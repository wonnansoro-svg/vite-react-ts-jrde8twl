import { GoogleGenerativeAI } from '@google/generative-ai';
import React, { useState, useEffect } from 'react';
import { 
  Home, CloudRain, MessageCircle, Bell, Volume2, 
  AlertTriangle, Send, Sun, Cloud, Bug, Leaf, 
  MapPin, ArrowLeft, Wind, CloudLightning, 
  XCircle, Loader2, Locate, Phone, MessageSquare, Map,
  CreditCard, Check, Crown, Star
} from 'lucide-react';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polygon, Popup, Circle, Marker, useMap } from 'react-leaflet';

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
}

// --- OUTIL POUR RECENTRER LA CARTE ---
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
};

// --- 2. FONCTIONS MÉTÉO VISUELLE ---
const getWeatherVisuals = (code: number) => {
  if (code === 0 || code === 1) return { weatherImg: "https://img.freepik.com/photos-gratuite/beau-paysage-ciel-bleu_23-2151906820.jpg?w=740", Icon: Sun, actionImg: "https://img.freepik.com/photos-gratuite/recolte-du-riz-au-sri-lanka_23-2151940459.jpg?w=740", actionType: "harvest", ttsText: "Ciel dégagé et très ensoleillé. Moment idéal pour récolter." };
  if (code === 2 || code === 3) return { weatherImg: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=400", Icon: Cloud, actionImg: "https://img.freepik.com/photos-gratuite/gros-plan-photo-main-tenant-plantation-graine-plante_1150-28369.jpg", actionType: "sowing", ttsText: "Ciel nuageux avec bonne humidité. Conditions parfaites pour semer." };
  if (code >= 50 && code <= 67) return { weatherImg: "https://img.freepik.com/vecteurs-libre/parapluie-rouge-sous-pluie_1284-11413.jpg?w=740", Icon: CloudRain, actionImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiHyDydvnCDwg_HZHcnOlBqQrXb5TePETSAQ&s", actionType: "spray_no", ttsText: "Pluie prévue. Ne faites aucune pulvérisation aujourd'hui." };
  if (code >= 80) return { weatherImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIMzaqG-lwT8wszF3lRYHXvVgI7FWrkEG3ng&s", Icon: CloudLightning, actionImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiHyDydvnCDwg_HZHcnOlBqQrXb5TePETSAQ&s", actionType: "spray_no", ttsText: "Alerte orages violents. Restez à l'abri." };
  return { weatherImg: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=400", Icon: Cloud, actionImg: "https://img.freepik.com/photos-gratuite/gros-plan-photo-main-tenant-plantation-graine-plante_1150-28369.jpg", actionType: "sowing", ttsText: "Temps clément. Vous pouvez continuer vos activités." };
};

// --- 3. COMPOSANTS DE NAVIGATION & PROFIL ---
const BottomNav: React.FC<{ activeTab: TabType, setActiveTab: (t: TabType) => void, setIsProfileOpen: (o: boolean) => void }> = ({ activeTab, setActiveTab, setIsProfileOpen }) => (
  <div className="bg-white border-t border-gray-200 flex justify-around items-center p-2 pb-4 text-[10px] text-gray-500 z-50 relative">
    <button onClick={() => {setActiveTab('dashboard'); setIsProfileOpen(false);}} className={`flex flex-col items-center ${activeTab === 'dashboard' ? 'text-green-600 font-bold' : ''}`}><Home size={20} className="mb-1" /> Accueil</button>
    <button onClick={() => {setActiveTab('weather'); setIsProfileOpen(false);}} className={`flex flex-col items-center ${activeTab === 'weather' ? 'text-green-600 font-bold' : ''}`}><CloudRain size={20} className="mb-1" /> Météo</button>
    <button onClick={() => {setActiveTab('chat'); setIsProfileOpen(false);}} className={`flex flex-col items-center ${activeTab === 'chat' ? 'text-green-600 font-bold' : ''}`}><MessageCircle size={20} className="mb-1" /> IA Chat</button>
    <button onClick={() => {setActiveTab('alert'); setIsProfileOpen(false);}} className={`flex flex-col items-center ${activeTab === 'alert' ? 'text-red-600 font-bold' : ''}`}><div className="relative"><Bell size={20} className="mb-1" /><span className="absolute top-0 right-0 bg-red-500 w-2.5 h-2.5 rounded-full border border-white"></span></div> Alertes</button>
  </div>
);

// --- ⭐️ NOUVEAU PROFIL AVEC GESTION DES ABONNEMENTS ⭐️ ---
const AccountScreen: React.FC<{ setIsProfileOpen: (o: boolean) => void, onUpdateLocation: () => void }> = ({ setIsProfileOpen, onUpdateLocation }) => {
  // Simulation de l'abonnement actuel (Dans la vraie app, ça viendra de votre base de données)
  const [currentPlan, setCurrentPlan] = useState('premium');

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto z-40 relative pb-20">
      <div className="bg-green-700 text-white p-4 pt-6 flex items-center font-bold text-lg sticky top-0 shadow-md z-20">
        <button onClick={() => setIsProfileOpen(false)} className="mr-3 p-1.5 hover:bg-green-600 rounded-full transition-colors"><ArrowLeft size={24} /></button>
        Mon Profil
      </div>
      
      <div className="p-4 space-y-6">
        {/* EN-TÊTE UTILISATEUR */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <img src="https://img.freepik.com/photos-premium/daily-farm-life-men-in-agriculture-and-their-connection-to-rural-traditions_914383-31331.jpg" alt="Profil" className="w-16 h-16 rounded-full border-2 border-green-500 object-cover" />
          <div>
            <h2 className="font-black text-gray-800 text-lg">SORO Wonnan</h2>
            <p className="text-xs text-gray-500 font-medium mb-1">Culture : Maïs, Coton, Anacarde</p>
            {currentPlan === 'premium' && <span className="inline-flex items-center bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"><Crown size={12} className="mr-1" /> Membre Premium</span>}
            {currentPlan === 'expert' && <span className="inline-flex items-center bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"><Star size={12} className="mr-1" /> Coopérative Expert</span>}
            {currentPlan === 'gratuit' && <span className="inline-flex items-center bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Compte Basique</span>}
          </div>
        </div>
        
        {/* BOUTON POUR MODIFIER LA POSITION DU CHAMP */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center"><Map className="mr-2 text-green-600" size={20}/> Gestion de mon exploitation</h3>
          <button onClick={() => { onUpdateLocation(); setIsProfileOpen(false); }} className="w-full bg-blue-50 text-blue-700 font-bold py-3 rounded-xl border border-blue-200 flex items-center justify-center hover:bg-blue-100 transition-colors">
            <Locate className="mr-2" size={20} /> Mettre à jour la position GPS
          </button>
        </div>

        {/* SECTION ABONNEMENTS */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4 flex items-center"><CreditCard className="mr-2 text-green-600" size={20}/> Mes Abonnements</h3>
          
          <div className="space-y-4">
            {/* Plan Gratuit */}
            <div className={`relative p-5 rounded-2xl border-2 transition-all ${currentPlan === 'gratuit' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
              {currentPlan === 'gratuit' && <div className="absolute -top-3 right-4 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Actuel</div>}
              <h4 className="font-black text-gray-800 text-lg">Basique (Gratuit)</h4>
              <p className="text-2xl font-black text-green-600 my-1">0 FCFA <span className="text-sm text-gray-500 font-medium">/ mois</span></p>
              <ul className="text-sm text-gray-600 space-y-2 mb-4 mt-3">
                <li className="flex items-center"><Check size={16} className="text-green-500 mr-2"/> Météo standard</li>
                <li className="flex items-center"><Check size={16} className="text-green-500 mr-2"/> 5 questions à l'IA / jour</li>
              </ul>
              {currentPlan !== 'gratuit' && <button onClick={() => setCurrentPlan('gratuit')} className="w-full py-2 rounded-xl font-bold text-gray-500 bg-gray-100">Passer au plan gratuit</button>}
            </div>

            {/* Plan Premium */}
            <div className={`relative p-5 rounded-2xl border-2 transition-all ${currentPlan === 'premium' ? 'border-yellow-400 bg-yellow-50 shadow-md' : 'border-gray-200 bg-white'}`}>
              {currentPlan === 'premium' && <div className="absolute -top-3 right-4 bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center"><Crown size={12} className="mr-1"/> Actuel</div>}
              <h4 className="font-black text-gray-800 text-lg flex items-center">Premium <Crown size={18} className="ml-2 text-yellow-500"/></h4>
              <p className="text-2xl font-black text-yellow-600 my-1">2 500 FCFA <span className="text-sm text-gray-500 font-medium">/ mois</span></p>
              <ul className="text-sm text-gray-600 space-y-2 mb-4 mt-3">
                <li className="flex items-center"><Check size={16} className="text-yellow-500 mr-2"/> Météo sur 7 jours + Actions</li>
                <li className="flex items-center"><Check size={16} className="text-yellow-500 mr-2"/> Accès illimité à l'IA (SAIDA)</li>
                <li className="flex items-center"><Check size={16} className="text-yellow-500 mr-2"/> Alertes Chenilles & NDVI (1 Parcelle)</li>
              </ul>
              {currentPlan !== 'premium' && <button onClick={() => setCurrentPlan('premium')} className="w-full py-2.5 rounded-xl font-bold text-white bg-yellow-500 hover:bg-yellow-600 shadow-sm">Mettre à niveau (Premium)</button>}
            </div>

            {/* Plan Expert / Coopérative */}
            <div className={`relative p-5 rounded-2xl border-2 transition-all ${currentPlan === 'expert' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 bg-white'}`}>
              {currentPlan === 'expert' && <div className="absolute -top-3 right-4 bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center"><Star size={12} className="mr-1"/> Actuel</div>}
              <h4 className="font-black text-gray-800 text-lg">Expert (Coopérative)</h4>
              <p className="text-2xl font-black text-blue-600 my-1">10 000 FCFA <span className="text-sm text-gray-500 font-medium">/ mois</span></p>
              <ul className="text-sm text-gray-600 space-y-2 mb-4 mt-3">
                <li className="flex items-center"><Check size={16} className="text-blue-500 mr-2"/> Toutes les options Premium</li>
                <li className="flex items-center"><Check size={16} className="text-blue-500 mr-2"/> Analyse de parcelles illimitées</li>
                <li className="flex items-center"><Check size={16} className="text-blue-500 mr-2"/> Ligne directe avec un Agronome</li>
              </ul>
              {currentPlan !== 'expert' && <button onClick={() => setCurrentPlan('expert')} className="w-full py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm">Devenir Expert</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 4. ÉCRAN DES ALERTES ---
const AlertScreen: React.FC = () => (
  <div className="flex flex-col h-full bg-gray-50 overflow-y-auto pb-24">
    <div className="bg-red-600 text-white p-4 pt-6 flex items-center font-bold text-lg sticky top-0 shadow-md">
      <AlertTriangle className="mr-2" size={24} /> Centre d'Alertes
    </div>
    
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-2xl shadow-md border-t-4 border-red-600 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <h2 className="font-black text-red-600 text-lg">Invasion de Chenilles Légionnaires</h2>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full uppercase">Critique</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Détecté sur : Parcelle 1 (Maïs)</p>
        </div>
        
        <img src="https://bioprotectionportal.com/wp-content/uploads/2023/07/fall_armyworm_larvae_on_maize-1-1024x683.jpg" alt="Chenilles" className="w-full h-48 object-cover" />
        
        <div className="p-4 bg-red-50">
          <p className="text-sm text-gray-800 mb-4">L'analyse satellite (NDVI) indique une perte rapide de la masse végétale sur votre maïs. Une intervention immédiate est requise pour sauver la récolte.</p>
          
          <h3 className="font-bold text-gray-800 mb-3 text-sm">Action recommandée : Contacter l'assistance</h3>
          <div className="flex space-x-3">
            <a href="tel:+22500000000" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold flex justify-center items-center transition-colors">
              <Phone className="mr-2" size={18} /> Appeler
            </a>
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex justify-center items-center transition-colors">
              <MessageSquare className="mr-2" size={18} /> Message
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- 5. ÉCRAN DASHBOARD ---
const DashboardScreen: React.FC<{ setActiveTab: (t: TabType) => void, location: LocationState, setIsProfileOpen: (o: boolean) => void }> = ({ setActiveTab, location, setIsProfileOpen }) => {
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const actualiserGPS = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { setUserPos([pos.coords.latitude, pos.coords.longitude]); setIsLocating(false); },
        (err) => { console.error(err); setIsLocating(false); alert("Activez le GPS de votre appareil."); },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } 
      );
    } else { setIsLocating(false); }
  };

  useEffect(() => { setUserPos([location.lat, location.lon]); }, [location.lat, location.lon]);

  const polyMais: [number, number][] = [ [location.lat + 0.0015, location.lon + 0.0005], [location.lat + 0.0015, location.lon + 0.0035], [location.lat - 0.0015, location.lon + 0.0035], [location.lat - 0.0015, location.lon + 0.0005] ];
  const polyCoton: [number, number][] = [ [location.lat + 0.0020, location.lon - 0.0040], [location.lat + 0.0020, location.lon - 0.0010], [location.lat - 0.0010, location.lon - 0.0010], [location.lat - 0.0010, location.lon - 0.0040] ];
  const polyAnacarde: [number, number][] = [ [location.lat - 0.0025, location.lon + 0.0010], [location.lat - 0.0025, location.lon + 0.0050], [location.lat - 0.0055, location.lon + 0.0050], [location.lat - 0.0055, location.lon + 0.0010] ];

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto relative pb-20">
      <div className="absolute top-0 w-full z-20 flex justify-between items-center p-4 pointer-events-none">
        <div className="flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-auto shadow-md"><MapPin size={16} className="text-red-400 animate-bounce" /><span className="text-white font-bold text-xs">Mon Champ ({location.city})</span></div>
        <button onClick={() => setIsProfileOpen(true)} className="w-10 h-10 bg-white rounded-full border-2 border-green-500 flex items-center justify-center overflow-hidden pointer-events-auto shadow-md"><img src="https://img.freepik.com/photos-premium/daily-farm-life-men-in-agriculture-and-their-connection-to-rural-traditions_914383-31331.jpg" alt="Profil" className="w-full h-full object-cover" /></button>
      </div>
      
      <div className="relative h-[45%] min-h-[320px] flex-shrink-0 border-b-4 border-green-600 rounded-b-3xl shadow-md overflow-hidden z-0 bg-gray-200">
        <MapContainer center={[location.lat, location.lon]} zoom={14} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false}>
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          {userPos && <MapUpdater center={userPos} />}
          {userPos && (
            <>
              <Circle center={userPos} radius={2000} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.15 }} />
              <Marker position={userPos}><Popup>Votre position actuelle</Popup></Marker>
            </>
          )}
          <Polygon positions={polyMais} pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.5 }}><Popup>Parcelle 1 : Maïs</Popup></Polygon>
          <Polygon positions={polyCoton} pathOptions={{ color: '#e2e8f0', fillColor: '#ffffff', fillOpacity: 0.6 }}><Popup>Parcelle 2 : Coton</Popup></Polygon>
          <Polygon positions={polyAnacarde} pathOptions={{ color: '#ea580c', fillColor: '#ea580c', fillOpacity: 0.5 }}><Popup>Parcelle 3 : Anacarde</Popup></Polygon>
        </MapContainer>
        <button onClick={actualiserGPS} disabled={isLocating} className="absolute bottom-20 right-3 bg-white/95 rounded-full shadow-xl p-3 border-2 border-blue-500 flex items-center justify-center text-blue-600 pointer-events-auto transition-transform active:scale-95" style={{ zIndex: 1000 }}>{isLocating ? <Loader2 className="animate-spin" size={24} /> : <Locate size={24} />}</button>
        <div className="absolute bottom-6 left-3 bg-white/95 rounded-2xl shadow-xl p-3 border-2 border-green-500 flex items-center space-x-3 pointer-events-none" style={{ zIndex: 1000 }}><div className="bg-green-100 p-2 rounded-full"><Leaf className="text-green-600" size={24} /></div><div className="flex flex-col"><p className="text-[10px] text-gray-500 font-bold uppercase leading-none mb-1">Santé Globale</p><p className="text-2xl font-black text-gray-800 leading-none">85%</p></div></div>
      </div>

      <div className="p-4 pt-6 space-y-6">
        <div>
          <h3 className="text-base font-bold text-gray-800 flex items-center mb-4"><Leaf className="mr-2 text-green-600" size={20} /> Mes Champs</h3>
          <div className="flex overflow-x-auto space-x-4 pb-2 -mx-4 px-4 scrollbar-hide">
            <div onClick={() => setSelectedCrop('Maïs')} className="cursor-pointer bg-white rounded-2xl shadow-sm min-w-[220px] flex-shrink-0 border border-gray-100 overflow-hidden"><div className="relative h-28"><img src="https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400" alt="Maïs" className="w-full h-full object-cover" /></div><div className="p-4"><h3 className="font-bold text-gray-800">Parcelle 1 - Maïs</h3></div></div>
            <div onClick={() => setSelectedCrop('Coton')} className="cursor-pointer bg-white rounded-2xl shadow-sm min-w-[220px] flex-shrink-0 border border-gray-100 overflow-hidden"><div className="relative h-28"><img src="https://images.unsplash.com/photo-1595085350702-86ee979b9b66?w=400" alt="Coton" className="w-full h-full object-cover" /></div><div className="p-4"><h3 className="font-bold text-gray-800">Parcelle 2 - Coton</h3></div></div>
            <div onClick={() => setSelectedCrop('Anacarde')} className="cursor-pointer bg-white rounded-2xl shadow-sm min-w-[220px] flex-shrink-0 border border-gray-100 overflow-hidden"><div className="relative h-28"><img src="https://images.unsplash.com/photo-1532296068339-4ab529dc3709?w=400" alt="Anacarde" className="w-full h-full object-cover" /></div><div className="p-4"><h3 className="font-bold text-gray-800">Parcelle 3 - Anacarde</h3></div></div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-bold text-red-600 mb-3 flex items-center"><AlertTriangle className="mr-2" size={18} /> Alertes Récentes</h3>
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-red-500 p-3 flex items-center space-x-3"><img src="https://bioprotectionportal.com/wp-content/uploads/2023/07/fall_armyworm_larvae_on_maize-1-1024x683.jpg" alt="Chenille" className="w-16 h-16 rounded-lg object-cover" /><div className="flex-grow"><div className="flex justify-between items-start"><h4 className="font-bold text-sm">Chenilles sur le Maïs</h4><Bug size={16} className="text-red-500" /></div><button onClick={() => setActiveTab('alert')} className="mt-2 text-xs bg-red-100 text-red-700 font-bold px-2 py-1 rounded w-full">Voir l'Alerte</button></div></div>
        </div>
      </div>
      
      {selectedCrop && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60"><div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl relative"><h3 className="text-xl font-black mb-3">Détails : {selectedCrop}</h3><p className="text-gray-600 mb-4">Analyse NDVI de votre parcelle de {selectedCrop.toLowerCase()}...</p><button onClick={() => setSelectedCrop(null)} className="w-full bg-green-100 text-green-800 py-3 rounded-xl font-bold hover:bg-green-200">Fermer</button></div></div>
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
      const utterance = new SpeechSynthesisUtterance(`Météo à ${location.city}. Température ${temp}. ${text}`);
      utterance.lang = 'fr-FR'; utterance.rate = 0.9;
      utterance.onstart = () => setSpeakingId(id); utterance.onend = () => setSpeakingId(null); utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isLoading) return <div className="flex h-full items-center justify-center flex-col"><Loader2 className="animate-spin text-green-600 mb-4" size={48} /><p>Analyse météo de votre champ...</p></div>;

  return (
    <div className="flex flex-col h-full bg-gray-100 overflow-y-auto pb-24">
      <div className="bg-white p-4 shadow-sm border-b flex items-center justify-between sticky top-0 z-20"><h1 className="text-xl font-black">Météo (7 Jours)</h1><div className="flex items-center bg-green-50 px-3 py-1.5 rounded-full"><MapPin size={16} className="mr-1.5 text-green-600" /><span className="text-sm font-bold text-green-800">Votre champ</span></div></div>
      <div className="p-4 space-y-4">
        {forecast.map((day) => (
          <div key={day.id} className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col relative">
            <div className="bg-gray-800 text-white text-center py-1.5 font-bold text-sm uppercase">{day.day}</div>
            <button onClick={() => speak(day.id, day.day, day.ttsText || "", day.temp)} className={`absolute top-10 right-2 z-50 p-2 rounded-full shadow-lg ${speakingId === day.id ? 'bg-green-500 text-white animate-pulse scale-110' : 'bg-white/80 text-green-700'}`}><Volume2 size={24} /></button>
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

// --- 7. ÉCRAN CHAT IA ---
const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Bonjour ! Je suis SAIDA. Que se passe-t-il dans vos champs aujourd'hui ?" }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
      if (!API_KEY) throw new Error("Clé API manquante");

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "Tu es SAIDA, expert agricole. Réponds en 2 phrases max."
      });

      const history = messages.slice(1).map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(userMessage);
      
      setMessages((prev) => [...prev, { role: 'assistant', content: result.response.text() }]);
    } catch (error: any) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Désolé, problème IA : ${error.message}` }]);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 pb-24">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-white text-gray-800 border shadow-sm rounded-bl-none'}`}>{msg.content}</div></div>
        ))}
        {isLoading && <div className="flex justify-start"><div className="bg-white p-3 rounded-2xl border shadow-sm flex items-center space-x-2"><Loader2 className="animate-spin text-green-600" size={16} /><span className="text-sm">SAIDA réfléchit...</span></div></div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="absolute bottom-16 left-0 w-full bg-white p-3 border-t flex items-center z-10"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Posez votre question à SAIDA..." className="flex-grow bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none" /><button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="ml-2 bg-green-600 text-white p-2.5 rounded-full"><Send size={18} /></button></div>
    </div>
  );
};

// --- 8. APPLICATION PRINCIPALE ET ONBOARDING ---
export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [weatherForecast, setWeatherForecast] = useState<DailyWeather[]>([]);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  
  const [farmLocation, setFarmLocation] = useState<LocationState | null>(null);
  const [isLocatingFarm, setIsLocatingFarm] = useState(false);

  useEffect(() => {
    const savedLocation = localStorage.getItem('farmLocation');
    if (savedLocation) {
      setFarmLocation(JSON.parse(savedLocation));
    }
  }, []);

  const defineFarmLocation = () => {
    setIsLocatingFarm(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLoc = { lat: pos.coords.latitude, lon: pos.coords.longitude, city: "Ma Localité" };
          setFarmLocation(newLoc);
          localStorage.setItem('farmLocation', JSON.stringify(newLoc)); 
          setIsLocatingFarm(false);
        },
        (error) => {
          console.error("Erreur GPS Onboarding:", error);
          alert("GPS refusé. Nous utilisons Boundiali par défaut.");
          const defaultLoc = { lat: 9.5217, lon: -6.4869, city: "Boundiali" };
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
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${farmLocation.lat}&longitude=${farmLocation.lon}&daily=weathercode,temperature_2m_max,windspeed_10m_max&timezone=auto`);
        const data = await response.json();
        const formattedForecast = data.daily.time.map((date: string, index: number) => {
          const code = data.daily.weathercode[index];
          const temp = data.daily.temperature_2m_max[index];
          const wind = data.daily.windspeed_10m_max[index];
          const visuals = getWeatherVisuals(code);
          const dateObj = new Date(date);
          const dayName = index === 0 ? "Aujourd'hui" : index === 1 ? "Demain" : dateObj.toLocaleDateString('fr-FR', { weekday: 'long' });
          return { id: index, day: dayName, temp: `${temp}°C`, wind: `${wind} km/h`, ...visuals };
        }).slice(0, 7);
        setWeatherForecast(formattedForecast);
      } catch (error) { console.error("Erreur météo:", error); } finally { setIsWeatherLoading(false); }
    };
    fetchWeather();
  }, [farmLocation]);

  if (!farmLocation) {
    return (
      <div className="h-[100dvh] w-full bg-green-700 flex flex-col justify-center items-center p-6 text-center relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1595085350702-86ee979b9b66?w=600" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="background" />
        <div className="relative z-10 bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full">
          <div className="bg-green-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6">
            <MapPin size={40} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-800 mb-2">Bienvenue sur SAIDA</h1>
          <p className="text-gray-600 mb-8 text-sm">Pour commencer, nous avons besoin d'enregistrer la position exacte de votre champ principal.</p>
          <button 
            onClick={defineFarmLocation} 
            disabled={isLocatingFarm}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl flex justify-center items-center shadow-lg transition-transform active:scale-95"
          >
            {isLocatingFarm ? <Loader2 className="animate-spin mr-2" size={20} /> : <Locate className="mr-2" size={20} />}
            {isLocatingFarm ? "Recherche satellite..." : "Géolocaliser mon champ"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full bg-white flex flex-col relative overflow-hidden">
      <div className="flex-grow overflow-hidden relative">
        {isProfileOpen ? (
          <AccountScreen setIsProfileOpen={setIsProfileOpen} onUpdateLocation={defineFarmLocation} />
        ) : (
          <>
            {activeTab === 'dashboard' && <DashboardScreen setActiveTab={setActiveTab} location={farmLocation} setIsProfileOpen={setIsProfileOpen} />}
            {activeTab === 'weather' && <WeatherScreen location={farmLocation} forecast={weatherForecast} isLoading={isWeatherLoading} />}
            {activeTab === 'chat' && <ChatScreen />}
            {activeTab === 'alert' && <AlertScreen />}
          </>
        )}
      </div>
      {!isProfileOpen && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} setIsProfileOpen={setIsProfileOpen} />}
    </div>
  );
}