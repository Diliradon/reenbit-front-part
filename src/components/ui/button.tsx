import * as React from "react"

import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const getVariantStyles = (variant: ButtonProps["variant"]) => {
  switch (variant) {
    case "destructive":
      return "bg-red-600 text-white shadow-sm hover:bg-red-700"
    case "outline":
      return "border border-gray-300 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900"
    case "secondary":
      return "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200"
    case "ghost":
      return "hover:bg-gray-100 hover:text-gray-900"
    case "link":
      return "text-blue-600 underline-offset-4 hover:underline"
    default:
      return "bg-blue-600 text-white shadow hover:bg-blue-700"
  }
}

const getSizeStyles = (size: ButtonProps["size"]) => {
  switch (size) {
    case "sm":
      return "h-8 rounded-md px-3 text-xs"
    case "lg":
      return "h-10 rounded-md px-8"
    case "icon":
      return "h-9 w-9"
    default:
      return "h-9 px-4 py-2"
  }
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
    const variantStyles = getVariantStyles(variant)
    const sizeStyles = getSizeStyles(size)

    if (asChild) {
      // If asChild is true, we would need a more complex implementation
      // For now, we'll just render as a button
      console.warn("asChild prop is not fully supported in native implementation")
    }

    return (
      <button
        className={cn(baseStyles, variantStyles, sizeStyles, className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
