// customer-frontend/src/pages/ContactUs.jsx

import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import api from "../services/api";

const CONTACT_DETAILS = [
  { icon: Mail, label: "Email", value: "localbites29@gmail.com", href: "mailto:localbites29@gmail.com" },
  { icon: Phone, label: "Phone", value: "03260490057", href: "tel:+923260490057" },
  { icon: MapPin, label: "Address", value: "Gujranwala, Punjab, Pakistan" },
  { icon: Clock, label: "Support hours", value: "Every day, 10:00 AM – 11:00 PM" },
];

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/customer/contact", form);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <section className="bg-primary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Get in touch</h1>
          <p className="text-orange-50 mt-3 max-w-xl mx-auto">
            Questions, feedback, or a restaurant you think we should have? We'd love to hear from
            you.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 grid md:grid-cols-2 gap-10">
        {/* Contact details */}
        <div className="space-y-5">
          {CONTACT_DETAILS.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                <Icon size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                {href ? (
                  <a href={href} className="text-sm font-medium text-secondary hover:text-primary">
                    {value}
                  </a>
                ) : (
                  <p className="text-sm font-medium text-secondary">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Your name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none
                focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Email address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none
                focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              placeholder="How can we help?"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none
                focus:border-primary transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-medium
              text-sm py-2.5 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            <Send size={15} />
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;