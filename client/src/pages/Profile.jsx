import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Camera, Mail, Phone, MapPin, Building, Hash, User as UserIcon, Lock, Loader2, Save } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "../redux/userSlice";

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    address: user?.address || "",
    city: user?.city || "",
    pincode: user?.pincode || "",
  });

  const [profilePic, setProfilePic] = useState(user?.profilePic || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNo: user.phoneNo || "",
        address: user.address || "",
        city: user.city || "",
        pincode: user.pincode || "",
      });
      if (user.profilePic) {
        setProfilePic(user.profilePic);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accessToken = localStorage.getItem("accesstoken");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

      const res = await axios.put(
        `${API_URL}/api/v1/users/update-profile`,
        { ...formData, profilePic },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Profile updated successfully");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] pt-24 pb-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account details and preferences.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Profile Picture */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-[#111] rounded-3xl p-6 shadow-xs border border-blue-500 dark:border-neutral-800 flex flex-col items-center justify-center space-y-4">
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white dark:border-neutral-800 shadow-md">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                      {formData.firstName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-105"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden"
                />
              </div>
              <div className="text-center mt-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white capitalize">{formData.firstName} {formData.lastName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Middle Column: Basic Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#111] rounded-3xl p-6 shadow-xs border border-gray-100 dark:border-neutral-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-blue-500" /> Basic Information
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-800 text-gray-500 dark:text-gray-400 cursor-not-allowed outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed directly.</p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-neutral-800">
                  <Link
                    to="/forgot-password"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gray-50 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 font-medium transition-colors"
                  >
                    <Lock className="w-4 h-4" /> Change Password
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Additional Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#111] rounded-3xl p-6 shadow-xs border border-gray-100 dark:border-neutral-800 flex flex-col h-full">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" /> Contact Details
              </h3>

              <div className="space-y-4 flex-1">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phoneNo"
                      value={formData.phoneNo}
                      onChange={handleChange}
                      placeholder="+91 0000000000"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Street Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Enter your full address"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pincode</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="Pincode"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-neutral-800">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
