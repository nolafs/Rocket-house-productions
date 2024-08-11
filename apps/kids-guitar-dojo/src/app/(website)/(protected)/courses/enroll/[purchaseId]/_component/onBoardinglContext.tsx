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
  childEmail: '',
  avatar: '',
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
    readFromLocalStorage();
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      saveDataToLocalStorage(onBoardingData);
    }
  }, [onBoardingData, dataLoaded]);

  const updateOnBoardingDetails = useCallback(
    (dealDetails: Partial<OnBoardingType>) => {
      setOnBoardingData({ ...setOnBoardingData, ...dealDetails });
    },
    [onBoardingData],
  );

  const saveDataToLocalStorage = (currentDealData: OnBoardingInitialValuesType) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentDealData));
  };

  const readFromLocalStorage = () => {
    const loadedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!loadedDataString) return setOnBoardingData(defaultOnBoarding);
    const validated = onBoardingInitialValuesSchema.safeParse(JSON.parse(loadedDataString));

    if (validated.success) {
      setOnBoardingData(validated.data);
    } else {
      setOnBoardingData(defaultOnBoarding);
    }
  };

  const resetLocalStorage = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
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
