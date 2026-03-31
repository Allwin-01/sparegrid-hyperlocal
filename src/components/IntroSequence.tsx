import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VaporizeTextCycle, { Tag } from "./ui/vapour-text-effect";
import AnimatedTextCycle from "./ui/animated-text-cycle";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface IntroSequenceProps {
  onComplete: () => void;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<"vaporize" | "cycle">("vaporize");
  const [fontSize, setFontSize] = useState("80px");

  useEffect(() => {
    const handleResize = () => {
      setFontSize(window.innerWidth < 768 ? "40px" : "80px");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleVaporizeComplete = () => {
    setPhase("cycle");
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === "vaporize" && (
          <motion.div
            key="vaporize"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="w-full h-full flex items-center justify-center"
          >
            <VaporizeTextCycle
              texts={["Sparegrid"]}
              font={{
                fontFamily: "Inter, sans-serif",
                fontSize: fontSize,
                fontWeight: 700
              }}
              color="rgb(255, 255, 255)"
              spread={6}
              density={6}
              animation={{
                vaporizeDuration: 2.5,
                fadeInDuration: 1.5,
                waitDuration: 1
              }}
              direction="left-to-right"
              alignment="center"
              tag={Tag.H1}
              loop={false}
              onCycleComplete={handleVaporizeComplete}
            />
          </motion.div>
        )}

        {phase === "cycle" && (
          <motion.div
            key="cycle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4 max-w-5xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-light text-muted-foreground mb-8 leading-tight">
              Your{" "}
              <AnimatedTextCycle 
                words={[
                  "spare parts",
                  "repair shop",
                  "maintenance",
                  "vehicle care",
                  "inventory",
                  "logistics",
                  "Sparegrid"
                ]}
                interval={2000}
                className="text-white font-bold" 
              />{" "}
              deserves better tools
            </h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <Button 
                onClick={onComplete}
                variant="outline"
                className="rounded-full px-8 py-6 text-lg border-white/20 hover:bg-white hover:text-black transition-all duration-300"
              >
                Enter Dashboard <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip Button */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-8 right-8 z-[110]"
      >
        <Button
          onClick={onComplete}
          variant="ghost"
          className="text-white/50 hover:text-white hover:bg-white/10 rounded-full"
        >
          Skip Intro
        </Button>
      </motion.div>
    </div>
  );
};
