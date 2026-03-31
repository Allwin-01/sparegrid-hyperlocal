import React from 'react'
import { cn } from '../../lib/utils'
import { VariantProps, cva } from "class-variance-authority";

const buttonVariants = cva(
    "relative group border transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none overflow-hidden",
    {
        variants: {
            variant: {
                default: "bg-background text-foreground border-border hover:border-primary/50",
                neon: "bg-black text-primary border-primary/50 hover:border-primary hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]",
                outline: "bg-transparent border-border hover:bg-accent hover:text-accent-foreground",
            },
            size: {
                default: "h-10 px-4 py-2 rounded-md",
                sm: "h-9 px-3 rounded-md text-xs",
                lg: "h-12 px-8 rounded-md text-lg",
                icon: "h-10 w-10 rounded-full flex items-center justify-center",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface NeonButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    glowColor?: string;
}

const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
    ({ className, variant, size, glowColor, children, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                style={{
                  // @ts-ignore
                  '--primary-rgb': glowColor || '0, 255, 255'
                }}
                {...props}
            >
                <span className="relative z-10">{children}</span>
                {variant === 'neon' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                )}
            </button>
        )
    }
)
NeonButton.displayName = "NeonButton"

export { NeonButton, buttonVariants }
