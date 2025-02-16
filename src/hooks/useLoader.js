import { useEffect } from 'react';
import {EVENTS} from '../const/common'

export function useLoader(setLoader) {
  useEffect(() => {
    const handleLoader = (event) => {
      setLoader(event.detail);
    };
    window.addEventListener(EVENTS.SET_LOADER, handleLoader); // Listen to loader EVENTS
    return () => {
      window.removeEventListener(EVENTS.SET_LOADER, handleLoader);
    };
  }, []);
}
