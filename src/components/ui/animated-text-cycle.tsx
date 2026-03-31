import * as React from "react";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedTextCycleProps {
  words: string[];
  interval?: number;
  className?: string;
}

export default function AnimatedTextCycle({
  words,
  interval = 5000,
  className = "",
}: AnimatedTextCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState<number | "auto">("auto");
  const measureRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  // Use useLayoutEffect to measure before paint
  useLayoutEffect(() => {
    const measureWidth = () => {
      if (measureRef.current) {
        const elements = measureRef.current.children;
        if (elements.length > currentIndex) {
          const rect = elements[currentIndex].getBoundingClientRect();
          // Use a more generous buffer and ensure we don't round down
          const newWidth = Math.ceil(rect.width);
          if (newWidth > 0) {
            setWidth(newWidth);
          }
        }
      }
    };

    // Measure immediately
    measureWidth();

    // Also measure after a short delay to account for font loading/rendering quirks
    const timeoutId = setTimeout(measureWidth, 100);

    // Re-measure on window resize
    window.addEventListener("resize", measureWidth);
    
    // Check for font loading
    if ("fonts" in document) {
      (document as any).fonts.ready.then(measureWidth);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", measureWidth);
    };
  }, [currentIndex, words]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, words.length]);

  // Container animation for the whole word
  const containerVariants = {
    hidden: { 
      y: -15,
      opacity: 0,
      filter: "blur(4px)"
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1] // Custom easeOutQuint for smoothness
      }
    },
    exit: { 
      y: 15,
      opacity: 0,
      filter: "blur(4px)",
      transition: { 
        duration: 0.3, 
        ease: "easeIn"
      }
    },
  };

  return (
    <span className="relative inline-flex items-baseline" ref={containerRef}>
      {/* Hidden measurement div with all words rendered */}
      <div 
        ref={measureRef} 
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none whitespace-nowrap flex"
        style={{ 
          visibility: "hidden",
          fontSize: "inherit",
          fontWeight: "inherit",
          fontFamily: "inherit",
          letterSpacing: "inherit",
          textTransform: "inherit"
        }}
      >
        {words.map((word, i) => (
          <span key={i} className={className} style={{ display: "inline-block" }}>
            {word}
          </span>
        ))}
      </div>

      {/* Visible animated word container */}
      <motion.span 
        className="relative inline-flex items-baseline justify-center overflow-visible flex-shrink-0"
        animate={{ 
          width: width === "auto" ? "auto" : width + 12, // Increased buffer to 12px
          transition: { 
            type: "spring",
            stiffness: 200,
            damping: 25,
            mass: 1,
          }
        }}
        style={{ minHeight: "1em" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentIndex}
            className={`inline-block ${className}`}
            variants={containerVariants as any}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ 
              whiteSpace: "nowrap",
              width: "max-content",
              display: "inline-block",
              verticalAlign: "baseline"
            }}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </span>
  );
}
 
