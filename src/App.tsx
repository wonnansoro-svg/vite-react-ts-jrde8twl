import React, { useState } from 'react';
import { 
  Home, CloudRain, MessageCircle, Bell, Camera, Volume2, PhoneCall, 
  AlertTriangle, Wind, Send, Sun, Cloud, ThermometerSun, Bug, Leaf, 
  ZoomIn, ZoomOut, Layers, Ban, MapPin, CheckCircle, Edit3, ArrowLeft
} from 'lucide-react';

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
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" alt="Profil Agriculteur" className="w-16 h-16 rounded-full border-2 border-green-200 object-cover" />
        <div>
          <h2 className="font-bold text-gray-800 text-lg leading-tight">Amadou T.</h2>
          <p className="text-xs text-gray-500">Culture : Maïs & Anacarde</p>
          <p className="text-xs text-gray-500 mb-1">Localisation : Boundiali, Savanes</p>
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
  if (isProfileOpen) return <AccountScreen setIsProfileOpen={setIsProfileOpen} />;

  return (
    <div className="flex flex-col h-full bg-gray-100 overflow-y-auto">
      <div className="absolute top-0 w-full z-20 flex justify-between items-center p-4 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center space-x-2 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
          <MapPin size={16} className="text-red-400" />
          <span className="text-white font-bold text-xs shadow-sm">Boundiali, Savanes</span>
        </div>
        <button 
          onClick={() => setIsProfileOpen(true)}
          className="w-10 h-10 bg-white rounded-full border-2 border-green-500 flex items-center justify-center text-green-700 shadow-lg overflow-hidden transition transform hover:scale-105"
        >
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" alt="Profil Agriculteur" className="w-full h-full object-cover" />
        </button>
      </div>
      
      <div className="relative h-[45%] min-h-[300px] bg-blue-100 flex-shrink-0 border-b-4 border-green-600 rounded-b-3xl shadow-md overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <polygon points="40,90 260,70 330,220 160,280 20,200" fill="rgba(34, 197, 94, 0.25)" stroke="#22c55e" strokeWidth="3" strokeDasharray="5 5" />
          <circle cx="40" cy="90" r="6" fill="white" stroke="#22c55e" strokeWidth="2" />
          <circle cx="260" cy="70" r="6" fill="white" stroke="#22c55e" strokeWidth="2" />
          <circle cx="330" cy="220" r="6" fill="white" stroke="#22c55e" strokeWidth="2" />
          <circle cx="160" cy="280" r="6" fill="white" stroke="#22c55e" strokeWidth="2" />
          <circle cx="20" cy="200" r="6" fill="white" stroke="#22c55e" strokeWidth="2" />
          <rect x="155" y="155" width="65" height="24" rx="12" fill="white" opacity="0.95"/>
          <text x="187" y="171" fontSize="11" fontWeight="bold" fill="#166534" textAnchor="middle">3.2 ha</text>
        </svg>

        <div className="absolute top-1/3 left-1/4 w-28 h-28 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-80"></div>
        <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-90 text-white flex justify-center items-center font-bold text-xs"><AlertTriangle className="animate-pulse"/></div>
        
        <div className="absolute right-3 bottom-6 flex flex-col space-y-2 z-10">
          <button className="bg-white/95 p-2.5 rounded-xl shadow-lg text-gray-700 hover:bg-gray-50"><Layers size={22}/></button>
          <div className="bg-white/95 rounded-xl shadow-lg flex flex-col overflow-hidden">
            <button className="p-2.5 border-b hover:bg-gray-50"><ZoomIn size={22} className="text-gray-700"/></button>
            <button className="p-2.5 hover:bg-gray-50"><ZoomOut size={22} className="text-gray-700"/></button>
          </div>
          <button className="bg-green-600 text-white p-2.5 rounded-xl shadow-lg mt-2 flex items-center justify-center hover:bg-green-700">
            <Edit3 size={22} />
          </button>
        </div>

        <div className="absolute bottom-6 left-3 z-10 bg-white/95 rounded-2xl shadow-xl p-3 border-2 border-green-500 flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-full">
            <Leaf className="text-green-600" size={24} />
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] text-gray-500 font-bold uppercase leading-none mb-1">Santé Parcelle</p>
            <p className="text-2xl font-black text-gray-800 leading-none">85%</p>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col space-y-5">
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
            <Leaf className="mr-2 text-green-600" size={18} /> État de mes cultures
          </h3>
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            <div className="min-w-[120px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-20 bg-[url('https://images.unsplash.com/photo-1601493700631-2b1619b013b8?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center"></div>
              <div className="p-2 text-center">
                <p className="font-bold text-gray-800 text-sm">Maïs</p>
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center justify-center">✅ En forme</span>
              </div>
            </div>
            <div className="min-w-[120px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-20 bg-[url('https://images.unsplash.com/photo-1587334274328-64186a80aeee?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center"></div>
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
            <img src="https://images.unsplash.com/photo-1599596638426-38290f96f014?auto=format&fit=crop&q=80&w=150" alt="Chenille" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
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
    </div>
  );
};

const WeatherScreen: React.FC = () => {
  const forecast = [
    { day: "Aujourd'hui", temp: "32°C", icon: <Sun className="text-orange-500" size={32}/>, action: "PULVÉRISATION OK", actionColor: "bg-green-100 text-green-700 border-green-500", desc: "Temps clair. Bon pour traiter les feuilles." },
    { day: "Demain", temp: "28°C", icon: <CloudRain className="text-blue-500" size={32}/>, action: "SEMIS CONSEILLÉ", actionColor: "bg-blue-100 text-blue-700 border-blue-500", desc: "Pluie attendue. Le sol sera parfait pour semer." },
    { day: "Mercredi", temp: "30°C", icon: <Wind className="text-gray-500" size={32}/>, action: "INTERDIT : TRAITEMENT", actionColor: "bg-red-100 text-red-700 border-red-500", desc: "Vents très forts. Les produits vont s'envoler.", badIcon: <Ban size={16} className="mr-1 inline"/> },
    { day: "Jeudi", temp: "34°C", icon: <ThermometerSun className="text-red-500" size={32}/>, action: "ATTENTION : CHALEUR", actionColor: "bg-orange-100 text-orange-700 border-orange-500", desc: "Ne pas travailler au champ à midi." },
    { day: "Vendredi", temp: "31°C", icon: <Cloud className="text-gray-400" size={32}/>, action: "RÉCOLTE POSSIBLE", actionColor: "bg-green-100 text-green-700 border-green-500", desc: "Temps nuageux et doux." },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
      <div className="bg-green-700 text-white p-4 pt-6 text-center font-bold text-lg shadow-md z-10 sticky top-0">
        Météo & Travaux (5 Jours)
      </div>
      <div className="p-3 space-y-3 pb-6">
        {forecast.map((item, index) => (
          <div key={index} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-gray-100 pr-3">
              {item.icon}
              <span className="font-bold text-gray-800 text-sm mt-1">{item.temp}</span>
              <span className="text-[10px] text-gray-400 font-medium">{item.day}</span>
            </div>
            <div className="flex-grow">
              <div className={`text-xs font-black uppercase px-2 py-1 rounded border ${item.actionColor} inline-flex items-center mb-1`}>
                {item.badIcon && item.badIcon}
                {item.action}
              </div>
              <p className="text-xs text-gray-600 leading-tight">{item.desc}</p>
            </div>
          </div>
        ))}
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

const AlertScreen: React.FC = () => (
  <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
    <div className="bg-red-600 text-white p-4 pt-6 text-center font-bold text-lg shadow-md flex items-center justify-center">
      <AlertTriangle className="mr-2" size={20} /> Détail de l'alerte
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-red-100 mb-4">
        <div className="bg-red-50 p-3 border-b border-red-100">
          <h3 className="text-red-700 font-black flex items-center text-sm">⚠️ ALERTE CRITIQUE (80%)</h3>
          <p className="text-gray-800 font-bold mt-1 text-lg">Risque Chenilles Légionnaires</p>
        </div>
        <div className="h-48 bg-gray-200 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599596638426-38290f96f014?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center"></div>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Analyse</h4>
            <p className="text-sm text-gray-700">L'humidité actuelle combinée aux fortes chaleurs récentes favorisent massivement l'éclosion des larves dans la parcelle Sud.</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <h4 className="text-xs font-bold text-yellow-800 uppercase mb-2">Actions recommandées :</h4>
            <ul className="text-sm text-gray-700 space-y-2 list-disc pl-4">
              <li>Inspecter le cœur des plants de maïs immédiatement.</li>
              <li>Appliquer le traitement préventif bio d'ici 24h.</li>
              <li>Installer des pièges à phéromones.</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-auto pt-4">
        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center transition-colors">
          <PhoneCall className="mr-3" size={24} /> APPELER LE TECHNICIEN
        </button>
        <p className="text-center text-xs text-gray-400 mt-2">Mise en relation directe avec la coopérative</p>
      </div>
    </div>
  </div>
);

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
