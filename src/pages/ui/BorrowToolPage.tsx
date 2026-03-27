import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import type { Tool } from "../../types/tool";

const BASE_URL = "http://localhost:8000";

const BorrowToolPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;

  // State for dynamic tool data
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  // Form States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 1. Fetch Tool Data on Mount
  useEffect(() => {
    const fetchToolDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/v1/tools/${id}`);

        // Transform the data to match your UI needs
        const toolData = response.data.store;
        setTool({
          ...toolData,
          image: `${BASE_URL}/api/v1/tools/${id}/tool-image`,
          // Ensure requirements is an array
          requirements: Array.isArray(toolData.requirements)
            ? toolData.requirements
            : toolData.requirements?.split(",") || [],
        });
      } catch (error) {
        console.error("Error:", error);
        toast.error("Could not find this tool.");
        navigate("/marketplace");
      } finally {
        setLoading(false);
      }
    };

    fetchToolDetails();
  }, [id, navigate]);

  // 2. Logic to calculate total price
  const totalCost = useMemo(() => {
    if (!startDate || !endDate || !tool) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 0; // Prevent negative days

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return diffDays * (tool.price || 0);
  }, [startDate, endDate, tool]);

  const handleRequest = async (e: HTMLFormElement) => {
    e.preventDefault();

    // 1. Validation
    if (!startDate || !endDate || totalCost <= 0) {
      toast.error("Please select valid pickup and return dates");
      return;
    }

    const formatLocalDateTime = (dateStr: string) => {
      const d = new Date(dateStr);
      // This creates the format: 2026-03-27T00:00:00
      return d.toISOString().split(".")[0];
    };

    const borrowPayload = {
      toolId: tool?.id, 
      userId: Number(user?.id || 1),
      status: "PENDING",
      startDate: formatLocalDateTime(startDate),
      endDate: formatLocalDateTime(endDate),
      totalCost: totalCost,
    };

    console.log("Sending Payload:", borrowPayload);

    toast.promise(
      // Ensure the URL is /borrows (plural) as per your controller
      axios.post(`${BASE_URL}/api/v1/borrows`, borrowPayload),
      {
        loading: "Sending request...",
        success: "Request sent! 🎉",
        error: (err) => {
          console.error("Error Response:", err.response?.data);
          return (
            <b>{err.response?.data?.message || "Check field types (400)"}</b>
          );
        },
      },
    );
    navigate("/tools");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse font-bold text-slate-400">
          Loading tool details...
        </div>
      </div>
    );

  if (!tool) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Navigation Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-600 hover:text-blue-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          <div className="font-bold text-slate-900">
            ${tool.price}
            <span className="text-slate-400 text-sm font-normal"> / day</span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Tool Image */}
            <section>
              <img
                src={tool.image}
                alt={tool.title}
                className="w-full h-100 object-cover rounded-[2.5rem] shadow-lg border-4 border-white bg-slate-200"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x400?text=No+Image+Available";
                }}
              />
            </section>

            {/* Tool Info Card */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 mb-2">
                    {tool.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-amber-500 fill-current mr-1" />{" "}
                      4.8 (Dynamic soon)
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" /> {tool.location}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                    tool.availability
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tool.availability ? "Available" : "Borrowed"}
                </span>
              </div>

              <p className="text-slate-600 leading-relaxed mb-8">
                {tool.description}
              </p>

              <div className="border-t border-slate-100 pt-8">
                <h3 className="font-bold text-slate-900 mb-4">
                  Borrowing Requirements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tool.requirements.map((req, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>{`${req}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Owner Info Card */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-xl border-2 border-white shadow-sm">
                  {tool.userEmail ? tool.userEmail[0].toUpperCase() : "U"}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">
                    Owned by {tool.userEmail?.split("@")[0]}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Member since {new Date(tool.createdAt).getFullYear()}
                  </p>
                </div>
              </div>
              <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-600 transition-all">
                <MessageSquare className="w-5 h-5" />
              </button>
            </section>
          </div>

          {/* Sticky Sidebar Form */}
          <aside className="lg:col-start-3">
            <div className="bg-white rounded-4xl p-8 shadow-xl border border-slate-100 sticky top-24">
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  Select Dates
                </h3>
                <div className="text-right">
                  <span className="block text-2xl font-black text-slate-900">
                    ${tool.price}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    per day
                  </span>
                </div>
              </div>

              <form onSubmit={handleRequest} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                    Pickup Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                    Return Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      min={startDate || new Date().toISOString().split("T")[0]}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                {totalCost > 0 && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>Total Days</span>
                      <span className="font-bold text-slate-900">
                        {totalCost / tool.price}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900">
                      <span>Total Price</span>
                      <span>${totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!tool.availability}
                  className={`w-full py-5 rounded-[1.25rem] font-black text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center group ${
                    tool.availability
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  {tool.availability ? "Send Request" : "Not Available"}
                  {tool.availability && (
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </form>

              <p className="text-center text-slate-400 text-xs mt-6">
                Owners typically respond within{" "}
                <span className="text-slate-900 font-bold">2 hours</span>
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default BorrowToolPage;
