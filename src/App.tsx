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

// --- OUTIL POUR RECENTRER LA CARTE ---
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
};

// --- 2. FONCTIONS MÉTÉO VISUELLE & ACTIONS AGRONOMIQUES ---
const getWeatherVisuals = (code: number, rainSum: number = 0) => {
  if (code === 0 || code === 1) return { weatherImg: "https://img.freepik.com/photos-gratuite/beau-paysage-ciel-bleu_23-2151906820.jpg?w=740", Icon: Sun, actionImg: "https://img.freepik.com/photos-gratuite/recolte-du-riz-au-sri-lanka_23-2151940459.jpg?w=740", actionType: "harvest", ttsText: "Ciel dégagé et très ensoleillé. Suggestion : C'est le moment idéal pour récolter l'anacarde ou désherber manuellement." };
  if (code === 2 || code === 3) return { weatherImg: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=400", Icon: Cloud, actionImg: "https://img.freepik.com/photos-gratuite/gros-plan-photo-main-tenant-plantation-graine-plante_1150-28369.jpg", actionType: "sowing", ttsText: "Ciel nuageux avec bonne humidité. Suggestion : Conditions parfaites pour semer le maïs ou épandre de l'engrais de fond." };
  if (code >= 50 && code <= 67 || rainSum > 0) return { weatherImg: "https://img.freepik.com/vecteurs-libre/parapluie-rouge-sous-pluie_1284-11413.jpg?w=740", Icon: CloudRain, actionImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiHyDydvnCDwg_HZHcnOlBqQrXb5TePETSAQ&s", actionType: "spray_no", ttsText: `Pluie prévue aujourd'hui (${rainSum}mm). Suggestion : Ne faites aucune pulvérisation de pesticides, le produit sera lessivé.` };
  if (code >= 80) return { weatherImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIMzaqG-lwT8wszF3lRYHXvVgI7FWrkEG3ng&s", Icon: CloudLightning, actionImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiHyDydvnCDwg_HZHcnOlBqQrXb5TePETSAQ&s", actionType: "spray_no", ttsText: "Alerte orages violents. Restez à l'abri. Ne vous rendez pas dans les champs sous les éclairs." };
  return { weatherImg: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=400", Icon: Cloud, actionImg: "https://img.freepik.com/photos-gratuite/gros-plan-photo-main-tenant-plantation-graine-plante_1150-28369.jpg", actionType: "sowing", ttsText: "Temps clément. Vous pouvez continuer l'observation de vos cultures et le sarclage." };
};

// --- 3. COMPOSANTS DE NAVIGATION & PROFIL ---
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
            {currentPlan === 'premium' && <span className="inline-flex items-center bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"><Crown size={12} className="mr-1" /> Membre Premium</span>}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center"><HelpCircle className="mr-2 text-green-600" size={20}/> Besoin d'assistance ?</h3>
          <p className="text-sm text-gray-600 mb-4">Un problème avec l'application ou besoin d'un conseil agronomique ?</p>
          <div className="flex space-x-3">
            <a href={`tel:+${supportNumber}`} className="flex-1 bg-gray-800 hover:bg-black text-white py-2.5 rounded-xl font-bold flex justify-center items-center text-sm transition-colors shadow-sm">
              <Phone size={16} className="mr-2" /> Appeler
            </a>
            <a href={`https://wa.me/${supportNumber}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl font-bold flex justify-center items-center text-sm transition-colors shadow-sm">
              <MessageCircle size={16} className="mr-2" /> WhatsApp
            </a>
          </div>
        </div>

        <button 
          onClick={() => { 
            localStorage.removeItem('champ_agriculteur_poly');
            localStorage.removeItem('champ_agriculteur_ndvi');
            window.location.reload(); 
          }} 
          className="w-full bg-red-50 text-red-600 font-bold py-3 rounded-xl border border-red-200 hover:bg-red-100 transition-colors">
            Effacer mon champ de la carte
        </button>
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center"><Map className="mr-2 text-green-600" size={20}/> Gestion de l'exploitation</h3>
          <button onClick={() => { onUpdateLocation(); setIsProfileOpen(false); }} className="w-full bg-blue-50 text-blue-700 font-bold py-3 rounded-xl border border-blue-200 flex items-center justify-center hover:bg-blue-100 transition-colors">
            <Locate className="mr-2" size={20} /> Mettre à jour la position GPS
          </button>
        </div>

        <div>
          <h3 className="font-bold text-gray-800 mb-4 flex items-center"><CreditCard className="mr-2 text-green-600" size={20}/> Mes Abonnements</h3>
          <div className="space-y-4">
            <div className={`relative p-5 rounded-2xl border-2 transition-all ${currentPlan === 'gratuit' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
              <h4 className="font-black text-gray-800 text-lg">Basique (Gratuit)</h4>
              <p className="text-2xl font-black text-green-600 my-1">0 FCFA <span className="text-sm text-gray-500 font-medium">/ mois</span></p>
              <ul className="text-xs text-gray-600 mt-2 space-y-1">
                <li className="flex items-center"><Check size={14} className="text-green-500 mr-1"/> Météo locale basique</li>
                <li className="flex items-center"><Check size={14} className="text-green-500 mr-1"/> Chat IA (limité)</li>
              </ul>
              {currentPlan !== 'gratuit' && <button onClick={() => setCurrentPlan('gratuit')} className="mt-4 w-full py-2.5 rounded-xl font-bold text-gray-500 bg-gray-100">Passer au plan gratuit</button>}
            </div>

            <div className={`relative p-5 rounded-2xl border-2 transition-all ${currentPlan === 'premium' ? 'border-yellow-400 bg-yellow-50 shadow-md' : 'border-gray-200 bg-white'}`}>
              {currentPlan === 'premium' && <div className="absolute -top-3 right-4 bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center"><Crown size={12} className="mr-1"/> Actuel</div>}
              <h4 className="font-black text-gray-800 text-lg flex items-center">Premium <Crown size={18} className="ml-2 text-yellow-500"/></h4>
              <p className="text-2xl font-black text-yellow-600 my-1">2 500 FCFA <span className="text-sm text-gray-500 font-medium">/ mois</span></p>
              <ul className="text-xs text-gray-700 mt-2 space-y-1 font-medium">
                <li className="flex items-center"><Check size={14} className="text-yellow-600 mr-1"/> Alertes satellites NDVI</li>
                <li className="flex items-center"><Check size={14} className="text-yellow-600 mr-1"/> Chat IA illimité & Audio</li>
                <li className="flex items-center"><Check size={14} className="text-yellow-600 mr-1"/> Assistance agronome 24/7</li>
              </ul>
              {currentPlan !== 'premium' && <button onClick={() => setCurrentPlan('premium')} className="mt-4 w-full py-2.5 rounded-xl font-bold text-white bg-yellow-500 hover:bg-yellow-600">Mettre à niveau</button>}
              
            </div>

            <div className={`relative p-5 rounded-2xl border-2 transition-all ${currentPlan === 'cooperative' ? 'border-green-600 bg-green-50 shadow-md' : 'border-gray-200 bg-white'}`}>
              {currentPlan === 'cooperative' && <div className="absolute -top-3 right-4 bg-green-600 text-green-900 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center"><Star size={12} className="mr-1"/> Actuel</div>}
              <h4 className="font-black text-gray-800 text-lg flex items-center">Coopérative <Star size={18} className="ml-2 text-green-500"/></h4>
              <p className="text-2xl font-black text-green-600 my-1">350 000 FCFA <span className="text-sm text-gray-500 font-medium">/ année</span></p>
              <ul className="text-xs text-gray-700 mt-2 space-y-1 font-medium">
                <li className="flex items-center"><Check size={14} className="text-green-600 mr-1"/> Accès à tous les outils</li>
                <li className="flex items-center"><Check size={14} className="text-green-600 mr-1"/> Support prioritaire</li>
                <li className="flex items-center"><Check size={14} className="text-green-600 mr-1"/> Formation en ligne</li>
                <li className="flex items-center"><Check size={14} className="text-green-600 mr-1"/> 300 utilisateurs</li>
              </ul>
              {currentPlan !== 'cooperative' && <button onClick={() => setCurrentPlan('cooperative')} className="mt-4 w-full py-2.5 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600">S'abonner</button>}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

// --- 4. ÉCRAN DES ALERTES DÉTAILLÉES (CONNECTÉ AU SATELLITE) ---
const AlertScreen: React.FC = () => {
  const [speakingId, setSpeakingId] = React.useState<number | null>(null);
  const [realData, setRealData] = React.useState<any>(null);

  // Au chargement, on récupère les données réelles du satellite
  React.useEffect(() => {
    const data = localStorage.getItem('real_satellite_data');
    if (data) setRealData(JSON.parse(data));
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
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.onstart = () => setSpeakingId(id);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Base de données de toutes les alertes possibles
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
    },
    {
      id: 3, type: "Fenêtre Météo", title: "Moment de Pulvérisation", crop: "Toutes cultures",
      satellite: "Agrométéo", urgency: "Information", icon: <Wind size={24} className="text-blue-500" />,
      color: "bg-blue-50", borderColor: "border-blue-400", textColor: "text-blue-800", badge: "bg-blue-500",
      description: "Vent faible et pas de pluie prévue dans les 24h.",
      action: "Conditions optimales pour traiter vos champs."
    }
  ];

  // 🧠 LOGIQUE INTELLIGENTE : On filtre les alertes selon les VRAIES valeurs !
  let activeAlerts = [];
  if (realData) {
    // Si l'humidité est supérieure à 25% (0.25), c'est bon pour semer !
    if (realData.moisture >= 0.25) activeAlerts.push(allAlerts[0]);
    // Si l'humidité est très basse (< 15%), on déclenche l'alerte Stress Hydrique
    if (realData.moisture < 0.15) activeAlerts.push(allAlerts[1]);
    
    // Alerte météo (toujours active pour l'exemple)
    activeAlerts.push(allAlerts[2]);
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 pb-20 overflow-y-auto">
      <div className="bg-red-600 p-6 rounded-b-3xl shadow-md text-white z-10">
        <h2 className="text-2xl font-black flex items-center">
          <AlertTriangle className="mr-2" size={28} />
          Centre d'Alertes
        </h2>
        <p className="text-red-100 text-sm mt-2 opacity-90">
          Connecté aux satellites Sentinel-1 et Sentinel-2
        </p>
      </div>

      <div className="p-4 space-y-4 mt-2">
        {!realData && (
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-yellow-800 text-sm font-medium text-center">
            Veuillez dessiner un champ sur la carte (Accueil) pour que les satellites analysent votre parcelle.
          </div>
        )}

        {realData && activeAlerts.length === 0 && (
          <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-green-800 text-sm font-medium text-center">
            ✅ Aucune alerte critique. Vos cultures se portent bien !
          </div>
        )}

        {activeAlerts.map((alert) => (
          <div key={alert.id} className={`${alert.color} border-l-4 ${alert.borderColor} rounded-xl shadow-sm overflow-hidden relative`}>
            <div className={`absolute top-0 right-0 ${alert.badge} text-white text-[10px] font-black px-3 py-1 rounded-bl-lg uppercase tracking-wider`}>
              {alert.urgency}
            </div>
            <div className="p-4 pt-5">
              <div className="flex items-start mb-2">
                <div className="bg-white p-2 rounded-lg shadow-sm mr-3 shrink-0">{alert.icon}</div>
                <div className="flex-grow pr-6">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{alert.type} • {alert.crop}</p>
                  <h3 className={`font-black text-lg ${alert.textColor} leading-tight`}>{alert.title}</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">📡 Source : {alert.satellite}</p>
                </div>
              </div>
              <div className="bg-white/60 p-3 rounded-lg mt-3 mb-3">
                <p className="text-sm text-gray-700 font-medium">
                  {/* On affiche la vraie donnée récupérée */}
                  {alert.id === 1 || alert.id === 2 ? `[Donnée réelle : ${(realData.moisture * 100).toFixed(0)}% d'humidité] ` : ''} 
                  {alert.description}
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className={`text-sm font-bold ${alert.textColor} flex-grow pr-2 leading-tight`}>👉 Action : {alert.action}</p>
                <button onClick={() => lireAlerte(`${alert.title}. ${alert.description}. Action recommandée : ${alert.action}`, alert.id)} className="p-3 rounded-full shadow-sm shrink-0 bg-white text-gray-600 hover:bg-gray-50"><Volume2 size={20} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 5. ÉCRAN DASHBOARD ---
const DashboardScreen: React.FC<{ location: any, setIsProfileOpen: (o: boolean) => void, setActiveTab: (t: string) => void }> = ({ location, setIsProfileOpen, setActiveTab }) => {
  
  const [selectedCrop, setSelectedCrop] = React.useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  
  const [ndviOverlay, setNdviOverlay] = React.useState<{ url: string, bounds: any } | null>(null);
  const [isLoadingNdvi, setIsLoadingNdvi] = React.useState(false);

  const [savedPolygon, setSavedPolygon] = React.useState<[number, number][] | null>(null);

  React.useEffect(() => {
    const memoryPoly = localStorage.getItem('champ_agriculteur_poly');
    const memoryNdvi = localStorage.getItem('champ_agriculteur_ndvi');
    
    if (memoryPoly) setSavedPolygon(JSON.parse(memoryPoly));
    if (memoryNdvi) setNdviOverlay(JSON.parse(memoryNdvi));
  }, []);

  const cropData: any = {
    'Maïs': { ndvi: '0.42', status: 'Critique', color: 'text-red-600', bg: 'bg-red-100', text: "Attention ! L'indice de santé de votre maïs a fortement baissé. Le satellite détecte des dommages qui correspondent aux chenilles légionnaires. Traitement urgent conseillé." },
    'Coton': { ndvi: '0.78', status: 'Bonne santé', color: 'text-green-600', bg: 'bg-green-100', text: "Votre parcelle de coton se porte bien. La croissance végétative est normale. Pensez à vérifier l'humidité du sol." },
    'Anacarde': { ndvi: '0.85', status: 'Excellent', color: 'text-blue-600', bg: 'bg-blue-100', text: "Vos anacardiers sont en pleine forme. L'indice NDVI est excellent. Préparez-vous sereinement pour la prochaine campagne." }
  };
      
  const lireRecommandation = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.85; 
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("La synthèse vocale n'est pas supportée sur ce navigateur.");
    }
  };

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
                
                const leafletBounds = [
                  [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
                  [bounds.getNorthEast().lat, bounds.getNorthEast().lng]
                ];

                const latlngs = layer.getLatLngs()[0];
                const geoJsonCoords = latlngs.map((coord: any) => [coord.lng, coord.lat]);
                geoJsonCoords.push(geoJsonCoords[0]); 
                
                const displayPoly = latlngs.map((coord: any) => [coord.lat, coord.lng]);

                setIsLoadingNdvi(true);
                alert("📡 Demande envoyée au satellite... Calcul en cours !");

                try {
                  // 💡 ASTUCE : Si l'erreur persiste, vous devrez créer votre propre clé gratuite sur agromonitoring.com
                  const API_KEY = "d932a8e0b9840a95a7078a6cfe7faedc"; 

                  console.log("1. Envoi du polygone...");
                  const polyResponse = await fetch(`https://api.agromonitoring.com/agro/1.0/polygons?appid=${API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: "Champ Agriculteur",
                      geo_json: { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [geoJsonCoords] } }
                    })
                  });
                  
                  // On vérifie si la création du polygone a échoué
                  if (!polyResponse.ok) {
                    const errorData = await polyResponse.json();
                    throw new Error(`Refus du satellite (Polygone) : ${errorData.message || 'Erreur inconnue'}`);
                  }
                  
                  const polyData = await polyResponse.json();
                  console.log("Polygone créé avec succès, ID:", polyData.id);

                  console.log("2. Recherche d'images Sentinel-2...");
                  const end = Math.floor(Date.now() / 1000);
                  const start = end - (30 * 24 * 60 * 60);
                  const imgResponse = await fetch(`https://api.agromonitoring.com/agro/1.0/image/search?start=${start}&end=${end}&polyid=${polyData.id}&appid=${API_KEY}`);
                  
                  if (!imgResponse.ok) throw new Error("Impossible de récupérer les images satellites.");
                  const imgData = await imgResponse.json();

                  console.log("3. Recherche des données de sol Sentinel-1...");
                  const soilResponse = await fetch(`https://api.agromonitoring.com/agro/1.0/soil?polyid=${polyData.id}&appid=${API_KEY}`);
                  
                  if (!soilResponse.ok) throw new Error("Impossible de récupérer l'humidité du sol.");
                  const soilData = await soilResponse.json();

                  if (imgData && imgData.length > 0) {
                    const latestImage = imgData[imgData.length - 1];
                    const ndviUrl = latestImage.image.ndvi;
                    
                    const ndviData = { url: ndviUrl, bounds: leafletBounds };
                    setNdviOverlay(ndviData);
                    setSavedPolygon(displayPoly);
                    
                    localStorage.setItem('champ_agriculteur_ndvi', JSON.stringify(ndviData));
                    localStorage.setItem('champ_agriculteur_poly', JSON.stringify(displayPoly));
                    localStorage.setItem('real_satellite_data', JSON.stringify({
                      moisture: soilData.moisture || 0.2 
                    }));
                    
                    alert("✅ Analyse Sentinel terminée avec succès !");
                  } else {
                    alert("☁️ Nuages détectés. Aucune image claire disponible sur les 30 derniers jours.");
                  }
                } catch (error: any) {
                  console.error("Erreur Satellite Détaillée :", error);
                  // L'alerte va maintenant afficher le VRAI problème !
                  alert(`❌ Erreur : ${error.message}`);
                } finally {
                  setIsLoadingNdvi(false);
                }
              } }
              draw={{
                rectangle: false, circle: false, circlemarker: false, marker: false, polyline: false,
                polygon: { allowIntersection: false, shapeOptions: { color: '#22c55e', fillOpacity: 0.1 } }
              }}
            />
          </FeatureGroup>

          {savedPolygon && (
            <Polygon positions={savedPolygon} pathOptions={{ color: '#22c55e', fillOpacity: 0.1, weight: 2 }} />
          )}

          {ndviOverlay && (
            <ImageOverlay url={ndviOverlay.url} bounds={ndviOverlay.bounds} opacity={0.8} />
          )}

        </MapContainer>
      </div>

      <div className="px-4 mt-5 -mb-2">
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-xl shadow-sm flex flex-col items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-bl-lg">URGENCE</div>
          <div className="flex items-start w-full mt-1">
            <AlertTriangle className="text-red-600 mr-3 shrink-0" size={24} />
            <div className="flex-grow">
              <h3 className="text-red-800 font-bold text-sm">Alerte Chenilles (Maïs)</h3>
              <p className="text-red-600 text-xs font-medium mt-0.5">La masse végétale chute rapidement.</p>
            </div>
          </div>
          <button onClick={() => setActiveTab('alert')} className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-sm">
            Voir les alertes détaillées
          </button>
        </div>
      </div>

      <div className="p-4 pt-6 space-y-6">
        <div>
          <h3 className="text-base font-bold text-gray-800 flex items-center mb-4"><Leaf className="mr-2 text-green-600" size={20} /> Mes Champs</h3>
          <div className="flex overflow-x-auto space-x-4 pb-2 -mx-4 px-4 scrollbar-hide">
            <div onClick={() => setSelectedCrop('Maïs')} className="cursor-pointer bg-white rounded-2xl shadow-sm min-w-[200px] flex-shrink-0 border border-gray-100 overflow-hidden"><div className="relative h-24"><img src="https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400" alt="Maïs" className="w-full h-full object-cover" /></div><div className="p-3"><h3 className="font-bold text-gray-800 text-sm">Parcelle 1 - Maïs</h3></div></div>
            <div onClick={() => setSelectedCrop('Coton')} className="cursor-pointer bg-white rounded-2xl shadow-sm min-w-[200px] flex-shrink-0 border border-gray-100 overflow-hidden"><div className="relative h-24"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhyLm-SLLOTWuL0KJasjrC-8Rq7hkfVt5RgQ&s" alt="Coton" className="w-full h-full object-cover" /></div><div className="p-3"><h3 className="font-bold text-gray-800 text-sm">Parcelle 2 - Coton</h3></div></div>
            <div onClick={() => setSelectedCrop('Anacarde')} className="cursor-pointer bg-white rounded-2xl shadow-sm min-w-[200px] flex-shrink-0 border border-gray-100 overflow-hidden"><div className="relative h-24"><img src="https://image.lecourrier.vn/uploaded/2015/12/31/1014493635601a.jpg" alt="Anacarde" className="w-full h-full object-cover" /></div><div className="p-3"><h3 className="font-bold text-gray-800 text-sm">Parcelle 3 - Anacarde</h3></div></div>
          </div>
        </div>
      </div>
      
      {selectedCrop && cropData[selectedCrop] && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-2 ${cropData[selectedCrop].bg}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-black text-gray-800">Détails : {selectedCrop}</h3>
              <button 
                onClick={() => lireRecommandation(cropData[selectedCrop].text)} 
                className={`p-3 rounded-full shadow-md transition-all ${isSpeaking ? 'bg-green-500 text-white animate-pulse' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
              >
                <Volume2 size={24} />
              </button>
            </div>

            <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="bg-white p-2 rounded-lg shadow-sm"><Activity className={cropData[selectedCrop].color} size={24} /></div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Indice NDVI (Santé)</p>
                <p className={`text-lg font-black ${cropData[selectedCrop].color}`}>{cropData[selectedCrop].ndvi} <span className="text-xs font-semibold ml-1">({cropData[selectedCrop].status})</span></p>
              </div>
            </div>

            <p className="text-gray-700 text-sm mb-6 leading-relaxed border-l-4 border-green-500 pl-3">
              {cropData[selectedCrop].text}
            </p>
            
            <button onClick={() => {setSelectedCrop(null); window.speechSynthesis.cancel(); setIsSpeaking(false);}} className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 6. ÉCRAN MÉTÉO ---
const WeatherScreen: React.FC<{ location: LocationState, forecast: DailyWeather[], isLoading: boolean }> = ({ location, forecast, isLoading }) => {
  const [speakingId, setSpeakingId] = useState<number | null>(null);

  const speak = (id: number, dayName: string, text: string, temp: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`Prévisions pour ${dayName} à ${location.city}. Température de ${temp}. ${text}`);
      utterance.lang = 'fr-FR'; utterance.rate = 0.9;
      utterance.onstart = () => setSpeakingId(id); utterance.onend = () => setSpeakingId(null); utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

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
            <button onClick={() => speak(day.id, day.day, day.ttsText || "", day.temp)} className={`absolute top-10 right-2 z-50 p-2 rounded-full shadow-lg ${speakingId === day.id ? 'bg-green-500 text-white animate-pulse scale-110' : 'bg-white/80 text-green-700'}`}><Volume2 size={24} /></button>
            <div className="flex h-36">
              <div className="w-1/2 relative border-r-2 border-white"><img src={day.weatherImg} alt="Météo" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div><div className="absolute top-2 left-2 flex items-center"><day.Icon className="text-white mr-1.5" size={20} /><span className="text-2xl font-black text-white leading-none">{day.temp}</span></div><div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded flex items-center"><Wind className="text-blue-300 mr-1.5" size={14} /><span className="text-xs font-bold text-white">{day.wind}</span></div></div>
              <div className="w-1/2 relative border-l-2 border-white"><img src={day.actionImg} alt="Action" className="w-full h-full object-cover" /><div className="absolute inset-0 flex items-center justify-center bg-black/20">{day.actionType === 'spray_no' && <div className="bg-white rounded-full p-1"><XCircle size={64} className="text-red-600 drop-shadow-xl" /></div>}{day.actionType === 'sowing' && <div className="bg-white/90 px-3 py-1.5 rounded-xl font-black text-green-800 border-2 border-green-500 shadow-xl -rotate-12 uppercase">Semer</div>}{day.actionType === 'harvest' && <div className="bg-white/90 px-3 py-1.5 rounded-xl font-black text-orange-800 border-2 border-orange-500 shadow-xl -rotate-12 uppercase">Récolter</div>}</div></div>
            </div>
            <div className="p-3 bg-white text-xs text-gray-700 border-t border-gray-100">
              <strong className="text-green-700">Conseil :</strong> {day.ttsText?.split("Suggestion :")[1] || day.ttsText}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 7. ÉCRAN CHAT (SAIDA IA) ---
const ChatScreen: React.FC = () => {
  const [messages, setMessages] = React.useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Bonjour ! Je suis SAIDA, votre assistant agricole. Comment puis-je vous aider avec vos cultures aujourd'hui ?" }
  ]);
  const [inputMessage, setInputMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [speakingIndex, setSpeakingIndex] = React.useState<number | null>(null);

  const lireMessage = (text: string, index: number) => {
    if (!('speechSynthesis' in window)) {
      alert("La synthèse vocale n'est pas supportée sur ce navigateur.");
      return;
    }

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR'; 
    utterance.rate = 0.9; 

    utterance.onstart = () => setSpeakingIndex(index);
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    window.speechSynthesis.cancel();
    setSpeakingIndex(null);

    const newMessages = [...messages, { role: 'user', text: inputMessage }];
    setMessages(newMessages as {role: 'user' | 'ai', text: string}[]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // ⚠️ ASSUREZ-VOUS DE METTRE VOTRE CLÉ GEMINI ICI POUR QUE LE CHAT FONCTIONNE
      const API_KEY = "VOTREAPI"; 
      
      const systemInstruction = "Tu es SAIDA, un assistant agricole expert travaillant en Côte d'Ivoire. Tu aides les agriculteurs avec des conseils simples, pratiques et directs sur la météo, les cultures (maïs, coton, anacarde), et les maladies. Sois chaleureux et concis.";

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: "user", parts: [{ text: inputMessage }] }]
        })
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error.message);

      const aiResponse = data.candidates[0].content.parts[0].text;
      setMessages([...newMessages, { role: 'ai', text: aiResponse }] as {role: 'user' | 'ai', text: string}[]);

    } catch (error) {
      console.error("Erreur IA:", error);
      setMessages([...newMessages, { role: 'ai', text: "Désolé, je n'arrive pas à me connecter au serveur. Vérifiez votre connexion ou votre clé API." }] as {role: 'user' | 'ai', text: string}[]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      <div className="bg-green-600 p-4 text-white shadow-md z-10">
        <h2 className="text-xl font-black flex items-center">
          <MessageCircle className="mr-2" /> SAIDA IA
        </h2>
        <p className="text-green-100 text-xs mt-1">Votre expert agricole personnel</p>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm relative group ${
              msg.role === 'user' 
                ? 'bg-green-500 text-white rounded-tr-sm' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              
              {msg.role === 'ai' && (
                <button 
                  onClick={() => lireMessage(msg.text, index)}
                  className={`mt-2 p-1.5 rounded-full inline-flex items-center transition-colors ${
                    speakingIndex === index 
                      ? 'bg-green-100 text-green-700 animate-pulse' 
                      : 'bg-gray-50 text-gray-400 hover:text-green-600 hover:bg-green-50'
                  }`}
                  title={speakingIndex === index ? "Arrêter la lecture" : "Lire le message"}
                >
                  <Volume2 size={16} />
                  {speakingIndex === index && <span className="text-[10px] font-bold ml-1">Lecture...</span>}
                </button>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-500 border border-gray-100 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center bg-gray-100 rounded-full p-1 pl-4 shadow-inner">
          <input 
            type="text" 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Posez votre question agricole..."
            className="flex-grow bg-transparent outline-none text-sm text-gray-700"
          />
          <button 
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              inputMessage.trim() && !isLoading ? 'bg-green-500 text-white shadow-md' : 'bg-gray-200 text-gray-400'
            }`}
          >
            <Send size={18} className={inputMessage.trim() && !isLoading ? 'ml-1' : ''} />
          </button>
        </div>
      </div>
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
  const [isLocatingFarm, setIsLocatingFarm] = useState(false);

  useEffect(() => {
    const savedLocation = localStorage.getItem('farmLocation');
    if (savedLocation) setFarmLocation(JSON.parse(savedLocation));
  }, []);

  const getCityName = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=fr`);
      const data = await res.json();
      return data.locality || data.city || "Zone Agricole";
    } catch (error) {
      console.error("Erreur ville :", error);
      return "Localité inconnue";
    }
  };

  const defineFarmLocation = () => {
    setIsLocatingFarm(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const cityName = await getCityName(lat, lon); 
          
          const newLoc = { lat, lon, city: cityName };
          setFarmLocation(newLoc);
          localStorage.setItem('farmLocation', JSON.stringify(newLoc)); 
          setIsLocatingFarm(false);
        },
        (error) => {
          console.error("Erreur GPS:", error);
          alert("GPS refusé ou introuvable. Korhogo utilisé par défaut.");
          const defaultLoc = { lat: 9.5217, lon: -6.4869, city: "Korhogo" };
          setFarmLocation(defaultLoc);
          localStorage.setItem('farmLocation', JSON.stringify(defaultLoc));
          setIsLocatingFarm(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsLocatingFarm(false);
    }
  };

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
          const dateObj = new Date(date);
          const dayName = index === 0 ? "Aujourd'hui" : index === 1 ? "Demain" : dateObj.toLocaleDateString('fr-FR', { weekday: 'long' });
          
          return { id: index, day: dayName, temp: `${temp}°C`, wind: `${wind} km/h`, rain: `${rain}mm`, ...visuals };
        }).slice(0, 7);
        
        setWeatherForecast(formattedForecast);
      } catch (error) { console.error("Erreur météo:", error); } finally { setIsWeatherLoading(false); }
    };
    fetchWeather();
  }, [farmLocation]);

  if (!farmLocation) {
    return (
      <div className="h-[100dvh] w-full bg-green-700 flex flex-col justify-center items-center p-6 text-center relative overflow-hidden">
        <div className="relative z-10 bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full">
          <div className="bg-green-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"><MapPin size={40} className="text-green-600" /></div>
          <h1 className="text-2xl font-black text-gray-800 mb-2">Bienvenue sur SAIDA</h1>
          <p className="text-gray-600 mb-8 text-sm">Pour commencer, nous avons besoin d'enregistrer la position exacte de votre champ principal pour la météo locale.</p>
          <button onClick={defineFarmLocation} disabled={isLocatingFarm} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl flex justify-center items-center shadow-lg transition-transform active:scale-95">
            {isLocatingFarm ? <Loader2 className="animate-spin mr-2" size={20} /> : <Locate className="mr-2" size={20} />}
            {isLocatingFarm ? "Recherche satellite..." : "Géolocaliser mon champ"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full bg-white flex flex-col relative overflow-hidden">
      <div className="flex-grow relative overflow-hidden bg-white">
        
        {isProfileOpen && (
          <div className="absolute inset-0 z-50 bg-white">
            <AccountScreen setIsProfileOpen={setIsProfileOpen} onUpdateLocation={defineFarmLocation} />
          </div>
        )}

        <div className={`absolute inset-0 transition-opacity duration-200 bg-white ${activeTab === 'dashboard' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}>
          <DashboardScreen location={farmLocation} setIsProfileOpen={setIsProfileOpen} setActiveTab={setActiveTab} />
        </div>
        
        <div className={`absolute inset-0 transition-opacity duration-200 bg-white ${activeTab === 'weather' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}>
          <WeatherScreen location={farmLocation} forecast={weatherForecast} isLoading={isWeatherLoading} />
        </div>
        
        <div className={`absolute inset-0 transition-opacity duration-200 bg-white ${activeTab === 'chat' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}>
          <ChatScreen />
        </div>
        
        <div className={`absolute inset-0 transition-opacity duration-200 bg-white ${activeTab === 'alert' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}>
          <AlertScreen />
        </div>

      </div>
      
      {!isProfileOpen && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} setIsProfileOpen={setIsProfileOpen} />}
    </div>
  );
}