import React from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import BackgroundGlow from "../../components/BackgroundGlow";

const Contact = () => {
  return (
    <div className="min-h-screen relative pt-20 pb-10">
      {/* Premium Animated Background */}
      <BackgroundGlow />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-linear-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">Contact Us</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto transition-colors">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white/80 dark:bg-gray-900/40 rounded-2xl p-6 border border-sky-900/60
 dark:border-sky-800/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.6)] transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              Send us a message
            </h2>
            <form className="space-y-4">
              <div>
                <label className="text-gray-600 dark:text-gray-400 text-sm mb-1 block transition-colors">Name</label>
                <Input
                  type="text"
                  placeholder="Your name"
                  className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-sky-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-gray-600 dark:text-gray-400 text-sm mb-1 block transition-colors">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-sky-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-gray-600 dark:text-gray-400 text-sm mb-1 block transition-colors">
                  Subject
                </label>
                <Input
                  type="text"
                  placeholder="How can we help?"
                  className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-sky-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-gray-600 dark:text-gray-400 text-sm mb-1 block transition-colors">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Your message..."
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-sky-500 focus:outline-none resize-none transition-colors"
                />
              </div>
              <Button className="w-full bg-linear-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-gray-900/40 rounded-2xl p-6 border border-sky-900/60
 dark:border-sky-800/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.6)] transition-colors duration-300">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
                Contact Information
              </h2>
              <div className="space-y-4">
                <ContactItem
                  icon={Phone}
                  label="Phone"
                  value="7990126127"
                  subtext="Manager: Mann Patel"
                />
                <ContactItem
                  icon={Mail}
                  label="Email"
                  value="patelmann2705@gmail.com"
                />
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/60 rounded-2xl p-6 border border-sky-300/60 dark:border-sky-800/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.6)] transition-colors duration-300">
              <h3 className="text-gray-900 dark:text-white font-semibold mb-2 transition-colors">Business Hours</h3>
              <div className="text-gray-600 dark:text-gray-400 text-sm space-y-1 transition-colors">
                <p>Monday - Saturday: 10:00 AM - 8:00 PM</p>
                <p>Sunday: 11:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactItem = ({ icon: Icon, label, value, subtext }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 bg-sky-500/10 dark:bg-sky-500/20 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
      <Icon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
    </div>
    <div>
      <p className="text-gray-500 dark:text-gray-500 text-sm transition-colors">{label}</p>
      <p className="text-gray-900 dark:text-white transition-colors">{value}</p>
      {subtext && <p className="text-sky-600 dark:text-sky-400 text-sm transition-colors">{subtext}</p>}
    </div>
  </div>
);

export default Contact;
