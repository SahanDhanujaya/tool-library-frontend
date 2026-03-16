import { useState } from 'react';
import { 
  Box, Search, Filter, MapPin, 
  Star, ChevronRight, Plus 
} from 'lucide-react';

const ToolMarketplace = () => {
  // Mock data to represent your "Inventory Service"
  const [tools] = useState([
    { id: 1, name: 'DeWalt Cordless Drill', category: 'Power Tools', owner: 'Mike R.', rating: 4.8, status: 'Available', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=200' },
    { id: 2, name: 'Extendable Ladder (20ft)', category: 'Home Repair', owner: 'Sarah J.', rating: 5.0, status: 'Borrowed', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=200' },
    { id: 3, name: 'Leaf Blower', category: 'Gardening', owner: 'Alex B.', rating: 4.5, status: 'Available', image: 'https://images.unsplash.com/photo-1590105577767-e21a46b5394b?auto=format&fit=crop&q=80&w=200' },
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg shadow-md shadow-blue-100">
            <Box className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">ToolShare</span>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tools in West Village..." 
              className="w-full bg-slate-100 border-none rounded-xl py-2 pl-10 focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Trust</p>
            <p className="text-sm font-bold text-blue-600">98 pts</p>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden">
             <img src="https://ui-avatars.com/api/?name=User&background=random" alt="Profile" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar - Filters & Trust */}
        <aside className="space-y-6 hidden lg:block">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <Filter className="w-4 h-4 mr-2 text-blue-600" /> Categories
            </h3>
            <ul className="space-y-3">
              {['Power Tools', 'Gardening', 'Cleaning', 'Hand Tools', 'Ladders'].map(cat => (
                <li key={cat} className="text-slate-500 hover:text-blue-600 cursor-pointer text-sm font-medium flex justify-between">
                  {cat} <span className="text-slate-300 italic font-normal">→</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
            <h3 className="font-bold mb-1">Community Spirit</h3>
            <p className="text-blue-100 text-xs mb-4">You've saved neighbors $120 this month!</p>
            <button className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-semibold transition-colors">
              View My Impact
            </button>
          </div>
        </aside>

        {/* Main Feed */}
        <section className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">Available Near You</h2>
            <button className="flex items-center space-x-2 text-blue-600 font-semibold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              <span>List a Tool</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div key={tool.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={tool.image} 
                    alt={tool.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${
                    tool.status === 'Available' ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                  }`}>
                    {tool.status}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 line-clamp-1">{tool.name}</h3>
                    <div className="flex items-center text-amber-500 text-sm font-bold">
                      <Star className="w-3 h-3 fill-current mr-1" /> {tool.rating}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-slate-400 text-xs mb-4">
                    <MapPin className="w-3 h-3 mr-1" /> 0.4 miles away • {tool.owner}
                  </div>

                  <button className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                    tool.status === 'Available' 
                    ? 'bg-slate-900 text-white hover:bg-blue-600' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}>
                    {tool.status === 'Available' ? 'Borrow Now' : 'Join Waitlist'}
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ToolMarketplace;