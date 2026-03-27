import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Bell,
  Shield,
  Camera,
  MapPin,
  Save,
  Trash2,
  ArrowLeft,
  Globe,
  CreditCard,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
  Package,
  Edit3,
} from "lucide-react";
import axios from "axios";
import type { User as UserType } from "../../types/user";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import type { Tool } from "../../types/tool";

const UserSettings: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, saveUser } = useAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const loggedInUser: UserType = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : user;

  const [activeTab, setActiveTab] = useState<
    "profile" | "items" | "security" | "notifications" | "account"
  >("profile");
  const [loading, setLoading] = useState(false);
  const [userTools, setUserTools] = useState<Tool[]>([]); // State for listed items
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Initialize state from AuthContext
  const [profile, setProfile] = useState<Partial<UserType>>({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    residency: user?.residency || "",
    picture:
      user?.picture ||
      `https://ui-images.com/api/?name=${user?.name || "User"}&background=0D8ABC&color=fff`,
    phone: user?.phone || "",
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    {
      id: "items",
      label: "Listed Items",
      icon: <Package className="w-4 h-4" />,
    }, // New Tab
    {
      id: "account",
      label: "Account",
      icon: <CreditCard className="w-4 h-4" />,
    },
    { id: "security", label: "Security", icon: <Lock className="w-4 h-4" /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    if (status.type) setStatus({ type: null, message: "" });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/users/${loggedInUser.email}`,
        profile,
      );

      if (response.status === 200) {
        saveUser(response.data); // Sync global state
        setStatus({
          type: "success",
          message: "Profile updated successfully!",
        });
      }
    } catch (err: any) {
      setStatus({
        type: "error",
        message:
          err.response?.data?.message ||
          "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/v1/users/${loggedInUser?.email}/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.status === 200) {
        getUserProfile();
      }
      toast.success("Profile picture updated!");
      setStatus({ type: "success", message: "Profile picture updated!" });
    } catch (err) {
      toast.error("Image upload failed. Please try again.");
      setStatus({ type: "error", message: "Image upload failed." });
    } finally {
      setLoading(false);
    }
  };

  // Logic unchanged as requested
  const getUserProfile = async () => {
    try {
      const profilePic = await axios.get(
        `${BASE_URL}/api/v1/users/${loggedInUser?.email}/get-image`,
        {
          responseType: "blob",
        },
      );
      const imageUrl = URL.createObjectURL(profilePic.data);
      setProfile({ ...loggedInUser, picture: imageUrl });
    } catch (err) {
      toast.error("Failed to load profile picture.");
    }
  };

  // Fetch tools listed by user
  const fetchUserTools = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/tools/user/${loggedInUser.email}`,
      );

      if (res.data && res.data.store) {
        const toolsWithImages = await Promise.all(
          res.data.store.map(async (tool: Tool) => {
            try {
              const imageRes = await axios.get(
                `${BASE_URL}/api/v1/tools/${tool.id}/tool-image`,
                { responseType: "blob" },
              );

              const imageUrl = URL.createObjectURL(imageRes.data);
              return { ...tool, image: imageUrl };
            } catch (error) {
              console.error(`Failed to load image for tool ${tool.id}`, error);
              return { ...tool, image: null };
            }
          }),
        );

        setUserTools(toolsWithImages);
      }
    } catch (err) {
      console.error("Error fetching items", err);
      toast.error("Could not load your listed items.");
    }
  };

  useEffect(() => {
    getUserProfile();
    fetchUserTools();
  }, []);

  async function handleDelete(id: number | undefined) {
    toast(
      (t) => (
        <span>
          Are you sure you want to delete this tool?
          <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
            <button
              onClick={() => {
                confirmDelete(id); // Call your actual delete function
                toast.dismiss(t.id); // Close the toast
              }}
              style={{
                background: "#ff4b4b",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Yes, Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                background: "#eee",
                color: "#333",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </span>
      ),
      {
        duration: Infinity, // Don't let it disappear until they click
        position: "top-center",
      },
    );
  }
  const confirmDelete = async (id: number | undefined) => {
     if (id) {
      await axios.delete(`${BASE_URL}/api/v1/tools/${id}`).then(() => {
        toast.success("Item deleted successfully!");
        fetchUserTools();
      });
    } else {
      toast.error("Invalid item ID. Cannot delete.");
    }
  }
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sticky Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/tools')}
            className="group flex items-center text-slate-500 hover:text-slate-900 font-bold transition-all"
          >
            <div className="p-2 rounded-lg group-hover:bg-slate-100 mr-2 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
            Back
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">
              Verified Member
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-8">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                Settings
              </h1>
              <p className="text-slate-500 text-sm">
                Manage your profile and listed items.
              </p>
            </div>

            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                    activeTab === tab.id
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-200 scale-[1.02]"
                      : "text-slate-500 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>
                  {activeTab === tab.id && (
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                  )}
                </button>
              ))}
            </nav>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[2rem] text-white shadow-lg shadow-blue-100">
              <Shield className="w-8 h-8 mb-4 opacity-50" />
              <p className="font-bold text-lg mb-1">Trust Score: 98</p>
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div className="bg-white w-[98%] h-full" />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {status.message && (
              <div
                className={`mb-6 p-4 rounded-2xl flex items-center space-x-3 animate-in fade-in slide-in-from-top-2 ${
                  status.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <p className="font-bold text-sm">{status.message}</p>
              </div>
            )}

            {activeTab === "profile" && (
              <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm animate-in fade-in slide-in-from-right-4">
                <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
                  <div
                    className="relative group cursor-pointer"
                    onClick={handleImageClick}
                  >
                    <img
                      src={profile.picture}
                      alt="Profile"
                      className="w-32 h-32 rounded-[2.5rem] object-cover ring-8 ring-slate-50 shadow-inner group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white w-8 h-8" />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-2xl font-black text-slate-900">
                      Public Profile
                    </h3>
                    <p className="text-slate-500 text-sm">
                      Update your identity on the ToolShare network.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleSaveProfile}
                  className="space-y-6 text-gray-500"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                        Display Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          name="name"
                          type="text"
                          value={profile.name}
                          onChange={handleChange}
                          className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 pl-14 pr-6  font-semibold outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          name="residency"
                          type="text"
                          value={profile.residency}
                          onChange={handleChange}
                          className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 pl-14 pr-6 font-semibold outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 pl-14 pr-6 font-semibold outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                      Your Bio
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-5 top-5 text-slate-400 w-5 h-5" />
                      <textarea
                        name="bio"
                        rows={4}
                        value={profile.bio}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 pl-14 pr-6 font-semibold outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  <button
                    disabled={loading}
                    type="submit"
                    className="flex items-center space-x-2 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    <span>{loading ? "Saving..." : "Save Changes"}</span>
                  </button>
                </form>
              </section>
            )}

            {/* New Listed Items Tab Content */}
            {activeTab === "items" && (
              <section className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">
                      Your Shared Gear
                    </h3>
                    <p className="text-slate-500 text-sm">
                      Manage and update the items you've listed.
                    </p>
                  </div>
                </div>

                {userTools.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userTools.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-slate-100 rounded-3xl overflow-hidden group hover:shadow-xl transition-all"
                      >
                        <div className="h-40 bg-slate-100 relative">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="p-6">
                          <h4 className="font-bold text-slate-900 mb-1">
                            {item.title}
                          </h4>
                          <p className="text-slate-500 text-xs mb-4 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/edit-tool/${item.id}`)}
                              className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" /> Update
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(item.id);
                              }}
                              className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-200">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">
                      No items listed yet
                    </h3>
                    <p className="text-slate-500">
                      Items you list for sharing will appear here.
                    </p>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;

