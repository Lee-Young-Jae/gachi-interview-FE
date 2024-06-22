"use client";

import { useEffect, useRef, useState } from "react";

interface ModalProps {
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  disableBackdropClick?: boolean;
}

const Modal = ({ children, header, footer }: ModalProps) => {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const buttons = footerRef.current.querySelectorAll("button");
    if (buttons.length === 0) return;

    buttons[buttons.length - 1]?.focus();
  }, [footerRef]);
  return (
    <div className="flex flex-col z-50 w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg sm:max-w-[425px] animate-slideUp">
      {header && (
        <header className="text-lg font-semibold leading-none tracking-tight">{header}</header>
      )}
      <div className="">{children}</div>
      {footer && (
        <footer className="border-gray-200 flex justify-end gap-2" ref={footerRef}>
          {footer}
        </footer>
      )}
    </div>
  );
};

export default Modal;
