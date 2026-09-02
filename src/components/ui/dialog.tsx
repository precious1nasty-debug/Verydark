import type { ComponentProps } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  children,
  title,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & { title: string }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/70" />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-[min(100%-2rem,32rem)] max-h-[min(90vh,40rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[var(--radius-xl)] bg-card p-6 shadow-[var(--shadow-card)] hairline",
          className,
        )}
        {...props}
      >
        <DialogPrimitive.Title className="font-display text-xl font-semibold">
          {title}
        </DialogPrimitive.Title>
        <DialogPrimitive.Description className="sr-only">
          {title}
        </DialogPrimitive.Description>
        <DialogPrimitive.Close className="absolute top-4 right-4 grid size-11 place-items-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-accent">
          <X className="size-5" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
        <div className="mt-5">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
