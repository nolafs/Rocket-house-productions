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
  const [onBoardingData, setOnBoardingData] = useState<OnBoardingInitialValuesType>(defaultOnBoarding);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    readFromLocalStorage();
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (dataLoaded) {
      saveDataToLocalStorage(onBoardingData);
    }
  }, [onBoardingData, dataLoaded]);

  // Fixed: Use functional update and removed dependency
  const updateOnBoardingDetails = useCallback((onBoardingDetails: Partial<OnBoardingType>) => {
    setOnBoardingData(prev => ({ ...prev, ...onBoardingDetails }));
  }, []);

  const saveDataToLocalStorage = (currentDealData: OnBoardingInitialValuesType) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentDealData));
    }
  };

  const readFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const loadedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!loadedDataString) return setOnBoardingData(defaultOnBoarding);
      const validated = onBoardingInitialValuesSchema.safeParse(JSON.parse(loadedDataString));

      if (validated.success) {
        setOnBoardingData(validated.data);
      } else {
        setOnBoardingData(defaultOnBoarding);
      }
    } else {
      setOnBoardingData(defaultOnBoarding);
    }
  };

  // Fixed: Added window check before accessing localStorage
  const resetLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setOnBoardingData(defaultOnBoarding);
  };

  const contextValue = useMemo(
    () => ({
      onBoardingData,
      dataLoaded,
      updateOnBoardingDetails,
      resetLocalStorage,
    }),
    [onBoardingData, dataLoaded, updateOnBoardingDetails],
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
