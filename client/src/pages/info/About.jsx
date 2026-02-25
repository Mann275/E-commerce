import React from "react";
import { Store, Heart, Target, Users, Shield, TrendingUp } from "lucide-react";
import BackgroundGlow from "../../components/BackgroundGlow";

const About = () => {
  return (
    <div className="min-h-screen relative pt-20 pb-10">
      {/* Premium Animated Background */}
      <BackgroundGlow />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16rounded-xl flex items-center justify-center mx-auto mb-6">
            <img src="./public/logo.png" alt="🙂" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            About OverClocked
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto transition-colors">
            India's premier multi-seller marketplace where sellers showcase
            their products and buyers discover amazing deals.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white/80 dark:bg-gray-900/40 rounded-2xl p-8 mb-8 border border-sky-900/60 dark:border-sky-800/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.6)] transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">Our Story</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 transition-colors">
            OverClocked was founded with a vision to create a platform that
            connects passionate sellers with enthusiastic buyers. We believe
            that every seller, big or small, deserves a platform to showcase
            their products, and every buyer deserves access to a wide variety of
            products at competitive prices.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors">
            Today, we're proud to be a growing marketplace where multiple
            sellers can set up their virtual stores, list their products, and
            reach customers across India. Whether you're a seller looking to
            expand your reach or a buyer searching for the best deals,
            OverClocked is your destination.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ValueCard
            icon={Target}
            title="Our Mission"
            description="To empower sellers and delight buyers by providing a seamless, secure, and trustworthy marketplace experience."
          />
          <ValueCard
            icon={Heart}
            title="Our Values"
            description="Transparency, fairness, and customer satisfaction are at the core of everything we do."
          />
          <ValueCard
            icon={Users}
            title="Our Community"
            description="A growing network of verified sellers and satisfied customers who trust our platform."
          />
        </div>

        {/* For Sellers & Buyers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-gray-900/40 rounded-2xl p-6 border border-sky-900/60
 dark:border-sky-800/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.6)] transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">For Sellers</h3>
            </div>
            <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-2 transition-colors">
              <li>• Create your own virtual store</li>
              <li>• List and manage your products easily</li>
              <li>• Reach customers across India</li>
              <li>• Track orders and manage inventory</li>
              <li>• Grow your business with us</li>
            </ul>
          </div>
          <div className="bg-white/80 dark:bg-gray-900/40 rounded-2xl p-6 border border-sky-900/60
 dark:border-sky-800/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.6)] transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-sky-500 dark:text-sky-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">For Buyers</h3>
            </div>
            <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-2 transition-colors">
              <li>• Browse products from multiple sellers</li>
              <li>• Compare prices and find best deals</li>
              <li>• Secure payment options</li>
              <li>• Verified seller ratings and reviews</li>
              <li>• Easy returns and buyer protection</li>
            </ul>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white/80 dark:bg-gray-900/40 rounded-2xl p-8 border border-sky-900/60
 dark:border-sky-800/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.6)] transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">Meet Our Team</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-linear-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              MP
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-white font-semibold text-lg transition-colors">Mann Patel</h3>
              <p className="text-sky-500 dark:text-sky-400 transition-colors">Founder & Developer</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">
                Building the future of online marketplace in India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ValueCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white/80 dark:bg-gray-900/40 rounded-xl p-6 border border-sky-900/60
 dark:border-sky-800/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.6)] text-center transition-colors duration-300">
    <div className="w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
      <Icon className="w-6 h-6 text-sky-500 dark:text-sky-400" />
    </div>
    <h3 className="text-gray-900 dark:text-white font-semibold mb-2 transition-colors">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">{description}</p>
  </div>
);

export default About;
