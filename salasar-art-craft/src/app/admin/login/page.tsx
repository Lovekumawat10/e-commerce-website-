"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Lock, Mail, ShieldAlert } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access_token);
        router.push("/admin");
      } else {
        const errData = await response.json();
        setError(errData.detail || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-navy flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-gold/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10 px-6"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white/95 p-4 rounded-xl shadow-2xl mb-6">
            <Image src="/logo.png" alt="Salasar Art Craft" width={180} height={48} className="h-10 w-auto object-contain" />
          </div>
          <h1 className="text-3xl font-serif text-cream mb-2">Admin Portal</h1>
          <p className="text-gold/80 font-light tracking-wide text-sm">SECURE ACCESS REQUIRED</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm font-medium border border-red-100"
              >
                <ShieldAlert size={16} />
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-medium text-navy/60 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={16} className="text-navy/40" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-cream/50 border border-navy/10 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm text-navy" 
                  placeholder="admin@salasarartcraft.com" 
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-navy/60 uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={16} className="text-navy/40" />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-cream/50 border border-navy/10 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm text-navy" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-4 bg-gold hover:bg-gold-light text-navy font-medium tracking-wider uppercase text-sm rounded-xl transition-all shadow-[0_5px_15px_rgba(212,175,55,0.3)] mt-2 flex justify-center items-center ${isSubmitting ? 'opacity-70 cursor-wait' : 'hover:-translate-y-0.5'}`}
            >
              {isSubmitting ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>
        </div>
        
        <p className="text-center text-white/40 text-xs mt-8">
          © {new Date().getFullYear()} Salasar Art Craft. All rights reserved.
        </p>
      </motion.div>
    </main>
  );
}
