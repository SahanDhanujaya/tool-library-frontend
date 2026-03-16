import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  MapPin, 
  Phone, 
  Send, 
  CheckCircle2,
  Github,
  Twitter
} from 'lucide-react';

const ContactPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Add your form submission logic here
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-slate-50 py-20 px-6 border-b border-slate-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            We’re here to help
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have questions about sharing tools or safety? Our team is ready to support the community.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in touch</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Chat with Support</h4>
                    <p className="text-slate-600 text-sm">Typical response time: Under 2 hours</p>
                    <button className="mt-2 text-blue-600 font-semibold hover:underline text-sm">Open Live Chat</button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Email Us</h4>
                    <p className="text-slate-600 text-sm">support@toolshare.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Local Office</h4>
                    <p className="text-slate-600 text-sm">123 West Village, New York, NY 10014</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof/Community Links */}
            <div className="pt-8 border-t border-slate-100">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Follow our growth</p>
              <div className="flex space-x-4">
                <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-slate-600">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-slate-600">
                  <Github className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Form Card */}
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-100/50 border border-slate-100 p-8 md:p-10">
            {isSubmitted ? (
              <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-500">Thanks for reaching out. We'll get back to you shortly.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 text-blue-600 font-bold hover:text-blue-700"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none">
                    <option>General Inquiry</option>
                    <option>Safety Concerns</option>
                    <option>Technical Support</option>
                    <option>Partnerships</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Your Message</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center space-x-2 active:scale-[0.98]"
                >
                  <span>Send Message</span>
                  <Send className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default ContactPage;