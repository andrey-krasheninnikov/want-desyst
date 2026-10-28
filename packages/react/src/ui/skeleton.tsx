import { cn } from "../utils.js"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("rounded-md bg-accent", className)}
      {...props}
    />
  )
}

export { Skeleton }
