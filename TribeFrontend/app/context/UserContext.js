import React, { createContext, useEffect, useState, useContext } from 'react';
import axios from "axios";
import { checkToken } from 'helper/JWTHelper';

const UserContext = createContext();

/**
 * Proveedor de contexto para el contexto `UserContext`.
 *
 * @param {React.ReactNode} props.children Componentes hijos que se renderizarán dentro del contexto.
 * @returns {JSX.Element} Elemento JSX que define el proveedor del contexto y renderiza los componentes hijos.
 */
export const UserProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null)

  return (
    <UserContext.Provider
      value={{
        user,
        isLogged,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);