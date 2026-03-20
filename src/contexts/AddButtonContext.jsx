// AddButtonContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AddButtonContext = createContext(null);

export function AddButtonProvider({ children }) {
  const [action, setAction] = useState(null);
  return (
    <AddButtonContext.Provider value={{ action, setAction }}>
      {children}
    </AddButtonContext.Provider>
  );
}

export function useAddButton() {
  return useContext(AddButtonContext);
}
