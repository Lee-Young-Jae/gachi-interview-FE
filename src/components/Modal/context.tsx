"use client";

import React, { ReactNode, createContext, useEffect } from "react";

export const ModalContext = createContext<{
  modal: React.ReactNode | null;
  setModal: (modal: React.ReactNode) => void;
  isAnimating: boolean;
  setIsAnimating: (isAnimating: boolean) => void;
}>({
  modal: null,
  setModal: () => {},
  isAnimating: false,
  setIsAnimating: () => {},
});

ModalContext.displayName = "ModalContext";

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = React.useState<React.ReactNode | null>(null);
  const [isAnimating, setIsAnimating] = React.useState<boolean>(false);

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modal]);

  return (
    <ModalContext.Provider value={{ modal, setModal, isAnimating, setIsAnimating }}>
      {children}
    </ModalContext.Provider>
  );
};
