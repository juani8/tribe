// src/context/UiContext.js

import React, { createContext, useState, useContext } from 'react';

// Create the context
const UiContext = createContext();

// Create a provider component
export const UiProvider = ({ children }) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [menuOptions, setMenuOptions] = useState([]);
  const [menuTitle, setMenuTitle] = useState('');

  // Function to show the menu with options
  const showMenu = (options = [], title) => {
    setMenuTitle(title);
    setMenuOptions(options);
    setMenuVisible(true);
  };

  // Function to hide the menu
  const hideMenu = () => {
    setMenuVisible(false);
  };

  return (
    <UiContext.Provider
      value={{
        isMenuVisible,
        showMenu,
        hideMenu,
        menuOptions,
        menuTitle
      }}
    >
      {children}
    </UiContext.Provider>
  );
};

// Custom hook to use the UiContext
export const useUiContext = () => useContext(UiContext);