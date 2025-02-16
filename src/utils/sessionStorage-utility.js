// sessionStorageUtility.js

// Save a value to sessionStorage
export const saveToSessionStorage = (key, value) => {
    if (value instanceof Object) {
      // Serialize object to JSON string before saving
      sessionStorage.setItem(key, JSON.stringify(value));
    } else {
      // Save primitive value directly
      sessionStorage.setItem(key, value);
    }
  };
  
  // Retrieve a value from sessionStorage
  export const getFromSessionStorage = (key) => {
    const value = sessionStorage.getItem(key);
    
    if (value) {
      try {
        // Try parsing as JSON to handle objects
        return JSON.parse(value);
      } catch (error) {
        // If it's not JSON, return the raw string
        return value;
      }
    }
  
    return null;
  };
  
  // Remove a value from sessionStorage
  export const removeFromSessionStorage = (key) => {
    sessionStorage.removeItem(key);
  };
  
  // Clear all sessionStorage data
  export const clearSessionStorage = () => {
    sessionStorage.clear();
  };
  