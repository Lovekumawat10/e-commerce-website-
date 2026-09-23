"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, ShoppingBag, ShieldCheck, Truck, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const AccordionItem = ({ title, content, isOpen, onClick }: { title: string, content: React.ReactNode, isOpen: boolean, onClick: () => void }) => (
  <div className="border-b border-navy/10">
    <button
      className="w-full py-5 flex justify-between items-center text-left focus:outline-none"
      onClick={onClick}
    >
      <span className="font-serif text-navy text-xl">{title}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronDown size={20} className="text-gold" />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pb-6 text-navy/70 font-light leading-relaxed">
            {content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

interface ProductData {
  id: number;
  title: string;
  price: number;
  description: string;
  image_url: string;
  stock_status: boolean;
}

export default function ProductPage() {
  const params = useParams();
  const { id } = params;
  const { addToCart } = useCart();

  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [activeImage, setActiveImage] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProductData(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleAddToCart = () => {
    if (productData) {
      addToCart(productData);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-cream">
        <Navbar />
        <div className="pt-32 pb-24 flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !productData) {
    return (
      <main className="min-h-screen bg-cream">
        <Navbar />
        <div className="pt-32 pb-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-3xl font-serif text-navy">Product Not Found</h1>
          <p className="text-navy/60 mt-2">The masterpiece you are looking for does not exist or has been removed.</p>
          <Link href="/" className="text-gold border-b border-gold hover:text-gold-light hover:border-gold-light mt-6 inline-block uppercase tracking-widest text-sm font-medium transition-colors pb-1">
            Return to Collection
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const imageUrl = productData.image_url.startsWith('http')
    ? productData.image_url
    : `http://127.0.0.1:8000${productData.image_url}`;

  // Map DB data to UI format, keeping dummy images for the remaining gallery to preserve UI
  const product = {
    name: productData.title,
    sku: `SLSR-${productData.id.toString().padStart(3, '0')}`,
    price: `₹${productData.price.toLocaleString('en-IN')}`,
    status: productData.stock_status ? "In Stock" : "Out of Stock",
    description: productData.description || "A masterpiece of divine artistry, meticulously carved by master artisans.",
    images: [
      imageUrl,
      "https://images.unsplash.com/photo-1590038767624-dac5740a997b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1574874457494-01362e71d322?auto=format&fit=crop&q=80&w=1200",
    ],
    specs: [
      { label: "Material", value: "Premium Grade Wood/Marble" },
      { label: "Dimensions", value: "Custom Built" },
      { label: "Finish", value: "Hand-polished with Gold Leaf accents" },
    ],
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="container mx-auto px-6 md:px-12">
          
          {/* Breadcrumb */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link href="/" className="inline-flex items-center space-x-2 text-navy/60 hover:text-gold transition-colors">
              <ArrowLeft size={16} />
              <span className="uppercase tracking-widest text-xs font-medium">Back to Collections</span>
            </Link>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* Left Column: Image Gallery */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-navy/5 mb-6 group cursor-crosshair shadow-lg">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src={product.images[activeImage]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-125"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative aspect-square overflow-hidden rounded-lg transition-all duration-300 ${
                      activeImage === idx ? "ring-2 ring-gold ring-offset-2 ring-offset-cream opacity-100" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Product Info & Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-1/2 flex flex-col"
            >
              {/* Header */}
              <div className="mb-6">
                <p className="text-gold font-medium tracking-widest text-xs uppercase mb-3">SKU: {product.sku}</p>
                <h1 className="text-4xl md:text-5xl font-serif text-navy leading-tight mb-4">{product.name}</h1>
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-serif text-gold">{product.price}</span>
                  <span className={`px-3 py-1 ${productData.stock_status ? 'bg-navy/5 text-navy border-navy/10' : 'bg-red-50 text-red-600 border-red-100'} border rounded-full text-xs font-medium tracking-wider uppercase flex items-center`}>
                    <span className={`w-2 h-2 rounded-full ${productData.stock_status ? 'bg-gold animate-pulse' : 'bg-red-500'} mr-2`}></span>
                    {product.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-10">
                <p className="text-navy/70 font-light text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={!productData.stock_status}
                  className={`flex-1 flex items-center justify-center space-x-3 py-4 px-8 font-medium tracking-wide uppercase text-sm transition-colors shadow-[0_10px_20px_rgba(212,175,55,0.2)] ${productData.stock_status ? 'bg-gold hover:bg-gold-light text-navy' : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'}`}
                >
                  <ShoppingBag size={18} />
                  <span>{productData.stock_status ? 'Add to Cart' : 'Out of Stock'}</span>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-4 px-8 bg-transparent border border-navy text-navy hover:bg-navy hover:text-cream font-medium tracking-wide uppercase text-sm transition-colors"
                >
                  Request Customization
                </motion.button>
              </div>

              {/* Information Accordions */}
              <div className="mt-auto">
                <AccordionItem
                  title="Specifications & Dimensions"
                  isOpen={activeAccordion === 0}
                  onClick={() => toggleAccordion(0)}
                  content={
                    <ul className="space-y-3">
                      {product.specs.map((spec, idx) => (
                        <li key={idx} className="flex justify-between border-b border-navy/5 pb-2 last:border-0">
                          <span className="text-navy/60">{spec.label}</span>
                          <span className="text-navy font-medium text-right">{spec.value}</span>
                        </li>
                      ))}
                    </ul>
                  }
                />
                
                <AccordionItem
                  title="Shipping & Delivery"
                  isOpen={activeAccordion === 1}
                  onClick={() => toggleAccordion(1)}
                  content={
                    <div className="space-y-4">
                      <p>As each piece is meticulously handcrafted to order, please allow <strong>4-6 weeks</strong> for creation and processing.</p>
                      <div className="flex items-start space-x-3 p-4 bg-navy/5 rounded-lg border border-navy/10">
                        <Truck size={20} className="text-gold flex-shrink-0 mt-0.5" />
                        <p className="text-sm">We provide fully insured, white-glove global shipping. The temple will arrive in custom-built wooden crates to ensure absolute safety.</p>
                      </div>
                    </div>
                  }
                />
                
                <AccordionItem
                  title="Refund & Return Policy"
                  isOpen={activeAccordion === 2}
                  onClick={() => toggleAccordion(2)}
                  content={
                    <div className="space-y-4">
                      <p>Due to the bespoke nature of our handcrafted temples, we do not accept standard returns.</p>
                      <div className="flex items-start space-x-3 p-4 bg-navy/5 rounded-lg border border-navy/10">
                        <ShieldCheck size={20} className="text-gold flex-shrink-0 mt-0.5" />
                        <p className="text-sm">In the rare event of transit damage, please notify us within 48 hours of delivery with photographic evidence, and our team will arrange for a prompt replacement or restoration.</p>
                      </div>
                    </div>
                  }
                />
              </div>

            </motion.div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Luxurious Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-10 right-10 bg-navy text-cream py-4 px-6 rounded-xl shadow-2xl border border-gold/20 flex items-center gap-4 z-50"
          >
            <CheckCircle className="text-gold" size={24} />
            <div>
              <p className="font-serif text-lg">Added to Cart</p>
              <p className="text-xs text-cream/70 font-light">{product.name}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
