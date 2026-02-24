import React from "react";
import { Shield, Lock, Eye, Database } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-10">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-linear-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: February 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <Section
            icon={Database}
            title="Information We Collect"
            content="We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes your name, email address, phone number, shipping address, and payment information."
          />

          <Section
            icon={Eye}
            title="How We Use Your Information"
            content="We use the information we collect to process transactions, send you order confirmations and updates, respond to your comments and questions, send you marketing communications (if you've opted in), and improve our services."
          />

          <Section
            icon={Lock}
            title="Data Security"
            content="We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We use SSL encryption for all data transmissions."
          />

          <Section
            icon={Shield}
            title="Your Rights"
            content="You have the right to access, correct, or delete your personal information. You can also opt out of marketing communications at any time. Contact us at patelmann2705@gmail.com for any privacy-related requests."
          />
        </div>

        {/* Contact */}
        <div className="mt-12 bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-2">Questions?</h2>
          <p className="text-gray-400">
            If you have any questions about this Privacy Policy, please contact
            us at <span className="text-sky-400">patelmann2705@gmail.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const Section = ({ icon: Icon, title, content }) => (
  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 bg-sky-500/20 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-sky-400" />
      </div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
    </div>
    <p className="text-gray-400 leading-relaxed">{content}</p>
  </div>
);

export default Privacy;
