import type { ComponentProps } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: ComponentProps<typeof Dialog.Content> & { side?: "left" | "right" }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-background/70" />
      <Dialog.Content
        className={cn(
          "fixed z-50 flex h-full w-[min(100%,20rem)] flex-col bg-card p-6 shadow-[var(--shadow-card)]",
          side === "right" ? "inset-y-0 right-0" : "inset-y-0 left-0",
          className,
        )}
        {...props}
      >
        <Dialog.Title className="font-display text-lg">Menu</Dialog.Title>
        <Dialog.Description className="sr-only">Site navigation</Dialog.Description>
        {children}
        <Dialog.Close className="absolute top-4 right-4 grid size-11 place-items-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-accent">
          <X className="size-5" />
          <span className="sr-only">Close</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
