import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: // Liquid Fill Gradient Shift for Primary Accent Button
          "border border-primary text-primary hover:text-primary-foreground focus-visible:ring-primary before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-gradient-to-r before:from-[hsl(var(--primary-darker))] before:to-[hsl(var(--primary-lighter))] before:transition-transform before:duration-500 before:ease-out before:scale-x-0 before:origin-left group-hover:before:scale-x-100 before:z-[-1] hover:border-transparent",
        destructive:
          "border border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: // Standard outline, can be made thinner if border-input is adjusted or use border-primary for brand color
          "border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        secondary: // Outline style for secondary, using secondary color
          "border border-secondary bg-transparent text-secondary hover:text-secondary-foreground hover:bg-secondary",
        ghost: "hover:bg-accent hover:text-accent-foreground text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2", // Adjusted padding for oval
        sm: "h-9 px-4", // Adjusted padding for oval
        lg: "h-12 px-8", // Adjusted padding for oval
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
