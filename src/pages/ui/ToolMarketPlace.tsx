import { useEffect, useState } from 'react';
import { 
  Box, Search, Filter, MapPin, 
  Star, ChevronRight, Plus 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { Tool } from '../../types/tool';

const BASE_URL = "http://localhost:8000";

const ToolMarketplace = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]); // State for filtered results
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ['All', 'Power Tools', 'Gardening', 'Cleaning', 'Hand Tools', 'Ladders'];

  const fetchTools = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/v1/tools`);
      
      const toolsWithImages = response.data.store.map((tool: Tool) => ({
        ...tool,
        image: `${BASE_URL}/api/v1/tools/${tool.id}/tool-image`
      }));

      setTools(toolsWithImages);
      setFilteredTools(toolsWithImages); // Initialize filtered tools
    } catch (error) {
      console.error("Error fetching tools:", error);
      toast.error("Failed to load tools.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  // 2. Filter Logic: Runs whenever searchQuery or selectedCategory changes
  useEffect(() => {
    let result = tools;

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(tool => tool.category === selectedCategory);
    }

    // Filter by Search Query (Title or Description)
    if (searchQuery) {
      result = result.filter(tool => 
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTools(result);
  }, [searchQuery, selectedCategory, tools]);

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
        
        {/* Dynamic Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools by name or description..." 
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
             <Link to="/settings">
              <img src="https://ui-avatars.com/api/?name=User&background=random" alt="Profile" />
             </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar - Dynamic Categories */}
        <aside className="space-y-6 hidden lg:block">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <Filter className="w-4 h-4 mr-2 text-blue-600" /> Categories
            </h3>
            <ul className="space-y-3">
              {categories.map(cat => (
                <li 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-sm font-medium flex justify-between cursor-pointer transition-colors ${
                    selectedCategory === cat ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-blue-400'
                  }`}
                >
                  {cat} 
                  {selectedCategory === cat && <span className="text-blue-600">●</span>}
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
            <h2 className="text-2xl font-bold text-slate-800">
              {selectedCategory === "All" ? "Available Near You" : `${selectedCategory} Near You`}
            </h2>
            <Link to="/list-tool" className="flex items-center space-x-2 text-blue-600 font-semibold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              <span>List a Tool</span>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-400">Loading tools...</div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400">No tools found matching your criteria.</p>
              <button onClick={() => {setSearchQuery(""); setSelectedCategory("All");}} className="text-blue-600 text-sm mt-2 font-bold">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <div key={tool.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden bg-slate-200">
                    <img 
                      src={tool.image} 
                      alt={tool.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                    />
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${
                      tool.availability ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                    }`}>
                      {tool.availability ? 'Available' : 'Borrowed'}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-800 line-clamp-1">{tool.title}</h3>
                      <div className="flex items-center text-amber-500 text-sm font-bold">
                        <Star className="w-3 h-3 fill-current mr-1" /> 5.0
                      </div>
                    </div>
                    
                    <div className="flex items-center text-slate-400 text-xs mb-4">
                      <MapPin className="w-3 h-3 mr-1" /> {tool.location || 'Local'} • {tool.category}
                    </div>

                    <p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10 italic">
                      {tool.description}
                    </p>

                    <button onClick={() => navigate(`/borrow/${tool.id}`)} className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                      tool.availability 
                      ? 'bg-slate-900 text-white hover:bg-blue-600' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}>
                      {tool.availability ? `Borrow for $${tool.price}` : 'Join Waitlist'}
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ToolMarketplace;