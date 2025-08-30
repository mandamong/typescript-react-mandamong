import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useLocationChange = (callback: (location: Location) => void) => {
  const location = useLocation();

  useEffect(() => {
    callback(location as unknown as Location);
  }, [location, callback]);
};
