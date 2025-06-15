"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModalInstance } from "@/hooks/use-dialog-instance";

// Tipo para os dados do modal de informação
interface InfoData {
  title: string;
  message: string;
  confirmText?: string;
}

interface InfoDialogProps {
  modalKey: string;
}

export function InfoDialog({ modalKey }: InfoDialogProps) {
  const { isOpen, data, close } = useModalInstance<InfoData>(modalKey);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={close}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{data?.title || "Informação"}</DialogTitle>
          <DialogDescription>{data?.message}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={close}>{data?.confirmText || "OK"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
