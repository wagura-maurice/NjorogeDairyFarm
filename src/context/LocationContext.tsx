// src/context/LocationContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the shape of the location data
type LocationState = {
  city: string;
  road: string;
  street: string;
  building: string;
  houseNumber: string;
};

// Define the shape of the context
interface LocationContextProps {
  location: LocationState;
  saveLocation: (newLocation: LocationState) => Promise<void>;
  setLocation: React.Dispatch<React.SetStateAction<LocationState>>; // Add this line
}

// Create the context with a default value
export const LocationContext = createContext<LocationContextProps>({
  location: {
    city: "",
    road: "",
    street: "",
    building: "",
    houseNumber: "",
  },
  saveLocation: async (newLocation: LocationState) => {},
  setLocation: () => {}, // Add this line to provide a stub for setLocation
});

type LocationProviderProps = {
  children: ReactNode;
};

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [location, setLocation] = useState<LocationState>({
    city: "",
    road: "",
    street: "",
    building: "",
    houseNumber: "",
  });

  useEffect(() => {
    // Load saved location details when the app starts
    const loadLocation = async () => {
      const savedLocation = await AsyncStorage.getItem("locationDetails");
      if (savedLocation) {
        setLocation(JSON.parse(savedLocation));
      }
    };

    loadLocation();
  }, []);

  const saveLocation = async (newLocation: LocationState) => {
    try {
      const jsonValue = JSON.stringify(newLocation);
      await AsyncStorage.setItem("locationDetails", jsonValue);
      setLocation(newLocation);
    } catch (e) {
      // saving error
      console.error("Error saving location data", e);
    }
  };

  return (
    <LocationContext.Provider value={{ location, saveLocation, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
