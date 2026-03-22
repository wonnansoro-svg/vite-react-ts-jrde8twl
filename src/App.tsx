import React, { useState, useEffect } from 'react';

// --- 1. IMPORTS DES ICÔNES (Lucide) ---
import { 
  Home, CloudRain, MessageCircle, Bell, Volume2, 
  AlertTriangle, Send, Sun, Cloud, Bug, Leaf, 
  MapPin, ArrowLeft, Wind, CloudLightning, 
  XCircle, Loader2, Locate, Phone, Map,
  CreditCard, Check, CheckCircle, Crown, Star, Activity, HelpCircle,
  Droplets, Sprout, Radio, Smartphone,
  ShoppingCart, Plus, Minus, Trash2, X
} from 'lucide-react';

// --- 2. IMPORTS DE LA CARTE (Leaflet) ---
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { MapContainer, TileLayer, Polygon, useMap, FeatureGroup, ImageOverlay } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

// --- 3. IMPORTS FIREBASE ---
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- 4. DÉFINITION DES TYPES ---
type TabType = 'dashboard' | 'weather' | 'chat' | 'alert';

interface LocationState { lat: number; lon: number; city: string; }
interface DailyWeather {
  ttsText?: string; id: number; day: string; weatherImg: string;
  temp: string; wind: string; Icon: any; actionImg: string; actionType: string; rain?: string;
}

const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => { map.flyTo(center, 14, { animate: true, duration: 1.5 }); }, [center, map]);
  return null;
};

// --- 5. LOGIQUE MÉTÉO ---
const getWeatherVisuals = (code: number, rainSum: number = 0) => {
  if (code === 0 || code === 1) return { weatherImg: "https://img.freepik.com/photos-gratuite/beau-paysage-ciel-bleu_23-2151906820.jpg?w=740", Icon: Sun, actionImg: "https://img.freepik.com/photos-gratuite/recolte-du-riz-au-sri-lanka_23-2151940459.jpg?w=740", actionType: "harvest", ttsText: "Ciel dégagé et très ensoleillé. Suggestion : C'est le moment idéal pour récolter l'anacarde." };
  if (code === 2 || code === 3) return { weatherImg: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=400", Icon: Cloud, actionImg: "https://img.freepik.com/photos-gratuite/gros-plan-photo-main-tenant-plantation-graine-plante_1150-28369.jpg", actionType: "sowing", ttsText: "Ciel nuageux avec bonne humidité. Suggestion : Conditions parfaites pour semer le maïs." };
  if (code >= 50 && code <= 67 || rainSum > 0) return { weatherImg: "https://img.freepik.com/vecteurs-libre/parapluie-rouge-sous-pluie_1284-11413.jpg?w=740", Icon: CloudRain, actionImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiHyDydvnCDwg_HZHcnOlBqQrXb5TePETSAQ&s", actionType: "spray_no", ttsText: `Pluie prévue aujourd'hui. Suggestion : Ne faites aucune pulvérisation de pesticides.` };
  if (code >= 80) return { weatherImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIMzaqG-lwT8wszF3lRYHXvVgI7FWrkEG3ng&s", Icon: CloudLightning, actionImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiHyDydvnCDwg_HZHcnOlBqQrXb5TePETSAQ&s", actionType: "spray_no", ttsText: "Alerte orages violents. Restez à l'abri." };
  return { weatherImg: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=400", Icon: Cloud, actionImg: "https://img.freepik.com/photos-gratuite/gros-plan-photo-main-tenant-plantation-graine-plante_1150-28369.jpg", actionType: "sowing", ttsText: "Temps clément. Vous pouvez continuer l'observation de vos cultures." };
};

// --- 6. NAVIGATION ET PROFIL (AVEC ABONNEMENTS ET GPS) ---
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
    try {
      await setDoc(doc(db, "agriculteurs", "mon_profil_test"), { polygone: null, ndvi: null, humiditeSol: null });
      localStorage.removeItem('champ_agriculteur_poly');
      window.location.reload(); 
    } catch (e) { console.error(e); window.location.reload(); }
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
            {currentPlan === 'premium' && <span className="inline-flex items-center bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"><Crown size={12} className="mr-1" /> Membre Premium</span>}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center"><HelpCircle className="mr-2 text-green-600" size={20}/> Besoin d'assistance ?</h3>
          <div className="flex space-x-3">
            <a href={`tel:+${supportNumber}`} className="flex-1 bg-gray-800 text-white py-2.5 rounded-xl font-bold flex justify-center items-center text-sm"><Phone size={16} className="mr-2" /> Appeler</a>
            <a href={`https://wa.me/${supportNumber}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-500 text-white py-2.5 rounded-xl font-bold flex justify-center items-center text-sm"><MessageCircle size={16} className="mr-2" /> WhatsApp</a>
          </div>
        </div>

        <button onClick={effacerChamp} className="w-full bg-red-50 text-red-600 font-bold py-3 rounded-xl border border-red-200 hover:bg-red-100 transition-colors">
          Effacer mon champ du Cloud
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
              </ul>
              {currentPlan !== 'premium' && <button onClick={() => setCurrentPlan('premium')} className="mt-4 w-full py-2.5 rounded-xl font-bold text-white bg-yellow-500 hover:bg-yellow-600">Mettre à niveau</button>}
            </div>

            <div className={`relative p-5 rounded-2xl border-2 transition-all ${currentPlan === 'cooperative' ? 'border-green-600 bg-green-50 shadow-md' : 'border-gray-200 bg-white'}`}>
              {currentPlan === 'cooperative' && <div className="absolute -top-3 right-4 bg-green-600 text-green-900 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center"><Star size={12} className="mr-1"/> Actuel</div>}
              <h4 className="font-black text-gray-800 text-lg flex items-center">Coopérative <Star size={18} className="ml-2 text-green-500"/></h4>
              <p className="text-2xl font-black text-green-600 my-1">350 000 FCFA <span className="text-sm text-gray-500 font-medium">/ an</span></p>
              <ul className="text-xs text-gray-700 mt-2 space-y-1 font-medium">
                <li className="flex items-center"><Check size={14} className="text-green-600 mr-1"/> 300 utilisateurs inclus</li>
              </ul>
              {currentPlan !== 'cooperative' && <button onClick={() => setCurrentPlan('cooperative')} className="mt-4 w-full py-2.5 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600">S'abonner</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 7. ÉCRAN DES ALERTES ---
const AlertScreen: React.FC = () => {
  const [speakingId, setSpeakingId] = React.useState<number | null>(null);
  const [realData, setRealData] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchAlertData = async () => {
      try {
        const docRef = doc(db, "agriculteurs", "mon_profil_test");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().humiditeSol) {
          setRealData({ moisture: docSnap.data().humiditeSol });
        }
      } catch (error) { console.error(error); }
    };
    fetchAlertData();
  }, []);

  const lireAlerte = (text: string, id: number) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) { window.speechSynthesis.cancel(); setSpeakingId(null); return; }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR'; utterance.rate = 0.9;
      utterance.onstart = () => setSpeakingId(id); utterance.onend = () => setSpeakingId(null); utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const allAlerts = [
    {
      id: 1, type: "Feu Vert Semis", title: "Humidité Optimale", crop: "Toutes cultures",
      satellite: "Sentinel-1 (Radar)", urgency: "Action Idéale", icon: <Sprout size={24} className="text-green-600" />,
      color: "bg-green-50", borderColor: "border-green-500", textColor: "text-green-800", badge: "bg-green-600",
      description: "Le satellite indique que votre sol est parfaitement humide (>25%).", action: "Vous pouvez démarrer le semis aujourd'hui."
    },
    {
      id: 2, type: "Alerte Irrigation", title: "Stress Hydrique Sévère", crop: "Toutes cultures",
      satellite: "Sentinel-1 (NDMI)", urgency: "Avertissement", icon: <Droplets size={24} className="text-orange-500" />,
      color: "bg-orange-50", borderColor: "border-orange-400", textColor: "text-orange-800", badge: "bg-orange-500",
      description: "Le sol est très sec (humidité < 15%). La plante commence à souffrir.", action: "Irrigation d'urgence requise."
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
        <h2 className="text-2xl font-black flex items-center"><AlertTriangle className="mr-2" size={28} /> Centre d'Alertes</h2>
        <p className="text-red-100 text-sm mt-2 opacity-90">Connecté au Cloud (Firebase)</p>
      </div>
      <div className="p-4 space-y-4 mt-2">
        {!realData && <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-yellow-800 text-sm font-medium text-center">Veuillez dessiner un champ sur la carte (Accueil) pour que les satellites analysent votre parcelle.</div>}
        {realData && activeAlerts.length === 0 && <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-green-800 text-sm font-medium text-center">✅ Aucune alerte critique. L'humidité de votre sol est normale ({(realData.moisture * 100).toFixed(0)}%).</div>}
        {activeAlerts.map((alert) => (
          <div key={alert.id} className={`${alert.color} border-l-4 ${alert.borderColor} rounded-xl shadow-sm overflow-hidden relative`}>
            <div className={`absolute top-0 right-0 ${alert.badge} text-white text-[10px] font-black px-3 py-1 rounded-bl-lg uppercase tracking-wider`}>{alert.urgency}</div>
            <div className="p-4 pt-5">
              <div className="flex items-start mb-2"><div className="bg-white p-2 rounded-lg shadow-sm mr-3 shrink-0">{alert.icon}</div><div className="flex-grow pr-6"><h3 className={`font-black text-lg ${alert.textColor} leading-tight`}>{alert.title}</h3></div></div>
              <div className="bg-white/60 p-3 rounded-lg mt-3 mb-3"><p className="text-sm text-gray-700 font-medium">[Firebase : {(realData.moisture * 100).toFixed(0)}% d'humidité] {alert.description}</p></div>
              <div className="flex items-center justify-between mt-2">
                <p className={`text-sm font-bold ${alert.textColor} flex-grow pr-2 leading-tight`}>👉 Action : {alert.action}</p>
                <button onClick={() => lireAlerte(`${alert.title}. ${alert.description}. Action : ${alert.action}`, alert.id)} className="p-3 rounded-full shadow-sm shrink-0 bg-white text-gray-600 hover:bg-gray-50"><Volume2 size={20} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 8. ÉCRAN DASHBOARD (CARTE FIXE + PANIER AJUSTÉ) ---
const DashboardScreen: React.FC<{ location: any, setIsProfileOpen: (o: boolean) => void, setActiveTab: (t: string) => void }> = ({ location, setIsProfileOpen, setActiveTab }) => {
  const [selectedCrop, setSelectedCrop] = React.useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [ndviOverlay, setNdviOverlay] = React.useState<{ url: string, bounds: any } | null>(null);
  const [isLoadingNdvi, setIsLoadingNdvi] = React.useState(false);
  const [savedPolygon, setSavedPolygon] = React.useState<[number, number][] | null>(null);

  const [cart, setCart] = React.useState<{id: number, title: string, price: number, qty: number, img: string}[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState<string | null>(null);

  React.useEffect(() => {
    const chargerDonneesFirebase = async () => {
      try {
        const docRef = doc(db, "agriculteurs", "mon_profil_test");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.polygone) setSavedPolygon(data.polygone);
          if (data.ndvi) setNdviOverlay(data.ndvi);
        }
      } catch (error) { console.error("Erreur de chargement Firebase:", error); }
    };
    chargerDonneesFirebase();
  }, []);

  const cropData: any = {
    'Maïs': { ndvi: '0.42', status: 'Critique', color: 'text-red-600', bg: 'bg-red-100', text: "Attention ! L'indice de santé a baissé (chenilles légionnaires). Traitement urgent." },
    'Coton': { ndvi: '0.78', status: 'Bonne santé', color: 'text-green-600', bg: 'bg-green-100', text: "Croissance végétative normale. Pensez à vérifier l'humidité du sol." },
    'Anacarde': { ndvi: '0.85', status: 'Excellent', color: 'text-blue-600', bg: 'bg-blue-100', text: "L'indice NDVI est excellent. Préparez-vous sereinement pour la campagne." }
  };

  const products = [
    { id: 1, title: "Engrais NPK 15-15-15", oldPrice: 15000, price: 12500, img: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500", desc: "Sac de 50kg - Idéal pour le Maïs" },
    { id: 2, title: "Semences Maïs Hybride", oldPrice: 6000, price: 4500, img: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500", desc: "Sachet de 2kg - Haut rendement" },
    { id: 3, title: "Insecticide K-Othrine", oldPrice: 4000, price: 3500, img: "https://img.freepik.com/photos-gratuite/bouteille-pulverisateur-plastique-blanc-isole-fond-blanc_1232-3023.jpg", desc: "Anti-chenilles foudroyant (1L)" },
    { id: 4, title: "Pulvérisateur à Dos 16L", oldPrice: 22000, price: 18000, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiHyDydvnCDwg_HZHcnOlBqQrXb5TePETSAQ&s", desc: "Manuel, robuste et pratique" },
    { id: 5, title: "Bottes de Travail Pro", oldPrice: 7500, price: 5000, img: "https://images.unsplash.com/photo-1605810756781-b9978434a946?w=500", desc: "Protection contre les serpents (Taille 42)" }
  ];

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    else setCart([...cart, { ...product, qty: 1 }]);
  };

  const updateQty = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => setCart(cart.filter(item => item.id !== id));
  const totalCart = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const validerPaiement = () => {
    if (!paymentMethod) { alert("Veuillez choisir un moyen de paiement."); return; }
    alert(`✅ Commande confirmée ! Un SMS de validation ${paymentMethod} vous a été envoyé.`);
    setCart([]); setIsCheckoutOpen(false); setIsCartOpen(false);
  };

  const lireRecommandation = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR'; utterance.rate = 0.85; 
      utterance.onstart = () => setIsSpeaking(true); utterance.onend = () => setIsSpeaking(false); utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    // CORRECTION 1 : Suppression de la marge "pb-20" inutile qui créait le blanc en bas
    <div className="flex flex-col h-full bg-gray-50 relative">
      
      {/* BOUTON PANIER FLOTTANT */}
      {cart.length > 0 && (
        <button onClick={() => setIsCartOpen(true)} className="fixed bottom-20 right-4 z-40 bg-orange-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center animate-bounce">
          <ShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
            {cart.reduce((acc, item) => acc + item.qty, 0)}
          </span>
        </button>
      )}

      {/* ZONE 1 : LA CARTE SATELLITE (FIXE EN HAUT) */}
      <div className="relative h-[45%] min-h-[300px] flex-shrink-0 z-20">
        <div className="absolute top-0 w-full z-20 flex justify-between items-center p-4 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
          <div className="flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-auto shadow-md"><MapPin size={16} className="text-red-400 animate-bounce" /><span className="text-white font-bold text-xs">{location.city}</span></div>
          <button onClick={() => setIsProfileOpen(true)} className="w-10 h-10 bg-white rounded-full border-2 border-green-500 flex items-center justify-center overflow-hidden pointer-events-auto shadow-md"><img src="https://img.freepik.com/photos-premium/daily-farm-life-men-in-agriculture-and-their-connection-to-rural-traditions_914383-31331.jpg" alt="Profil" className="w-full h-full object-cover" /></button>
        </div>
        
        <div className="h-full w-full border-b-4 border-green-600 rounded-b-3xl shadow-md overflow-hidden bg-gray-200">
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
                  try {
                    const API_KEY = "5efa02f1edfc4a79ab94a5810d1eb0bf"; 
                    const polyResponse = await fetch(`https://api.agromonitoring.com/agro/1.0/polygons?appid=${API_KEY}`, {
                      method: 'POST', headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name: "Champ", geo_json: { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [geoJsonCoords] } } })
                    });
                    const polyData = await polyResponse.json();
                    const end = Math.floor(Date.now() / 1000);
                    const start = end - (30 * 24 * 60 * 60);
                    const imgResponse = await fetch(`https://api.agromonitoring.com/agro/1.0/image/search?start=${start}&end=${end}&polyid=${polyData.id}&appid=${API_KEY}`);
                    const imgData = await imgResponse.json();

                    let humidite = 0.22; 
                    try {
                      const soilResponse = await fetch(`https://api.agromonitoring.com/agro/1.0/soil?polyid=${polyData.id}&appid=${API_KEY}`);
                      const soilData = await soilResponse.json();
                      if(soilData.moisture) humidite = soilData.moisture;
                    } catch (e) { console.log("Erreur API humidité"); }

                    if (imgData && imgData.length > 0) {
                      const ndviData = { url: imgData[imgData.length - 1].image.ndvi, bounds: leafletBounds };
                      setNdviOverlay(ndviData); setSavedPolygon(displayPoly);
                      await setDoc(doc(db, "agriculteurs", "mon_profil_test"), { polygone: displayPoly, ndvi: ndviData, humiditeSol: humidite, dateMiseAJour: new Date().toISOString() });
                      alert("✅ Analyse terminée et sauvegardée dans le Cloud !");
                    } else { alert("Nuages détectés ☁️."); }
                  } catch (error: any) { alert(`❌ Erreur Satellite: ${error.message}`); } finally { setIsLoadingNdvi(false); }
                }}
                draw={{ rectangle: false, circle: false, circlemarker: false, marker: false, polyline: false, polygon: { allowIntersection: false, shapeOptions: { color: '#22c55e', fillOpacity: 0.1 } } }}
              />
            </FeatureGroup>
            {savedPolygon && <Polygon positions={savedPolygon} pathOptions={{ color: '#22c55e', fillOpacity: 0.1, weight: 2 }} />}
            {ndviOverlay && <ImageOverlay url={ndviOverlay.url} bounds={ndviOverlay.bounds} opacity={0.8} />}
          </MapContainer>
        </div>
      </div>

      {/* ZONE 2 : LE CONTENU DÉFILANT (SCROLL) */}
      <div className="flex-grow overflow-y-auto relative z-10 pb-6">
        
        <div className="px-4 mt-5">
          <button onClick={() => setActiveTab('alert')} className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded-lg shadow-sm">
            Voir les alertes Cloud
          </button>
        </div>

        <div className="p-4 pt-6">
          <h3 className="text-base font-bold text-gray-800 flex items-center mb-4"><Leaf className="mr-2 text-green-600" size={20} /> Mes Champs</h3>
          <div className="flex overflow-x-auto space-x-4 pb-2 -mx-4 px-4 scrollbar-hide">
            <div onClick={() => setSelectedCrop('Maïs')} className="cursor-pointer bg-white rounded-2xl shadow-sm min-w-[200px] flex-shrink-0 border border-gray-100 overflow-hidden"><div className="relative h-24"><img src="https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400" alt="Maïs" className="w-full h-full object-cover" /></div><div className="p-3"><h3 className="font-bold text-gray-800 text-sm">Parcelle 1 - Maïs</h3></div></div>
            <div onClick={() => setSelectedCrop('Coton')} className="cursor-pointer bg-white rounded-2xl shadow-sm min-w-[200px] flex-shrink-0 border border-gray-100 overflow-hidden"><div className="relative h-24"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhyLm-SLLOTWuL0KJasjrC-8Rq7hkfVt5RgQ&s" alt="Coton" className="w-full h-full object-cover" /></div><div className="p-3"><h3 className="font-bold text-gray-800 text-sm">Parcelle 2 - Coton</h3></div></div>
            <div onClick={() => setSelectedCrop('Anacarde')} className="cursor-pointer bg-white rounded-2xl shadow-sm min-w-[200px] flex-shrink-0 border border-gray-100 overflow-hidden"><div className="relative h-24"><img src="https://image.lecourrier.vn/uploaded/2015/12/31/1014493635601a.jpg" alt="Anacarde" className="w-full h-full object-cover" /></div><div className="p-3"><h3 className="font-bold text-gray-800 text-sm">Parcelle 3 - Anacarde</h3></div></div>
          </div>
        </div>
        
        <div className="p-4 pt-0">
          <h3 className="text-base font-bold text-gray-800 flex items-center mb-4"><ShoppingCart className="mr-2 text-orange-500" size={20} /> Boutique Agricole</h3>
          <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-hide">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 min-w-[220px] max-w-[220px] flex-shrink-0 overflow-hidden relative">
                <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase z-10">-{(100 - (product.price / product.oldPrice) * 100).toFixed(0)}%</div>
                <div className="h-28 relative"><img src={product.img} alt={product.title} className="w-full h-full object-cover" /></div>
                <div className="p-3">
                  <h4 className="text-gray-800 font-bold text-sm leading-tight">{product.title}</h4>
                  <p className="text-gray-500 text-[10px] mt-1 line-clamp-1">{product.desc}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="font-black text-orange-600 text-sm">{product.price.toLocaleString()} F</p>
                      <p className="text-[10px] text-gray-400 line-through">{product.oldPrice.toLocaleString()} F</p>
                    </div>
                    <button onClick={() => addToCart(product)} className="bg-orange-100 hover:bg-orange-500 hover:text-white text-orange-600 p-2 rounded-full transition-colors"><Plus size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> 

      {/* POPUP DÉTAILS CULTURES */}
      {selectedCrop && cropData[selectedCrop] && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-2 ${cropData[selectedCrop].bg}`}></div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-black text-gray-800">Détails : {selectedCrop}</h3>
              <button onClick={() => lireRecommandation(cropData[selectedCrop].text)} className={`p-3 rounded-full shadow-md transition-all ${isSpeaking ? 'bg-green-500 text-white animate-pulse' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}><Volume2 size={24} /></button>
            </div>
            <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="bg-white p-2 rounded-lg shadow-sm"><Activity className={cropData[selectedCrop].color} size={24} /></div>
              <div><p className="text-[10px] text-gray-500 font-bold uppercase">Indice NDVI (Santé)</p><p className={`text-lg font-black ${cropData[selectedCrop].color}`}>{cropData[selectedCrop].ndvi}</p></div>
            </div>
            <p className="text-gray-700 text-sm mb-6 leading-relaxed border-l-4 border-green-500 pl-3">{cropData[selectedCrop].text}</p>
            <button onClick={() => {setSelectedCrop(null); window.speechSynthesis.cancel(); setIsSpeaking(false);}} className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">Fermer</button>
          </div>
        </div>
      )}

      {/* MODAL PANIER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-gray-50 animate-in slide-in-from-bottom-full">
          <div className="bg-white p-4 shadow-sm flex items-center justify-between border-b">
            <h2 className="text-xl font-black text-gray-800 flex items-center"><ShoppingCart className="mr-2 text-orange-500"/> Mon Panier</h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><X size={24}/></button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">Votre panier est vide.</div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm flex items-center space-x-3">
                  <img src={item.img} alt={item.title} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-grow">
                    <h4 className="font-bold text-sm text-gray-800">{item.title}</h4>
                    <p className="text-orange-600 font-black text-sm">{item.price.toLocaleString()} F</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <button onClick={() => updateQty(item.id, -1)} className="p-1 bg-white rounded shadow-sm text-gray-600"><Minus size={14}/></button>
                    <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="p-1 bg-white rounded shadow-sm text-gray-600"><Plus size={14}/></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                </div>
              ))
            )}
          </div>

          {/* CORRECTION 2 : Ajout de la marge pb-24 ici pour remonter le contenu au-dessus du menu de navigation ! */}
          <div className="bg-white p-6 pb-24 border-t rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-bold">Total à payer</span>
              <span className="text-2xl font-black text-gray-800">{totalCart.toLocaleString()} FCFA</span>
            </div>
            <button disabled={cart.length === 0} onClick={() => setIsCheckoutOpen(true)} className={`w-full py-4 rounded-xl font-black text-white shadow-md ${cart.length === 0 ? 'bg-gray-300' : 'bg-orange-500 hover:bg-orange-600'}`}>
              Finaliser la commande
            </button>
          </div>
        </div>
      )}

      {/* MODAL PAIEMENT UEMOA */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 backdrop-blur-sm">
          {/* CORRECTION 3 : Ajout de la marge pb-24 ici aussi */}
          <div className="bg-white w-full max-h-[90%] rounded-t-3xl p-6 pb-24 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-gray-800">Paiement Sécurisé</h2>
              <button onClick={() => setIsCheckoutOpen(false)} className="p-2 text-gray-500 bg-gray-100 rounded-full"><X size={20}/></button>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">Sélectionnez votre moyen de paiement Mobile Money :</p>
            
            <div className="space-y-3 flex-grow overflow-y-auto">
              <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'Wave' ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}`}>
                <input type="radio" name="payment" value="Wave" className="hidden" onChange={(e) => setPaymentMethod(e.target.value)} />
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4"><span className="text-white font-black text-xs">WAVE</span></div>
                <span className="font-bold text-gray-800 flex-grow">Wave Côte d'Ivoire</span>
                {paymentMethod === 'Wave' && <CheckCircle size={20} className="text-blue-500" />}
              </label>

              <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'Orange' ? 'border-orange-500 bg-orange-50' : 'border-gray-100'}`}>
                <input type="radio" name="payment" value="Orange" className="hidden" onChange={(e) => setPaymentMethod(e.target.value)} />
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-4"><span className="text-white font-black text-[10px]">ORANGE</span></div>
                <span className="font-bold text-gray-800 flex-grow">Orange Money</span>
                {paymentMethod === 'Orange' && <CheckCircle size={20} className="text-orange-500" />}
              </label>

              <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'MTN' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-100'}`}>
                <input type="radio" name="payment" value="MTN" className="hidden" onChange={(e) => setPaymentMethod(e.target.value)} />
                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center mr-4"><span className="text-black font-black text-[10px]">MTN</span></div>
                <span className="font-bold text-gray-800 flex-grow">MTN MoMo</span>
                {paymentMethod === 'MTN' && <CheckCircle size={20} className="text-yellow-600" />}
              </label>

              <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'Moov' ? 'border-blue-800 bg-blue-50' : 'border-gray-100'}`}>
                <input type="radio" name="payment" value="Moov" className="hidden" onChange={(e) => setPaymentMethod(e.target.value)} />
                <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center mr-4"><span className="text-white font-black text-[10px]">MOOV</span></div>
                <span className="font-bold text-gray-800 flex-grow">Moov Money</span>
                {paymentMethod === 'Moov' && <CheckCircle size={20} className="text-blue-800" />}
              </label>
            </div>

            <button onClick={validerPaiement} className="w-full mt-4 py-4 rounded-xl font-black text-white bg-green-600 hover:bg-green-700 shadow-md">
              Payer {totalCart.toLocaleString()} FCFA
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

// --- 9. ÉCRAN MÉTÉO ---
const WeatherScreen: React.FC<{ location: LocationState, forecast: DailyWeather[], isLoading: boolean }> = ({ location, forecast, isLoading }) => {
  if (isLoading) return <div className="flex h-full items-center justify-center flex-col"><Loader2 className="animate-spin text-green-600 mb-4" size={48} /><p>Analyse météo de {location.city}...</p></div>;

  return (
    <div className="flex flex-col h-full bg-gray-100 overflow-y-auto pb-24">
      <div className="bg-white p-4 shadow-sm border-b flex items-center justify-between sticky top-0 z-20"><h1 className="text-xl font-black">Météo & Actions</h1><div className="flex items-center bg-green-50 px-3 py-1.5 rounded-full"><MapPin size={16} className="mr-1.5 text-green-600" /><span className="text-sm font-bold text-green-800">{location.city}</span></div></div>
      <div className="p-4 space-y-4">
        {forecast.map((day) => (
          <div key={day.id} className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col relative">
            <div className="bg-gray-800 text-white text-center py-1.5 font-bold text-sm uppercase flex justify-center items-center">{day.day} {day.rain && day.rain !== "0mm" && <span className="ml-2 text-blue-300 text-xs lowercase">({day.rain})</span>}</div>
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

// --- 10. ÉCRAN CHAT (LA VRAIE IA GEMINI DE RETOUR !) ---
const ChatScreen: React.FC = () => {
  const [messages, setMessages] = React.useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Bonjour ! Je suis SAIDA, votre assistant agricole. Comment puis-je vous aider avec vos cultures aujourd'hui ?" }
  ]);
  const [inputMessage, setInputMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [speakingIndex, setSpeakingIndex] = React.useState<number | null>(null);

  const lireMessage = (text: string, index: number) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingIndex === index) { window.speechSynthesis.cancel(); setSpeakingIndex(null); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR'; utterance.rate = 0.9;
    utterance.onstart = () => setSpeakingIndex(index); utterance.onend = () => setSpeakingIndex(null); utterance.onerror = () => setSpeakingIndex(null);
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
      // ⚠️ ASSUREZ-VOUS DE METTRE VOTRE CLÉ GEMINI ICI (NE PAS LAISSER 'VOTRE_CLE_GEMINI_ICI')
      const API_KEY = "VOTRE_CLE_GEMINI_ICI"; 
      const systemInstruction = "Tu es SAIDA, un assistant agricole expert travaillant en Côte d'Ivoire. Tu aides les agriculteurs avec des conseils simples et pratiques.";

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system_instruction: { parts: [{ text: systemInstruction }] }, contents: [{ role: "user", parts: [{ text: inputMessage }] }] })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      
      const aiResponse = data.candidates[0].content.parts[0].text;
      setMessages([...newMessages, { role: 'ai', text: aiResponse }] as {role: 'user' | 'ai', text: string}[]);
    } catch (error) {
      setMessages([...newMessages, { role: 'ai', text: "Désolé, je n'arrive pas à me connecter au serveur (vérifiez votre clé API)." }] as {role: 'user' | 'ai', text: string}[]);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      <div className="bg-green-600 p-4 text-white shadow-md z-10"><h2 className="text-xl font-black flex items-center"><MessageCircle className="mr-2" /> SAIDA IA</h2><p className="text-green-100 text-xs mt-1">Votre expert agricole personnel</p></div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm relative group ${msg.role === 'user' ? 'bg-green-500 text-white rounded-tr-sm' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              {msg.role === 'ai' && (
                <button onClick={() => lireMessage(msg.text, index)} className={`mt-2 p-1.5 rounded-full inline-flex items-center transition-colors ${speakingIndex === index ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-gray-50 text-gray-400'}`}><Volume2 size={16} /></button>
              )}
            </div>
          </div>
        ))}
        {isLoading && <div className="flex justify-start"><div className="bg-white p-3 rounded-2xl shadow-sm flex items-center space-x-2"><div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-75"></div></div></div>}
      </div>
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center bg-gray-100 rounded-full p-1 pl-4 shadow-inner">
          <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Posez votre question..." className="flex-grow bg-transparent outline-none text-sm text-gray-700" />
          <button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${inputMessage.trim() && !isLoading ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
};

// --- 11. APP PRINCIPALE (LE VRAI ÉCRAN DE DÉMARRAGE EST LÀ) ---
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
    } catch (error) { return "Localité inconnue"; }
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
          alert("GPS refusé. Boundiali utilisé par défaut.");
          const defaultLoc = { lat: 9.5217, lon: -6.4869, city: "Boundiali" };
          setFarmLocation(defaultLoc);
          localStorage.setItem('farmLocation', JSON.stringify(defaultLoc));
          setIsLocatingFarm(false);
        },
        { enableHighAccuracy: true }
      );
    } else { setIsLocatingFarm(false); }
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
          const dayName = index === 0 ? "Aujourd'hui" : index === 1 ? "Demain" : new Date(date).toLocaleDateString('fr-FR', { weekday: 'long' });
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
        {isProfileOpen && <div className="absolute inset-0 z-50 bg-white"><AccountScreen setIsProfileOpen={setIsProfileOpen} onUpdateLocation={defineFarmLocation} /></div>}
        <div className={`absolute inset-0 transition-opacity duration-200 bg-white ${activeTab === 'dashboard' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}><DashboardScreen location={farmLocation} setIsProfileOpen={setIsProfileOpen} setActiveTab={setActiveTab} /></div>
        <div className={`absolute inset-0 transition-opacity duration-200 bg-white ${activeTab === 'weather' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}><WeatherScreen location={farmLocation} forecast={weatherForecast} isLoading={isWeatherLoading} /></div>
        <div className={`absolute inset-0 transition-opacity duration-200 bg-white ${activeTab === 'chat' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}><ChatScreen /></div>
        <div className={`absolute inset-0 transition-opacity duration-200 bg-white ${activeTab === 'alert' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}><AlertScreen /></div>
      </div>
      {!isProfileOpen && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} setIsProfileOpen={setIsProfileOpen} />}
    </div>
  );
}