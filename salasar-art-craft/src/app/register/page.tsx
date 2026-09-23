"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, is_google: false })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        login(data.access_token, data.user);
      } else {
        setError(data.detail || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleMock = async () => {
    const mockEmail = prompt("Since we are in local dev without OAuth, please enter the Gmail address you want to register/login with:");
    if (!mockEmail) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: mockEmail.split("@")[0], email: mockEmail, is_google: true })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.access_token, data.user);
      } else {
        setError(data.detail || "Google registration failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <main className="min-h-screen flex w-full bg-cream">
      
      {/* Left side: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-md"
        >
          <motion.div variants={itemVariants} className="mb-12 text-center md:text-left">
            <Image src="/logo.png" alt="Salasar Art Craft" width={180} height={50} className="h-12 w-auto object-contain mx-auto md:mx-0" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-serif text-navy mb-2">Create an Account</h1>
            <p className="text-navy/60 font-light mb-6">Join our exclusive community of divine art collectors.</p>
          </motion.div>

          {error && (
            <motion.div variants={itemVariants} className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <motion.div variants={itemVariants} className="relative">
              <input
                type="text"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="block w-full px-0 py-3 text-navy bg-transparent border-0 border-b border-navy/20 appearance-none focus:outline-none focus:ring-0 focus:border-gold transition-colors peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="name"
                className="absolute text-sm text-navy/50 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gold peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Full Name
              </label>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="block w-full px-0 py-3 text-navy bg-transparent border-0 border-b border-navy/20 appearance-none focus:outline-none focus:ring-0 focus:border-gold transition-colors peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="email"
                className="absolute text-sm text-navy/50 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gold peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email Address
              </label>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="block w-full px-0 py-3 text-navy bg-transparent border-0 border-b border-navy/20 appearance-none focus:outline-none focus:ring-0 focus:border-gold transition-colors peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="password"
                className="absolute text-sm text-navy/50 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gold peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Password
              </label>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <button type="submit" disabled={loading} className="w-full py-4 bg-navy hover:bg-navy-dark text-white font-medium tracking-wide uppercase text-sm transition-all duration-300 shadow-lg disabled:opacity-70">
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-navy/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-cream text-navy/40 uppercase tracking-widest text-xs">Or sign up with</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button onClick={handleGoogleMock} type="button" className="flex items-center justify-center px-4 py-3 border border-navy/10 hover:border-gold hover:bg-gold/5 transition-all duration-300 text-navy font-medium">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button type="button" className="flex items-center justify-center px-4 py-3 border border-navy/10 hover:border-gold hover:bg-gold/5 transition-all duration-300 text-navy font-medium">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                Facebook
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-10 text-center">
            <p className="text-navy/60 font-light text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-navy font-medium hover:text-gold transition-colors">
                Log In
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right side: Image */}
      <div className="hidden md:flex w-1/2 relative bg-navy overflow-hidden items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/brand-bg.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-navy/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-navy/10" />
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="bg-white/95 backdrop-blur-md p-10 rounded-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center"
          >
            <Image src="/logo.png" alt="Salasar Art Craft" width={300} height={100} className="w-64 md:w-80 h-auto object-contain" priority />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
