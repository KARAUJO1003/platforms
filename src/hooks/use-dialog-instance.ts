"use client";

import { useModal } from "@/providers/modal-provider";

// Hook personalizado para facilitar o uso de um modal específico
export function useModalInstance<T = any>(modalKey: string) {
  const { openModal, closeModal, updateModalData, isModalOpen, getModalData } =
    useModal();

  return {
    isOpen: isModalOpen(modalKey),
    data: getModalData<T>(modalKey),
    open: (data?: T) => openModal<T>(modalKey, data),
    close: () => closeModal(modalKey),
    updateData: (data: T) => updateModalData<T>(modalKey, data),
  };
}
