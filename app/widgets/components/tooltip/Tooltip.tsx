"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "../../tiptap/utils"

// --- Root Tooltip Component ---
const Tooltip = TooltipPrimitive.Root

// --- Tooltip Provider ---
const TooltipProvider = TooltipPrimitive.Provider

// --- Tooltip Trigger ---
const TooltipTrigger = TooltipPrimitive.Trigger

// --- Tooltip Content with Bootstrap Styling ---
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <div className="tooltip bs-tooltip-auto fade show">
      <div className="tooltip-arrow"></div>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn("tooltip-inner", className)}
        style={{ zIndex: 1070 }}
        {...props}
      />
    </div>
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider 
}
