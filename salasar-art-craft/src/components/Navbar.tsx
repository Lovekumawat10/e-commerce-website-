"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 border-b border-transparent ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm border-gold/20 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Brand */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Salasar Art Craft" width={200} height={64} className="h-12 md:h-16 w-auto object-contain" priority />
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex space-x-10 items-center">
              <Link href="/" className="text-navy hover:text-gold transition-colors text-sm tracking-wide uppercase font-medium">Home</Link>
              <Link href="/orders" className="text-navy hover:text-gold transition-colors text-sm tracking-wide uppercase font-medium">Orders</Link>
              <Link href="/collections" className="text-navy hover:text-gold transition-colors text-sm tracking-wide uppercase font-medium">Collections</Link>
              <Link href="/custom-orders" className="text-navy hover:text-gold transition-colors text-sm tracking-wide uppercase font-medium">Custom Orders</Link>
            <Link href="/contact" className="text-sm uppercase tracking-widest text-navy/80 hover:text-gold transition-colors font-medium">Contact</Link>
          </nav>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6 text-navy">
            <button onClick={() => setIsSearchOpen(true)} className="hover:text-gold transition-colors" aria-label="Search">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link href="/checkout" className="hover:text-gold transition-colors relative" aria-label="Cart">
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <Link href="/profile" className="hover:text-gold transition-colors" aria-label="User Profile">
              <User size={20} strokeWidth={1.5} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-navy focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-0 bg-white z-50 flex flex-col pt-24 px-8"
            >
              <button
                className="absolute top-6 right-6 text-navy"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={32} strokeWidth={1.5} />
              </button>
              
              <nav className="flex flex-col space-y-8 text-center mt-12">
                <Link href="/" className="font-serif text-3xl text-navy hover:text-gold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                <Link href="/orders" className="font-serif text-3xl text-navy hover:text-gold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Orders</Link>
                <Link href="/collections" className="font-serif text-3xl text-navy hover:text-gold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Collections</Link>
                <Link href="/custom-orders" className="font-serif text-3xl text-navy hover:text-gold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Custom Orders</Link>
                <Link href="/contact" className="font-serif text-3xl text-navy hover:text-gold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
              </nav>

              <div className="flex justify-center space-x-8 mt-16 text-navy">
                <button onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }} aria-label="Search">
                  <Search size={24} strokeWidth={1.5} />
                </button>
                <Link href="/checkout" aria-label="Cart" onClick={() => setIsMobileMenuOpen(false)} className="relative">
                  <ShoppingCart size={24} strokeWidth={1.5} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
                <Link href="/profile" aria-label="User Profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <User size={24} strokeWidth={1.5} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Full-Screen Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-navy/95 backdrop-blur-md z-50 flex flex-col items-center justify-center px-6"
          >
            <button
              className="absolute top-8 right-8 text-white/70 hover:text-gold transition-colors"
              onClick={() => setIsSearchOpen(false)}
            >
              <X size={36} strokeWidth={1} />
            </button>
            <div className="w-full max-w-2xl">
              <p className="text-gold/80 uppercase tracking-widest text-sm mb-4 text-center">What are you looking for?</p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search masterpieces..."
                  className="w-full bg-transparent border-b-2 border-white/20 text-white text-3xl md:text-5xl py-4 focus:outline-none focus:border-gold placeholder:text-white/20"
                  autoFocus
                />
                <button className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-gold transition-colors">
                  <Search size={32} strokeWidth={1} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
