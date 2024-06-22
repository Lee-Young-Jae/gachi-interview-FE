"use client";

import Modal from "../Modal";
import Backdrop from "../Backdrop";
import { createPortal } from "react-dom";
import React, { useContext, ReactNode } from "react";
import { ModalContext } from "./context";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const useModal = () => {
  const { modal, setModal, isAnimating, setIsAnimating } = useContext(ModalContext);
  const router = useRouter();

  const openModal = (modal: ReactNode) => {
    setModal(modal);
  };

  const closeModal = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setModal(null);
      setIsAnimating(false);
    }, 300);
  };

  const closeModalAndBack = () => {
    router.back();
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setModal(null);
      setIsAnimating(false);
    }, 300);
  };

  const openDialog = (message: string) => {
    openModal(
      <Modal footer={<Button onClick={closeModal}>확인</Button>} disableBackdropClick={false}>
        {message}
      </Modal>,
    );
  };

  const openDialogWithBack = (message: string) => {
    openModal(
      <Modal footer={<Button onClick={closeModalAndBack}>확인</Button>} disableBackdropClick={true}>
        {message}
      </Modal>,
    );
  };

  const closeDialog = () => {
    setModal(null);
  };

  return { openModal, closeModal, modal, openDialog, closeDialog, openDialogWithBack, isAnimating };
};

export const useErrorModal = () => {
  const { openModal, closeModal } = useModal();
  const openErrorModal = (message: string) => {
    openModal(
      <Modal
        header="😭"
        footer={<Button onClick={closeModal}>확인</Button>}
        disableBackdropClick={false}
      >
        {message}
      </Modal>,
    );
  };

  return openErrorModal;
};

export const ModalContainer = () => {
  const { modal, closeModal, isAnimating } = useModal();

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (React.isValidElement(modal) && modal.props.disableBackdropClick) return;
    closeModal();
  };

  return modal
    ? createPortal(
        <Backdrop onClick={onBackdropClick} isAnimating={isAnimating}>
          {modal}
        </Backdrop>,
        document.getElementById("modal-root") as Element,
      )
    : null;
};
