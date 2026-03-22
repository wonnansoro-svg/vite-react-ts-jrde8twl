import { GoogleGenerativeAI } from '@google/generative-ai';
import React, { useState, useEffect } from 'react';
import { 
  Home, CloudRain, MessageCircle, Bell, Volume2, 
  AlertTriangle, Send, Sun, Cloud, Bug, Leaf, 
  MapPin, ArrowLeft, Wind, CloudLightning, 
  XCircle, Loader2, Locate, Phone, MessageSquare, Map,
  CreditCard, Check, Crown, Star, Activity, HelpCircle,
  Droplets, Sprout, Radio, Smartphone
} from 'lucide-react';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { MapContainer, TileLayer, Polygon, useMap, FeatureGroup, ImageOverlay } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

// --- IMPORTS FIREBASE ---
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// --- CONFIGURATION FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyBRiY9PGhZjmZSC9f6Yx0viR3-Qfi2uKEk",
  authDomain: "saida-979d4.firebaseapp.com",
  projectId: "saida-979d4",
  storageBucket: "saida-979d4.firebasestorage.app",
  messagingSenderId: "66298402035",
  appId: "1:66298402035:web:f32de787c40e724d95d386"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- 1. DÉFINITION DES TYPES ---
type TabType = 'dashboard' | 'weather' | 'chat' | 'alert';

interface LocationState {
  lat: number;
  lon: number;
  city: string;
}

interface DailyWeather {
  ttsText?: string;
  id: number;
  day: string;
  weatherImg: string;
  temp: string;
  wind: string;
  Icon: any;
  actionImg: string;
  actionType: string;
  rain?: string;
}

const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
};

// --- 2. FONCTIONS MÉTÉO VISUELLE ---
const getWeatherVisuals = (code: number, rainSum: number = 0) => {
  if (code === 0 || code === 1) return { weatherImg: "https://img.freepik.com/photos-gratuite/beau-paysage-ciel-bleu_23-2151906820.jpg?w=740", Icon: Sun, actionImg: "https://img.freepik.com/photos-gratuite/recolte-du-riz-au-sri-lanka_23-2151940459.jpg?w=740", actionType: "harvest", ttsText: "Ciel dégagé et très ensoleillé. Suggestion : C'est le moment idéal pour récolter l'anacarde." };
  if (code === 2 || code === 3) return { weatherImg: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=400", Icon: Cloud, actionImg: "https://img.freepik.com/photos-gratuite/gros-plan-photo-main-tenant-plantation-graine-plante_1150-28369.jpg", actionType: "sowing", ttsText: "Ciel nuageux avec bonne humidité. Suggestion : Conditions parfaites pour semer le maïs." };
  if (code >= 50 && code <= 67 || rainSum > 0) return { weatherImg: "https://img.freepik.com/vecteurs-libre/parapluie-rouge-sous-pluie_1284-11413.jpg?w=740", Icon: CloudRain, actionImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiHyDydvnCDwg_HZHcnOlBqQrXb5TePETSAQ&s", actionType: "spray_no", ttsText: `Pluie prévue aujourd'hui. Suggestion : Ne faites aucune pulvérisation de pesticides.` };
  if (code >= 80) return { weatherImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIMzaqG-lwT8wszF3lRYHXvVgI7FWrkEG3ng&s", Icon: CloudLightning, actionImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiHyDydvnCDwg_HZHcnOlBqQrXb5TePETSAQ&s", actionType: "spray_no", ttsText: "Alerte orages violents. Restez à l'abri." };
  return { weatherImg: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=400", Icon: Cloud, actionImg: "https://img.freepik.com/photos-gratuite/gros-plan-photo-main-tenant-plantation-graine-plante_1150-28369.jpg", actionType: "sowing", ttsText: "Temps clément. Vous pouvez continuer l'observation de vos cultures." };
};

// --- 3. COMPOSANTS NAVIGATION & PROFIL ---
const BottomNav: React.FC<{ activeTab: TabType, setActiveTab: (t: TabType) => void, setIsProfileOpen: (o: boolean) => void }> = ({ activeTab, setActiveTab, setIsProfileOpen }) => (
  <div className="bg-white border-t border-gray-200 flex justify-around items-center p-2 pb-4 text-[10px] text-gray-500 z-50 relative shrink-0">
    <button onClick={() => {setActiveTab('dashboard'); setIsProfileOpen(false);}} className={`flex flex-col items-center ${activeTab === 'dashboard' ? 'text-green-600 font-bold' : ''}`}><Home size={20} className="mb-1" /> Accueil</button>
    <button onClick={() => {setActiveTab('weather'); setIsProfileOpen(false);}} className={`flex flex-col items-center ${activeTab === 'weather' ? 'text-green-600 font-bold' : ''}`}><CloudRain size={20} className="mb-1" /> Météo</button>
    <button onClick={() => {setActiveTab('chat'); setIsProfileOpen(false);}} className={`flex flex-col items-center ${activeTab === 'chat' ? 'text-green-600 font-bold' : ''}`}><MessageCircle size={20} className="mb-1" /> IA Chat</button>
    <button onClick={() => {setActiveTab('alert'); setIsProfileOpen(false);}} className={`flex flex-col items-center ${activeTab === 'alert' ? 'text-red-600 font-bold' : ''}`}><div className="relative"><Bell size={20} className="mb-1" /><span className="absolute top-0 right-0 bg-red-500 w-2.5 h-2.5 rounded-full border border-white"></span></div> Alertes</button>
  </div>
);

const AccountScreen: React.FC<{ setIsProfileOpen: (o: boolean) => void, onUpdateLocation: () => void }> = ({ setIsProfileOpen, onUpdateLocation }) => {
  const [currentPlan, setCurrentPlan] = useState('premium');
  const supportNumber = "2250778014537"; 

  const effacerChamp = async () => {
    // On efface la base de données Firebase
    try {
      await setDoc(doc(db, "agriculteurs", "mon_profil_test"), {
        polygone: null,
        ndvi: null,
        humiditeSol: null
      });
      window.location.reload(); 
    } catch (e) {
      console.error(e);
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto z-40 relative pb-20">
      <div className="bg-green-700 text-white p-4 pt-6 flex items-center font-bold text-lg sticky top-0 shadow-md z-20">
        <button onClick={() => setIsProfileOpen(false)} className="mr-3 p-1.5 hover:bg-green-600 rounded-full transition-colors"><ArrowLeft size={24} /></button> Mon Profil
      </div>
      
      <div className="p-4 space-y-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <img src="https://img.freepik.com/photos-premium/daily-farm-life-men-in-agriculture-and-their-connection-to-rural-traditions_914383-31331.jpg" alt="Profil" className="w-16 h-16 rounded-full border-2 border-green-500 object-cover" />
          <div>
            <h2 className="font-black text-gray-800 text-lg">SORO Wonnan</h2>
            <p className="text-xs text-gray-500 font-medium mb-1">Culture : Maïs, Coton, Anacarde</p>
          </div>
        </div>

        <button onClick={effacerChamp} className="w-full bg-red-50 text-red-600 font-bold py-3 rounded-xl border border-red-200 hover:bg-red-100 transition-colors">
          Effacer mon champ de la carte
        </button>
      </div>
    </div>
  );
};

// --- 4. ÉCRAN DES ALERTES DÉTAILLÉES ---
const AlertScreen: React.FC = () => {
  const [speakingId, setSpeakingId] = React.useState<number | null>(null);
  const [realData, setRealData] = React.useState<any>(null);

  // NOUVEAU : Lecture des données depuis Firebase !
  React.useEffect(() => {
    const fetchAlertData = async () => {
      try {
        const docRef = doc(db, "agriculteurs", "mon_profil_test");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().humiditeSol) {
          setRealData({ moisture: docSnap.data().humiditeSol });
        }
      } catch (error) {
        console.error("Erreur lecture Firebase pour les alertes:", error);
      }
    };
    fetchAlertData();
  }, []);

  const lireAlerte = (text: string, id: number) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR'; utterance.rate = 0.9;
      utterance.onstart = () => setSpeakingId(id);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const allAlerts = [
    {
      id: 1, type: "Feu Vert Semis", title: "Humidité Optimale", crop: "Toutes cultures",
      satellite: "Sentinel-1 (Radar Backscatter)", urgency: "Action Idéale", icon: <Sprout size={24} className="text-green-600" />,
      color: "bg-green-50", borderColor: "border-green-500", textColor: "text-green-800", badge: "bg-green-600",
      description: "Le satellite Radar indique que votre sol est parfaitement humide (>25%).",
      action: "Conditions idéales. Vous pouvez démarrer le semis aujourd'hui."
    },
    {
      id: 2, type: "Alerte Irrigation", title: "Stress Hydrique Sévère", crop: "Toutes cultures",
      satellite: "Sentinel-1 & Landsat (NDMI)", urgency: "Avertissement", icon: <Droplets size={24} className="text-orange-500" />,
      color: "bg-orange-50", borderColor: "border-orange-400", textColor: "text-orange-800", badge: "bg-orange-500",
      description: "Le sol est extrêmement sec (humidité < 15%). La plante commence à souffrir.",
      action: "Irrigation d'urgence requise sur la parcelle pour éviter le flétrissement."
    }
  ];

  let activeAlerts = [];
  if (realData) {
    if (realData.moisture >= 0.25) activeAlerts.push(allAlerts[0]);
    if (realData.moisture < 0.15) activeAlerts.push(allAlerts[1]);
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 pb-20 overflow-y-auto">
      <div className="bg-red-600 p-6 rounded-b-3xl shadow-md text-white z-10">
        <h2 className="text-2xl font-black flex items-center">
          <AlertTriangle className="mr-2" size={28} />
          Centre d'Alertes
        </h2>
        <p className="text-red-100 text-sm mt-2 opacity-90">Connecté au Cloud (Firebase)</p>
      </div>

      <div className="p-4 space-y-4 mt-2">
        {!realData && (
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-yellow-800 text-sm font-medium text-center">
            Veuillez dessiner un champ sur la carte (Accueil) pour que les satellites analysent votre parcelle.
          </div>
        )}
        {realData && activeAlerts.length === 0 && (
          <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-green-800 text-sm font-medium text-center">
            ✅ Aucune alerte critique. L'humidité de votre sol est normale ({(realData.moisture * 100).toFixed(0)}%).
          </div>
        )}

        {activeAlerts.map((alert) => (
          <div key={alert.id} className={`${alert.color} border-l-4 ${alert.borderColor} rounded-xl shadow-sm overflow-hidden relative`}>
            <div className={`absolute top-0 right-0 ${alert.badge} text-white text-[10px] font-black px-3 py-1 rounded-bl-lg uppercase tracking-wider`}>{alert.urgency}</div>
            <div className="p-4 pt-5">
              <div className="flex items-start mb-2">
                <div className="bg-white p-2 rounded-lg shadow-sm mr-3 shrink-0">{alert.icon}</div>
                <div className="flex-grow pr-6">
                  <h3 className={`font-black text-lg ${alert.textColor} leading-tight`}>{alert.title}</h3>
                </div>
              </div>
              <div className="bg-white/60 p-3 rounded-lg mt-3 mb-3">
                <p className="text-sm text-gray-700 font-medium">
                  [Donnée Firebase : ${(realData.moisture * 100).toFixed(0)}% d'humidité] {alert.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 5. ÉCRAN DASHBOARD (Connecté à Firebase) ---
const DashboardScreen: React.FC<{ location: any, setIsProfileOpen: (o: boolean) => void, setActiveTab: (t: string) => void }> = ({ location, setIsProfileOpen, setActiveTab }) => {
  const [selectedCrop, setSelectedCrop] = React.useState<string | null>(null);
  const [ndviOverlay, setNdviOverlay] = React.useState<{ url: string, bounds: any } | null>(null);
  const [isLoadingNdvi, setIsLoadingNdvi] = React.useState(false);
  const [savedPolygon, setSavedPolygon] = React.useState<[number, number][] | null>(null);

  // NOUVEAU : Lecture des données depuis FIREBASE au démarrage !
  React.useEffect(() => {
    const chargerDonneesFirebase = async () => {
      try {
        const docRef = doc(db, "agriculteurs", "mon_profil_test");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.polygone) setSavedPolygon(data.polygone);
          if (data.ndvi) setNdviOverlay(data.ndvi);
          console.log("✅ Données récupérées depuis Firebase !");
        }
      } catch (error) {
        console.error("Erreur de chargement Firebase:", error);
      }
    };
    chargerDonneesFirebase();
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto relative pb-20">
      <div className="absolute top-0 w-full z-20 flex justify-between items-center p-4 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <div className="flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-auto shadow-md"><MapPin size={16} className="text-red-400 animate-bounce" /><span className="text-white font-bold text-xs">{location.city}</span></div>
        <button onClick={() => setIsProfileOpen(true)} className="w-10 h-10 bg-white rounded-full border-2 border-green-500 flex items-center justify-center overflow-hidden pointer-events-auto shadow-md"><img src="https://img.freepik.com/photos-premium/daily-farm-life-men-in-agriculture-and-their-connection-to-rural-traditions_914383-31331.jpg" alt="Profil" className="w-full h-full object-cover" /></button>
      </div>
      
      <div className="relative h-[40%] min-h-[280px] flex-shrink-0 border-b-4 border-green-600 rounded-b-3xl shadow-md overflow-hidden z-0 bg-gray-200">
        <MapContainer center={[location.lat, location.lon]} zoom={14} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false}>
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          
          <FeatureGroup>
            <EditControl
              position="bottomleft"
              onCreated={async (e: any) => {
                const layer = e.layer;
                const bounds = layer.getBounds();
                const leafletBounds = [[bounds.getSouthWest().lat, bounds.getSouthWest().lng], [bounds.getNorthEast().lat, bounds.getNorthEast().lng]];
                const latlngs = layer.getLatLngs()[0];
                const geoJsonCoords = latlngs.map((coord: any) => [coord.lng, coord.lat]);
                geoJsonCoords.push(geoJsonCoords[0]); 
                const displayPoly = latlngs.map((coord: any) => [coord.lat, coord.lng]);

                setIsLoadingNdvi(true);
                alert("📡 Demande envoyée au satellite... Calcul en cours !");

                try {
                  const API_KEY = "5efa02f1edfc4a79ab94a5810d1eb0bf"; 

                  const polyResponse = await fetch(`https://api.agromonitoring.com/agro/1.0/polygons?appid=${API_KEY}`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: "Champ", geo_json: { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [geoJsonCoords] } } })
                  });
                  const polyData = await polyResponse.json();
                  if (!polyData.id) throw new Error("Erreur de polygone");

                  const end = Math.floor(Date.now() / 1000);
                  const start = end - (30 * 24 * 60 * 60);
                  const imgResponse = await fetch(`https://api.agromonitoring.com/agro/1.0/image/search?start=${start}&end=${end}&polyid=${polyData.id}&appid=${API_KEY}`);
                  const imgData = await imgResponse.json();

                  // NOUVEAU : API Humidité
                  let humidite = 0.22; // Valeur par défaut si l'API soil échoue
                  try {
                    const soilResponse = await fetch(`https://api.agromonitoring.com/agro/1.0/soil?polyid=${polyData.id}&appid=${API_KEY}`);
                    const soilData = await soilResponse.json();
                    if(soilData.moisture) humidite = soilData.moisture;
                  } catch (e) { console.log("Erreur API humidité, utilisation valeur par défaut"); }

                  if (imgData && imgData.length > 0) {
                    const ndviUrl = imgData[imgData.length - 1].image.ndvi;
                    const ndviData = { url: ndviUrl, bounds: leafletBounds };
                    
                    setNdviOverlay(ndviData);
                    setSavedPolygon(displayPoly);
                    
                    // NOUVEAU : ÉCRITURE DANS FIREBASE
                    const donneesAgriculteur = {
                      polygone: displayPoly,
                      ndvi: ndviData,
                      humiditeSol: humidite,
                      dateMiseAJour: new Date().toISOString()
                    };

                    await setDoc(doc(db, "agriculteurs", "mon_profil_test"), donneesAgriculteur);
                    console.log("✅ Données sauvegardées avec succès dans Firebase !");
                    
                    alert("✅ Analyse terminée et sauvegardée dans le Cloud ! Allez voir l'onglet Alertes.");
                  } else {
                    alert("Nuages détectés ☁️. Aucune image claire disponible.");
                  }
                } catch (error: any) {
                  console.error("Erreur:", error);
                  alert(`❌ Erreur Satellite: ${error.message}`);
                } finally {
                  setIsLoadingNdvi(false);
                }
              }}
              draw={{ rectangle: false, circle: false, circlemarker: false, marker: false, polyline: false, polygon: { allowIntersection: false, shapeOptions: { color: '#22c55e', fillOpacity: 0.1 } } }}
            />
          </FeatureGroup>

          {savedPolygon && <Polygon positions={savedPolygon} pathOptions={{ color: '#22c55e', fillOpacity: 0.1, weight: 2 }} />}
          {ndviOverlay && <ImageOverlay url={ndviOverlay.url} bounds={ndviOverlay.bounds} opacity={0.8} />}
        </MapContainer>
      </div>

      <div className="px-4 mt-5 -mb-2">
        <button onClick={() => setActiveTab('alert')} className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded-lg shadow-sm">
          Voir les alertes Cloud
        </button>
      </div>
    </div>
  );
};

// --- 6. ÉCRAN MÉTÉO ---
const WeatherScreen: React.FC<{ location: LocationState, forecast: DailyWeather[], isLoading: boolean }> = ({ location, forecast, isLoading }) => {
  if (isLoading) return <div className="flex h-full items-center justify-center flex-col"><Loader2 className="animate-spin text-green-600 mb-4" size={48} /><p>Analyse météo de {location.city}...</p></div>;

  return (
    <div className="flex flex-col h-full bg-gray-100 overflow-y-auto pb-24">
      <div className="bg-white p-4 shadow-sm border-b flex items-center justify-between sticky top-0 z-20"><h1 className="text-xl font-black">Météo & Actions</h1><div className="flex items-center bg-green-50 px-3 py-1.5 rounded-full"><MapPin size={16} className="mr-1.5 text-green-600" /><span className="text-sm font-bold text-green-800">{location.city}</span></div></div>
      <div className="p-4 space-y-4">
        {forecast.map((day) => (
          <div key={day.id} className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col relative">
            <div className="bg-gray-800 text-white text-center py-1.5 font-bold text-sm uppercase flex justify-center items-center">
              {day.day} {day.rain && day.rain !== "0mm" && <span className="ml-2 text-blue-300 text-xs lowercase">({day.rain})</span>}
            </div>
            <div className="flex h-36">
              <div className="w-1/2 relative border-r-2 border-white"><img src={day.weatherImg} alt="Météo" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div><div className="absolute top-2 left-2 flex items-center"><day.Icon className="text-white mr-1.5" size={20} /><span className="text-2xl font-black text-white leading-none">{day.temp}</span></div><div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded flex items-center"><Wind className="text-blue-300 mr-1.5" size={14} /><span className="text-xs font-bold text-white">{day.wind}</span></div></div>
              <div className="w-1/2 relative border-l-2 border-white"><img src={day.actionImg} alt="Action" className="w-full h-full object-cover" /><div className="absolute inset-0 flex items-center justify-center bg-black/20">{day.actionType === 'spray_no' && <div className="bg-white rounded-full p-1"><XCircle size={64} className="text-red-600 drop-shadow-xl" /></div>}{day.actionType === 'sowing' && <div className="bg-white/90 px-3 py-1.5 rounded-xl font-black text-green-800 border-2 border-green-500 shadow-xl -rotate-12 uppercase">Semer</div>}{day.actionType === 'harvest' && <div className="bg-white/90 px-3 py-1.5 rounded-xl font-black text-orange-800 border-2 border-orange-500 shadow-xl -rotate-12 uppercase">Récolter</div>}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 7. ÉCRAN CHAT ---
const ChatScreen: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 p-6 items-center justify-center">
      <MessageCircle size={48} className="text-green-500 mb-4" />
      <h2 className="text-xl font-black text-center mb-2">IA en Pause</h2>
      <p className="text-center text-gray-500 text-sm">Insérez votre clé Gemini dans le code pour réactiver l'assistant agricole.</p>
    </div>
  );
};

// --- 8. APPLICATION PRINCIPALE ---
export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [weatherForecast, setWeatherForecast] = useState<DailyWeather[]>([]);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [farmLocation, setFarmLocation] = useState<LocationState | null>(null);

  useEffect(() => {
    const savedLocation = localStorage.getItem('farmLocation');
    if (savedLocation) setFarmLocation(JSON.parse(savedLocation));
    else setFarmLocation({ lat: 9.5217, lon: -6.4869, city: "Korhogo" }); // Default
  }, []);

  useEffect(() => {
    if (!farmLocation) return;
    const fetchWeather = async () => {
      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${farmLocation.lat}&longitude=${farmLocation.lon}&daily=weathercode,temperature_2m_max,windspeed_10m_max,precipitation_sum&timezone=auto`);
        const data = await response.json();
        
        const formattedForecast = data.daily.time.map((date: string, index: number) => {
          const code = data.daily.weathercode[index];
          const temp = data.daily.temperature_2m_max[index];
          const wind = data.daily.windspeed_10m_max[index];
          const rain = data.daily.precipitation_sum[index]; 
          const visuals = getWeatherVisuals(code, rain);
          const dayName = index === 0 ? "Aujourd'hui" : index === 1 ? "Demain" : new Date(date).toLocaleDateString('fr-FR', { weekday: 'long' });
          return { id: index, day: dayName, temp: `${temp}°C`, wind: `${wind} km/h`, rain: `${rain}mm`, ...visuals };
        }).slice(0, 7);
        setWeatherForecast(formattedForecast);
      } catch (error) { console.error("Erreur météo:", error); } finally { setIsWeatherLoading(false); }
    };
    fetchWeather();
  }, [farmLocation]);

  if (!farmLocation) return null;

  return (
    <div className="h-[100dvh] w-full bg-white flex flex-col relative overflow-hidden">
      <div className="flex-grow relative overflow-hidden bg-white">
        {isProfileOpen && <div className="absolute inset-0 z-50 bg-white"><AccountScreen setIsProfileOpen={setIsProfileOpen} onUpdateLocation={() => {}} /></div>}
        <div className={`absolute inset-0 transition-opacity duration-200 bg-white ${activeTab === 'dashboard' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}><DashboardScreen location={farmLocation} setIsProfileOpen={setIsProfileOpen} setActiveTab={setActiveTab} /></div>
        <div className={`absolute inset-0 transition-opacity duration-200 bg-white ${activeTab === 'weather' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}><WeatherScreen location={farmLocation} forecast={weatherForecast} isLoading={isWeatherLoading} /></div>
        <div className={`absolute inset-0 transition-opacity duration-200 bg-white ${activeTab === 'chat' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}><ChatScreen /></div>
        <div className={`absolute inset-0 transition-opacity duration-200 bg-white ${activeTab === 'alert' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}><AlertScreen /></div>
      </div>
      {!isProfileOpen && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} setIsProfileOpen={setIsProfileOpen} />}
    </div>
  );
}