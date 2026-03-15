import React, { useState } from 'react';
import { 
  Home, CloudRain, MessageCircle, Bell, Camera, Volume2, PhoneCall, 
  AlertTriangle, Send, Sun, Cloud, ThermometerSun, Bug, Leaf, 
  ZoomIn, ZoomOut, Layers, Ban, MapPin, CheckCircle, Edit3, ArrowLeft, Droplets, Wind, Phone
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
  // 1. On crée un état pour savoir quelle culture est cliquée (null = aucune)
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  if (isProfileOpen) return <AccountScreen setIsProfileOpen={setIsProfileOpen} />;

  return (
    <div className="flex flex-col h-full bg-gray-100 overflow-y-auto relative">
      {/* --- EN-TÊTE ET CARTE SATELLITE --- */}
      <div className="absolute top-0 w-full z-20 flex justify-between items-center p-4 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center space-x-2 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
          <MapPin size={16} className="text-red-400" />
          <span className="text-white font-bold text-xs shadow-sm">Korhogo, Savanes</span>
        </div>
        <button 
          onClick={() => setIsProfileOpen(true)}
          className="w-10 h-10 bg-white rounded-full border-2 border-green-500 flex items-center justify-center text-green-700 shadow-lg overflow-hidden transition transform hover:scale-105"
        >
          <img src="https://www.linkedin.com/in/wonnan-soro-700732143/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BIQAVee26RBuSJMPmMBsfPw%3D%3D" alt="Profil Agriculteur" className="w-full h-full object-cover" />
        </button>
      </div>
      
      {/* --- LA VRAIE CARTE INTERACTIVE --- */}
      <div className="relative h-[45%] min-h-[300px] flex-shrink-0 border-b-4 border-green-600 rounded-b-3xl shadow-md overflow-hidden z-0">
        
        {/* Le conteneur de la carte, centré entre les deux parcelles */}
        <MapContainer 
          center={[9.5050, -6.4720]} 
          zoom={15} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          zoomControl={false}
        >
          {/* La couche d'images satellites */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; Esri'
          />
          
          {/* --- 1ère Parcelle : MAÏS (En bonne santé - Verte) --- */}
          <Polygon 
            positions={[
              [9.5065, -6.4715],
              [9.5065, -6.4685],
              [9.5035, -6.4685],
              [9.5035, -6.4715],
            ]}
            pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.4, weight: 3 }}
          >
            <Popup>
              <div className="text-center min-w-[120px]">
                <h4 className="font-bold text-gray-800 text-sm mb-1">Parcelle Maïs</h4>
                <div className="bg-green-100 text-green-800 text-xs font-black px-2 py-1.5 rounded border border-green-200 shadow-sm">
                  NDVI : 0.78
                </div>
                <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                  Végétation dense et saine.<br/>Dernier relevé : Aujourd'hui.
                </p>
              </div>
            </Popup>
          </Polygon>

          {/* --- 2ème Parcelle : ANACARDE (En stress - Orange) --- */}
          <Polygon 
            positions={[
              [9.5065, -6.4755], // On décale vers l'Ouest
              [9.5065, -6.4725],
              [9.5035, -6.4725],
              [9.5035, -6.4755],
            ]}
            pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.5, weight: 3 }}
          >
            <Popup>
              <div className="text-center min-w-[120px]">
                <h4 className="font-bold text-gray-800 text-sm mb-1">Parcelle Anacarde</h4>
                <div className="bg-orange-100 text-orange-800 text-xs font-black px-2 py-1.5 rounded border border-orange-200 shadow-sm">
                  NDVI : 0.35
                </div>
                <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                  Stress hydrique détecté.<br/>Zone à risque (Chenilles).
                </p>
              </div>
            </Popup>
          </Polygon>

        </MapContainer>

        {/* La petite étiquette flottante avec le score de santé (qui reste par-dessus la carte) */}
        <div className="absolute bottom-6 left-3 bg-white/95 rounded-2xl shadow-xl p-3 border-2 border-green-500 flex items-center space-x-3 pointer-events-none"
          style={{ zIndex: 1000 }} // Nécessaire pour passer au-dessus de Leaflet
>
          <div className="bg-green-100 p-2 rounded-full">
            <Leaf className="text-green-600" size={24} />
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] text-gray-500 font-bold uppercase leading-none mb-1">Santé Parcelle</p>
            <p className="text-2xl font-black text-gray-800 leading-none">85%</p>
          </div>
        </div>
      </div>

      {/* --- SECTION DES CULTURES --- */}
      <div className="p-4 flex flex-col space-y-5">
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
            <Leaf className="mr-2 text-green-600" size={18} /> État de mes cultures
          </h3>
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            
            {/* Bouton cliquable Maïs */}
            <div 
              onClick={() => setSelectedCrop('Maïs')}
              className="cursor-pointer min-w-[120px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden active:scale-95 transition-transform"
            >
              <div className="h-20 bg-[url('https://static.lebulletin.com/wp-content/uploads/2017/09/ma%C3%AFs-%C3%A9pi-champ-e1533057090112.jpg')] bg-cover bg-center"></div>
              <div className="p-2 text-center">
                <p className="font-bold text-gray-800 text-sm">Maïs</p>
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center justify-center">✅ En forme</span>
              </div>
            </div>

            {/* Bouton cliquable Anacarde */}
            <div 
              onClick={() => setSelectedCrop('Anacarde')}
              className="cursor-pointer min-w-[120px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden active:scale-95 transition-transform"
            >
              <div className="h-20 bg-[url('https://magazinedelafrique.com/wp-content/uploads/2020/12/Laanacarde-objet-de-tous-les-soins.jpg')] bg-cover bg-center"></div>
              <div className="p-2 text-center">
                <p className="font-bold text-gray-800 text-sm">Anacarde</p>
                <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center justify-center">⚠️ À surveiller</span>
              </div>
            </div>

          </div>
        </div>

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
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
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
  // 1. On crée un état pour stocker la liste des messages
  const [messages, setMessages] = useState([
    { id: 1, text: "Pourquoi ma zone nord est rouge sur la carte ?", sender: 'user', time: "10:42" },
    { id: 2, text: "Bonjour ! J'ai analysé la zone. Le rouge indique un stress hydrique important et un début possible d'Oïdium.", sender: 'bot', time: "10:43" }
  ]);
  
  // 2. On crée un état pour ce que l'utilisateur tape dans le champ texte
  const [inputValue, setInputValue] = useState('');

  // 3. La fonction qui s'active quand on clique sur Envoyer
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return; // On n'envoie pas de message vide

    const userText = inputValue; // On sauvegarde le texte
    
    // 1. On affiche le message de l'utilisateur
    const newUserMsg = { 
      id: Date.now(), 
      text: userText, 
      sender: 'user', 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMsg]);
    setInputValue(''); // On vide le champ texte

    // 2. Le mini-cerveau de l'IA analyse la phrase
    setTimeout(() => {
      let botResponse = "C'est noté. Je mets à jour le dossier de cette parcelle.";
      const texteMinuscule = userText.toLowerCase();

      // Mots-clés Météo
      if (texteMinuscule.includes('météo') || texteMinuscule.includes('pluie') || texteMinuscule.includes('soleil')) {
        botResponse = "D'après mes capteurs à Boundiali, il y a 80% de chances de pluie demain. Je déconseille toute pulvérisation aujourd'hui.";
      } 
      // Mots-clés Maladies/Insectes
      else if (texteMinuscule.includes('chenille') || texteMinuscule.includes('maladie') || texteMinuscule.includes('insecte')) {
        botResponse = "Pour les chenilles légionnaires, je vous recommande un traitement à base de Neem. Voulez-vous que je vérifie les stocks de la coopérative ?";
      } 
      // Mots-clés Salutations
      else if (texteMinuscule.includes('bonjour') || texteMinuscule.includes('salut')) {
        botResponse = "Bonjour ! Comment se portent vos plants de maïs aujourd'hui ?";
      }
      // Mots-clés Remerciements
      else if (texteMinuscule.includes('merci')) {
        botResponse = "Avec grand plaisir ! Je reste à votre disposition si vous avez un doute sur vos cultures.";
      }

      // 3. On affiche la réponse de l'IA
      const newBotMsg = { 
        id: Date.now() + 1, 
        text: botResponse, 
        sender: 'bot', 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages(prevMessages => [...prevMessages, newBotMsg]);
    }, 1200); // L'IA "tape" pendant 1.2 secondes
  };
  return (
    <div className="flex flex-col h-full bg-[#E5DDD5]">
      <div className="bg-green-700 text-white p-4 pt-6 flex items-center shadow-md">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
          <span className="text-2xl">🤖</span>
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight">Assistant Agri-IA</h2>
          <span className="text-xs text-green-200">En ligne</span>
        </div>
      </div>
      
      <div className="flex-grow p-4 overflow-y-auto space-y-4 flex flex-col">
        {/* On affiche dynamiquement tous les messages */}
        {messages.map((msg) => (
          <div key={msg.id} className={`p-3 rounded-lg max-w-[85%] shadow-sm border ${
            msg.sender === 'user' 
              ? 'self-end bg-[#DCF8C6] rounded-tr-none border-green-100' 
              : 'self-start bg-white rounded-tl-none border-gray-100'
          }`}>
            <p className="text-gray-800 text-sm">{msg.text}</p>
            <span className={`text-[10px] block mt-1 ${msg.sender === 'user' ? 'text-gray-500 text-right' : 'text-gray-400 text-right'}`}>
              {msg.time}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-[#F0F0F0] p-3 flex items-center space-x-2">
        <button className="p-2 text-gray-500 bg-white rounded-full shadow-sm">
          <Camera size={20} />
        </button>
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Écrivez votre question..." 
          className="flex-grow p-2.5 rounded-full border-none shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500" 
        />
        <button 
          onClick={handleSendMessage}
          className="p-2.5 bg-green-600 text-white rounded-full shadow-sm hover:bg-green-700"
        >
          <Send size={18} className="ml-0.5" />
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
