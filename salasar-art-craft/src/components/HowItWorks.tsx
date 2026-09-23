"use client";
import React from "react";
import { Compass, ShieldCheck, Truck } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Discover Designs",
    description: "Browse our premium handcrafted wooden and marble temples.",
    icon: Compass,
  },
  {
    title: "Secure Checkout",
    description: "Seamless and safe purchasing experience.",
    icon: ShieldCheck,
  },
  {
    title: "Safe Doorstep Delivery",
    description: "Insured and careful delivery of your sacred space.",
    icon: Truck,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-32 bg-background relative z-20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif text-navy mb-4">How It Works</h2>
          <div className="w-16 h-[1px] bg-gold mx-auto mb-6"></div>
          <p className="text-navy/60 max-w-lg mx-auto font-light text-lg">
            A seamless journey to bringing divine craftsmanship into your sacred space.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group p-10 bg-white border border-navy/5 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                
                <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center mb-8 group-hover:bg-gold/10 transition-colors duration-500">
                  <Icon size={32} className="text-navy group-hover:text-gold transition-colors duration-500" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-2xl font-serif text-navy mb-4">{step.title}</h3>
                <p className="text-navy/60 font-light leading-relaxed">
                  {step.description}
                </p>
                
                <div className="mt-8 text-gold font-serif text-5xl opacity-10 absolute -bottom-4 -right-2">
                  0{index + 1}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
