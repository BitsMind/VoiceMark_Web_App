"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { MyFormData } from "@/types/table";

interface UseDeleteDialogProps {
  onConfirmSingle?: (id: string) => void | Promise<void>;
  onConfirmMulti?: (records: MyFormData[]) => void | Promise<void>;
}

export function useDeleteDialog({ onConfirmSingle, onConfirmMulti }: UseDeleteDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [target, setTarget] = React.useState<{ type: "single" | "multi"; data: any } | null>(null);

  const showSingle = (id: string) => {
    setTarget({ type: "single", data: id });
    setOpen(true);
  };

  const showMulti = (records: MyFormData[]) => {
    setTarget({ type: "multi", data: records });
    setOpen(true);
  };

  const handleConfirm = async () => {
    if (!target) return;
    if (target.type === "single" && onConfirmSingle) {
      await onConfirmSingle(target.data);
    } else if (target.type === "multi" && onConfirmMulti) {
      await onConfirmMulti(target.data);
    }
    setOpen(false);
  };

  const Dialog = (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {target?.type === "multi"
              ? "Delete selected files?"
              : "Delete this file?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Your file(s) will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    showSingle,
    showMulti,
    Dialog,
  };
}
