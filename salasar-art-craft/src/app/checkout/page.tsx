"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ShieldCheck, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, totalAmount, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    pinCode: "",
    paymentMethod: "UPI"
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);

    const payload = {
      product_ids: cartItems.map(item => item.id),
      shipping_address: `${formData.fullName}, ${formData.address}`,
      pin_code: formData.pinCode,
      total_amount: totalAmount,
      payment_method: formData.paymentMethod,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        setOrderId(result.order_id);
        setShowSuccess(true);
        clearCart();
        setTimeout(() => {
          router.push("/");
        }, 4000);
      } else {
        alert("Failed to process your order. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream relative">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-serif text-navy mb-4">Secure Checkout</h1>
            <div className="w-16 h-[1px] bg-gold mx-auto mb-4"></div>
            <p className="text-navy/60 font-light">Complete your purchase securely.</p>
          </motion.div>

          {cartItems.length === 0 && !showSuccess ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center bg-white p-16 rounded-xl border border-navy/5 shadow-sm max-w-2xl mx-auto"
            >
              <h2 className="text-2xl font-serif text-navy mb-4">Your Cart is Empty</h2>
              <p className="text-navy/60 mb-8">You haven't added any divine masterpieces to your cart yet.</p>
              <Link href="/" className="inline-flex py-3 px-8 bg-gold hover:bg-gold-light text-navy font-medium tracking-wide uppercase text-sm rounded-lg transition-colors">
                Return to Collection
              </Link>
            </motion.div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-12">
              
              {/* Left Column: Form */}
              <div className="w-full lg:w-2/3 bg-white p-8 md:p-12 rounded-xl shadow-[0_10px_40px_rgba(15,23,42,0.05)] border border-navy/5">
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                  {/* Shipping Details */}
                  <div>
                    <h2 className="text-xl font-serif text-navy mb-6 border-b border-navy/10 pb-2">Shipping Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-navy/60 uppercase tracking-wider mb-2">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          className="w-full px-4 py-3 bg-cream/50 border border-navy/10 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm text-navy" 
                          placeholder="Enter your full name" 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-navy/60 uppercase tracking-wider mb-2">Detailed Address</label>
                        <textarea 
                          required
                          rows={3}
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className="w-full px-4 py-3 bg-cream/50 border border-navy/10 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm text-navy resize-none" 
                          placeholder="House/Flat No., Street, Landmark, City, State" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-navy/60 uppercase tracking-wider mb-2">PIN Code</label>
                        <input 
                          type="text" 
                          required
                          value={formData.pinCode}
                          onChange={(e) => setFormData({...formData, pinCode: e.target.value})}
                          className="w-full px-4 py-3 bg-cream/50 border border-navy/10 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm text-navy" 
                          placeholder="e.g. 110001" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h2 className="text-xl font-serif text-navy mb-6 border-b border-navy/10 pb-2">Payment Method</h2>
                    <div className="space-y-4">
                      <label className={`block relative p-4 rounded-lg border cursor-pointer transition-all ${formData.paymentMethod === 'UPI' ? 'border-gold bg-gold/5' : 'border-navy/10 bg-white hover:border-navy/30'}`}>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            name="payment" 
                            value="UPI"
                            checked={formData.paymentMethod === 'UPI'}
                            onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                            className="w-4 h-4 text-gold bg-gray-100 border-gray-300 focus:ring-gold accent-gold"
                          />
                          <span className="ml-3 font-medium text-navy">Pay via UPI / Card (Online)</span>
                        </div>
                      </label>

                      <label className={`block relative p-4 rounded-lg border cursor-pointer transition-all ${formData.paymentMethod === 'COD' ? 'border-gold bg-gold/5' : 'border-navy/10 bg-white hover:border-navy/30'}`}>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            name="payment" 
                            value="COD"
                            checked={formData.paymentMethod === 'COD'}
                            onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                            className="w-4 h-4 text-gold bg-gray-100 border-gray-300 focus:ring-gold accent-gold"
                          />
                          <span className="ml-3 font-medium text-navy">Cash on Delivery (COD)</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </form>
              </div>

              {/* Right Column: Order Summary */}
              <div className="w-full lg:w-1/3">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-navy/5 sticky top-32">
                  <h2 className="text-xl font-serif text-navy mb-6 border-b border-navy/10 pb-2">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="flex items-center gap-4 py-2 border-b border-navy/5 last:border-0">
                        <div className="h-16 w-16 relative flex-shrink-0 bg-cream rounded-md overflow-hidden border border-navy/10">
                          <Image src={item.image_url.startsWith('http') ? item.image_url : `http://127.0.0.1:8000${item.image_url}`} alt={item.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-navy line-clamp-1">{item.title}</h3>
                          <p className="text-sm text-gold mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-navy/30 hover:text-red-500 transition-colors" aria-label="Remove item">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-navy/10 pt-4 mb-6">
                    <div className="flex justify-between items-center text-sm text-navy/60 mb-2">
                      <span>Subtotal</span>
                      <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-navy/60 mb-2">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-navy font-serif border-t border-navy/10 pt-4 mb-8">
                    <span className="text-xl">Total</span>
                    <span className="text-2xl text-gold">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <button 
                    form="checkout-form"
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full py-4 bg-gold hover:bg-gold-light text-navy font-medium tracking-wide uppercase text-sm rounded-lg transition-colors shadow-[0_5px_15px_rgba(212,175,55,0.2)] flex justify-center items-center ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {isSubmitting ? 'Processing Securely...' : 'Place Order'}
                    {!isSubmitting && <ShieldCheck size={18} className="ml-2" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-10 max-w-md w-full shadow-2xl text-center border border-gold/20 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>
              
              <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-gold" />
              </div>
              
              <h2 className="text-3xl font-serif text-navy mb-4">Order Confirmed</h2>
              <p className="text-navy/70 mb-6 font-light">
                Thank you for your purchase. Your divine masterpiece is now being prepared for you.
              </p>
              
              <div className="bg-cream/50 rounded-lg p-4 mb-8 border border-navy/5">
                <p className="text-xs text-navy/50 uppercase tracking-widest mb-1">Order ID</p>
                <p className="font-medium text-navy text-lg">#SLSR-ORD-{orderId}</p>
              </div>
              
              <p className="text-sm text-gold font-medium animate-pulse">Redirecting to homepage...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
