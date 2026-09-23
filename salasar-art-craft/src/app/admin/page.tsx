"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  PackageSearch, 
  TrendingUp, 
  Users, 
  AlertCircle,
  LogOut,
  UploadCloud,
  Check,
  X,
  Search,
  MoreVertical,
  IndianRupee,
  Edit,
  Trash2,
  Calendar,
  Filter,
  ChevronDown,
  CheckCircle,
  XCircle,
  MessageCircle
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard (Overview)", icon: LayoutDashboard },
  { id: "products", label: "Manage Products", icon: PackageSearch },
  { id: "orders", label: "Orders & Profits", icon: TrendingUp },
  { id: "customers", label: "Customer Management", icon: Users },
  { id: "returns", label: "Returns & Complaints", icon: AlertCircle },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [inStock, setInStock] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/admin/login");
  };

  if (!isAuthenticated) return null; // Wait for redirect


  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview inStock={inStock} setInStock={setInStock} />;
      case "products":
        return <ManageProducts />;
      case "orders":
        return <OrdersProfits />;
      case "customers":
        return <CustomerManagement />;
      case "returns":
        return <ReturnsComplaints />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-2xl font-serif text-navy/50">Module Under Construction</h2>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      {/* Left Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-navy text-white flex flex-col flex-shrink-0 z-20"
      >
        <div className="p-6 border-b border-white/10">
          <div className="bg-white/95 p-3 rounded-xl inline-block mb-2 shadow-lg">
            <Image src="/logo.png" alt="Salasar Art Craft" width={150} height={40} className="h-8 w-auto object-contain" />
          </div>
          <p className="text-gold text-xs font-medium tracking-widest uppercase mt-2">Admin Portal</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive ? "bg-gold/10 text-gold" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-gold transition-colors w-full rounded-lg text-left">
            <LogOut size={18} />
            <span className="font-medium text-sm">Exit Admin</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-navy/5 h-16 flex items-center justify-between px-8 flex-shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-navy/50">Admin Access:</span>
            <span className="font-medium text-navy bg-navy/5 px-3 py-1 rounded-full">lovekumawat1511@gmail.com</span>
          </div>
          
          <button onClick={handleLogout} className="text-sm font-medium text-navy/70 hover:text-navy transition-colors flex items-center gap-2">
            <LogOut size={16} />
            Logout
          </button>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// Sub-component for the Dashboard Overview
const DashboardOverview = ({ inStock, setInStock }: { inStock: boolean, setInStock: (val: boolean) => void }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [stats, setStats] = useState<{total_revenue: number, total_orders: number, active_users: number, pending_returns: number, recent_orders: any[]}>({total_revenue: 0, total_orders: 0, active_users: 0, pending_returns: 0, recent_orders: []});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/admin/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !imageFile) {
      alert("Please provide title, price, and an image.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("image", imageFile);

      const response = await fetch("http://127.0.0.1:8000/admin/add-product", {
        method: "POST",
        body: formData,
        // Crucial: Do not set Content-Type header manually for FormData
      });

      if (response.ok) {
        alert("Product published successfully!");
        // Reset form
        setTitle("");
        setPrice("");
        setDescription("");
        setImageFile(null);
        setInStock(true);
      } else {
        alert("Failed to publish product.");
      }
    } catch (error) {
      console.error("Error publishing product:", error);
      alert("An error occurred while communicating with the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-3xl font-serif text-navy">Dashboard Overview</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Revenue" value={`₹${stats.total_revenue.toLocaleString('en-IN')}`} trend="+12.5%" />
        <MetricCard title="Total Orders" value={stats.total_orders.toString()} trend="+8.2%" />
        <MetricCard title="Active Users" value={stats.active_users.toString()} trend="+24.1%" />
        <MetricCard title="Pending Returns" value={stats.pending_returns.toString()} trend={stats.pending_returns > 0 ? "+1" : "0"} alert={stats.pending_returns > 0} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Tables & Lists) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Recent Orders Table */}
          <div className="bg-white p-6 rounded-xl border border-navy/5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-navy">Recent Activity</h2>
              <button className="text-sm text-gold hover:text-gold-light font-medium transition-colors">View All Orders</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-navy/10 text-navy/50 text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-medium">Order ID</th>
                    <th className="py-3 px-4 font-medium">Customer</th>
                    <th className="py-3 px-4 font-medium">Amount</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {stats.recent_orders.length === 0 ? (
                    <tr><td colSpan={5} className="py-6 text-center text-navy/50">No recent orders found.</td></tr>
                  ) : (
                    stats.recent_orders.map((order, i) => {
                      let statusColor = "text-blue-600 bg-blue-50";
                      if (order.order_status === "Shipped") statusColor = "text-green-600 bg-green-50";
                      else if (order.order_status === "Delivered") statusColor = "text-emerald-600 bg-emerald-50";
                      else if (order.order_status === "Returned") statusColor = "text-red-600 bg-red-50";
                      
                      return (
                        <tr key={i} className="border-b border-navy/5 last:border-0 hover:bg-navy/[0.02] transition-colors">
                          <td className="py-4 px-4 font-medium text-navy">#SLSR-ORD-{order.id}</td>
                          <td className="py-4 px-4 text-navy/70 truncate max-w-[150px]">{order.shipping_address.split(',')[0]}</td>
                          <td className="py-4 px-4 font-medium text-navy">₹{order.total_amount.toLocaleString('en-IN')}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                              {order.order_status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button className="text-navy/40 hover:text-navy transition-colors"><MoreVertical size={16} /></button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Returns & Complaints */}
          <div className="bg-white p-6 rounded-xl border border-navy/5 shadow-sm border-l-4 border-l-red-500">
            <h2 className="text-xl font-serif text-navy mb-4">Complaints & Returns Action Required</h2>
            <div className="space-y-4">
              {[
                { id: "#RTN-023", cust: "Priya Singh", item: "Rosewood Divine Arch", reason: "Minor scratch on the base during transit.", date: "Today, 10:45 AM" },
                { id: "#CMP-104", cust: "Arjun Rao", item: "Custom Marble Order", reason: "Delayed delivery by 3 days.", date: "Yesterday, 04:20 PM" },
              ].map((ticket, i) => (
                <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-red-50/50 rounded-lg border border-red-100">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-navy text-sm">{ticket.id}</span>
                      <span className="text-xs text-navy/50">• {ticket.date}</span>
                    </div>
                    <p className="text-sm font-medium text-navy mb-1">{ticket.cust} - <span className="font-light">{ticket.item}</span></p>
                    <p className="text-sm text-navy/70">{ticket.reason}</p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex gap-2">
                    <button className="px-3 py-1.5 bg-white border border-navy/20 text-navy text-xs font-medium rounded hover:bg-navy hover:text-white transition-colors">Review</button>
                    <button className="px-3 py-1.5 bg-navy text-white text-xs font-medium rounded hover:bg-navy-dark transition-colors">Resolve</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (Forms) */}
        <div className="xl:col-span-1">
          
          {/* Add New Product Form */}
          <div className="bg-white p-6 rounded-xl border border-navy/5 shadow-sm sticky top-0">
            <h2 className="text-xl font-serif text-navy mb-6">Add New Product</h2>
            
            <form className="space-y-5" onSubmit={handlePublish}>
              <div>
                <label className="block text-xs font-medium text-navy/60 uppercase tracking-wider mb-2">Product Name</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream border border-navy/10 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm text-navy" 
                  placeholder="e.g., Majestic Teak Altar" 
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-navy/60 uppercase tracking-wider mb-2">Price (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee size={14} className="text-navy/40" />
                  </div>
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-cream border border-navy/10 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm text-navy" 
                    placeholder="0.00" 
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-navy/60 uppercase tracking-wider mb-2">Detailed Description</label>
                <textarea 
                  rows={4} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream border border-navy/10 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm text-navy resize-none" 
                  placeholder="Describe the craftsmanship..." 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-navy/60 uppercase tracking-wider mb-2">Product Images</label>
                <label htmlFor="imageUpload" className="relative border-2 border-dashed border-navy/20 rounded-xl p-8 flex flex-col items-center justify-center bg-cream/50 hover:bg-gold/5 hover:border-gold/50 transition-colors cursor-pointer group overflow-hidden block w-full">
                  <input 
                    id="imageUpload"
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required
                  />
                  <UploadCloud size={32} className="text-navy/40 group-hover:text-gold transition-colors mb-3" />
                  <p className="text-sm text-navy/70 font-medium text-center">
                    {imageFile ? imageFile.name : "Drag & drop images here"}
                  </p>
                  {!imageFile && <p className="text-xs text-navy/40 mt-1">or click to browse</p>}
                </label>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium text-navy">Stock Status</span>
                <button 
                  type="button"
                  onClick={() => setInStock(!inStock)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${inStock ? 'bg-gold' : 'bg-navy/20'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${inStock ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="text-xs text-navy/60 ml-2 w-20 text-right">{inStock ? 'In Stock' : 'Out of Stock'}</span>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 bg-gold hover:bg-gold-light text-navy font-medium tracking-wide uppercase text-sm rounded-lg transition-colors shadow-[0_5px_15px_rgba(212,175,55,0.2)] mt-4 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? "Publishing..." : "Publish to Website"}
              </button>
            </form>
          </div>
          
        </div>

      </div>
    </div>
  );
};

// Reusable Metric Card Component
const MetricCard = ({ title, value, trend, alert = false }: { title: string, value: string, trend: string, alert?: boolean }) => {
  const isPositive = trend.startsWith('+');
  return (
    <div className={`bg-white p-6 rounded-xl border ${alert ? 'border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-navy/5 shadow-sm'}`}>
      <h3 className="text-navy/50 text-sm font-medium uppercase tracking-wider mb-4">{title}</h3>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-serif text-navy">{value}</span>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${alert ? 'bg-red-100 text-red-600' : (isPositive ? 'bg-green-100 text-green-700' : 'bg-navy/10 text-navy/70')}`}>
          {trend}
        </span>
      </div>
    </div>
  );
};

// Manage Products Tab
const ManageProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleStock = async (id: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/admin/products/${id}/stock`, { method: "PUT" });
      if (res.ok) {
        fetchProducts(); // Refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-serif text-navy">Manage Products</h1>
      </div>

      <div className="bg-white rounded-xl border border-navy/5 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-navy/5 flex items-center justify-between">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy/40" />
            <input type="text" placeholder="Search products..." className="w-full pl-9 pr-4 py-2 bg-cream border border-navy/10 rounded-lg text-sm text-navy focus:outline-none focus:border-gold" />
          </div>
          <button className="flex items-center space-x-2 text-navy/70 hover:text-navy text-sm font-medium">
            <Filter size={16} /> <span>Filter</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy/5 text-navy/50 text-xs uppercase tracking-wider">
                <th className="py-4 px-6 font-medium">Product</th>
                <th className="py-4 px-6 font-medium">Price</th>
                <th className="py-4 px-6 font-medium">Stock Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={4} className="py-8 text-center text-navy/50">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-navy/50">No products found.</td></tr>
              ) : products.map(product => {
                const imageUrl = product.image_url.startsWith('http') ? product.image_url : `http://127.0.0.1:8000${product.image_url}`;
                return (
                  <tr key={product.id} className="border-b border-navy/5 last:border-0 hover:bg-cream/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <Image src={imageUrl} alt={product.title} width={48} height={48} className="rounded-md object-cover h-12 w-12 border border-navy/10" />
                        <span className="font-medium text-navy">{product.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-navy">₹{product.price.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => toggleStock(product.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${product.stock_status ? 'bg-gold' : 'bg-navy/20'}`}
                      >
                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${product.stock_status ? 'translate-x-5' : 'translate-x-1'}`} />
                      </button>
                      <span className="ml-3 text-xs text-navy/60">{product.stock_status ? "In Stock" : "Out of Stock"}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button onClick={() => handleDelete(product.id)} className="text-navy/40 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Orders & Profits Tab
const OrdersProfits = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Reject Modal State
  const [rejectingOrderId, setRejectingOrderId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/admin/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: number, status: string, reason: string | null = null) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejection_reason: reason })
      });
      if (res.ok) {
        fetchOrders();
        setRejectingOrderId(null);
        setRejectionReason("");
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 relative">
      <h1 className="text-3xl font-serif text-navy">Orders & Profits</h1>

      {/* Reject Modal */}
      {rejectingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md"
          >
            <h3 className="text-xl font-serif text-navy mb-4">Reason for Rejection</h3>
            <textarea 
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="E.g., Out of stock, Delivery unserviceable..."
              className="w-full px-4 py-2 bg-cream border border-navy/10 rounded-lg text-sm mb-4 focus:outline-none focus:border-red-400"
              rows={4}
            />
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setRejectingOrderId(null)}
                className="px-4 py-2 text-navy text-sm font-medium hover:bg-navy/5 rounded-lg transition-colors"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button 
                onClick={() => updateOrderStatus(rejectingOrderId, "Rejected", rejectionReason)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                disabled={isUpdating || !rejectionReason.trim()}
              >
                {isUpdating ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-navy/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy/5 text-navy/50 text-xs uppercase tracking-wider">
                <th className="py-4 px-6 font-medium">Order ID</th>
                <th className="py-4 px-6 font-medium">Customer Address</th>
                <th className="py-4 px-6 font-medium">Amount</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-navy/50">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-navy/50">No orders placed yet.</td>
                </tr>
              ) : (
                orders.map((order, i) => {
                  let statusColor = "text-blue-600 bg-blue-50"; 
                  if (order.order_status === "Shipped") statusColor = "text-orange-600 bg-orange-50";
                  else if (order.order_status === "Delivered") statusColor = "text-green-600 bg-green-50";
                  else if (order.order_status === "Rejected") statusColor = "text-red-600 bg-red-50";
                  else if (order.order_status === "Approved") statusColor = "text-emerald-600 bg-emerald-50";

                  return (
                    <tr key={order.id} className="border-b border-navy/5 last:border-0 hover:bg-cream/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-navy">#SLSR-ORD-{order.id}</td>
                      <td className="py-4 px-6 text-navy/70 max-w-xs break-words">
                        <span className="block font-medium">{order.shipping_address}</span>
                        <span className="block text-xs text-navy/50">Pin: {order.pin_code}</span>
                      </td>
                      <td className="py-4 px-6 font-medium text-navy">₹{order.total_amount.toLocaleString('en-IN')}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                          {order.order_status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {order.order_status === "Processing" && (
                            <>
                              <button onClick={() => updateOrderStatus(order.id, "Approved")} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-medium transition-colors">Approve</button>
                              <button onClick={() => setRejectingOrderId(order.id)} className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded text-xs font-medium transition-colors">Reject</button>
                            </>
                          )}
                          {order.order_status === "Approved" && (
                            <button onClick={() => updateOrderStatus(order.id, "Shipped")} className="px-3 py-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded text-xs font-medium transition-colors">Mark Shipped</button>
                          )}
                          {order.order_status === "Shipped" && (
                            <button onClick={() => updateOrderStatus(order.id, "Delivered")} className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded text-xs font-medium transition-colors">Mark Delivered</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Customer Management Tab
const CustomerManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/admin/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-3xl font-serif text-navy">Customer Management</h1>

      <div className="bg-white rounded-xl border border-navy/5 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-navy/5 flex items-center justify-between">
          <div className="relative w-72">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy/40" />
            <input type="text" placeholder="Search by name, email..." className="w-full pl-9 pr-4 py-2 bg-cream border border-navy/10 rounded-lg text-sm text-navy focus:outline-none focus:border-gold" />
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-cream border border-navy/10 rounded-lg text-sm font-medium text-navy hover:border-gold transition-colors">Export CSV</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy/5 text-navy/50 text-xs uppercase tracking-wider">
                <th className="py-4 px-6 font-medium">Name</th>
                <th className="py-4 px-6 font-medium">Email</th>
                <th className="py-4 px-6 font-medium">Total Orders</th>
                <th className="py-4 px-6 font-medium">Total Spent</th>
                <th className="py-4 px-6 font-medium">Account Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={6} className="py-8 text-center text-navy/50">Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-navy/50">No customers registered yet.</td></tr>
              ) : users.map((user, i) => (
                <tr key={i} className="border-b border-navy/5 last:border-0 hover:bg-cream/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-navy">{user.name}</td>
                  <td className="py-4 px-6 text-navy/70">{user.email}</td>
                  <td className="py-4 px-6 text-navy/70">{user.orders}</td>
                  <td className="py-4 px-6 font-medium text-navy">{user.spent}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.active ? 'text-green-600 bg-green-50 border border-green-200' : 'text-gray-500 bg-gray-100 border border-gray-200'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-navy/40 hover:text-navy transition-colors"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


// Returns & Complaints Tab
const ReturnsComplaints = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/admin/complaints");
      if (res.ok) {
        setComplaints(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/admin/complaints/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-3xl font-serif text-navy">Returns & Complaints</h1>

      {loading ? (
        <p className="text-navy/50">Loading complaints...</p>
      ) : complaints.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-xl border border-navy/5">
          <p className="text-navy/50">No returns or complaints found in the database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {complaints.map((ticket, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-navy/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-6">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-semibold text-navy text-sm bg-navy/5 px-3 py-1 rounded-md">{ticket.ticket_id}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${ticket.type === 'Return' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                      {ticket.type}
                    </span>
                    <span className="text-xs text-navy/50 bg-cream px-2 py-1 rounded-full border border-navy/10">{ticket.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-navy/50 uppercase tracking-wider mb-1">Customer</p>
                      <p className="text-sm font-medium text-navy">{ticket.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-navy/50 uppercase tracking-wider mb-1">Order Ref</p>
                      <p className="text-sm font-medium text-navy">{ticket.order_id || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-navy/50 uppercase tracking-wider mb-1">Issue Description</p>
                    <p className="text-sm text-navy/80 bg-cream p-3 rounded-lg border border-navy/5">{ticket.issue}</p>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col gap-3 min-w-[200px]">
                  {ticket.status !== 'Resolved' && (
                    <button onClick={() => updateStatus(ticket.id, 'Resolved')} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors">
                      <CheckCircle size={16} /> Mark Resolved
                    </button>
                  )}
                  {ticket.status !== 'Rejected' && (
                    <button onClick={() => updateStatus(ticket.id, 'Rejected')} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors">
                      <XCircle size={16} /> Reject Claim
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
