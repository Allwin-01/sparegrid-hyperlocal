"use client";

import { Toast, Toaster, createToaster } from "@ark-ui/react/toast";
import { Portal } from "@ark-ui/react/portal";
import { X } from "lucide-react";

export const toaster = createToaster({
  placement: "bottom-end",
  gap: 16,
  overlap: true,
});

export default function ToastBasic() {
  return (
    <Portal>
      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 min-w-80 p-4 relative overflow-anywhere transition-all duration-300 ease-default will-change-transform h-(--height) opacity-(--opacity) translate-x-(--x) translate-y-(--y) scale-(--scale) z-(--z-index)">
            <Toast.Title className="text-gray-900 dark:text-white font-semibold text-sm">
              {toast.title}
            </Toast.Title>
            <Toast.Description className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              {toast.description}
            </Toast.Description>
            <Toast.CloseTrigger className="absolute top-3 right-3 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X className="w-3 h-3" />
            </Toast.CloseTrigger>
          </Toast.Root>
        )}
      </Toaster>
    </Portal>
  );
}
