import React from "react";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy-dark text-cream/70 pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 inline-block p-4 rounded-xl mb-6 shadow-lg">
              <Image src="/logo.png" alt="Salasar Art Craft" width={200} height={64} className="h-12 w-auto object-contain" />
            </div>
            <p className="font-light leading-relaxed mb-6">
              The premier marketplace for handcrafted temple designs, bridging divine artistry with global devotees.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy hover:border-gold transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy hover:border-gold transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy hover:border-gold transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 2.7 11.4 3 10c-1.3 0-2.5-.5-3.3-1.4C1 8.5 1 5.3 1 5.3s3.1.2 5.5 1.5c2.4-1.6 5.8-1.5 7.9.3 2.1 1.7 2.7 4.9 2 7.4 1.3-1.3 2.3-3.1 3-5.2z"></path></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium uppercase tracking-widest text-sm mb-6">Explore</h4>
            <ul className="space-y-4 font-light">
              <li><a href="#" className="hover:text-gold transition-colors">Wooden Temples</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Marble Sanctums</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Brass & Metal</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Custom Orders</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">New Arrivals</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-medium uppercase tracking-widest text-sm mb-6">Company</h4>
            <ul className="space-y-4 font-light">
              <li><a href="#" className="hover:text-gold transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Our Workshop</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium uppercase tracking-widest text-sm mb-6">Contact</h4>
            <ul className="space-y-4 font-light">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="mt-1 flex-shrink-0 text-gold" />
                <span>123 Artisan Valley,<br />Craft City, IN 400001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="flex-shrink-0 text-gold" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="flex-shrink-0 text-gold" />
                <span>namaste@salasarart.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm font-light">
          <p>&copy; {new Date().getFullYear()} Salasar Art Craft. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="opacity-50">Secure Payments</span>
            {/* Payment icons could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
