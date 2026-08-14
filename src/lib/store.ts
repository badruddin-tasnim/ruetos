import { create } from 'zustand';

export type AppId = 'ai-exam-prep' | 'mind-map' | 'study-buddy' | 'class-routine' | 'notices';

export interface AppWindow {
  id: string;
  appId: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

interface OSState {
  isLoggedIn: boolean;
  studentName: string;
  studentRoll: string;
  windows: AppWindow[];
  activeAppId: AppId | null;
  login: (roll: string, reg: string) => Promise<boolean>;
  logout: () => void;
  openWindow: (appId: AppId, title: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
}

const INITIAL_WINDOWS: AppWindow[] = [
  { id: 'ai-exam-prep-1', appId: 'ai-exam-prep', title: 'AI Exam Prep', isOpen: false, isMinimized: false, zIndex: 1 },
  { id: 'mind-map-1', appId: 'mind-map', title: 'Course Mind Map', isOpen: false, isMinimized: false, zIndex: 1 },
  { id: 'study-buddy-1', appId: 'study-buddy', title: 'Study Buddy', isOpen: false, isMinimized: false, zIndex: 1 },
  { id: 'class-routine-1', appId: 'class-routine', title: 'Class Routine', isOpen: false, isMinimized: false, zIndex: 1 },
  { id: 'notices-1', appId: 'notices', title: 'Notices', isOpen: false, isMinimized: false, zIndex: 1 },
];

export const useOSStore = create<OSState>((set, get) => ({
  isLoggedIn: false,
  studentName: 'Tasnim',
  studentRoll: '1903001',
  windows: INITIAL_WINDOWS,
  activeAppId: null,

  login: async (roll: string, reg: string) => {
    // Mock login
    return new Promise((resolve) => {
      setTimeout(() => {
        set({ isLoggedIn: true, studentRoll: roll });
        resolve(true);
      }, 800);
    });
  },

  logout: () => {
    set({ isLoggedIn: false, windows: INITIAL_WINDOWS, activeAppId: null });
  },

  openWindow: (appId, title) => {
    set((state) => {
      const existingWindow = state.windows.find(w => w.appId === appId);
      const maxZ = Math.max(0, ...state.windows.map(w => w.zIndex));
      
      if (existingWindow) {
        return {
          windows: state.windows.map(w => 
            w.appId === appId 
              ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 }
              : w
          ),
          activeAppId: appId,
        };
      }

      return {
        windows: [...state.windows, {
          id: `${appId}-${Date.now()}`,
          appId,
          title,
          isOpen: true,
          isMinimized: false,
          zIndex: maxZ + 1
        }],
        activeAppId: appId,
      };
    });
  },

  closeWindow: (id) => {
    set((state) => {
      const newWindows = state.windows.map(w => w.id === id ? { ...w, isOpen: false } : w);
      const remainingOpen = newWindows.filter(w => w.isOpen && !w.isMinimized).sort((a, b) => b.zIndex - a.zIndex);
      return {
        windows: newWindows,
        activeAppId: remainingOpen.length > 0 ? remainingOpen[0].appId : null,
      };
    });
  },

  minimizeWindow: (id) => {
    set((state) => {
      const newWindows = state.windows.map(w => w.id === id ? { ...w, isMinimized: true } : w);
      const remainingOpen = newWindows.filter(w => w.isOpen && !w.isMinimized).sort((a, b) => b.zIndex - a.zIndex);
      return {
        windows: newWindows,
        activeAppId: remainingOpen.length > 0 ? remainingOpen[0].appId : null,
      };
    });
  },

  restoreWindow: (id) => {
    set((state) => {
      const maxZ = Math.max(0, ...state.windows.map(w => w.zIndex));
      const targetWindow = state.windows.find(w => w.id === id);
      return {
        windows: state.windows.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: maxZ + 1 } : w),
        activeAppId: targetWindow?.appId || state.activeAppId,
      };
    });
  },

  focusWindow: (id) => {
    set((state) => {
      const targetWindow = state.windows.find(w => w.id === id);
      if (!targetWindow || !targetWindow.isOpen || targetWindow.isMinimized) return state;
      
      const maxZ = Math.max(0, ...state.windows.map(w => w.zIndex));
      if (targetWindow.zIndex === maxZ) return state; // Already focused

      return {
        windows: state.windows.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w),
        activeAppId: targetWindow.appId,
      };
    });
  },
}));
