"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Filter, ChevronRight } from "lucide-react";

export default function CollectionsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Marble Temples", "Wooden Temples", "Silver Plated", "Pooja Accessories"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-cream pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif text-navy mb-4">Masterpiece Collections</h1>
          <p className="text-navy/60 font-light max-w-2xl">
            Discover our curated selection of divine artistry. Each piece is handcrafted by master artisans, preserving centuries of heritage.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar / Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-32">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-navy/10">
                <Filter size={20} className="text-gold" />
                <h3 className="text-lg font-serif text-navy">Categories</h3>
              </div>
              <ul className="space-y-4">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => setActiveCategory(category)}
                      className={`text-left w-full transition-colors flex items-center justify-between group ${
                        activeCategory === category ? "text-gold font-medium" : "text-navy/70 hover:text-gold"
                      }`}
                    >
                      <span>{category}</span>
                      {activeCategory === category && <ChevronRight size={16} className="text-gold" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="w-12 h-12 border-4 border-navy/10 border-t-gold rounded-full animate-spin"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 border border-navy/5 bg-white rounded-2xl">
                <p className="text-navy/50">No masterpieces found in this collection.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    key={product.id} 
                    className="group"
                  >
                    <Link href={`/product/${product.id}`} className="block">
                      <div className="relative aspect-[4/5] overflow-hidden bg-navy/5 mb-4">
                        <Image
                          src={product.image_url ? `http://127.0.0.1:8000${product.image_url}` : "/placeholder.jpg"}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-navy/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <h3 className="text-lg font-serif text-navy mb-1 group-hover:text-gold transition-colors">{product.title}</h3>
                      <p className="text-navy/70 font-medium">₹{product.price.toLocaleString('en-IN')}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
