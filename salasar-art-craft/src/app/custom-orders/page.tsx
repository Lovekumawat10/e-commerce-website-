"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Send } from "lucide-react";

export default function CustomOrdersPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-cream pt-32 pb-24">
      <Navbar />
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif text-navy mb-6"
          >
            Bespoke Creations
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-navy/60 font-light max-w-2xl mx-auto"
          >
            Commission a one-of-a-kind masterpiece tailored to your exact spiritual and architectural requirements. Share your vision, and our master artisans will bring it to life.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 md:p-12 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-navy/5"
        >
          {success ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="text-green-600" size={32} />
              </div>
              <h2 className="text-3xl font-serif text-navy mb-4">Request Submitted</h2>
              <p className="text-navy/60 mb-8 max-w-md mx-auto">
                Thank you for trusting us with your vision. Our design team will review your requirements and contact you within 24-48 hours with a consultation schedule and preliminary quote.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="px-8 py-3 bg-navy text-white uppercase tracking-widest text-sm font-medium hover:bg-gold transition-colors"
              >
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-navy/70 font-medium">Full Name</label>
                  <input required type="text" className="w-full bg-cream/50 border border-navy/10 p-4 rounded-none focus:outline-none focus:border-gold transition-colors text-navy" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-navy/70 font-medium">Email Address</label>
                  <input required type="email" className="w-full bg-cream/50 border border-navy/10 p-4 rounded-none focus:outline-none focus:border-gold transition-colors text-navy" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-navy/70 font-medium">Material Preference</label>
                <select className="w-full bg-cream/50 border border-navy/10 p-4 rounded-none focus:outline-none focus:border-gold transition-colors text-navy">
                  <option>Select Material...</option>
                  <option>Premium Teak Wood</option>
                  <option>Makrana White Marble</option>
                  <option>Rosewood (Sheesham)</option>
                  <option>Silver Cladding</option>
                  <option>Other / Unsure</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-navy/70 font-medium">Design Requirements & Dimensions</label>
                <textarea required rows={5} className="w-full bg-cream/50 border border-navy/10 p-4 rounded-none focus:outline-none focus:border-gold transition-colors text-navy resize-none" placeholder="Please describe the size, style, and specific deities or carvings you envision..."></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-navy/70 font-medium">Reference Images (Optional)</label>
                <div className="border-2 border-dashed border-navy/10 p-8 text-center bg-cream/30 hover:bg-cream/80 transition-colors cursor-pointer group">
                  <Upload className="mx-auto mb-4 text-navy/40 group-hover:text-gold transition-colors" size={32} />
                  <p className="text-sm text-navy/60">Drag and drop images here, or <span className="text-gold font-medium">browse</span></p>
                  <p className="text-xs text-navy/40 mt-2">Supports JPG, PNG, PDF (Max 5MB)</p>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-navy hover:bg-navy-dark text-white font-medium tracking-widest uppercase transition-all shadow-lg disabled:opacity-70"
              >
                {loading ? "Submitting Request..." : "Request Consultation"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
          <Footer />
</main>
  );
}

