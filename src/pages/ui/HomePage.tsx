import { useRef } from 'react';
import { 
  MapPin, ShieldCheck, Users, 
  ArrowRight, Share2, Search, Zap 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ContactPage from './ContactPage';

const HomePage = () => {
  // 1. Create a Ref for the How It Works section
  const howItWorksRef = useRef<HTMLDivElement>(null);

  // 2. Handler for internal Hero button scroll
  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative px-6 pt-4 pb-24 lg:pt-8 lg:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold mb-6">
              <Zap className="w-4 h-4" />
              <span>Join 500+ neighbors in West Village</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
              Don't buy it. <br />
              <span className="text-blue-600 italic">Borrow it.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-lg">
              ToolShare connects you with neighbors to share power tools, gardening gear, and home equipment. Save money, reduce waste, and build community.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/tools" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-center">
                Browse Marketplace
              </Link>
              {/* 3. Updated this button to use the scroller */}
              <button 
                onClick={scrollToHowItWorks}
                className="px-8 py-4 bg-slate-100 text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-200 transition-all text-center"
              >
                Learn More
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
               <img 
                src="https://images.unsplash.com/photo-1581141849291-1125c7b692b5?auto=format&fit=crop&q=80&w=800" 
                alt="Community Workshop" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl">
                 <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-900">DeWalt Drill Combo</p>
                        <p className="text-xs text-slate-500">Available 400m away</p>
                    </div>
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest">FREE</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS - Attached the Ref and ID here */}
      <section 
        ref={howItWorksRef} 
        id='how-it-works' 
        className="bg-slate-50 py-24 px-6"
      >
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How ToolShare Works</h2>
          <p className="text-slate-500">Three simple steps to start saving and sharing.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: <Search className="w-8 h-8 text-blue-600" />,
              title: "Find what you need",
              desc: "Search for specific tools in your neighborhood using our verified map."
            },
            {
              icon: <Share2 className="w-8 h-8 text-purple-600" />,
              title: "Request & Borrow",
              desc: "Message the owner, agree on a time, and pick up the tool. All for free or a small fee."
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
              title: "Safe & Insured",
              desc: "Every loan is backed by our Trust Score system and community guarantees."
            }
          ].map((step, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-2 transition-transform">
              <div className="mb-6">{step.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TRUST SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="bg-blue-600 rounded-[3rem] p-12 lg:p-20 text-white flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6">Built on Neighborly Trust</h2>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <div className="bg-white/20 p-2 rounded-lg"><Users className="w-6 h-6" /></div>
                <div>
                  <h4 className="font-bold">Verified Identities</h4>
                  <p className="text-blue-100 text-sm">Every member is verified via local address confirmation.</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="bg-white/20 p-2 rounded-lg"><MapPin className="w-6 h-6" /></div>
                <div>
                  <h4 className="font-bold">Hyper-Local</h4>
                  <p className="text-blue-100 text-sm">We focus on 1-mile radiuses to keep borrowing convenient.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-3xl text-slate-900 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <p className="italic text-lg mb-4">"I saved $200 on a one-time renovation project by borrowing a tile saw from Dave down the street. Amazing!"</p>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full shadow-inner"></div>
              <div>
                <p className="font-bold">Sarah Jenkins</p>
                <p className="text-xs text-slate-500">Member since 2023</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="py-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-8 text-slate-900">Ready to clean out your garage?</h2>
        <Link to="/auth/register" className="inline-flex items-center space-x-2 text-blue-600 font-bold text-xl hover:underline">
          <span>Get started today</span>
          <ArrowRight className="w-6 h-6" />
        </Link>
      </section>

      {/* 5. CONTACT SECTION */}
      <section  ref={howItWorksRef}  id="contact">
        <ContactPage />
      </section>
    </div>
  );
};

export default HomePage;