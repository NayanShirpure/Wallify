"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 3 // Allow slightly more toasts
const TOAST_REMOVE_DELAY = 5000 // Increase delay to 5 seconds

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
     // Clear existing timeout if the toast is updated or re-added
    clearTimeout(toastTimeouts.get(toastId));
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      // Schedule removal for the new toast
      addToRemoveQueue(action.toast.id);
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
        // If updating, reset the removal timeout
      if (action.toast.id) {
          addToRemoveQueue(action.toast.id);
      }
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // Stop the removal timeout for the dismissed toast
      if (toastId) {
         if (toastTimeouts.has(toastId)) {
            clearTimeout(toastTimeouts.get(toastId));
            toastTimeouts.delete(toastId);
         }
      } else {
         // Stop all timeouts if dismissing all
        toastTimeouts.forEach(timeout => clearTimeout(timeout));
        toastTimeouts.clear();
      }


      // Add toast to removal queue explicitly on dismiss IF it should auto-remove after dismiss
      // For manual dismiss, we might not want this. Assuming manual dismiss = remove immediately.
      // Let's refine: DISMISS_TOAST just marks it closed. REMOVE_TOAST actually removes it.
      // The auto-removal timeout should lead to REMOVE_TOAST, not DISMISS_TOAST.
       // Let's remove the addToRemoveQueue call from here as it's handled by ADD/UPDATE

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false, // Mark as closed, visual transition starts
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      // Clean up timeout just in case
       if (action.toastId && toastTimeouts.has(action.toastId)) {
          clearTimeout(toastTimeouts.get(action.toastId));
          toastTimeouts.delete(action.toastId);
       } else if (!action.toastId) {
            // Clear all timeouts if removing all
            toastTimeouts.forEach(timeout => clearTimeout(timeout));
            toastTimeouts.clear();
       }

      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
         // When the toast's open state changes (e.g., due to animation end or swipe)
        if (!open) {
             // Ensure timeout is cleared and remove the toast from state
             if (toastTimeouts.has(id)) {
                clearTimeout(toastTimeouts.get(id));
                toastTimeouts.delete(id);
             }
            dispatch({ type: "REMOVE_TOAST", toastId: id });
         }
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
