"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-navy"
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          y: backgroundY,
          backgroundImage: "url('https://images.unsplash.com/photo-1600021307689-53b34bdf835c?auto=format&fit=crop&q=80&w=2070')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-navy/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-navy/40" />
      </motion.div>

      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center mt-20"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gold uppercase tracking-[0.3em] text-xs md:text-sm font-semibold mb-6"
        >
          Exclusive Masterpieces
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-tight mb-8 drop-shadow-lg"
        >
          Welcome to <br className="hidden md:block" />
          <span className="italic font-light text-cream/90">Salasar Art Craft.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-cream/80 max-w-2xl font-light leading-relaxed mb-12"
        >
          Discover our exclusive collection of exquisitely handcrafted temples, designed to bring divinity and elegance to your sacred space.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 items-center"
        >
          <button className="px-10 py-4 bg-gold hover:bg-gold-light text-navy font-medium tracking-wide uppercase text-sm transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] w-full sm:w-auto">
            Explore Collection
          </button>
          <button className="px-10 py-4 bg-transparent border border-cream/50 text-cream hover:bg-cream hover:text-navy font-medium tracking-wide uppercase text-sm transition-all duration-300 w-full sm:w-auto">
            Request Custom Design
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
