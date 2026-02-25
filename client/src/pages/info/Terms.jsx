import React from "react";
import BackgroundGlow from "../../components/BackgroundGlow";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen relative pt-20 pb-10">
      {/* Premium Animated Background */}
      <BackgroundGlow />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-linear-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors">Last updated: February 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <TermSection
            number="1"
            title="Acceptance of Terms"
            content="By accessing and using OverClocked, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services."
          />

          <TermSection
            number="2"
            title="User Accounts"
            content="You can register as a Buyer or Seller on our platform. You are responsible for maintaining the confidentiality of your account and password. You agree to provide accurate and complete information during registration."
          />

          <TermSection
            number="3"
            title="Seller Terms"
            content="Sellers can list products on our marketplace. Sellers are responsible for product quality, accurate descriptions, pricing, and timely delivery. Sellers must comply with all applicable laws and regulations. OverClocked reserves the right to suspend or remove seller accounts that violate these terms."
          />

          <TermSection
            number="4"
            title="Buyer Terms"
            content="Buyers can browse and purchase products from various sellers. By placing an order, you represent that the information provided is accurate and that you are authorized to use the payment method. Buyers agree to provide honest reviews and ratings."
          />

          <TermSection
            number="5"
            title="Products and Pricing"
            content="Product prices are set by individual sellers. All prices are subject to change without notice. Product images and descriptions are provided by sellers. OverClocked is not responsible for inaccuracies in seller-provided content."
          />

          <TermSection
            number="6"
            title="Orders and Payment"
            content="Orders are fulfilled by respective sellers. Payment is processed securely through our platform. We reserve the right to refuse or cancel any order due to stock unavailability, pricing errors, or suspected fraud."
          />

          <TermSection
            number="7"
            title="Shipping and Delivery"
            content="Delivery times are estimates provided by sellers and may vary. Risk of loss and title for items pass to you upon delivery. Shipping costs are determined by individual sellers and are non-refundable unless the return is due to seller error."
          />

          <TermSection
            number="8"
            title="Returns and Refunds"
            content="Returns and refunds are handled according to each seller's return policy. Generally, items can be returned within 7 days of delivery in original condition. Disputes between buyers and sellers can be escalated to OverClocked for resolution."
          />

          <TermSection
            number="9"
            title="Platform Fees"
            content="OverClocked may charge sellers a commission or fee for using the platform. Fee structure will be communicated to sellers during registration and is subject to change with prior notice."
          />

          <TermSection
            number="10"
            title="Limitation of Liability"
            content="OverClocked acts as a marketplace platform connecting buyers and sellers. We are not liable for the quality, safety, or legality of products listed by sellers. Our liability is limited to the transaction value in question."
          />

          <TermSection
            number="11"
            title="Governing Law"
            content="These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Gujarat, India."
          />
        </div>

        {/* Contact */}
        <div className="mt-12 bg-white/80 dark:bg-gray-900/40 rounded-2xl p-6 border border-sky-900/60
 dark:border-sky-800/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.6)] transition-colors duration-300">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Questions?</h2>
          <p className="text-gray-600 dark:text-gray-400 transition-colors">
            If you have any questions about these Terms, please contact us at{" "}
            <span className="text-sky-500 dark:text-sky-400">patelmann2705@gmail.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const TermSection = ({ number, title, content }) => (
  <div className="bg-white/80 dark:bg-gray-900/40 rounded-xl p-6 border border-sky-900/60
 dark:border-sky-800/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.6)] transition-colors duration-300">
    <div className="flex items-start gap-4">
      <span className="w-8 h-8 bg-linear-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
        {number}
      </span>
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 transition-colors">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm transition-colors">{content}</p>
      </div>
    </div>
  </div>
);

export default Terms;
