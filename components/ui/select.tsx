'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface SelectContextType {
  value?: string
  onValueChange?: (value: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  selectedLabel?: string
  setSelectedLabel: (label: string) => void
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined)

const useSelectContext = () => {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error("useSelectContext must be used within a Select component")
  }
  return context
}

const Select = React.forwardRef<
  HTMLDivElement,
  {
    value?: string
    onValueChange?: (value: string) => void
    children?: React.ReactNode
  } & React.HTMLAttributes<HTMLDivElement>
>(({ className, value, onValueChange, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedLabel, setSelectedLabel] = React.useState<string>('')
  const containerRef = React.useRef<HTMLDivElement>(null)
  const mergedRef = ref || containerRef

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen, selectedLabel, setSelectedLabel }}>
      <div ref={mergedRef as React.RefObject<HTMLDivElement>} className={cn("relative w-full", className)} {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  )
})
Select.displayName = "Select"

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { isOpen, setIsOpen, selectedLabel } = useSelectContext()

  return (
    <button
      ref={ref}
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        className
      )}
      {...props}
    >
      <span className={selectedLabel ? "text-gray-900" : "text-gray-500"}>
        {selectedLabel || "Select an option"}
      </span>
      <ChevronDown size={16} className={cn("transition-transform", { "rotate-180": isOpen })} />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
  <span ref={ref} className={cn("text-foreground", className)} {...props}>
    {children}
  </span>
))
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isOpen } = useSelectContext()

  if (!isOpen) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-gray-200 bg-white shadow-lg max-h-48 overflow-y-auto",
        className
      )}
      {...props}
    />
  )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<
  HTMLDivElement,
  {
    value?: string
    children?: React.ReactNode
  } & React.HTMLAttributes<HTMLDivElement>
>(({ className, value, children, ...props }, ref) => {
  const { onValueChange, setIsOpen, setSelectedLabel, value: selectedValue } = useSelectContext()
  const isSelected = value === selectedValue

  const handleClick = () => {
    if (value) {
      onValueChange?.(value)
      setSelectedLabel(String(children) || value)
      setIsOpen(false)
    }
  }

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-2 pl-3 pr-2 text-sm hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600 focus:outline-none transition-colors",
        isSelected && "bg-blue-100 text-blue-700 font-medium",
        className
      )}
      data-value={value}
      role="option"
      {...props}
    >
      {children}
    </div>
  )
})
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
