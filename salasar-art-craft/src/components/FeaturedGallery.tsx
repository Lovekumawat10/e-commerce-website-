"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image_url: string;
  stock_status: boolean;
}

const getGridClass = (index: number) => {
  const classes = [
    "md:col-span-2 md:row-span-2",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-2",
    "md:col-span-2 md:row-span-1"
  ];
  return classes[index % classes.length];
};

const FeaturedGallery = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-24 bg-cream relative min-h-[500px]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-navy mb-4">Featured Masterpieces</h2>
            <div className="w-16 h-[1px] bg-gold mb-4"></div>
            <p className="text-navy/60 max-w-md font-light text-lg">
              Curated selections of the most exquisite temple designs from master artisans.
            </p>
          </div>
          <button className="mt-8 md:mt-0 text-navy hover:text-gold uppercase tracking-widest text-sm font-medium transition-colors border-b border-navy hover:border-gold pb-1">
            View All Collection
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-navy/50 font-serif text-xl">
            No masterpieces available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[300px] gap-6">
            {products.map((product, index) => {
              const gridClass = getGridClass(index);
              const imageUrl = product.image_url.startsWith('http') 
                ? product.image_url 
                : `http://127.0.0.1:8000${product.image_url}`;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`group relative overflow-hidden bg-white ${gridClass} shadow-md`}
                >
                  <Link href={`/product/${product.id}`} className="absolute inset-0 z-10">
                    <span className="sr-only">View {product.title}</span>
                  </Link>
                  
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                    style={{ backgroundImage: `url('${imageUrl}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-gold font-medium tracking-wider text-xs uppercase mb-2">
                        Premium Quality
                      </p>
                      <h3 className="text-white font-serif text-2xl md:text-3xl mb-2 leading-tight">
                        {product.title}
                      </h3>
                      <p className="text-white/90 text-lg font-light mb-6">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                      
                      <button className="relative z-20 pointer-events-auto flex items-center space-x-2 bg-white/10 hover:bg-gold backdrop-blur-md text-white px-6 py-3 border border-white/20 hover:border-gold transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0">
                        <ShoppingCart size={18} />
                        <span className="uppercase tracking-widest text-xs font-medium">Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedGallery;
