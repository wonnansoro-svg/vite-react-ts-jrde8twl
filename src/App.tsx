import React, { useState } from 'react';
import { 
  Home, CloudRain, MessageCircle, Bell, Camera, Volume2, PhoneCall, 
  AlertTriangle, Send, Sun, Cloud, ThermometerSun, Bug, Leaf, 
  ZoomIn, ZoomOut, Layers, Ban, MapPin, CheckCircle, Edit3, ArrowLeft, Droplets, Wind, Phone,
  MessageSquare,
} from 'lucide-react';

//---Ajoutez ceci tout en haut avec vos autres imports pour les cartes Leaflet---
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polygon, Marker, Popup
} from 'react-leaflet';

// --- DÉFINITION DES TYPES TYPESCRIPT ---
type TabType = 'dashboard' | 'weather' | 'chat' | 'alert';

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
}

// --- COMPOSANTS ---

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, setIsProfileOpen }) => (
  <div className="bg-white border-t border-gray-200 flex justify-around items-center p-2 pb-4 text-[10px] text-gray-500">
    <button onClick={() => {setActiveTab('dashboard'); setIsProfileOpen(false);}} className={`flex flex-col items-center ${activeTab === 'dashboard' ? 'text-green-600 font-bold' : ''}`}>
      <Home size={20} className="mb-1" />
      Dashboard
    </button>
    <button onClick={() => {setActiveTab('weather'); setIsProfileOpen(false);}} className={`flex flex-col items-center ${activeTab === 'weather' ? 'text-green-600 font-bold' : ''}`}>
      <CloudRain size={20} className="mb-1" />
      Météo
    </button>
    <button onClick={() => {setActiveTab('chat'); setIsProfileOpen(false);}} className={`flex flex-col items-center ${activeTab === 'chat' ? 'text-green-600 font-bold' : ''}`}>
      <MessageCircle size={20} className="mb-1" />
      IA Chat
    </button>
    <button onClick={() => {setActiveTab('alert'); setIsProfileOpen(false);}} className={`flex flex-col items-center ${activeTab === 'alert' ? 'text-red-600 font-bold' : ''}`}>
      <div className="relative">
        <Bell size={20} className="mb-1" />
        <span className="absolute top-0 right-0 bg-red-500 w-2.5 h-2.5 rounded-full border border-white"></span>
      </div>
      Alertes
    </button>
  </div>
);

const AccountScreen: React.FC<AccountScreenProps> = ({ setIsProfileOpen }) => (
  <div className="flex flex-col h-full bg-gray-50 overflow-y-auto animate-in fade-in duration-300">
    <div className="bg-green-700 text-white p-4 pt-6 flex items-center font-bold text-lg shadow-md z-10 sticky top-0">
      <button onClick={() => setIsProfileOpen(false)} className="mr-3 p-1.5 hover:bg-green-600 rounded-full transition-colors">
        <ArrowLeft size={24} />
      </button>
      Mon Profil & Forfaits
    </div>
    
    <div className="p-4 space-y-5 pb-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <img src="https://www.linkedin.com/in/wonnan-soro-700732143/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BIQAVee26RBuSJMPmMBsfPw%3D%3D" alt="Profil Agriculteur" className="w-16 h-16 rounded-full border-2 border-green-200 object-cover" />
        <div>
          <h2 className="font-bold text-gray-800 text-lg leading-tight">SORO Wonnan</h2>
          <p className="text-xs text-gray-500">Culture : Maïs & Anacarde</p>
          <p className="text-xs text-gray-500 mb-1">Localisation : Korhogo, Savanes</p>
          <span className="inline-block bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
            Forfait actuel : Découverte
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3">Mes Abonnements</h3>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gray-400"></div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-gray-800">Découverte</h4>
            <span className="text-lg font-black text-gray-800">0 FCFA</span>
          </div>
          <ul className="text-xs text-gray-600 space-y-2 mb-4">
            <li className="flex items-start"><CheckCircle size={14} className="mr-1.5 text-gray-400 flex-shrink-0" /> Dessin d'une seule parcelle</li>
            <li className="flex items-start"><CheckCircle size={14} className="mr-1.5 text-gray-400 flex-shrink-0" /> Météo basique sur 3 jours</li>
            <li className="flex items-start"><CheckCircle size={14} className="mr-1.5 text-gray-400 flex-shrink-0" /> IA Chatbot limité (5 msgs/j)</li>
          </ul>
          <button className="w-full bg-gray-100 text-gray-500 py-2.5 rounded-lg text-xs font-bold" disabled>Forfait Actif</button>
        </div>

        <div className="bg-green-50 rounded-xl shadow-md border-2 border-green-500 p-4 mb-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
            RECOMMANDÉ
          </div>
          <div className="flex justify-between items-center mb-2 mt-2">
            <h4 className="font-bold text-green-800 text-lg">Agri-Pro</h4>
            <div className="text-right">
              <span className="text-xl font-black text-green-700">2000 FCFA</span>
              <span className="text-[10px] text-green-600 block leading-none">par mois</span>
            </div>
          </div>
          <ul className="text-xs text-gray-700 space-y-2 mb-4 mt-3">
            <li className="flex items-start"><CheckCircle size={14} className="mr-1.5 text-green-600 flex-shrink-0" /> Parcelles illimitées</li>
            <li className="flex items-start"><CheckCircle size={14} className="mr-1.5 text-green-600 flex-shrink-0" /> Images satellites HD (Hebdomadaire)</li>
            <li className="flex items-start"><CheckCircle size={14} className="mr-1.5 text-green-600 flex-shrink-0" /> Alertes SMS Maladies & Climat</li>
            <li className="flex items-start"><CheckCircle size={14} className="mr-1.5 text-green-600 flex-shrink-0" /> Météo agricole prédictive à 7 jours</li>
          </ul>
          <button className="w-full bg-green-600 text-white py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-green-700 transition">
            Passer en Pro
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-blue-800">Coopérative</h4>
            <span className="text-xs font-bold text-blue-600 border border-blue-600 px-2 py-1 rounded">Sur devis</span>
          </div>
          <p className="text-xs text-gray-500 mb-3">Pour les groupements agricoles. Tableau de bord centralisé, gestion de multiples parcelles et ligne directe avec un agronome.</p>
          <button className="w-full bg-white border border-blue-600 text-blue-700 py-2 rounded-lg text-xs font-bold hover:bg-blue-50">
            Contacter le service commercial
          </button>
        </div>
      </div>
    </div>
  </div>
);

const DashboardScreen: React.FC<DashboardScreenProps> = ({ isProfileOpen, setIsProfileOpen, setActiveTab }) => {
  // On garde votre état pour savoir quelle culture est cliquée
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  if (isProfileOpen) return <AccountScreen setIsProfileOpen={setIsProfileOpen} />;

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto relative pb-20">
      
      {/* --- EN-TÊTE ET CARTE SATELLITE (Votre code intact) --- */}
      <div className="absolute top-0 w-full z-20 flex justify-between items-center p-4 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <div className="flex items-center space-x-2 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-auto">
          <MapPin size={16} className="text-red-400" />
          <span className="text-white font-bold text-xs shadow-sm">Korhogo, Savanes</span>
        </div>
        <button 
          onClick={() => setIsProfileOpen(true)}
          className="w-10 h-10 bg-white rounded-full border-2 border-green-500 flex items-center justify-center text-green-700 shadow-lg overflow-hidden transition transform hover:scale-105 pointer-events-auto"
        >
          <img src="https://www.linkedin.com/in/wonnan-soro-700732143/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BIQAVee26RBuSJMPmMBsfPw%3D%3D" alt="Profil" className="w-full h-full object-cover" />
        </button>
      </div>
      
      {/* --- LA CARTE INTERACTIVE --- */}
      <div className="relative h-[45%] min-h-[320px] flex-shrink-0 border-b-4 border-green-600 rounded-b-3xl shadow-md overflow-hidden z-0 bg-gray-200">
        <MapContainer 
          center={[9.5050, -6.4720]} 
          zoom={15} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          zoomControl={false}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; Esri'
          />
          
          {/* Parcelle : MAÏS */}
          <Polygon 
            positions={[ [9.5065, -6.4715], [9.5065, -6.4685], [9.5035, -6.4685], [9.5035, -6.4715] ]}
            pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.4, weight: 3 }}
          >
            <Popup>
              <div className="text-center min-w-[120px]">
                <h4 className="font-bold text-gray-800 text-sm mb-1">Parcelle Maïs</h4>
                <div className="bg-green-100 text-green-800 text-xs font-black px-2 py-1.5 rounded border border-green-200 shadow-sm">NDVI : 0.78</div>
              </div>
            </Popup>
          </Polygon>

          {/* Parcelle : ANACARDE */}
          <Polygon 
            positions={[ [9.5065, -6.4755], [9.5065, -6.4725], [9.5035, -6.4725], [9.5035, -6.4755] ]}
            pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.5, weight: 3 }}
          >
            <Popup>
              <div className="text-center min-w-[120px]">
                <h4 className="font-bold text-gray-800 text-sm mb-1">Anacarde</h4>
                <div className="bg-orange-100 text-orange-800 text-xs font-black px-2 py-1.5 rounded border border-orange-200 shadow-sm">NDVI : 0.35</div>
              </div>
            </Popup>
          </Polygon>
        </MapContainer>

        {/* Étiquette santé */}
        <div className="absolute bottom-6 left-3 bg-white/95 rounded-2xl shadow-xl p-3 border-2 border-green-500 flex items-center space-x-3 pointer-events-none" style={{ zIndex: 1000 }}>
          <div className="bg-green-100 p-2 rounded-full">
            <Leaf className="text-green-600" size={24} />
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] text-gray-500 font-bold uppercase leading-none mb-1">Santé Globale</p>
            <p className="text-2xl font-black text-gray-800 leading-none">85%</p>
          </div>
        </div>
      </div>

      {/* --- SECTION DES CULTURES (Le nouveau design est ici !) --- */}
      <div className="p-4 pt-6 flex flex-col space-y-6">
        <div>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center">
              <Leaf className="mr-2 text-green-600" size={20} /> Mes Champs
            </h3>
          </div>
          
          {/* Conteneur défilant horizontalement */}
          <div className="flex overflow-x-auto space-x-4 pb-2 -mx-4 px-4 scrollbar-hide">
            
            {/* Nouvelle Carte 1 : Maïs */}
            <div 
              onClick={() => setSelectedCrop('Maïs')}
              className="cursor-pointer bg-white rounded-2xl shadow-sm min-w-[220px] flex-shrink-0 border border-gray-100 overflow-hidden active:scale-95 transition-transform"
            >
              <div className="relative h-28">
                <img 
                  src="https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=400" 
                  alt="Maïs" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                  NDVI 0.78
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-800 text-base">Parcelle 1</h3>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">Maïs</span>
                </div>
                <p className="text-xs text-gray-500 mb-3 flex items-center">
                  <MapPin size={12} className="mr-1" /> Korhogo • 3.2 Hect
                </p>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                   <div className="bg-green-500 h-1.5 rounded-full w-[78%]"></div>
                </div>
              </div>
            </div>

            {/* Nouvelle Carte 2 : Anacarde */}
            <div 
              onClick={() => setSelectedCrop('Anacarde')}
              className="cursor-pointer bg-white rounded-2xl shadow-sm min-w-[220px] flex-shrink-0 border border-gray-100 overflow-hidden active:scale-95 transition-transform"
            >
              <div className="relative h-28">
                <img 
                  src="https://images.unsplash.com/photo-1628183188547-49f3e45dc5f2?auto=format&fit=crop&q=80&w=400" 
                  alt="Anacarde" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm animate-pulse">
                  Stress 0.35
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-800 text-base">Parcelle 2</h3>
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded">Anacarde</span>
                </div>
                <p className="text-xs text-gray-500 mb-3 flex items-center">
                  <MapPin size={12} className="mr-1" /> Korhogo • 5.0 Hect
                </p>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                   <div className="bg-orange-400 h-1.5 rounded-full w-[35%]"></div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* --- ZONE CRITIQUE (Votre code intact) --- */}
        <div>
          <h3 className="text-sm font-bold text-red-600 mb-3 flex items-center">
            <AlertTriangle className="mr-2" size={18} /> Zones Critiques & Alertes
          </h3>
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-red-500 p-3 flex items-center space-x-3">
            <img src="https://bioprotectionportal.com/wp-content/uploads/2023/07/fall_armyworm_larvae_on_maize-1-1024x683.jpg" alt="Chenille" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-800 text-sm">Attaque de Chenilles</h4>
                <Bug size={16} className="text-red-500" />
              </div>
              <p className="text-xs text-gray-500 leading-tight mt-1">Parcelle Maïs Sud. Traitement urgent requis.</p>
              <button onClick={() => setActiveTab('alert')} className="mt-2 text-xs bg-red-100 text-red-700 font-bold px-2 py-1 rounded w-full">
                Voir l'Alerte
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- LE POPUP (MODAL) QUI S'AFFICHE AU CLIC --- */}
      {selectedCrop && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-gray-800 mb-1 flex items-center">
              Détails : {selectedCrop}
            </h3>
            
            {selectedCrop === 'Maïs' ? (
              <div className="mt-3 space-y-3">
                <div className="flex justify-between items-center bg-green-50 p-2 rounded-lg border border-green-100">
                  <span className="text-sm font-bold text-green-800">Santé globale</span>
                  <span className="text-sm font-black text-green-700">92%</span>
                </div>
                <p className="text-sm text-gray-600">Votre parcelle de Maïs est en excellente santé. L'irrigation actuelle est parfaite. La floraison devrait commencer d'ici 12 jours.</p>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                <div className="flex justify-between items-center bg-orange-50 p-2 rounded-lg border border-orange-100">
                  <span className="text-sm font-bold text-orange-800">Santé globale</span>
                  <span className="text-sm font-black text-orange-700">65%</span>
                </div>
                <p className="text-sm text-gray-600">L'Anacarde montre des signes de stress thermique. Surveillez l'apparition d'insectes piqueurs. Un apport en eau est vivement conseillé d'ici ce soir.</p>
              </div>
            )}
            
            <button 
              onClick={() => setSelectedCrop(null)} 
              className="mt-5 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-bold text-sm transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const WeatherScreen: React.FC = () => {
  // --- CALCUL DES DATES EN TEMPS RÉEL ---
  const today = new Date();
  
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  // Fonction pour mettre la première lettre en majuscule et formater en français
  const formatDay = (date: Date, full: boolean = false) => {
    const options: Intl.DateTimeFormatOptions = full 
      ? { weekday: 'long', day: 'numeric', month: 'long' } 
      : { weekday: 'long' };
    const str = date.toLocaleDateString('fr-FR', options);
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F5F0] overflow-y-auto">
      {/* --- EN-TÊTE --- */}
      <div className="bg-blue-600 text-white p-4 pt-6 flex items-center shadow-md">
        <CloudRain className="mr-2" size={24} />
        <h2 className="font-bold text-lg">Météo & Travaux</h2>
      </div>

      <div className="p-4 space-y-4 pb-24">
        
        {/* --- CARTE DU JOUR (Avec la vraie date) --- */}
        <div className="relative bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
          <div className="absolute inset-0 bg-[url('https://media.ouest-france.fr/v1/pictures/MjAyMDA1ZjU0YWQ2NGYxMDc4YzhlOWUwYjI5NWZhMTg3ZmRjZjE?width=630&height=354&focuspoint=50%2C25&cropresize=1&client_id=bpeditorial&sign=b7377b1311777aa264aaa8eb76ba5e98adbb7a7daaeaf90934c14a0cb02027be')] bg-cover bg-center opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/95 to-blue-900/60"></div>
          
          <div className="relative p-5 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-xl">Korhogo</h3>
                {/* Affichage de la date d'aujourd'hui (ex: Lundi 15 Mars) */}
                <p className="text-sm text-blue-100 font-medium capitalize">{formatDay(today, true)}</p>
              </div>
              <Sun size={32} className="text-yellow-400 animate-pulse" />
            </div>
            
            <div className="mt-6 flex items-end space-x-4">
              <span className="text-5xl font-black">34°C</span>
              <span className="text-lg text-blue-100 mb-1">Ensoleillé et sec</span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 bg-black/30 rounded-xl p-3 backdrop-blur-sm border border-white/10">
              <div className="text-center">
                <Droplets size={16} className="mx-auto text-blue-300 mb-1" />
                <span className="text-xs font-bold block">Humidité</span>
                <span className="text-xs text-blue-100">45%</span>
              </div>
              <div className="text-center border-l border-r border-white/20">
                <Wind size={16} className="mx-auto text-gray-300 mb-1" />
                <span className="text-xs font-bold block">Vent</span>
                <span className="text-xs text-blue-100">12 km/h</span>
              </div>
              <div className="text-center">
                <ThermometerSun size={16} className="mx-auto text-red-300 mb-1" />
                <span className="text-xs font-bold block">Ressenti</span>
                <span className="text-xs text-blue-100">36°C</span>
              </div>
            </div>
          </div>
        </div>

        <h4 className="font-bold text-gray-800 text-sm mt-6 mb-2">Prévisions pour vos cultures</h4>
        
        <div className="space-y-3">
          {/* JOUR 1 - Demain avec le vrai jour de la semaine */}
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex items-center">
            <img src="https://previews.123rf.com/images/dvarg/dvarg1207/dvarg120700524/14657591-single-weather-icon-cloud-with-rain-and-lightning.avif" alt="Terre mouillée" className="w-16 h-16 rounded-lg object-cover mr-3 border border-gray-100" />
            <div className="flex-grow">
              <div className="flex justify-between">
                {/* Affichage dynamique (ex: Mardi) */}
                <span className="font-bold text-sm text-gray-800">{formatDay(tomorrow)}</span>
                <span className="font-bold text-sm text-blue-600">28°C</span>
              </div>
              <div className="flex items-center text-xs text-blue-600 mt-0.5 font-bold">
                <CloudRain size={14} className="mr-1" />
                <span>Fortes pluies (80%)</span>
              </div>
              <p className="text-[10px] text-gray-600 mt-1 leading-tight">La terre sera bien humide. Idéal pour préparer vos semis. <strong className="text-red-500">Ne pas pulvériser l'anacarde.</strong></p>
            </div>
          </div>

          {/* JOUR 2 - Après-demain avec le vrai jour de la semaine */}
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex items-center">
            <img src="https://static.europe1.fr/var/europe1/storage/styles/image_750_422/public/media/image/2024/11/26/10/la-meteo-du-26-novembre-grisaille-au-nord-ciel-voile-au-sud-le-soleil-joue-les-timides.jpg?itok=2405pYOp" alt="Paysage savane" className="w-16 h-16 rounded-lg object-cover mr-3 border border-gray-100" />
            <div className="flex-grow">
              <div className="flex justify-between">
                {/* Affichage dynamique (ex: Mercredi) */}
                <span className="font-bold text-sm text-gray-800">{formatDay(dayAfter)}</span>
                <span className="font-bold text-sm text-gray-600">31°C</span>
              </div>
              <div className="flex items-center text-xs text-gray-600 mt-0.5 font-bold">
                <Cloud size={14} className="mr-1" />
                <span>Ciel voilé (20%)</span>
              </div>
              <p className="text-[10px] text-gray-600 mt-1 leading-tight">Température clémente. Excellentes conditions pour le sarclage de la parcelle de Maïs.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const ChatScreen: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ia',
      text: "Bonjour ! Je suis votre système d'aide à la décision Agri-IA. Mes satellites ont terminé l'analyse de vos parcelles de korhogo. Comment puis-je vous aider aujourd'hui ?"
    }
  ]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const userText = inputText; 
    const newUserMsg = { id: Date.now(), sender: 'user', text: userText };
    
    setMessages((prev) => [...prev, newUserMsg]);
    setInputText('');

    setTimeout(() => {
      const textLowerCase = userText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      let aiResponse = "";

      if (textLowerCase.includes('chenille')) {
        aiResponse = "🐛 Alerte parasite : Le risque de prolifération de la chenille légionnaire d'automne est élevé en ce moment. Je recommande une inspection immédiate du cœur des plants de maïs et une pulvérisation de bio-insecticide avant 16h.";
      } else if (textLowerCase.includes('pluie') || textLowerCase.includes('meteo')) {
        aiResponse = "🌧️ Prévisions météo : De fortes pluies (80%) sont attendues demain. ⚠️ Ne lancez aucune pulvérisation foliaire aujourd'hui pour éviter que le produit ne soit lessivé par l'eau. L'humidité du sol sera cependant excellente.";
      } else if (textLowerCase.includes('anacarde')) {
        aiResponse = "🍂 Analyse Anacarderaie (NDVI: 0.35) : L'imagerie thermique montre un stress hydrique modéré. C'est une période critique pour le développement des noix. Surveillez de près les attaques potentielles de punaises (Helopeltis).";
      } else if (textLowerCase.includes('mais')) {
        aiResponse = "🌽 Parcelle de Maïs (NDVI: 0.78) : La croissance végétative est très bonne ! Attention toutefois, le niveau d'humidité actuel favorise les mauvaises herbes. Un sarclage est recommandé dans les 3 prochains jours pour aérer la culture.";
      } else if (textLowerCase.includes('semence')) {
        aiResponse = "🌱 Préparation des semis : Les pluies prévues demain vont bien détremper le sol. C'est le moment idéal pour préparer vos semences. Assurez-vous d'utiliser des variétés certifiées à cycle court et résistantes à la sécheresse.";
      } else if (textLowerCase.includes('recolte')) {
        aiResponse = "🌾 Planification de récolte : D'après l'indice de végétation, votre maïs atteindra la maturité physiologique bientôt. Préparez vos aires de séchage et vos sacs de stockage hermétiques (type PICS) pour éviter les pertes post-récolte.";
      } else if (textLowerCase.includes('bonjour') || textLowerCase.includes('salut')) {
        aiResponse = "Bonjour ! J'ai les données météo, l'état de l'anacarde et du maïs à ma disposition. Que souhaitez-vous vérifier en priorité ?";
      } else {
        aiResponse = "🛰️ C'est noté. J'intègre cette information à mon modèle prédictif. Avez-vous une question spécifique sur la météo, vos semences, ou l'état de vos cultures ?";
      }

      const newIaMsg = { id: Date.now() + 1, sender: 'ia', text: aiResponse };
      setMessages((prev) => [...prev, newIaMsg]);
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-16"> 
      {/* J'ai ajouté pb-16 ici pour laisser la place au menu principal */}
      
      <div className="bg-green-700 text-white p-4 pt-6 flex items-center shadow-md z-10 shrink-0">
        <div className="relative">
          <MessageSquare className="mr-3" size={24} />
          <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-green-700"></span>
          </span>
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight">Agri-IA Expert</h2>
          <p className="text-[10px] text-green-200 font-medium tracking-wider uppercase">Connecté aux satellites</p>
        </div>
      </div>

      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {/* J'ai enlevé le pb-24 qui n'était plus nécessaire */}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start max-w-[90%] ${msg.sender === 'user' ? 'flex-row-reverse self-end ml-auto' : ''}`}>
            <div className={`p-2 rounded-full shadow-sm border flex-shrink-0 ${msg.sender === 'user' ? 'bg-blue-100 border-blue-200 ml-2' : 'bg-green-100 border-green-200 mr-2'}`}>
              {msg.sender === 'user' ? <Home className="text-blue-700" size={18} /> : <Leaf className="text-green-700" size={18} />}
            </div>
            <div className={`p-3 rounded-2xl shadow-sm border text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border-gray-100 text-gray-800 rounded-tl-none'}`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CHANGEMENT MAJEUR ICI : J'ai retiré "fixed bottom-0" et mis "shrink-0" */}
      <div className="bg-white p-3 border-t border-gray-200 flex items-center shrink-0">
        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
          <Bug size={20} />
        </button>
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Posez votre question (ex: météo)..." 
          className="flex-grow bg-gray-100 border-none rounded-full px-4 py-2 mx-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <button 
          onClick={handleSendMessage}
          className="bg-green-600 text-white p-2.5 rounded-full shadow-sm hover:bg-green-700 transition-colors shrink-0"
        >
          <MessageSquare size={18} />
        </button>
      </div>
    </div>
  );
};

const AlertScreen: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
      {/* --- EN-TÊTE --- */}
      <div className="bg-red-600 text-white p-4 pt-6 flex items-center shadow-md">
        <AlertTriangle className="mr-2 animate-pulse" size={24} />
        <h2 className="font-bold text-lg">Alerte Critique</h2>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {/* --- CARTE D'ALERTE --- */}
        <div className="bg-white rounded-xl shadow-md border-2 border-red-500 overflow-hidden">
          <img 
            src="https://bioprotectionportal.com/wp-content/uploads/2023/07/fall_armyworm_larvae_on_maize-1-1024x683.jpg" 
            alt="Chenille légionnaire" 
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-black text-gray-800">Chenille Légionnaire</h3>
              <span className="bg-red-100 text-red-800 text-[10px] uppercase font-bold px-2 py-1 rounded animate-pulse">
                Urgence Absolue
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Détection confirmée sur la parcelle <strong>Maïs Sud</strong>. Risque de destruction rapide de la culture (plus de 15% de dégâts estimés).
            </p>
            
            <div className="bg-red-50 p-3 rounded-lg border border-red-100 mb-5">
              <h4 className="text-sm font-bold text-red-800 mb-1">Action Requise Aujourd'hui :</h4>
              <p className="text-xs text-red-700">Application d'un traitement phytosanitaire homologué. Ne pas attendre.</p>
            </div>

            {/* --- LE BOUTON D'APPEL MAGIQUE --- */}
            {/* Le href="tel:..." est ce qui déclenche l'appel sur le téléphone */}
            <a 
              href="tel:+2250778014537" 
              className="w-full flex items-center justify-center bg-red-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:bg-red-700 active:scale-95 transition-transform"
            >
              <Phone className="mr-2" size={20} />
              APPELER LE TECHNICIEN
            </a>
          </div>
        </div>
        
        {/* --- HISTORIQUE (Petit plus pour faire pro) --- */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
           <h4 className="font-bold text-gray-800 text-sm mb-2">Historique des alertes</h4>
           <p className="text-xs text-gray-500 italic">Aucune autre alerte récente sur cette parcelle au cours des 30 derniers jours.</p>
        </div>
      </div>
    </div>
  );
};

// --- COMPOSANT PRINCIPAL ---

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  return (
    <div className="h-[100dvh] w-full bg-white flex flex-col relative overflow-hidden">
      <div className="flex-grow overflow-hidden relative">
        {activeTab === 'dashboard' && <DashboardScreen isProfileOpen={isProfileOpen} setIsProfileOpen={setIsProfileOpen} setActiveTab={setActiveTab} />}
        {activeTab === 'weather' && <WeatherScreen />}
        {activeTab === 'chat' && <ChatScreen />}
        {activeTab === 'alert' && <AlertScreen />}
      </div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} setIsProfileOpen={setIsProfileOpen} />
    </div>
  );
}
