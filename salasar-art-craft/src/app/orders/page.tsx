"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, Truck, Home, XCircle, ChevronDown, ChevronUp, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrdersAndProducts = async () => {
      try {
        // Use user.id if available, fallback to 1 as requested for mock
        const userId = user?.id || 1;
        
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/orders/user/${userId}`),
          fetch(`http://127.0.0.1:8000/products`)
        ]);

        if (ordersRes.ok && productsRes.ok) {
          const ordersData = await ordersRes.json();
          const productsData = await productsRes.json();
          
          setOrders(ordersData);
          setProducts(productsData);
        }
      } catch (error) {
        console.error("Failed to fetch orders or products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndProducts();
  }, [user]);

  const toggleExpand = (orderId: number) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  // Helper to get product info for an order
  const getOrderProductInfo = (productIdsString: string) => {
    try {
      const ids = JSON.parse(productIdsString);
      if (!Array.isArray(ids) || ids.length === 0) return null;
      
      const firstProduct = products.find(p => p.id === ids[0]);
      if (!firstProduct) return null;

      return {
        ...firstProduct,
        additionalCount: ids.length - 1
      };
    } catch (e) {
      return null;
    }
  };

  const getStatusIndex = (status: string) => {
    switch (status) {
      case "Processing": return 0;
      case "Approved": return 1;
      case "Shipped": return 2;
      case "Delivered": return 3;
      case "Rejected": return -1;
      default: return 0;
    }
  };

  return (
    <main className="min-h-screen bg-cream pt-32 pb-24">
      <Navbar />
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl font-serif text-navy mb-4">My Orders</h1>
          <p className="text-navy/60 font-light">Track, manage, and view your complete order history.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-navy/10 border-t-gold rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-navy/5 shadow-sm">
            <Package size={48} className="mx-auto text-navy/20 mb-4" />
            <h3 className="text-xl font-serif text-navy mb-2">No orders found</h3>
            <p className="text-navy/60 mb-6">Looks like you haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const productInfo = getOrderProductInfo(order.product_ids);
              const isExpanded = expandedOrderId === order.id;
              const statusIdx = getStatusIndex(order.order_status);
              const isRejected = order.order_status === "Rejected";

              return (
                <div key={order.id} className="bg-white rounded-2xl border border-navy/5 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                  {/* Card Header (Always Visible) */}
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between cursor-pointer" onClick={() => toggleExpand(order.id)}>
                    <div className="flex items-center gap-6">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-cream rounded-xl border border-navy/5 overflow-hidden flex-shrink-0 relative">
                        {productInfo?.image_url ? (
                          <Image 
                            src={`http://127.0.0.1:8000${productInfo.image_url}`} 
                            alt={productInfo.title} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-navy/20">
                            <Package size={24} />
                          </div>
                        )}
                      </div>
                      
                      {/* Details */}
                      <div>
                        <div className="text-xs text-navy/50 font-medium tracking-widest uppercase mb-1">
                          Order #{order.id.toString().padStart(6, '0')}
                        </div>
                        <h3 className="text-lg font-medium text-navy mb-1">
                          {productInfo ? productInfo.title : 'Premium Item'}
                          {productInfo?.additionalCount > 0 && <span className="text-navy/50 text-sm ml-2">(+{productInfo.additionalCount} more)</span>}
                        </h3>
                        <div className="text-sm text-navy/60 flex items-center gap-4">
                          <span>{new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          <span className="w-1 h-1 bg-navy/20 rounded-full"></span>
                          <span className="font-medium text-navy">â‚¹{order.total_amount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full md:w-auto md:gap-8">
                      {/* Status Badge */}
                      <div className={`px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider ${
                        isRejected ? 'bg-red-50 text-red-600 border border-red-100' :
                        statusIdx === 3 ? 'bg-green-50 text-green-600 border border-green-100' :
                        'bg-gold/10 text-gold border border-gold/20'
                      }`}>
                        {order.order_status}
                      </div>

                      <button 
                        className="text-navy/40 hover:text-gold transition-colors flex items-center gap-2 text-sm font-medium uppercase tracking-widest"
                      >
                        <span className="hidden md:inline">{isExpanded ? 'Close' : 'Track'}</span>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Tracking Timeline */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden bg-cream/30 border-t border-navy/5"
                      >
                        <div className="p-6 md:p-8">
                          
                          {/* Rejection Alert */}
                          {isRejected && (
                            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-4">
                              <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                              <div>
                                <h4 className="text-red-800 font-medium mb-1">Order Rejected</h4>
                                <p className="text-red-600/80 text-sm">{order.rejection_reason || "Unfortunately, your order could not be fulfilled at this time."}</p>
                              </div>
                            </div>
                          )}

                          {/* Timeline */}
                          <div className="relative max-w-3xl mx-auto">
                            {/* Connecting Line */}
                            <div className="absolute top-6 left-6 right-6 h-0.5 bg-navy/10 hidden md:block"></div>
                            {/* Active Line (Desktop) */}
                            {!isRejected && <div 
                              className="absolute top-6 left-6 h-0.5 bg-gold hidden md:block transition-all duration-700"
                              style={{ width: `${(statusIdx / 3) * 100}%` }}
                            ></div>}

                            <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
                              {/* Step 1: Processing */}
                              <div className="flex md:flex-col items-center md:text-center gap-4 md:gap-3 relative">
                                {/* Mobile connecting line */}
                                <div className="absolute top-10 bottom-[-32px] left-6 w-0.5 bg-navy/10 md:hidden"></div>
                                {!isRejected && statusIdx > 0 && <div className="absolute top-10 bottom-[-32px] left-6 w-0.5 bg-gold md:hidden"></div>}
                                
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                                  statusIdx >= 0 || isRejected ? 'bg-gold border-gold text-white shadow-lg shadow-gold/20' : 'bg-white border-navy/10 text-navy/30'
                                }`}>
                                  <Clock size={20} />
                                </div>
                                <div className="flex-1 md:flex-none">
                                  <p className={`font-medium text-sm ${statusIdx >= 0 || isRejected ? 'text-navy' : 'text-navy/40'}`}>Processing</p>
                                  <p className="text-xs text-navy/50 mt-1">Order received</p>
                                </div>
                              </div>

                              {/* Step 2: Approved / Rejected */}
                              <div className="flex md:flex-col items-center md:text-center gap-4 md:gap-3 relative">
                                {/* Mobile connecting line */}
                                <div className="absolute top-10 bottom-[-32px] left-6 w-0.5 bg-navy/10 md:hidden"></div>
                                {!isRejected && statusIdx > 1 && <div className="absolute top-10 bottom-[-32px] left-6 w-0.5 bg-gold md:hidden"></div>}

                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                                  isRejected ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20' :
                                  statusIdx >= 1 ? 'bg-gold border-gold text-white shadow-lg shadow-gold/20' : 'bg-white border-navy/10 text-navy/30'
                                }`}>
                                  {isRejected ? <XCircle size={20} /> : <CheckCircle size={20} />}
                                </div>
                                <div className="flex-1 md:flex-none">
                                  <p className={`font-medium text-sm ${isRejected ? 'text-red-600' : statusIdx >= 1 ? 'text-navy' : 'text-navy/40'}`}>
                                    {isRejected ? 'Rejected' : 'Approved'}
                                  </p>
                                  <p className="text-xs text-navy/50 mt-1">
                                    {isRejected ? 'Cancelled by admin' : 'Confirmed by admin'}
                                  </p>
                                </div>
                              </div>

                              {/* Step 3: Shipped */}
                              <div className="flex md:flex-col items-center md:text-center gap-4 md:gap-3 relative">
                                {/* Mobile connecting line */}
                                <div className="absolute top-10 bottom-[-32px] left-6 w-0.5 bg-navy/10 md:hidden"></div>
                                {!isRejected && statusIdx > 2 && <div className="absolute top-10 bottom-[-32px] left-6 w-0.5 bg-gold md:hidden"></div>}

                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                                  !isRejected && statusIdx >= 2 ? 'bg-gold border-gold text-white shadow-lg shadow-gold/20' : 'bg-white border-navy/10 text-navy/30'
                                }`}>
                                  <Truck size={20} />
                                </div>
                                <div className="flex-1 md:flex-none">
                                  <p className={`font-medium text-sm ${!isRejected && statusIdx >= 2 ? 'text-navy' : 'text-navy/40'}`}>Shipped</p>
                                  <p className="text-xs text-navy/50 mt-1">Out for delivery</p>
                                </div>
                              </div>

                              {/* Step 4: Delivered */}
                              <div className="flex md:flex-col items-center md:text-center gap-4 md:gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                                  !isRejected && statusIdx >= 3 ? 'bg-gold border-gold text-white shadow-lg shadow-gold/20' : 'bg-white border-navy/10 text-navy/30'
                                }`}>
                                  <Home size={20} />
                                </div>
                                <div className="flex-1 md:flex-none">
                                  <p className={`font-medium text-sm ${!isRejected && statusIdx >= 3 ? 'text-navy' : 'text-navy/40'}`}>Delivered</p>
                                  <p className="text-xs text-navy/50 mt-1">Arrived safely</p>
                                </div>
                              </div>

                            </div>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
          <Footer />
</main>
  );
}

