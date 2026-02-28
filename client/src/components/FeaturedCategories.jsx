import React from "react";
import {
  Cpu,
  HardDrive,
  MemoryStick,
  Monitor,
  Fan,
  Container,
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Graphics Cards",
    icon: Monitor,
    desc: "RTX 50-Series & More",
    gradient: "from-pink-500 to-rose-600",
    image:
      "https://res.cloudinary.com/mann2729/image/upload/v1772097424/photo-1727176763565-1d983341bb95_ybcltm.jpg",
  },
  {
    name: "Processors",
    icon: Cpu,
    desc: "Intel & AMD Latest Gen",
    gradient: "from-indigo-700 to-violet-800",
    image:
      "https://res.cloudinary.com/mann2729/image/upload/v1772097435/photo-1555617981-dac3880eac6e_awpznj.jpg",
  },
  {
    name: "RGB Fans",
    icon: Fan,
    desc: "Cooling with RGB Lighting",
    gradient: "from-red-500 via-green-500 to-blue-500",
    image:
      "https://res.cloudinary.com/mann2729/image/upload/v1772097350/photo-1587202372634-32705e3bf49c_xowmty.jpg",
  },
  {
    name: "Motherboards",
    icon: Container,
    desc: "Premium Gaming Boards",
    gradient: "from-orange-500 to-red-600",
    image:
      "https://res.cloudinary.com/mann2729/image/upload/v1772097471/photo-1591799264318-7e6ef8ddb7ea_xipwzf.jpg",
  },
  {
    name: "Memory",
    icon: MemoryStick,
    desc: "DDR5 High Speed RAM",
    gradient: "from-emerald-700 to-green-800",
    image:
      "https://res.cloudinary.com/mann2729/image/upload/v1772097485/photo-1541029071515-84cc54f84dc5_b043r7.jpg",
  },
  {
    name: "Storage",
    icon: HardDrive,
    desc: "NVMe SSDs & HDDs",
    gradient: "from-slate-700 to-slate-900",
    image:
      "https://res.cloudinary.com/mann2729/image/upload/v1772098372/photo-1597138804456-e7dca7f59d54_rmhmlz.jpg",
  },
];

const FeaturedCategories = () => {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 mb-4 transition-colors">
            SHOP BY{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-blue-600">
              CATEGORY
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg transition-colors">
            Explore our premium selection of gaming hardware
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const CategoryCard = ({ category, index }) => {
  const Icon = category.icon;

  return (
    <Link
      to="/products"
      className="group relative overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 hover:border-sky-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-sky-500/20"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-40 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/85 to-gray-900/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8">
        <div
          className={`w-14 h-14 rounded-full bg-linear-to-r ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>

        <h3 className="text-2xl font-bold text-gray-100 mb-2 group-hover:text-sky-400 transition-colors">
          {category.name}
        </h3>

        <p className="text-gray-400 text-sm">{category.desc}</p>

        {/* Hover Arrow */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-sky-400 font-bold text-sm">Explore →</span>
        </div>
      </div>

      {/* Glow Effect */}
      <div
        className={`absolute inset-0 bg-linear-to-r ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`}
      />
    </Link>
  );
};

export default FeaturedCategories;
