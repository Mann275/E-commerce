import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { setUser } from "../redux/userSlice";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Building,
  Hash,
  User as UserIcon,
  Lock,
  Loader2,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

const Profile = () => {
  const params = useParams();
  const { user } = useSelector((store) => store.user);
  const userId = params.userId || user?._id;
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    address: user?.address || "",
    pincode: user?.pincode || "",
    city: user?.city || "",
    profilePic: user?.profilePic || "",
    role: user?.role || "",
    showEmail: user?.showEmail !== false,
    showPhone: user?.showPhone !== false,
  });

  const [file, setFile] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setPasswordLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const accessToken = localStorage.getItem("accesstoken");

      const res = await axios.put(
        `${API_URL}/api/v1/users/change-password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setShowPasswordModal(false);
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const dispatch = useDispatch();
  const handleChange = (e) => {
    setUpdateUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    const imageUrl = URL.createObjectURL(selectedFile);
    setTempImageSrc(imageUrl);
    setShowCropper(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    try {
      const croppedFile = await getCroppedImg(tempImageSrc, croppedAreaPixels);
      setFile(croppedFile);
      setUpdateUser((prev) => ({
        ...prev,
        profilePic: URL.createObjectURL(croppedFile),
      }));
      setShowCropper(false);
      setTempImageSrc(null);
    } catch (e) {
      console.error(e);
      toast.error("Failed to crop image");
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const [hasChanges, setHasChanges] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!user) return;
    const isDifferent =
      updateUser.firstName !== (user.firstName || "") ||
      updateUser.lastName !== (user.lastName || "") ||
      updateUser.phoneNo !== (user.phoneNo || "") ||
      updateUser.address !== (user.address || "") ||
      updateUser.city !== (user.city || "") ||
      updateUser.pincode !== (user.pincode || "") ||
      updateUser.showEmail !== (user.showEmail !== false) ||
      updateUser.showPhone !== (user.showPhone !== false) ||
      file !== null || // New picture uploaded
      updateUser.profilePic === ""; // Picture removed

    setHasChanges(isDifferent);
  }, [updateUser, user, file]);

  const handleRemoveProfilePic = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setUpdateUser((prev) => ({
      ...prev,
      profilePic: "",
    }));
    setImgError(false); // Reset error state when picture is removed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accesstoken");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("pincode", updateUser.pincode);
      formData.append("showEmail", updateUser.showEmail);
      formData.append("showPhone", updateUser.showPhone);
      if (file) {
        formData.append("file", file);
      } else if (updateUser.profilePic === "") {
        formData.append("profilePic", "");
      }
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

      const res = await axios.put(
        `${API_URL}/api/v1/users/update/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message || "Profile updated successfully");
        dispatch(setUser(res.data.user));
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setImgError(false); // Reset error state on successful update
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] pt-24 pb-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account details and preferences.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
        >
          {/* Left Column: Profile Picture */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-[#111] rounded-3xl p-6 shadow-xs border border-blue-400 dark:border-neutral-800 flex flex-col items-center justify-center space-y-4">
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white dark:border-neutral-800 shadow-md">
                  {updateUser?.profilePic && !imgError ? (
                    <img
                      src={updateUser?.profilePic}
                      alt="Profile"
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white text-5xl md:text-7xl font-black shadow-inner shadow-black/20 tracking-tighter">
                      {updateUser.firstName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-105"
                  title="Change Profile Picture"
                >
                  <Camera className="w-5 h-5" />
                </button>
                {updateUser.profilePic && (
                  <button
                    type="button"
                    onClick={handleRemoveProfilePic}
                    className="absolute top-0 right-0 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-transform hover:scale-105"
                    title="Remove Profile Picture"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden"
                />
              </div>
              <div className="text-center mt-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white capitalize">
                  {updateUser.firstName} {updateUser.lastName}
                </h3>
                <p className={`text-sm tracking-widest font-bold uppercase mt-1 ${updateUser.role === 'seller' ? 'text-emerald-500 [text-shadow:0_0_12px_rgba(16,185,129,0.8)]' : 'text-sky-500 [text-shadow:0_0_12px_rgba(14,165,233,0.8)]'}`}>
                  {updateUser.role}
                </p>
              </div>
            </div>
          </div>

          {/* Middle Column: Basic Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#111] rounded-3xl p-6 shadow-xs border border-blue-400 dark:border-neutral-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-blue-500" /> Basic Information
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={updateUser.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-blue-400 dark:border-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={updateUser.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-blue-400 dark:border-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    {user?.role === "seller" && (
                      <button
                        type="button"
                        onClick={() => setUpdateUser(prev => ({ ...prev, showEmail: !prev.showEmail }))}
                        className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        {updateUser.showEmail ? <><Eye size={14} /> Public</> : <><EyeOff size={14} /> Hidden</>}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={updateUser.email}
                      disabled
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-neutral-800/50 border border-blue-400 dark:border-neutral-800 text-gray-500 dark:text-gray-400 cursor-not-allowed outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed directly.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-blue-400 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gray-50 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 border border-blue-400 dark:border-neutral-700 text-gray-700 dark:text-gray-300 font-medium transition-colors cursor-pointer"
                  >
                    <Lock className="w-4 h-4" /> Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Additional Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#111] rounded-3xl p-6 shadow-xs border border-blue-400 dark:border-neutral-800 flex flex-col h-full">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" /> Contact Details
              </h3>

              <div className="space-y-4 flex-1">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone Number
                    </label>
                    {user?.role === "seller" && (
                      <button
                        type="button"
                        onClick={() => setUpdateUser(prev => ({ ...prev, showPhone: !prev.showPhone }))}
                        className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        {updateUser.showPhone ? <><Eye size={14} /> Public</> : <><EyeOff size={14} /> Hidden</>}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phoneNo"
                      value={updateUser.phoneNo}
                      onChange={handleChange}
                      placeholder="+91 0000000000"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-blue-400 dark:border-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Street Address
                  </label>
                  <textarea
                    name="address"
                    value={updateUser.address}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Enter your full address"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-blue-400 dark:border-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      City
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="city"
                        value={updateUser.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-blue-400 dark:border-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Pincode
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="pincode"
                        value={updateUser.pincode}
                        onChange={handleChange}
                        placeholder="Pincode"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-blue-400 dark:border-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Complete Form Area with Centered Button */}
          <div className="col-span-1 lg:col-span-12 flex justify-center mt-8">
            <button
              type="submit"
              disabled={loading || !hasChanges}
              className="w-full md:w-1/3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-10 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 md:mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Cropper Modal */}
      {showCropper && tempImageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-blue-400/30 dark:border-neutral-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Profile Picture</h3>

            <div className="relative w-full h-64 bg-black rounded-xl overflow-hidden mb-6 touch-none block">
              <Cropper
                image={tempImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                restrictPosition={false}
              />
            </div>

            <div className="mb-6 space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-between">
                <span>Zoom</span>
                <span>{Math.round(zoom * 100)}%</span>
              </label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-700"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCropCancel}
                className="flex-1 py-3 px-4 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCropSave}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 cursor-pointer"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white/90 dark:bg-[#111111]/90 backdrop-blur-3xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-blue-400/30 dark:border-neutral-800 animate-in fade-in zoom-in duration-300">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Change Password</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Update your account security parameters.</p>

            <form onSubmit={submitPasswordChange} className="space-y-4">
              {/* Old Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showOldPass ? "text" : "password"}
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-blue-200 dark:border-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showNewPass ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-blue-200 dark:border-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-blue-200 dark:border-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
                  }}
                  className="flex-1 py-3 px-4 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 py-3 px-4 flex items-center justify-center rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {passwordLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
