// frontend/src/components/Dialog.tsx
import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogTitleProps {
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ 
  children, 
  open, 
  onOpenChange 
}) => {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixDialog.Root>
  );
};

export const DialogTrigger: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return <RadixDialog.Trigger asChild>{children}</RadixDialog.Trigger>;
};

export const DialogContent: React.FC<DialogContentProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <RadixDialog.Content 
        className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg ${className}`}
      >
        {children}
        <RadixDialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <Cross2Icon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </RadixDialog.Close>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
};

export const DialogHeader: React.FC<DialogHeaderProps> = ({ 
  children 
}) => {
  return (
    <div className="flex flex-col space-y-1.5 text-center sm:text-left">
      {children}
    </div>
  );
};

export const DialogTitle: React.FC<DialogTitleProps> = ({ 
  children 
}) => {
  return (
    <RadixDialog.Title className="text-lg font-semibold leading-none tracking-tight">
      {children}
    </RadixDialog.Title>
  );
};