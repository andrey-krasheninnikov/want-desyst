import * as React from "react"
import { cn } from "../utils.js"
import { Label as LabelPrimitive } from "radix-ui"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "ui-label",
        className
      )}
      {...props}
    />
  )
}

export { Label }
