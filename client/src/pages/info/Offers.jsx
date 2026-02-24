import React from "react";
import { Gift, Clock, Tag } from "lucide-react";

const Offers = () => {
  const offers = [
    {
      title: "New User Special",
      description: "Get 10% off on your first order! Use code: WELCOME10",
      discount: "10% OFF",
      validUntil: "Valid for new users only",
    },
    {
      title: "Bundle Deal",
      description: "Buy CPU + GPU together and save up to 15%",
      discount: "15% OFF",
      validUntil: "Limited time offer",
    },
    {
      title: "Weekend Flash Sale",
      description: "Every weekend, exclusive deals on selected items",
      discount: "Up to 30% OFF",
      validUntil: "Every Sat & Sun",
    },
    {
      title: "Free Shipping",
      description: "Free shipping on orders above Rs. 5,000",
      discount: "FREE",
      validUntil: "All India delivery",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-linear-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Offer Zone</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Exclusive deals and discounts on your favorite gaming hardware!
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-sky-500/50 transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center">
                  <Tag className="w-6 h-6 text-sky-400" />
                </div>
                <span className="bg-linear-to-r from-sky-500 to-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {offer.discount}
                </span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-sky-400 transition-colors">
                {offer.title}
              </h3>
              <p className="text-gray-400 text-sm mb-3">{offer.description}</p>
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Clock className="w-3 h-3" />
                <span>{offer.validUntil}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 bg-linear-to-br from-sky-500/20 to-blue-600/20 rounded-2xl p-8 border border-sky-500/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Don't miss out!
          </h2>
          <p className="text-gray-400 mb-4">
            Subscribe to get notified about exclusive offers
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
            />
            <button className="bg-linear-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;
