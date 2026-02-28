import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Linkedin, Github, Globe, Mail, Phone } from "lucide-react";

const Footer = () => {
  const location = useLocation();

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <footer className="relative z-10 bg-white dark:bg-black border-t border-gray-800 dark:border-gray-800 pt-6 pb-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center mb-2">
              <div className="flex items-center gap-2 group cursor-pointer w-fit">
                <img
                  src="https://res.cloudinary.com/mann2729/image/upload/v1772097164/logo_xdduls.png"

                  alt="Logo"
                  className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-transform group-hover:scale-110"
                />
                <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                  Over<span className="text-sky-500 dark:text-sky-400">Clocked</span>
                </span>
              </div>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-2 transition-colors">
              A multi-seller marketplace connecting sellers with buyers across
              India.
            </p>
            <div className="flex gap-2">
              <SocialIcon
                icon={Linkedin}
                href="https://www.linkedin.com/in/mann27/"
              />
              <SocialIcon icon={Github} href="https://github.com/Mann275" />
              <SocialIcon icon={Globe} href="https://patelmann.me" />
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-2 text-sm transition-colors">Company</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 transition-colors">
              <li>
                <FooterLink to="/about">About Us</FooterLink>
              </li>

              <li>
                <FooterLink to="/contact">Contact Us</FooterLink>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-2 text-sm transition-colors">Support</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 transition-colors">
              <li>
                <FooterLink to="/privacy">Privacy Policy</FooterLink>
              </li>
              <li>
                <FooterLink to="/terms">Terms of Service</FooterLink>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-2 text-sm transition-colors">Contact Us</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 transition-colors">
              <li className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-sky-500 dark:text-sky-400" />
                <span>7990126127</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-sky-500 dark:text-sky-400" />
                <span>patelmann2705@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-400 dark:border-gray-800 pt-3 text-center transition-colors">
          <p className="text-gray-500 dark:text-gray-500 text-xs">
            © 2026 Overclocked. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon: Icon, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-sky-50 dark:hover:bg-sky-600 hover:text-sky-600 dark:hover:text-white transition-all duration-300 hover:scale-110"
  >
    <Icon className="w-3.5 h-3.5" />
  </a>
);

const FooterLink = ({ to, children }) => (
  <Link to={to} className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors block">
    {children}
  </Link>
);

export default Footer;
