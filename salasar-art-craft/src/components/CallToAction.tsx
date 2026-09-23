"use client";
import React from "react";
import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-navy p-12 md:p-20 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden"
        >
          {/* subtle pattern or gradient in the box */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent"></div>
          
          <div className="md:w-2/3 relative z-10 mb-10 md:mb-0">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">
              Bring Divinity to Your Home
            </h2>
            <p className="text-cream/70 text-lg md:text-xl font-light max-w-xl leading-relaxed">
              Explore our latest collection of meticulously crafted marble and wooden temples.
            </p>
          </div>
          
          <div className="md:w-1/3 flex justify-end relative z-10 w-full md:w-auto">
            <button className="w-full md:w-auto px-10 py-5 bg-gold hover:bg-gold-light text-navy font-medium tracking-wide uppercase text-sm transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              Shop Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
