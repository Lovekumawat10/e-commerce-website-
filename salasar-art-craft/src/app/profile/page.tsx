"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, MapPin, LogOut, Package, Settings, CreditCard } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-cream pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-serif text-navy mb-4"
          >
            My Account
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-navy/60 font-light"
          >
            Manage your profile, addresses, and preferences.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar Menu */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full md:w-64 flex-shrink-0 space-y-2"
          >
            <div className="bg-white rounded-2xl border border-navy/5 p-4 shadow-sm">
              <Link href="/profile" className="flex items-center gap-3 w-full p-3 rounded-lg bg-navy/5 text-navy font-medium">
                <User size={18} className="text-gold" />
                Profile Info
              </Link>
              <Link href="/orders" className="flex items-center gap-3 w-full p-3 rounded-lg text-navy/60 hover:text-navy hover:bg-cream transition-colors">
                <Package size={18} />
                My Orders
              </Link>
              <button className="flex items-center gap-3 w-full p-3 rounded-lg text-navy/60 hover:text-navy hover:bg-cream transition-colors">
                <CreditCard size={18} />
                Payment Methods
              </button>
              <button className="flex items-center gap-3 w-full p-3 rounded-lg text-navy/60 hover:text-navy hover:bg-cream transition-colors">
                <Settings size={18} />
                Settings
              </button>
              <div className="my-2 border-t border-navy/5"></div>
              <button onClick={logout} className="flex items-center gap-3 w-full p-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors text-left">
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 space-y-8"
          >
            {/* Personal Details */}
            <div className="bg-white p-8 md:p-10 rounded-2xl border border-navy/5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full"></div>
              
              <h3 className="text-xl font-serif text-navy mb-8 flex items-center gap-3">
                <User className="text-gold" /> Personal Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs uppercase tracking-widest text-navy/40 font-medium mb-1">Full Name</p>
                  <p className="text-lg text-navy font-medium">{user?.name || "Premium Member"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-navy/40 font-medium mb-1">Email Address</p>
                  <div className="flex items-center gap-2 text-lg text-navy font-medium">
                    {user?.email || "user@example.com"}
                    <span className="bg-green-100 text-green-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">Verified</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-navy/40 font-medium mb-1">Phone Number</p>
                  <p className="text-lg text-navy font-medium">+91 (Not Provided)</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-navy/40 font-medium mb-1">Member Since</p>
                  <p className="text-lg text-navy font-medium">2026</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-navy/5">
                <button className="px-6 py-2 border border-navy/20 text-navy font-medium text-sm rounded-lg hover:border-gold hover:text-gold transition-colors">
                  Edit Details
                </button>
              </div>
            </div>

            {/* Saved Addresses */}
            <div className="bg-white p-8 md:p-10 rounded-2xl border border-navy/5 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-serif text-navy flex items-center gap-3">
                  <MapPin className="text-gold" /> Saved Addresses
                </h3>
                <button className="text-sm text-gold font-medium hover:text-navy transition-colors">
                  + Add New
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Primary Address */}
                <div className="border border-gold/30 bg-gold/5 p-6 rounded-xl relative">
                  <span className="absolute top-4 right-4 text-xs font-bold uppercase tracking-wider bg-gold text-white px-2 py-1 rounded">Default</span>
                  <p className="font-medium text-navy mb-2">{user?.name || "Premium Member"}</p>
                  <p className="text-navy/60 text-sm leading-relaxed mb-4">
                    42 Artisan Boulevard, Sector 15<br />
                    Mumbai, Maharashtra 400001<br />
                    India
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <button className="text-navy/60 hover:text-gold transition-colors">Edit</button>
                    <button className="text-red-400 hover:text-red-600 transition-colors">Delete</button>
                  </div>
                </div>

                {/* Add New Placeholder */}
                <div className="border border-dashed border-navy/20 bg-cream/30 hover:bg-cream/80 p-6 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[180px] group">
                  <div className="w-10 h-10 rounded-full bg-white border border-navy/10 flex items-center justify-center text-navy/40 group-hover:text-gold mb-3 transition-colors">
                    +
                  </div>
                  <p className="text-sm font-medium text-navy/70 group-hover:text-navy">Add a new delivery address</p>
                </div>
              </div>
            </div>
            
          </motion.div>
        </div>
      </div>
    </main>
  );
}
