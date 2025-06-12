import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group", // Added relative, overflow-hidden, group
  {
    variants: {
      variant: {
        default: // Primary Accent Button with "Liquid Fill Gradient Shift"
          "border border-primary text-[hsl(var(--primary-foreground))] hover:text-[hsl(var(--primary-text-on-fill))] focus-visible:ring-primary before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-gradient-to-r before:from-[hsl(var(--primary-darker))] before:to-[hsl(var(--primary-lighter))] before:transition-transform before:duration-300 before:ease-out before:scale-x-0 before:origin-left group-hover:before:scale-x-100 before:z-[-1]",
        destructive:
          "border border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        secondary: // Can be styled similar to default if needed, or kept simpler
          "border border-secondary bg-transparent text-secondary-foreground hover:bg-secondary hover:text-secondary", // Adjusted for clarity, text remains on hover for this example
        ghost: "hover:bg-accent hover:text-accent-foreground text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8", // Made oval, so height is important
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
