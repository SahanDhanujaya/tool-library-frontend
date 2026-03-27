import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is installed
import {
  ArrowLeft,
  Camera,
  Plus,
  ChevronRight,
  MapPin,
  DollarSign,
  ShieldCheck,
  X,
  Loader2,
} from "lucide-react";
import type { Requirement, Tool } from "../../types/tool";

const ListATool = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  
  // Store the actual File object for the API, and a preview URL for the UI
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const loggedInUser = localStorage.getItem("user");
  const userObj = loggedInUser ? JSON.parse(loggedInUser) : null;

  const [formData, setFormData] = useState<Tool>({
    title: "",
    owner: userObj || { id: 0, name: "Guest", email: "" },
    category: "",
    description: "",
    price: 0,
    location: "",
    requirements: [],
    image: "",
    quantity: 1,
    availability: "available",
  });

  const categories = ["Power Tools", "Gardening", "Automotive", "Ladders", "Cleaning", "Hand Tools"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // Save file for Axios
      setImagePreview(URL.createObjectURL(file)); // Save URL for UI preview
    }
  };

  const handleCheckboxChange = (req: Requirement) => {
    setFormData((prev) => {
      const activeReqs = prev.requirements.includes(req)
        ? prev.requirements.filter((r) => r !== req)
        : [...prev.requirements, req];
      return { ...prev, requirements: activeReqs };
    });
  };

  const handleSubmit = async () => {
    if (!formData.title || !imageFile || !formData.category) {
      alert("Please ensure you've added a photo, title, and category.");
      setStep(1);
      return;
    }

    setIsSubmitting(true);

    // Create FormData object to match your Postman screenshot
    const data = new FormData();
    data.append("userEmail", userObj?.email || "dhanux@gmail.com");
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price.toString());
    data.append("image", imageFile); // The actual file object
    data.append("category", formData.category);
    data.append("location", formData.location);
    data.append("requirements", formData.requirements.join(","));
    data.append("availability", "true");

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/tools`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 || response.status === 200) {
        alert("Listing Created Successfully!");
        navigate("/tools");
      }
    } catch (error) {
      console.error("Error saving tool:", error);
      alert("Failed to save tool. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => (step > 1 ? setStep(step - 1) : navigate(-1));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center text-slate-500 hover:text-slate-900 font-bold transition-all"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {step === 1 ? "Cancel" : "Back"}
          </button>
          <div className="flex space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-8 rounded-full transition-all duration-500 ${
                  step >= s ? "bg-blue-600" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-3">
            {step === 1 && "What are you sharing?"}
            {step === 2 && "Set your terms"}
            {step === 3 && "Final details"}
          </h1>
          <p className="text-slate-500 font-medium">Join 2,000+ neighbors sharing their gear.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div
                className={`relative border-4 border-dashed rounded-[2rem] p-12 text-center transition-all ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-slate-100 hover:border-slate-200"
                } ${imagePreview ? "border-solid border-blue-100 bg-slate-50" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
              >
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="max-h-64 rounded-2xl mx-auto shadow-md" />
                    <button
                      onClick={() => { setImagePreview(""); setImageFile(null); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-10 h-10" />
                    </div>
                    <h3 className="font-black text-slate-900 text-xl">Upload Photos</h3>
                    <p className="text-slate-400 text-sm mb-6">Click to browse</p>
                    <input type="file" accept="image/*" id="product-image" className="hidden" onChange={handleImageChange} />
                    <label htmlFor="product-image" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all cursor-pointer inline-block">
                      Choose Image
                    </label>
                  </>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Tool Title</label>
                  <input name="title" value={formData.title} onChange={handleChange} type="text" placeholder="e.g. Bosch Jackhammer" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 px-6 font-semibold outline-none transition-all" />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Category</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((cat) => (
                      <button key={cat} type="button" onClick={() => setFormData({ ...formData, category: cat })} className={`py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all ${formData.category === cat ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-100 text-slate-500 hover:border-slate-200"}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="bg-blue-600 rounded-3xl p-8 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black mb-1 flex items-center"><ShieldCheck className="w-6 h-6 mr-2 text-blue-200" />Safety First</h3>
                  <p className="text-blue-100 text-sm opacity-90">All shared tools are covered by our $500 guarantee.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Daily Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input name="price" value={formData.price === 0 ? "" : formData.price} onChange={handleChange} type="number" placeholder="0.00" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 pl-12 pr-6 font-black text-2xl outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Pickup Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input name="location" value={formData.location} onChange={handleChange} type="text" placeholder="Neighborhood or Zip" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 pl-12 pr-6 font-semibold outline-none transition-all" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Tell neighbors about the condition..." className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 px-6 font-semibold outline-none transition-all resize-none" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Borrower Requirements</label>
                {["Verified Identity required", "Minimum Trust Score of 80", "Require security deposit ($50)"].map((req, i) => (
                  <label key={i} className="flex items-center p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all border-2 border-transparent has-[:checked]:border-blue-600 has-[:checked]:bg-white">
                    <input type="checkbox" checked={formData.requirements.includes(req as Requirement)} onChange={() => handleCheckboxChange(req as Requirement)} className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 mr-4" />
                    <span className="font-bold text-slate-700">{req}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 flex items-center justify-between gap-4">
            {step > 1 && (
              <button type="button" onClick={handleBack} className="px-8 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-100 transition-all">
                Previous
              </button>
            )}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={step === 3 ? handleSubmit : handleNext}
              className="flex-1 bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center group disabled:bg-blue-400"
            >
              {isSubmitting ? <Loader2 className="animate-spin w-6 h-6" /> : step === 3 ? "List Tool Now" : "Continue"}
              {!isSubmitting && <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListATool;