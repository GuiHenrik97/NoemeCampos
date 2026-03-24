import type { ReactNode } from "react"
import { createPortal } from "react-dom"

interface ModalProps {
    children: ReactNode
    onClose: () => void
    size?: "sm" | "md" | "lg" | "xl"
}

export default function Modal({ children, onClose, size = "md" }: ModalProps) {
    const sizeMap = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-3xl",
        xl: "max-w-5xl",
    }

    return createPortal(
        <div className="fixed inset-0 z-[9999]">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    className={`bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 w-full ${sizeMap[size]} relative`}
                >
                    {children}
                </div>
            </div>
        </div>,
        document.body
    )
}