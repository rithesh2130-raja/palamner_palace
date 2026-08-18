import React, { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    city: 'Palamner',
    pincode: '517408',
    state: 'Andhra Pradesh'
  });

  const updateLocation = (city, pincode, state = 'Andhra Pradesh') => {
    setLocation({ city, pincode, state });
  };

  return (
    <LocationContext.Provider value={{ location, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};
