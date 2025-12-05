/**
 * Toast Notification Utilities
 *
 * Wrapper functions around Sonner for consistent toast notifications
 * throughout the application.
 */

import { toast as sonnerToast } from 'sonner';

/**
 * Toast configuration options
 */
interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Show a success toast notification
 */
export function toast(message: string, options?: ToastOptions) {
  return sonnerToast(message, {
    description: options?.description,
    duration: options?.duration,
    action: options?.action,
  });
}

/**
 * Show a success toast notification
 */
export function toastSuccess(message: string, options?: ToastOptions) {
  return sonnerToast.success(message, {
    description: options?.description,
    duration: options?.duration || 3000,
    action: options?.action,
  });
}

/**
 * Show an error toast notification
 */
export function toastError(message: string, options?: ToastOptions) {
  return sonnerToast.error(message, {
    description: options?.description,
    duration: options?.duration || 5000,
    action: options?.action,
  });
}

/**
 * Show a warning toast notification
 */
export function toastWarning(message: string, options?: ToastOptions) {
  return sonnerToast.warning(message, {
    description: options?.description,
    duration: options?.duration || 4000,
    action: options?.action,
  });
}

/**
 * Show an info toast notification
 */
export function toastInfo(message: string, options?: ToastOptions) {
  return sonnerToast.info(message, {
    description: options?.description,
    duration: options?.duration || 3000,
    action: options?.action,
  });
}

/**
 * Show a loading toast notification
 * Returns an ID that can be used to update or dismiss the toast
 */
export function toastLoading(message: string, options?: Omit<ToastOptions, 'action'>) {
  return sonnerToast.loading(message, {
    description: options?.description,
    duration: options?.duration || Infinity,
  });
}

/**
 * Show a promise-based toast that updates based on promise state
 */
export function toastPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: Error) => string);
  }
) {
  return sonnerToast.promise(promise, messages);
}

/**
 * Dismiss a specific toast by ID
 */
export function toastDismiss(toastId?: string | number) {
  return sonnerToast.dismiss(toastId);
}

/**
 * Dismiss all toasts
 */
export function toastDismissAll() {
  return sonnerToast.dismiss();
}
