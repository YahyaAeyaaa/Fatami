"use client"

import { useState, useEffect, createContext, useContext, useCallback } from "react"
import { Check, X, AlertTriangle, Info, AlertCircle } from "lucide-react"

// Toast Context
const ToastContext = createContext(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Toast Provider
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ type = "info", title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, type, title, message, duration }])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const toast = {
    success: (title, message) => addToast({ type: "success", title, message }),
    error: (title, message) => addToast({ type: "error", title, message }),
    warning: (title, message) => addToast({ type: "warning", title, message }),
    info: (title, message) => addToast({ type: "info", title, message }),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

// Toast Container
function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

// Single Toast Item
function ToastItem({ toast, onClose }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))

    const timer = setTimeout(() => {
      handleClose()
    }, toast.duration)

    return () => clearTimeout(timer)
  }, [toast.duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(onClose, 200)
  }

  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  }

  const styles = {
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "bg-emerald-100 text-emerald-600",
      title: "text-emerald-800",
      progress: "bg-emerald-400",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "bg-red-100 text-red-600",
      title: "text-red-800",
      progress: "bg-red-400",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "bg-amber-100 text-amber-600",
      title: "text-amber-800",
      progress: "bg-amber-400",
    },
    info: {
      bg: "bg-sky-50",
      border: "border-sky-200",
      icon: "bg-sky-100 text-sky-600",
      title: "text-sky-800",
      progress: "bg-sky-400",
    },
  }

  const style = styles[toast.type]

  return (
    <div
      className={`
        pointer-events-auto w-full rounded-xl border shadow-lg backdrop-blur-sm overflow-hidden
        transition-all duration-200 ease-out
        ${style.bg} ${style.border}
        ${isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
    >
      <div className="flex items-start gap-3 p-4">
        <div className={`flex-shrink-0 p-2 rounded-lg ${style.icon}`}>
          {icons[toast.type]}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          {toast.title && (
            <p className={`font-semibold text-sm ${style.title}`}>{toast.title}</p>
          )}
          {toast.message && (
            <p className="text-sm text-gray-600 mt-0.5">{toast.message}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className={`h-full ${style.progress}`}
          style={{
            animation: `shrink ${toast.duration}ms linear forwards`,
          }}
        />
      </div>
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}

// Standalone Toast Component (tanpa context)
export function Toast({ 
  type = "info", 
  title, 
  message, 
  isOpen, 
  onClose,
  position = "bottom-right" 
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true))
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  }

  const styles = {
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "bg-emerald-100 text-emerald-600",
      title: "text-emerald-800",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "bg-red-100 text-red-600",
      title: "text-red-800",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "bg-amber-100 text-amber-600",
      title: "text-amber-800",
    },
    info: {
      bg: "bg-sky-50",
      border: "border-sky-200",
      icon: "bg-sky-100 text-sky-600",
      title: "text-sky-800",
    },
  }

  const positions = {
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-center": "top-6 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
  }

  const style = styles[type]

  if (!isOpen) return null

  return (
    <div className={`fixed ${positions[position]} z-50 max-w-sm w-full`}>
      <div
        className={`
          w-full rounded-xl border shadow-lg backdrop-blur-sm
          transition-all duration-200 ease-out
          ${style.bg} ${style.border}
          ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}
        `}
      >
        <div className="flex items-start gap-3 p-4">
          <div className={`flex-shrink-0 p-2 rounded-lg ${style.icon}`}>
            {icons[type]}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            {title && (
              <p className={`font-semibold text-sm ${style.title}`}>{title}</p>
            )}
            {message && (
              <p className="text-sm text-gray-600 mt-0.5">{message}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
