"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Message sent successfully. We will get back to you soon!");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-cream pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif text-navy mb-6"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-navy/60 font-light max-w-2xl mx-auto"
          >
            Whether you have a question about our collections, need assistance with an order, or wish to commission a bespoke piece, we are here for you.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Contact Details & Map */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-1/3 space-y-10"
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-serif text-navy">Our Studio</h3>
              <div className="flex items-start gap-4">
                <MapPin className="text-gold flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-navy font-medium">Salasar Art Craft</p>
                  <p className="text-navy/60 text-sm mt-1 leading-relaxed">
                    123 Artisan Lane, Shilpgram<br />
                    Udaipur, Rajasthan 313001<br />
                    India
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-gold flex-shrink-0" size={20} />
                <p className="text-navy/80">+91 98765 43210</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="text-gold flex-shrink-0" size={20} />
                <p className="text-navy/80">namaste@salasarart.com</p>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="text-gold flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-navy font-medium">Opening Hours</p>
                  <p className="text-navy/60 text-sm mt-1">Mon - Sat: 10:00 AM - 7:00 PM</p>
                  <p className="text-navy/60 text-sm">Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-64 bg-navy/5 rounded-xl border border-navy/10 flex items-center justify-center overflow-hidden relative group">
              <div className="absolute inset-0 bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')" }}></div>
              <div className="relative z-10 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-lg shadow-sm border border-navy/5 text-navy font-medium text-sm flex items-center gap-2">
                <MapPin size={16} className="text-gold" />
                View on Google Maps
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full lg:w-2/3 bg-white p-8 md:p-12 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-navy/5"
          >
            <h3 className="text-2xl font-serif text-navy mb-8">Send a Message</h3>
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
                <label className="text-xs uppercase tracking-widest text-navy/70 font-medium">Subject</label>
                <input required type="text" className="w-full bg-cream/50 border border-navy/10 p-4 rounded-none focus:outline-none focus:border-gold transition-colors text-navy" />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-navy/70 font-medium">Your Message</label>
                <textarea required rows={6} className="w-full bg-cream/50 border border-navy/10 p-4 rounded-none focus:outline-none focus:border-gold transition-colors text-navy resize-none"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-navy hover:bg-navy-dark text-white font-medium tracking-widest uppercase transition-all shadow-lg disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
