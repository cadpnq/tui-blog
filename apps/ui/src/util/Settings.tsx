import { createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';

export interface Settings {
  blinkLights: boolean;
  distortScreen: boolean;
  bloomEffect: boolean;
}

interface SettingsContextType {
  settings: Settings;
  setSetting: (key: keyof Settings, value: any) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: preact.ComponentChildren;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<Settings>({
    blinkLights: true,
    distortScreen: true,
    bloomEffect: true,
  });

  const setSetting = (key: keyof Settings, value: any) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  const value = {
    settings,
    setSetting,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
