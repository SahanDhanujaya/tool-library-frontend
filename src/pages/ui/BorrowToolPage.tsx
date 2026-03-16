import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Star, ShieldCheck, 
  Calendar, MessageSquare, 
  AlertCircle, ChevronRight, Info
} from 'lucide-react';

const BorrowToolPage = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const tool = {
    id: toolId,
    name: 'DeWalt Cordless Drill',
    pricePerDay: 15, // Added price
    category: 'Power Tools',
    owner: 'Mike R.',
    ownerRating: 4.9,
    ownerTotalShares: 24,
    rating: 4.8,
    reviews: 12,
    location: 'West Village, NY (0.4 miles away)',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800',
    description: 'Professional grade 20V Max drill. Lightweight and compact for working in tight spaces. Includes 2Ah battery and fast charger.',
    requirements: ['Verified Identity', 'Trust Score > 80', 'Basic tool handling knowledge']
  };

  // Logic to calculate total price
  const totalCost = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return diffDays * tool.pricePerDay;
  }, [startDate, endDate]);

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Request sent! Total cost: $${totalCost}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center text-slate-600 hover:text-blue-600 font-medium transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          {/* Added Price in Header */}
          <div className="font-bold text-slate-900">
            ${tool.pricePerDay}<span className="text-slate-400 text-sm font-normal"> / day</span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <section>
              <img 
                src={tool.image} 
                alt={tool.name} 
                className="w-full h-[400px] object-cover rounded-[2.5rem] shadow-lg border-4 border-white" 
              />
            </section>

            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 mb-2">{tool.name}</h1>
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <div className="flex items-center"><Star className="w-4 h-4 text-amber-500 fill-current mr-1" /> {tool.rating} ({tool.reviews} reviews)</div>
                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {tool.location}</div>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                  {tool.status}
                </span>
              </div>

              <p className="text-slate-600 leading-relaxed mb-8">
                {tool.description}
              </p>

              <div className="border-t border-slate-100 pt-8">
                <h3 className="font-bold text-slate-900 mb-4">Borrowing Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tool.requirements.map((req, i) => (
                    <div key={i} className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-xl border-2 border-white shadow-sm">
                  {tool.owner[0]}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Owned by {tool.owner}</h4>
                  <p className="text-xs text-slate-500">{tool.ownerTotalShares} successful shares • {tool.ownerRating} rating</p>
                </div>
              </div>
              <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-600 transition-all">
                <MessageSquare className="w-5 h-5" />
              </button>
            </section>
          </div>

          <aside className="lg:col-start-3">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 sticky top-24">
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-bold text-slate-900">Select Dates</h3>
                <div className="text-right">
                    <span className="block text-2xl font-black text-slate-900">${tool.pricePerDay}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">per day</span>
                </div>
              </div>
              
              <form onSubmit={handleRequest} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Pickup Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="date" 
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Return Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="date" 
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Price Summary Calculation Display */}
                {totalCost > 0 && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>Total for {totalCost / tool.pricePerDay} days</span>
                            <span className="font-bold text-slate-900">${totalCost}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>Service Fee</span>
                            <span className="font-bold text-slate-900">$0.00</span>
                        </div>
                        <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900">
                            <span>Total</span>
                            <span>${totalCost}</span>
                        </div>
                    </div>
                )}

                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                    <p className="text-[13px] text-blue-800 leading-tight">
                      By requesting, you agree to return the tool in its original condition.
                    </p>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white py-5 rounded-[1.25rem] font-black text-lg hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center justify-center group"
                >
                  Send Request
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <p className="text-center text-slate-400 text-xs mt-6">
                Owners typically respond within <span className="text-slate-900 font-bold">2 hours</span>
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default BorrowToolPage;