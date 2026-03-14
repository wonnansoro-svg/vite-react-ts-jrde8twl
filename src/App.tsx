// ==========================================
// DÉFINITION DES MODÈLES DE DONNÉES (TYPES)
// ==========================================

export type TabType = 'dashboard' | 'weather' | 'chat' | 'alert';

export interface WeatherForecast {
  day: string;
  temp: string;
  condition: 'sunny' | 'rainy' | 'windy' | 'hot' | 'cloudy'; // Utilisé pour afficher la bonne icône
  action: string;
  actionColor: string;
  desc: string;
  isBadCondition?: boolean;
}

export interface Parcel {
  id: string;
  name: string;
  crop: string;
  area: number; // Superficie en hectares
  healthScore: number; // Pourcentage de santé (0-100)
  coordinates: string; // Points SVG pour dessiner la parcelle sur la carte
  status: 'excellent' | 'warning' | 'critical';
}

export interface CropStatus {
  id: string;
  name: string;
  imageUrl: string;
  status: 'ok' | 'warning' | 'danger';
  statusMessage: string;
}

export interface AlertData {
  id: string;
  title: string;
  severity: number; // Niveau d'urgence (0-100)
  description: string;
  recommendations: string[];
  imageUrl: string;
  affectedParcelId: string;
}

// ==========================================
// DONNÉES DE SIMULATION (MOCK DATA)
// Ces données simulent ce que renverrait le backend
// ==========================================

export const MOCK_WEATHER: WeatherForecast[] = [
  { day: "Aujourd'hui", temp: "32°C", condition: 'sunny', action: "PULVÉRISATION OK", actionColor: "bg-green-100 text-green-700 border-green-500", desc: "Temps clair. Bon pour traiter les feuilles." },
  { day: "Demain", temp: "28°C", condition: 'rainy', action: "SEMIS CONSEILLÉ", actionColor: "bg-blue-100 text-blue-700 border-blue-500", desc: "Pluie attendue. Le sol sera parfait pour semer." },
  { day: "Mercredi", temp: "30°C", condition: 'windy', action: "INTERDIT : TRAITEMENT", actionColor: "bg-red-100 text-red-700 border-red-500", desc: "Vents très forts. Les produits vont s'envoler.", isBadCondition: true },
  { day: "Jeudi", temp: "34°C", condition: 'hot', action: "ATTENTION : CHALEUR", actionColor: "bg-orange-100 text-orange-700 border-orange-500", desc: "Ne pas travailler au champ à midi." },
  { day: "Vendredi", temp: "31°C", condition: 'cloudy', action: "RÉCOLTE POSSIBLE", actionColor: "bg-green-100 text-green-700 border-green-500", desc: "Temps nuageux et doux." },
];

export const MOCK_PARCELS: Parcel[] = [
  {
    id: 'p1',
    name: 'Parcelle Maïs Sud',
    crop: 'Maïs',
    area: 3.2,
    healthScore: 85,
    coordinates: '40,90 260,70 330,220 160,280 20,200',
    status: 'warning'
  }
];

// NOUVEAUX LIENS D'IMAGES PLUS STABLES (Maïs, Anacarde)
export const MOCK_CROPS: CropStatus[] = [
  {
    id: 'c1',
    name: 'Maïs',
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=400',
    status: 'ok',
    statusMessage: '✅ En forme'
  },
  {
    id: 'c2',
    name: 'Anacarde',
    imageUrl: 'https://images.unsplash.com/photo-1623055421588-66236b283b9e?auto=format&fit=crop&q=80&w=400',
    status: 'warning',
    statusMessage: '⚠️ À surveiller'
  }
];

// NOUVEAU LIEN D'IMAGE POUR L'ALERTE (Feuille malade / Insecte)
export const MOCK_ALERTS: AlertData[] = [
  {
    id: 'a1',
    title: 'Attaque de Chenilles',
    severity: 80,
    description: "L'humidité actuelle combinée aux fortes chaleurs récentes favorisent massivement l'éclosion des larves dans la parcelle Sud.",
    recommendations: [
      'Inspecter le cœur des plants de maïs immédiatement.',
      'Appliquer le traitement préventif bio d\'ici 24h.',
      'Installer des pièges à phéromones.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518568740560-3331ee0e18df?auto=format&fit=crop&q=80&w=600',
    affectedParcelId: 'p1'
  }
];
