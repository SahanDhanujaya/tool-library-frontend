import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Lock, Bell, Shield, 
  Camera, MapPin, Save,
  Trash2, ArrowLeft,
  Globe, Smartphone, CreditCard
} from 'lucide-react';

const UserSettings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'account'>('profile');

  // Mock User Data
  const [profile, setProfile] = useState({
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    bio: 'DIY enthusiast and weekend gardener. Happy to share my power tools with responsible neighbors!',
    location: 'West Village, NY',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=0D8ABC&color=fff'
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'account', label: 'Account', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Sticky Header with Back Button */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
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
          
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-72 space-y-8">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Settings</h1>
                <p className="text-slate-500 text-sm">Manage your profile and preferences.</p>
            </div>

            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                    activeTab === tab.id 
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 scale-[1.02]' 
                      : 'text-slate-500 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>
                  {activeTab === tab.id && <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />}
                </button>
              ))}
            </nav>

            {/* Trust Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[2rem] text-white shadow-lg shadow-blue-100">
               <Shield className="w-8 h-8 mb-4 opacity-50" />
               <p className="font-bold text-lg mb-1">Trust Score: 98</p>
               <p className="text-blue-100 text-xs leading-relaxed mb-4">Your high score helps you borrow tools faster!</p>
               <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-white w-[98%] h-full" />
               </div>
            </div>
          </aside>

          {/* Content Window */}
          <div className="flex-1">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
                    <div className="relative group">
                      <img src={profile.avatar} alt="Profile" className="w-32 h-32 rounded-[2.5rem] object-cover ring-8 ring-slate-50 shadow-inner" />
                      <button className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-xl hover:bg-blue-700 hover:scale-110 transition-all">
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-2xl font-black text-slate-900">Public Profile</h3>
                      <p className="text-slate-500">This information will be visible to other neighbors.</p>
                    </div>
                  </div>

                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Display Name</label>
                        <input type="text" value={profile.name} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 px-6 font-semibold outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input type="text" value={profile.location} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 pl-14 pr-6 font-semibold outline-none transition-all" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Your Bio</label>
                      <textarea rows={4} value={profile.bio} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 px-6 font-semibold outline-none transition-all resize-none" />
                    </div>

                    <div className="pt-4">
                      <button className="flex items-center space-x-2 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-95">
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </form>
                </section>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                  <h3 className="text-2xl font-black text-slate-900 mb-8">Login & Security</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Two-Factor Authentication</p>
                          <p className="text-sm text-slate-500">Active via SMS (Ends in ••42)</p>
                        </div>
                      </div>
                      <button className="text-sm font-black text-blue-600 hover:underline">Manage</button>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                          <Globe className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Browser Sessions</p>
                          <p className="text-sm text-slate-500">Currently active in New York, USA</p>
                        </div>
                      </div>
                      <button className="text-sm font-black text-blue-600 hover:underline">Log out all</button>
                    </div>
                  </div>

                  <div className="mt-10 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900">Delete Account</h4>
                      <p className="text-sm text-slate-500">Permanently remove all your tool data and history.</p>
                    </div>
                    <button className="flex items-center space-x-2 text-red-600 border-2 border-red-50 px-6 py-3 rounded-2xl font-black text-sm hover:bg-red-50 transition-all">
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Forever</span>
                    </button>
                  </div>
                </section>
              </div>
            )}

            {/* ACCOUNT/CREDIT TAB */}
            {activeTab === 'account' && (
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Account Billing</h3>
                <p className="text-slate-500 mb-8">Manage your platform fees and earnings from shares.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 rounded-3xl bg-slate-900 text-white">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Balance</p>
                    <p className="text-3xl font-black">$45.00</p>
                  </div>
                  <div className="p-6 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                    <button className="text-sm font-bold text-slate-400 hover:text-blue-600 flex items-center">
                      <Plus className="w-4 h-4 mr-2" /> Add Payout Method
                    </button>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Plus icon for the account tab
const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
  </svg>
);

export default UserSettings;