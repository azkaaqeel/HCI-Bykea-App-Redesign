"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button, buttonVariants } from "./button";
import { cn } from "./utils";

// AlertDialog is just a wrapper around Dialog with a different styling approach
function AlertDialog({
  ...props
}: React.ComponentProps<typeof Dialog>) {
  return <Dialog {...props} />;
}

// AlertDialogTrigger - not needed for controlled dialogs, but kept for compatibility
const AlertDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ ...props }, ref) => <button ref={ref} {...props} />);
AlertDialogTrigger.displayName = "AlertDialogTrigger";

// AlertDialogContent wraps DialogContent but removes the close button
function AlertDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogContent>) {
  return (
    <>
      <style>{`
        [data-slot="dialog-close"] {
          display: none !important;
        }
      `}</style>
      <DialogContent
        className={cn("gap-4", className)}
        {...props}
      >
        {children}
      </DialogContent>
    </>
  );
}

// Re-export from Dialog
const AlertDialogHeader = DialogHeader;
const AlertDialogFooter = DialogFooter;
const AlertDialogTitle = DialogTitle;
const AlertDialogDescription = DialogDescription;

// AlertDialogAction - primary action button
const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      className={cn(buttonVariants({ variant: 'default' }), className)}
      onClick={onClick}
      {...props}
    />
  );
});
AlertDialogAction.displayName = "AlertDialogAction";

// AlertDialogCancel - cancel button
const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="outline"
      className={cn(buttonVariants({ variant: "outline" }), className)}
      onClick={onClick}
      {...props}
    />
  );
});
AlertDialogCancel.displayName = "AlertDialogCancel";

// Dummy exports for compatibility
const AlertDialogPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const AlertDialogOverlay = () => null;

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
