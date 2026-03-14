// src/types.ts

export type TabType = 'dashboard' | 'weather' | 'chat' | 'alert';

export interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  setIsProfileOpen: (isOpen: boolean) => void;
}

export interface AccountScreenProps {
  setIsProfileOpen: (isOpen: boolean) => void;
}

export interface DashboardScreenProps {
  isProfileOpen: boolean;
  setIsProfileOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: TabType) => void;
}
