import { GoogleGenerativeAI } from '@google/generative-ai';
import React, { useState, useEffect } from 'react';
import { 
  Home, CloudRain, MessageCircle, Bell, Camera, Volume2, PhoneCall, 
  AlertTriangle, Send, Sun, Cloud, ThermometerSun, Bug, Leaf, 
  ZoomIn, ZoomOut, Layers, Ban, MapPin, Edit3, ArrowLeft, Droplets, Wind, Phone,
  MessageSquare, TrendingUp, Map, Grid, Calendar, CloudLightning, 
  CheckCircle, XCircle, Loader2
} from 'lucide-react';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet';

// --- DÉFINITION DES TYPES ---
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
}

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  setIsProfileOpen: (isOpen: boolean) => void;
}

interface AccountScreenProps {
  setIsProfileOpen: (isOpen: boolean) => void;
}

interface DashboardScreenProps {
  isProfileOpen: boolean;
  setIsProfileOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: TabType) => void;
  location: LocationState;
}

interface WeatherScreenProps {
  location: LocationState;
  forecast: DailyWeather[];
  isLoading: boolean;
}

// --- FONCTIONS UTILITAIRES POUR LA MÉTÉO VISUELLE ---
// Transforme les codes météo bruts de l'API en notre logique 100% visuelle (Images + Actions)
// --- FONCTIONS UTILITAIRES POUR LA MÉTÉO VISUELLE & VOCALE ---
const getWeatherVisuals = (code: number) => {
  if (code === 0 || code === 1) { 
      return {
          weatherImg: "https://img.freepik.com/photos-gratuite/beau-paysage-ciel-bleu_23-2151906820.jpg?semt=ais_rp_progressive&w=740&q=80",
          Icon: Sun,
          actionImg: "https://img.freepik.com/photos-gratuite/recolte-du-riz-au-sri-lanka_23-2151940459.jpg?semt=ais_hybrid&w=740&q=80",
          actionType: "harvest",
          ttsText: "Ciel dégagé et très ensoleillé. C'est le moment idéal pour récolter vos cultures."
      };
  } else if (code === 2 || code === 3) { 
      return {
          weatherImg: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&q=80&w=400",
          Icon: Cloud,
          actionImg: "https://img.freepik.com/photos-gratuite/gros-plan-photo-main-tenant-plantation-graine-plante_1150-28369.jpg",
          actionType: "sowing",
          ttsText: "Ciel nuageux avec une bonne humidité. Les conditions sont parfaites pour semer."
      };
  } else if (code >= 50 && code <= 67) { 
      return {
          weatherImg: "https://img.freepik.com/vecteurs-libre/parapluie-rouge-sous-pluie_1284-11413.jpg?semt=ais_hybrid&w=740&q=80",
          Icon: CloudRain,
          actionImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiHyDydvnCDwg_HZHcnOlBqQrXb5TePETSAQ&s",
          actionType: "spray_no",
          ttsText: "Attention, pluie prévue. Il est strictement interdit de pulvériser des produits aujourd'hui, ils seraient lavés par l'eau."
      };
  } else if (code >= 80) { 
      return {
          weatherImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIMzaqG-lwT8wszF3lRYHXvVgI7FWrkEG3ng&s",
          Icon: CloudLightning,
          actionImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiHyDydvnCDwg_HZHcnOlBqQrXb5TePETSAQ&s",
          actionType: "spray_no",
          ttsText: "Alerte météo. Risque d'orages violents. Restez à l'abri et ne faites aucun traitement sur vos parcelles."
      };
  }
  return { 
      weatherImg: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&q=80&w=400",
      Icon: Cloud,
      actionImg: "https://img.freepik.com/photos-gratuite/gros-plan-photo-main-tenant-plantation-graine-plante_1150-28369.jpg",
      actionType: "sowing",
          ttsText: "Temps clément. Vous pouvez continuer vos activités agricoles normalement."
  };
};

// --- COMPOSANTS DE NAVIGATION & PROFIL ---

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, setIsProfileOpen }) => (
  <div className="bg-white border-t border-gray-200 flex justify-around items-center p-2 pb-4 text-[10px] text-gray-500">
    <button onClick={() => {setActiveTab('dashboard'); setIsProfileOpen(false);}} className={`flex flex-col items-center ${activeTab === 'dashboard' ? 'text-green-600 font-bold' : ''}`}>
      <Home size={20} className="mb-1" /> Accueil
    </button>
    <button onClick={() => {setActiveTab('weather'); setIsProfileOpen(false);}} className={`flex flex-col items-center ${activeTab === 'weather' ? 'text-green-600 font-bold' : ''}`}>
      <CloudRain size={20} className="mb-1" /> Météo
    </button>
    <button onClick={() => {setActiveTab('chat'); setIsProfileOpen(false);}} className={`flex flex-col items-center ${activeTab === 'chat' ? 'text-green-600 font-bold' : ''}`}>
      <MessageCircle size={20} className="mb-1" /> IA Chat
    </button>
    <button onClick={() => {setActiveTab('alert'); setIsProfileOpen(false);}} className={`flex flex-col items-center ${activeTab === 'alert' ? 'text-red-600 font-bold' : ''}`}>
      <div className="relative"><Bell size={20} className="mb-1" /><span className="absolute top-0 right-0 bg-red-500 w-2.5 h-2.5 rounded-full border border-white"></span></div> Alertes
    </button>
  </div>
);

const AccountScreen: React.FC<AccountScreenProps> = ({ setIsProfileOpen }) => (
  <div className="flex flex-col h-full bg-gray-50 overflow-y-auto animate-in fade-in duration-300">
    <div className="bg-green-700 text-white p-4 pt-6 flex items-center font-bold text-lg shadow-md z-10 sticky top-0">
      <button onClick={() => setIsProfileOpen(false)} className="mr-3 p-1.5 hover:bg-green-600 rounded-full transition-colors"><ArrowLeft size={24} /></button>
      Mon Profil & Forfaits
    </div>
    <div className="p-4 space-y-5 pb-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <img src="https://img.freepik.com/photos-premium/daily-farm-life-men-in-agriculture-and-their-connection-to-rural-traditions_914383-31331.jpg" alt="Profil Agriculteur" className="w-16 h-16 rounded-full border-2 border-green-200 object-cover" />
        <div>
          <h2 className="font-bold text-gray-800 text-lg leading-tight">SORO Wonnan</h2>
          <p className="text-xs text-gray-500 mb-1">Culture : Maïs & Anacarde</p>
          <span className="inline-block bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Forfait actuel : Découverte</span>
        </div>
      </div>
      {/* ... [Reste du code Profil identique] ... */}
    </div>
  </div>
);

// --- ÉCRAN 1 : LE DASHBOARD (Carte dynamique) ---

const DashboardScreen: React.FC<DashboardScreenProps> = ({ isProfileOpen, setIsProfileOpen, setActiveTab, location }) => {
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  if (isProfileOpen) return <AccountScreen setIsProfileOpen={setIsProfileOpen} />;

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto relative pb-20">
      
      <div className="absolute top-0 w-full z-20 flex justify-between items-center p-4 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <div className="flex items-center space-x-2 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-auto">
          <MapPin size={16} className="text-red-400 animate-bounce" />
          <span className="text-white font-bold text-xs shadow-sm">Localisation : {location.city}</span>
        </div>
        <button onClick={() => setIsProfileOpen(true)} className="w-10 h-10 bg-white rounded-full border-2 border-green-500 flex items-center justify-center text-green-700 shadow-lg overflow-hidden pointer-events-auto">
          <img src="https://img.freepik.com/photos-premium/daily-farm-life-men-in-agriculture-and-their-connection-to-rural-traditions_914383-31331.jpg" alt="Profil" className="w-full h-full object-cover" />
        </button>
      </div>
      
      {/* MAGIE : La carte se centre sur la vraie position GPS de l'utilisateur ! */}
      <div className="relative h-[45%] min-h-[320px] flex-shrink-0 border-b-4 border-green-600 rounded-b-3xl shadow-md overflow-hidden z-0 bg-gray-200">
        <MapContainer 
          key={`${location.lat}-${location.lon}`} // Force le rechargement quand le GPS est trouvé
          center={[location.lat, location.lon]} 
          zoom={15} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          zoomControl={false}
        >
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution='&copy; Esri' />
          
          {/* Les polygones sont dessinés dynamiquement AUTOUR de la vraie position GPS */}
          <Polygon 
            positions={[ [location.lat + 0.0015, location.lon + 0.0005], [location.lat + 0.0015, location.lon + 0.0035], [location.lat - 0.0015, location.lon + 0.0035], [location.lat - 0.0015, location.lon + 0.0005] ]}
            pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.4, weight: 3 }}
          >
            <Popup><div className="text-center min-w-[120px]"><h4 className="font-bold text-gray-800 text-sm mb-1">Parcelle Maïs</h4><div className="bg-green-100 text-green-800 text-xs font-black px-2 py-1.5 rounded border border-green-200 shadow-sm">NDVI : 0.78</div></div></Popup>
          </Polygon>

          <Polygon 
            positions={[ [location.lat + 0.0015, location.lon - 0.0035], [location.lat + 0.0015, location.lon - 0.0005], [location.lat - 0.0015, location.lon - 0.0005], [location.lat - 0.0015, location.lon - 0.0035] ]}
            pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.5, weight: 3 }}
          >
            <Popup><div className="text-center min-w-[120px]"><h4 className="font-bold text-gray-800 text-sm mb-1">Anacarde</h4><div className="bg-orange-100 text-orange-800 text-xs font-black px-2 py-1.5 rounded border border-orange-200 shadow-sm">NDVI : 0.35</div></div></Popup>
          </Polygon>
        </MapContainer>

        <div className="absolute bottom-6 left-3 bg-white/95 rounded-2xl shadow-xl p-3 border-2 border-green-500 flex items-center space-x-3 pointer-events-none" style={{ zIndex: 1000 }}>
          <div className="bg-green-100 p-2 rounded-full"><Leaf className="text-green-600" size={24} /></div>
          <div className="flex flex-col"><p className="text-[10px] text-gray-500 font-bold uppercase leading-none mb-1">Santé Globale</p><p className="text-2xl font-black text-gray-800 leading-none">85%</p></div>
        </div>
      </div>

      <div className="p-4 pt-6 flex flex-col space-y-6">
        <div>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center">
              <Leaf className="mr-2 text-green-600" size={20} /> Mes Champs ({location.city})
            </h3>
          </div>
          
          <div className="flex overflow-x-auto space-x-4 pb-2 -mx-4 px-4 scrollbar-hide">
            <div onClick={() => setSelectedCrop('Maïs')} className="cursor-pointer bg-white rounded-2xl shadow-sm min-w-[220px] flex-shrink-0 border border-gray-100 overflow-hidden active:scale-95 transition-transform">
              <div className="relative h-28"><img src="https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=400" alt="Maïs" className="w-full h-full object-cover" /><div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">NDVI 0.78</div></div>
              <div className="p-4"><div className="flex justify-between items-start mb-1"><h3 className="font-bold text-gray-800 text-base">Parcelle 1</h3><span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">Maïs</span></div><div className="w-full bg-gray-100 rounded-full h-1.5 mt-3"><div className="bg-green-500 h-1.5 rounded-full w-[78%]"></div></div></div>
            </div>
            <div onClick={() => setSelectedCrop('Anacarde')} className="cursor-pointer bg-white rounded-2xl shadow-sm min-w-[220px] flex-shrink-0 border border-gray-100 overflow-hidden active:scale-95 transition-transform">
              <div className="relative h-28"><img src="https://www.aip.ci/wp-content/uploads/2025/02/1001190997.jpg" alt="Anacarde" className="w-full h-full object-cover" /><div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm animate-pulse">Stress 0.35</div></div>
              <div className="p-4"><div className="flex justify-between items-start mb-1"><h3 className="font-bold text-gray-800 text-base">Parcelle 2</h3><span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded">Anacarde</span></div><div className="w-full bg-gray-100 rounded-full h-1.5 mt-3"><div className="bg-orange-400 h-1.5 rounded-full w-[35%]"></div></div></div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-red-600 mb-3 flex items-center"><AlertTriangle className="mr-2" size={18} /> Zones Critiques & Alertes</h3>
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-red-500 p-3 flex items-center space-x-3">
            <img src="https://bioprotectionportal.com/wp-content/uploads/2023/07/fall_armyworm_larvae_on_maize-1-1024x683.jpg" alt="Chenille" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
            <div className="flex-grow">
              <div className="flex justify-between items-start"><h4 className="font-bold text-gray-800 text-sm">Attaque de Chenilles</h4><Bug size={16} className="text-red-500" /></div>
              <p className="text-xs text-gray-500 leading-tight mt-1">Parcelle Maïs. Traitement urgent requis.</p>
              <button onClick={() => setActiveTab('alert')} className="mt-2 text-xs bg-red-100 text-red-700 font-bold px-2 py-1 rounded w-full">Voir l'Alerte</button>
            </div>
          </div>
        </div>
      </div>

      {selectedCrop && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-gray-800 mb-1 flex items-center">Détails : {selectedCrop}</h3>
            {selectedCrop === 'Maïs' ? (
              <div className="mt-3 space-y-3"><div className="flex justify-between items-center bg-green-50 p-2 rounded-lg border border-green-100"><span className="text-sm font-bold text-green-800">Santé globale</span><span className="text-sm font-black text-green-700">92%</span></div><p className="text-sm text-gray-600">Votre parcelle de Maïs est en excellente santé.</p></div>
            ) : (
              <div className="mt-3 space-y-3"><div className="flex justify-between items-center bg-orange-50 p-2 rounded-lg border border-orange-100"><span className="text-sm font-bold text-orange-800">Santé globale</span><span className="text-sm font-black text-orange-700">65%</span></div><p className="text-sm text-gray-600">L'Anacarde montre des signes de stress thermique.</p></div>
            )}
            <button onClick={() => setSelectedCrop(null)} className="mt-5 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-bold text-sm transition-colors">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- ÉCRAN 2 : MÉTÉO (Dynamique grâce aux props) ---

// --- ÉCRAN 2 : MÉTÉO (Dynamique + VOCAL) ---

const WeatherScreen: React.FC<WeatherScreenProps> = ({ location, forecast, isLoading }) => {
  const [speakingId, setSpeakingId] = useState<number | null>(null);

  // Fonction magique de synthèse vocale (Text-to-Speech)
  const speak = (id: number, dayName: string, text: string, temp: string) => {
    if ('speechSynthesis' in window) {
      // Coupe la voix précédente si l'utilisateur clique plusieurs fois
      window.speechSynthesis.cancel();

      const fullText = `Prévisions pour ${dayName} à ${location.city}. Température maximum de ${temp}. ${text}`;
      
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.lang = 'fr-FR'; // Voix en Français
      utterance.rate = 0.9; // Vitesse légèrement ralentie pour être bien comprise

      utterance.onstart = () => setSpeakingId(id);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Votre navigateur ne supporte pas la lecture vocale.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-gray-100 items-center justify-center pb-24">
        <Loader2 className="animate-spin text-green-600 mb-4" size={48} />
        <p className="text-gray-600 font-bold">Analyse météo satellite en cours...</p>
        <p className="text-xs text-gray-400 mt-2">Recherche pour la zone de {location.city}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 overflow-y-auto pb-24 animate-in fade-in duration-500">
      <div className="bg-white p-4 shadow-sm border-b border-gray-200 shrink-0 flex items-center justify-between sticky top-0 z-20">
         <h1 className="text-xl font-black text-gray-800">Météo & Actions</h1>
         <div className="flex items-center bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
            <MapPin size={16} className="mr-1.5 text-green-600 animate-pulse" />
            <span className="text-sm font-bold text-green-800">{location.city}</span>
          </div>
      </div>

      <div className="p-4 space-y-4 shrink-0">
        <div className="flex justify-around bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-2">
           <div className="flex flex-col items-center"><CheckCircle className="text-green-500 mb-1" size={24}/> <span className="text-[10px] font-bold">OUI</span></div>
           <div className="flex flex-col items-center"><XCircle className="text-red-500 mb-1" size={24}/> <span className="text-[10px] font-bold">NON</span></div>
        </div>

        {forecast.map((day) => (
          <div key={day.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 flex flex-col relative">
            
            <div className="bg-gray-800 text-white text-center py-1.5 font-bold text-sm tracking-wide flex justify-center items-center">
              {day.day}
            </div>

            {/* BOUTON VOCAL MAGIQUE */}
            <button 
              onClick={() => speak(day.id, day.day, day.ttsText || "", day.temp)}
              className={`absolute top-10 right-2 z-50 p-2 rounded-full shadow-lg transition-all duration-300 ${
                speakingId === day.id 
                  ? 'bg-green-500 text-white animate-pulse scale-110' 
                  : 'bg-white/80 text-green-700 backdrop-blur-md hover:bg-white'
              }`}
            >
              <Volume2 size={24} className={speakingId === day.id ? "animate-bounce" : ""} />
            </button>

            <div className="flex h-36">
              <div className="w-1/2 relative border-r-2 border-white">
                <img src={day.weatherImg} alt="Météo" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>
                <div className="absolute top-2 left-2 flex items-center">
                  <day.Icon className="text-white drop-shadow-md mr-1.5" size={20} />
                  <span className="text-2xl font-black text-white drop-shadow-md leading-none">{day.temp}</span>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded border border-white/20 flex items-center">
                  <Wind className="text-blue-300 mr-1.5" size={14} />
                  <span className="text-xs font-bold text-white tracking-wider">{day.wind}</span>
                </div>
              </div>
              <div className="w-1/2 relative border-l-2 border-white">
                <img src={day.actionImg} alt="Action" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  {day.actionType === 'spray_no' && <div className="bg-white rounded-full p-1 animate-pulse"><XCircle size={64} className="text-red-600 drop-shadow-xl" strokeWidth={2.5} /></div>}
                  {day.actionType === 'spray_yes' && <div className="bg-white rounded-full p-1"><CheckCircle size={64} className="text-green-500 drop-shadow-xl" strokeWidth={2.5} /></div>}
                  {day.actionType === 'sowing' && <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl font-black text-green-800 border-2 border-green-500 shadow-xl transform -rotate-12 uppercase text-sm">Semer</div>}
                  {day.actionType === 'harvest' && <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl font-black text-orange-800 border-2 border-orange-500 shadow-xl transform -rotate-12 uppercase text-sm">Récolter</div>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ... [Composants ChatScreen et AlertScreen identiques à votre version originale] ...
// --- ÉCRAN 3 : L'IA CHATBOT (Connecté à l'API) ---

const ChatScreen: React.FC = () => {
  // Historique des messages
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Bonjour ! Je suis SAIDA, votre expert agricole. Que se passe-t-il dans votre champ de maïs ou d'anacarde aujourd'hui ?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Pour scroller automatiquement vers le bas quand un message arrive
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

 const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // 1. Récupération de la clé depuis l'environnement
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 

      if (!API_KEY) {
        console.error("Clé API manquante !");
        setMessages((prev) => [...prev, { role: 'assistant', content: "Erreur : Clé API non trouvée." }]);
        setIsLoading(false);
        return;
      }

      // 2. Initialisation de l'IA officielle de Google
      const genAI = new GoogleGenerativeAI(API_KEY);
      
      // On utilise le modèle flash actuel et on lui donne son "Cerveau" (System Instruction)
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "Tu es SAIDA, un assistant agricole expert en Côte d'Ivoire. Tu aides les agriculteurs de la région de Boundiali. Fais des réponses TRÈS COURTES (2 ou 3 phrases max). Tes spécialités : maïs, anacarde, météo, et lutte contre la chenille légionnaire."
      });

      // 3. Formatage de l'historique de la conversation (on ignore le premier message d'accueil)
      const history = messages.slice(1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // 4. Envoi du message via l'outil officiel
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(userMessage);
      
      const aiResponse = result.response.text();

      setMessages((prev) => [...prev, { role: 'assistant', content: aiResponse }]);

    } catch (error) {
      console.error("Erreur détaillée de l'IA:", error);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: "Désolé, ma connexion au serveur d'intelligence artificielle a échoué. Vérifiez la clé API." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-16">
      
      {/* En-tête */}
      <div className="bg-green-700 text-white p-4 pt-6 flex items-center shadow-md z-10 shrink-0">
        <MessageSquare className="mr-3" size={24} />
        <div>
          <h2 className="font-bold text-lg leading-tight">Agri-IA Expert</h2>
          <span className="text-[10px] text-green-200 flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse"></span> En ligne
          </span>
        </div>
      </div>

      {/* Zone des messages */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm text-sm ${
              msg.role === 'user' 
                ? 'bg-green-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {/* Animation de chargement quand l'IA "réfléchit" */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex space-x-2 items-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div className="bg-white p-3 border-t border-gray-200 shrink-0 flex items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
          <Camera size={24} />
        </button>
        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors mr-2">
          <Volume2 size={24} />
        </button>
        
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Posez votre question..." 
          className="flex-grow bg-gray-100 text-sm rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
        />
        
        <button 
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          className={`ml-2 p-2.5 rounded-full flex items-center justify-center transition-colors ${
            input.trim() && !isLoading ? 'bg-green-600 text-white shadow-md hover:bg-green-700' : 'bg-gray-200 text-gray-400'
          }`}
        >
          <Send size={18} className="ml-0.5" />
        </button>
      </div>
    </div>
  );
};
const AlertScreen: React.FC = () => { /* Gardez votre code original ici */ return <div className="flex flex-col h-full bg-gray-50 overflow-y-auto"><div className="bg-red-600 text-white p-4 pt-6 flex items-center shadow-md"><AlertTriangle className="mr-2 animate-pulse" size={24} /><h2 className="font-bold text-lg">Alerte Critique</h2></div><div className="p-4 flex flex-col items-center justify-center mt-10"><AlertTriangle size={64} className="text-red-500 mb-4" /><h3 className="text-xl font-bold text-gray-800">Chenille Légionnaire</h3><p className="text-center text-gray-600 mt-2 mb-6">Détection confirmée. Traitement urgent requis.</p><a href="tel:+2250778014537" className="w-full flex items-center justify-center bg-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-md"><Phone className="mr-2" size={20} /> APPELER LE TECHNICIEN</a></div></div>; };


// --- COMPOSANT PRINCIPAL APP (Le Cerveau) ---

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  
  // NOUVEAU : États globaux pour la position et la météo
  const [location, setLocation] = useState<LocationState>({ lat: 9.5246, lon: -6.4867, city: "Recherche du réseau..." }); // Par défaut Boundiali
  const [weatherForecast, setWeatherForecast] = useState<DailyWeather[]>([]);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(true);

  // NOUVEAU : Effet déclenché à l'ouverture de l'application
  useEffect(() => {
    // 1. Demander la permission GPS au navigateur du jury
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log("GPS refusé. Utilisation de Boundiali par défaut.");
          fetchData(9.5246, -6.4867); // Repli de sécurité pour le pitch
        }
      );
    } else {
      fetchData(9.5246, -6.4867);
    }
  }, []);

  // 2. Fonction qui interroge les vraies API (Météo et Villes)
  const fetchData = async (lat: number, lon: number) => {
    try {
      // Appel API 1 : Trouver le nom de la ville (Reverse Geocoding OpenStreetMap)
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const geoData = await geoRes.json();
      const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county || "Zone Agricole";
      
      setLocation({ lat, lon, city });

      // Appel API 2 : Météo réelle 7 jours (Open-Meteo, sans clé API !)
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,windspeed_10m_max&timezone=auto`);
      const weatherData = await weatherRes.json();

      // Transformation des données météo complexes en votre interface Visuelle
      const formattedForecast = weatherData.daily.time.map((date: string, index: number) => {
        const code = weatherData.daily.weathercode[index];
        const temp = Math.round(weatherData.daily.temperature_2m_max[index]);
        const wind = Math.round(weatherData.daily.windspeed_10m_max[index]);
        
        const visuals = getWeatherVisuals(code);
        
           const dateObj = new Date(date);
           const dayName = index === 0 ? "Aujourd'hui" : index === 1 ? "Demain" : dateObj.toLocaleDateString('fr-FR', { weekday: 'long' });

           return {
          id: index,
          day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
          temp: `${temp}°`,
          wind: `${wind} km/h`,
          ...visuals
        };
      }).slice(0, 7);

      setWeatherForecast(formattedForecast);
      setIsWeatherLoading(false);

    } catch (error) {
      console.error("Erreur API, on garde les fausses données pour ne pas planter", error);
      setIsWeatherLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-white flex flex-col relative overflow-hidden">
      <div className="flex-grow overflow-hidden relative">
        {/* On transmet maintenant les vraies données au Dashboard et à la Météo ! */}
        {activeTab === 'dashboard' && <DashboardScreen isProfileOpen={isProfileOpen} setIsProfileOpen={setIsProfileOpen} setActiveTab={setActiveTab} location={location} />}
        {activeTab === 'weather' && <WeatherScreen location={location} forecast={weatherForecast} isLoading={isWeatherLoading} />}
        {activeTab === 'chat' && <ChatScreen />}
        {activeTab === 'alert' && <AlertScreen />}
      </div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} setIsProfileOpen={setIsProfileOpen} />
    </div>
  );
}