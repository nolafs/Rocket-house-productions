'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { OnBoardingInitialValuesType, OnBoardingType, onBoardingInitialValuesSchema } from './schemas';

const defaultOnBoarding: OnBoardingInitialValuesType = {
  firstName: '',
  lastName: '',
  email: '',
  confirmTerms: false,
  parentConsent: false,
  newsletter: false,
  notify: false,
  birthday: '',
  name: '',
  avatar: '',
  favoriteColor: undefined,
  favoriteAnimal: undefined,
  favoriteSuperpower: undefined,
  favoriteHobby: undefined,
  gender: undefined,
};

const LOCAL_STORAGE_KEY = 'kids-guitar-dojo-onboarding';

type OnBoardingContextType = {
  onBoardingData: OnBoardingInitialValuesType;
  updateOnBoardingDetails: (dealDetails: Partial<OnBoardingType>) => void;
  dataLoaded: boolean;
  resetLocalStorage: () => void;
};

export const OnBoardingContext = createContext<OnBoardingContextType | null>(null);

export const OnBoardingContextProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize from localStorage on first mount
  const [onBoardingData, setOnBoardingData] = useState<OnBoardingInitialValuesType>(() => {
    if (typeof window === 'undefined') return defaultOnBoarding;

    const loadedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!loadedDataString) return defaultOnBoarding;

    const validated = onBoardingInitialValuesSchema.safeParse(JSON.parse(loadedDataString));
    return validated.success ? validated.data : defaultOnBoarding;
  });

  // Start as true since we lazy-initialize from localStorage above
  const dataLoaded = true;

  // Save to localStorage whenever data changes (after initial load)
  const saveDataToLocalStorage = useCallback((currentDealData: OnBoardingInitialValuesType) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentDealData));
    }
  }, []);

  const resetLocalStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setOnBoardingData(defaultOnBoarding);
  }, []);

  const updateOnBoardingDetails = useCallback((onBoardingDetails: Partial<OnBoardingType>) => {
    setOnBoardingData(prev => ({ ...prev, ...onBoardingDetails }));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    saveDataToLocalStorage(onBoardingData);
  }, [onBoardingData, saveDataToLocalStorage]);

  const contextValue = useMemo(
    () => ({
      onBoardingData,
      dataLoaded,
      updateOnBoardingDetails,
      resetLocalStorage,
    }),
    [onBoardingData, dataLoaded, updateOnBoardingDetails, resetLocalStorage],
  );

  return <OnBoardingContext.Provider value={contextValue}>{children}</OnBoardingContext.Provider>;
};

export function useOnBoardingContext() {
  const context = useContext(OnBoardingContext);
  if (context === null) {
    throw new Error('useOnBoardingContext must be used within a OnBoardingProvider');
  }
  return context;
}
