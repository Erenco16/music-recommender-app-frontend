"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Track mouse position for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] bg-black overflow-hidden">
      {/* Primary Background Glow */}
      <motion.div
        className="absolute inset-0 opacity-15"
        animate={{
          background: [
            "linear-gradient(45deg, #050505, #111111)",
            "linear-gradient(45deg, #080808, #0f0f0f)",
            "linear-gradient(45deg, #030303, #101010)",
            "linear-gradient(45deg, #050505, #111111)",
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: "blur(60px)" }}
      />

      {/* Blurry Moving Shapes - Abstract Dark */}
      <motion.div
        className="absolute top-0 left-0 w-[200%] h-[150%] opacity-15"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
          x: ["-10%", "0%", "-10%"],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(40,40,40,0.4), rgba(0,0,0,0))",
          filter: "blur(80px)",
        }}
      />

      {/* Gradient Layer - Deep Dark */}
      <motion.div
        className="absolute bottom-0 right-0 w-[150%] h-[150%] opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -15, 15, 0],
          x: ["10%", "0%", "10%"],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "radial-gradient(circle at 70% 70%, rgba(30,30,30,0.5), rgba(0,0,0,0))",
          filter: "blur(100px)",
        }}
      />

      {/* Dark Accent Blob */}
      <motion.div
        className="absolute w-[45%] h-[45%] opacity-20"
        animate={{
          scale: [1, 1.2, 0.9, 1],
          x: ["0%", "5%", "-5%", "0%"],
          y: ["0%", "-5%", "5%", "0%"],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          top: `${20 + mousePosition.y * 5}%`,
          left: `${15 + mousePosition.x * 5}%`,
          background: "radial-gradient(circle, rgba(50,50,50,0.4), rgba(0,0,0,0))",
          filter: "blur(70px)",
        }}
      />

      {/* Interactive Blurry Floating Shape */}
      <motion.div
        className="absolute w-[40%] h-[40%] opacity-25"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        style={{
          top: `${40 + mousePosition.y * 10}%`,
          left: `${40 + mousePosition.x * 10}%`,
          background: "radial-gradient(circle, rgba(60,60,60,0.5), rgba(0,0,0,0))",
          filter: "blur(70px)",
          transition: "top 0.3s ease-out, left 0.3s ease-out",
        }}
      />

      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      {/* Abstract Moving Particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-30"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: [
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
            ],
            y: [
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
            ],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: (i % 4 + 1) * 80 + "px",
            height: (i % 4 + 1) * 80 + "px",
            background: `radial-gradient(circle, rgba(${
              20 + i * 5
            },${
              20 + i * 5
            },${
              20 + i * 5
            },0.${i % 3 + 2}), rgba(0,0,0,0))`,
            filter: "blur(50px)",
          }}
        />
      ))}

      {/* Subtle Vignette Effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.5) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Geometric Elements - Lines (More Visible) */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute opacity-70"
            style={{
              height: "1px",
              width: "100%",
              top: `${15 * (i + 1)}%`,
              transform: "rotate(0deg)",
              backgroundColor: "rgba(120, 120, 120, 0.6)",
              boxShadow: "0 0 4px rgba(200, 200, 200, 0.3)"
            }}
            animate={{
              opacity: [0.5, 0.7, 0.5],
              top: [`${15 * (i + 1)}%`, `${15 * (i + 1) + 1}%`, `${15 * (i + 1)}%`],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`vline-${i}`}
            className="absolute opacity-70"
            style={{
              width: "1px",
              height: "100%",
              left: `${20 * (i + 1)}%`,
              backgroundColor: "rgba(120, 120, 120, 0.6)",
              boxShadow: "0 0 4px rgba(200, 200, 200, 0.3)"
            }}
            animate={{
              opacity: [0.5, 0.7, 0.5],
              left: [`${20 * (i + 1)}%`, `${20 * (i + 1) + 0.5}%`, `${20 * (i + 1)}%`],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* More Visible Grid Intersections */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          [...Array(4)].map((_, j) => (
            <motion.div
              key={`intersection-${i}-${j}`}
              className="absolute w-1 h-1 rounded-full"
              style={{
                top: `${15 * (i + 1)}%`,
                left: `${20 * (j + 1)}%`,
                backgroundColor: "rgba(180, 180, 180, 0.8)",
                boxShadow: "0 0 5px rgba(200, 200, 200, 0.5)"
              }}
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i + j
              }}
            />
          ))
        ))}
      </div>

      {/* Subtle Dot Grid */}
      <div className="absolute inset-0 opacity-15" 
        style={{
          backgroundImage: "radial-gradient(rgba(100, 100, 100, 0.3) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Occasional Flash Effect */}
      <motion.div
        className="absolute inset-0 bg-gray-900 opacity-0"
        animate={{
          opacity: [0, 0.05, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 15 + Math.random() * 10,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}