import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Package, Heart, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accesstoken");
    localStorage.removeItem("refreshtoken");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload(); // Force reload to update HomeOrOverview component
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-black to-zinc-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">NexHardware</h1>
              <p className="text-xs text-gray-400">
                Welcome back, {user.firstName}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
            Welcome Back,{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-red-500">
              {user.firstName}!
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Ready to upgrade your gaming setup?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <QuickActionCard
            icon={ShoppingBag}
            title="Browse Products"
            description="Explore our latest hardware"
            gradient="from-purple-500 to-pink-500"
          />
          <QuickActionCard
            icon={Package}
            title="My Orders"
            description="Track your purchases"
            gradient="from-blue-500 to-cyan-500"
          />
          <QuickActionCard
            icon={Heart}
            title="Wishlist"
            description="Saved items"
            gradient="from-orange-500 to-red-500"
          />
          <QuickActionCard
            icon={Settings}
            title="Settings"
            description="Manage your account"
            gradient="from-green-500 to-emerald-500"
          />
        </div>

        {/* User Info Card */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Account Information</CardTitle>
            <CardDescription className="text-gray-400">
              Your account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-gray-400">Name:</span>
              <span className="text-white font-medium">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-gray-400">Email:</span>
              <span className="text-white font-medium">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-gray-400">Role:</span>
              <span className="text-white font-medium capitalize">
                {user.role}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400">Status:</span>
              <span className="text-green-400 font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Verified
              </span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

const QuickActionCard = ({ icon: Icon, title, description, gradient }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 p-6 hover:border-orange-500/30 transition-all duration-300 hover:scale-105 cursor-pointer">
    <div className="relative z-10">
      <div
        className={`w-12 h-12 rounded-full bg-linear-to-r ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-orange-500 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
    <div
      className={`absolute inset-0 bg-linear-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
    />
  </div>
);

export default Home;
