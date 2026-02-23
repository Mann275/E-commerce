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
    desc: "RTX 40-Series & More",
    gradient: "from-purple-500 to-pink-500",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&auto=format&fit=crop&q=60",
  },
  {
    name: "Processors",
    icon: Cpu,
    desc: "Intel & AMD Latest Gen",
    gradient: "from-blue-500 to-cyan-500",
    image:
      "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&auto=format&fit=crop&q=60",
  },
  {
    name: "Memory",
    icon: MemoryStick,
    desc: "DDR5 High Speed RAM",
    gradient: "from-green-500 to-emerald-500",
    image:
      "https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&auto=format&fit=crop&q=60",
  },
  {
    name: "Storage",
    icon: HardDrive,
    desc: "NVMe SSDs & HDDs",
    gradient: "from-orange-500 to-red-500",
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&auto=format&fit=crop&q=60",
  },
  {
    name: "RGB Fans",
    icon: Fan,
    desc: "Cooling with RGB Lighting",
    gradient: "from-cyan-500 to-blue-500",
    image:
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&auto=format&fit=crop&q=60",
  },
  {
    name: "Motherboards",
    icon: Container,
    desc: "Premium Gaming Boards",
    gradient: "from-pink-500 to-rose-500",
    image:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&auto=format&fit=crop&q=60",
  },
];

const FeaturedCategories = () => {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            SHOP BY{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-red-500">
              CATEGORY
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
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
      className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 hover:border-orange-500/20 transition-all duration-300 hover:scale-105"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8">
        <div
          className={`w-14 h-14 rounded-full bg-linear-to-r ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">
          {category.name}
        </h3>

        <p className="text-gray-400 text-sm">{category.desc}</p>

        {/* Hover Arrow */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-orange-500 font-bold text-sm">Explore →</span>
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
