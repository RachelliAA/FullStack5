// src/context/UserContext.js
import { createContext, useContext } from "react";

// Create UserContext
export const UserContext = createContext(null);

// Custom hook to consume UserContext easily
export const useUser = () => useContext(UserContext);
