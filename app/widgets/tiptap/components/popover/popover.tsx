"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "../../utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
      <div className="popover bs-popover-auto fade show">
          <div className="popover-arrow"></div>
          <PopoverPrimitive.Content
              ref={ref}
              align={align}
              sideOffset={sideOffset}
              className={cn(
                  "popover-body",
                  className
              )}
              style={{ zIndex: 1060 }}
              {...props}
          />
      </div>
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
