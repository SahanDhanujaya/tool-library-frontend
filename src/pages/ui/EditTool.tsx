/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Camera,
  ChevronRight,
  MapPin,
  DollarSign,
  ShieldCheck,
  Loader2,
  Save,
} from "lucide-react";
import type { Requirement, Tool } from "../../types/tool";
import toast from "react-hot-toast";

const EditTool = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Image states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Initialize form with data passed from navigation state (faster)
  const [formData, setFormData] = useState<Tool>(
    location.state?.tool || {
      title: "",
      category: "",
      description: "",
      price: 0,
      location: "",
      requirements: [],
      availability: "true",
    }
  );

  const categories = ["Power Tools", "Gardening", "Automotive", "Ladders", "Cleaning", "Hand Tools"];

  const getTool = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/tools/${id}`);
    const toolData = response.data.store;

    let imageUrl = null;
    try {
      const imageResponse = await axios.get(
        `${BASE_URL}/api/v1/tools/${id}/tool-image`, 
        { responseType: "blob" }
      );
      imageUrl = URL.createObjectURL(imageResponse.data);
      setImagePreview(imageUrl);
    } catch (imgError) {
      console.error("Could not fetch tool image:", imgError);
    }

    setFormData({
      ...toolData,
      requirements: Array.isArray(toolData.requirements) 
        ? toolData.requirements 
        : toolData.requirements?.split(",") || [],
      image: imageUrl 
    });

  } catch (error) {
    console.error("Error fetching tool:", error);
    toast.error("Failed to load tool details.");
  }
};

  useEffect(() => {
    getTool();
  }, []);

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
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
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

  const handleUpdate = async () => {
  setIsSubmitting(true);

  try {
    const data = new FormData();

    // Append simple fields
    data.append("title", formData.title);
    data.append("userEmail", user.email);
    data.append("description", formData.description);
    data.append("price", formData.price.toString());
    data.append("category", formData.category);
    data.append("location", formData.location);
    data.append("availability", formData.availability);
    data.append("requirements", formData.requirements.join(","));

    if (imageFile) {
      data.append("image", imageFile);
    }

    await axios.put(`${BASE_URL}/api/v1/tools/${id}`, data);

    toast.success("Listing Updated Successfully!");
    navigate("/settings");
  } catch (error) {
    console.error("Error updating tool:", error);
    toast.error("Failed to update tool.");
  } finally {
    setIsSubmitting(false);
  }
};
  const handleNext = () => setStep(step + 1);
  const handleBack = () => (step > 1 ? setStep(step - 1) : navigate(-1));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Shared Progress Nav */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center text-slate-500 hover:text-slate-900 font-bold">
            <ArrowLeft className="w-5 h-5 mr-2" />
            {step === 1 ? "Cancel" : "Back"}
          </button>
          <div className="flex space-x-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step >= s ? "bg-blue-600" : "bg-slate-200"}`} />
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-3">
            {step === 1 && "Edit your listing"}
            {step === 2 && "Adjust your terms"}
            {step === 3 && "Review updates"}
          </h1>
          <p className="text-slate-500 font-medium text-xs bg-blue-50 w-fit mx-auto px-4 py-1 rounded-full uppercase tracking-widest">
            ID: {id?.split('-')[0]}...
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="relative border-4 border-dashed rounded-4xl p-12 text-center border-slate-100 bg-slate-50">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="max-h-64 rounded-2xl mx-auto shadow-md" />
                    <label htmlFor="edit-image" className="absolute -bottom-4 -right-4 bg-white p-3 rounded-full shadow-xl cursor-pointer hover:bg-blue-50 text-blue-600 border border-slate-100 transition-all">
                      <Camera className="w-6 h-6" />
                      <input type="file" accept="image/*" id="edit-image" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin text-slate-300 w-10 h-10" />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Tool Title</label>
                  <input name="title" value={formData.title} onChange={handleChange} type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 px-6 font-semibold outline-none transition-all" />
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
              <div className="bg-slate-900 rounded-3xl p-8 text-white flex items-center justify-between shadow-lg">
                <div>
                  <h3 className="text-xl font-black mb-1 flex items-center"><ShieldCheck className="w-6 h-6 mr-2 text-blue-400" />Status: Active</h3>
                  <p className="text-slate-400 text-sm">You can change price or location at any time.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Daily Price</label>
                  <div className="relative text-2xl">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input name="price" value={formData.price} onChange={handleChange} type="number" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 pl-12 pr-6 font-black outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Pickup Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input name="location" value={formData.location} onChange={handleChange} type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 pl-12 pr-6 font-semibold outline-none transition-all" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 px-6 font-semibold outline-none transition-all resize-none" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Borrower Requirements</label>
                {["Verified Identity required", "Minimum Trust Score of 80", "Require security deposit ($50)"].map((req, i) => (
                  <label key={i} className="flex items-center p-4 bg-slate-50 rounded-2xl cursor-pointer border-2 border-transparent has-checked:border-blue-600 has-checked:bg-white transition-all">
                    <input type="checkbox" checked={formData.requirements.includes(req as unknown as Requirement)} onChange={() => handleCheckboxChange(req as unknown as Requirement)} className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 mr-4" />
                    <span className="font-bold text-slate-700">{req}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Availability</label>
                <div className="flex items-center space-x-4 mt-2">
                  <button onClick={() => setFormData({ ...formData, availability: "true" })} className={`py-3 px-6 rounded-xl text-sm font-bold border-2 transition-all ${formData.availability === "true" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-100 text-slate-500 hover:border-slate-200"}`}>
                    Available
                  </button>
                  <button onClick={() => setFormData({ ...formData, availability: "false" })} className={`py-3 px-6 rounded-xl text-sm font-bold border-2 transition-all ${formData.availability === "false" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-100 text-slate-500 hover:border-slate-200"}`}>
                    Not Available
                  </button>
                </div>
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
              onClick={step === 3 ? handleUpdate : handleNext}
              className={`flex-1 ${step === 3 ? 'bg-slate-900' : 'bg-blue-600'} text-white py-5 rounded-3xl font-black text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center group disabled:opacity-50`}
            >
              {isSubmitting ? <Loader2 className="animate-spin w-6 h-6" /> : step === 3 ? (
                <>
                  <Save className="w-6 h-6 mr-2" /> Save Updates
                </>
              ) : "Continue"}
              {!isSubmitting && step < 3 && <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditTool;