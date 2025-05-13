// src/contexts/CityFilterContext.tsx
'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { fetchCities, supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface CityFilterContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  availableCities: string[];
  loadingCities: boolean;
  cityError: string | null;
}

const CityFilterContext = createContext<CityFilterContextType | undefined>(undefined);

export function CityFilterProvider({ children }: { children: React.ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<string>("Pan India");
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState<boolean>(true);
  const [cityError, setCityError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadCities() {
      if (!supabase) {
        const errorMsg = "Supabase client not initialized. Cannot load city filter options.";
        console.warn(errorMsg);
        setCityError(errorMsg);
        setLoadingCities(false);
        // Toasting here might be too early for a global context, 
        // individual components can react to cityError if needed.
        return;
      }
      setLoadingCities(true);
      setCityError(null);
      const result = await fetchCities();
      if (result.error) {
        console.error("Failed to load cities for global filter:", result.error);
        setCityError(result.error);
        // Notify user about failure to load cities for the filter
        toast({
          title: "Error Loading City Filter",
          description: "Could not load city options for the filter. Please try refreshing. Defaulting to 'Pan India'.",
          variant: "destructive",
        });
      } else {
        setAvailableCities(result.cities);
      }
      setLoadingCities(false);
    }
    loadCities();
  }, [toast]);

  const contextValue = useMemo(() => ({
    selectedCity,
    setSelectedCity,
    availableCities,
    loadingCities,
    cityError
  }), [selectedCity, availableCities, loadingCities, cityError]);

  return (
    <CityFilterContext.Provider value={contextValue}>
      {children}
    </CityFilterContext.Provider>
  );
}

export function useCityFilter() {
  const context = useContext(CityFilterContext);
  if (context === undefined) {
    throw new Error('useCityFilter must be used within a CityFilterProvider');
  }
  return context;
}
