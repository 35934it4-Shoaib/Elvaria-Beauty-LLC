import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Order & Delivery Status');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const cleanPhone = (settings?.whatsappPhone || '+18005553376').replace(/[^\d+]/g, '');
  const waUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
    'Hi ELVARIA BEAUTY, I would like to inquire about your products.'
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in your name, email, and inquiry message.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.submitContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject,
        message: message.trim(),
      });

      if (res.success) {
        setSuccess(true);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setError(res.message || 'Failed to submit inquiry.');
      }
    } catch {
      setError('An error occurred. Please try again or chat with us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact-page" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#62756A]">
          Customer Care
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#202420]">
          We're Here to Help
        </h1>
        <p className="text-sm text-[#68706B] leading-relaxed">
          Whether you need assistance with an ongoing order, delivery tracking, or ingredient advice, our dedicated team is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* WhatsApp Direct */}
          <div className="bg-[#EFEAE2] border border-[#DCDDD8] p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#25D366]">
              <MessageCircle className="w-5 h-5 fill-[#25D366]" />
              <h3 className="font-heading text-base font-bold text-[#202420]">
                Instant WhatsApp Care
              </h3>
            </div>
            <p className="text-xs text-[#68706B] leading-relaxed">
              For real-time assistance with order updates, courier tracking, or product guidance, message us directly.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 text-xs font-semibold rounded hover:bg-[#1EBE5D] transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat on WhatsApp: {settings?.whatsappPhone || '+92 300 1234567'}</span>
            </a>
          </div>

          {/* Contact Details List */}
          <div className="bg-white border border-[#DCDDD8] p-6 space-y-5 text-xs">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#62756A] mt-0.5 shrink-0" />
              <div>
                <strong className="block text-[#202420] font-semibold">Email Us</strong>
                <a href={`mailto:${settings?.supportEmail || settings?.contactEmail || 'care@elvariabeauty.com'}`} className="text-[#68706B] hover:text-[#62756A]">
                  {settings?.supportEmail || settings?.contactEmail || 'care@elvariabeauty.com'}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#62756A] mt-0.5 shrink-0" />
              <div>
                <strong className="block text-[#202420] font-semibold">Phone Support</strong>
                <span className="text-[#68706B]">{settings?.whatsappPhone || '+1 (800) 555-ELVA'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#62756A] mt-0.5 shrink-0" />
              <div>
                <strong className="block text-[#202420] font-semibold">Operating Hours</strong>
                <span className="text-[#68706B]">Monday &ndash; Saturday: 9:00 AM &ndash; 7:00 PM PKT</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#62756A] mt-0.5 shrink-0" />
              <div>
                <strong className="block text-[#202420] font-semibold">Headquarters & Fulfillment</strong>
                <span className="text-[#68706B]">Lahore, Punjab, Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white border border-[#DCDDD8] p-8 space-y-6">
          <h2 className="font-heading text-lg font-bold text-[#202420] uppercase tracking-wider">
            Send an Inquiry
          </h2>

          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#DDE5DF] text-[#62756A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-lg font-bold text-[#202420]">
                Message Received
              </h3>
              <p className="text-xs text-[#68706B] max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out to ELVARIA BEAUTY. A member of our support team will respond to your email within 24 business hours.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-[#62756A] text-[#F7F5F0] px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#202420] mt-2"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-xs rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#202420] font-semibold uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2.5 text-xs text-[#202420] focus:outline-none focus:border-[#62756A]"
                  />
                </div>
                <div>
                  <label className="block text-[#202420] font-semibold uppercase tracking-wider mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2.5 text-xs text-[#202420] focus:outline-none focus:border-[#62756A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#202420] font-semibold uppercase tracking-wider mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2.5 text-xs text-[#202420] focus:outline-none focus:border-[#62756A]"
                  />
                </div>
                <div>
                  <label className="block text-[#202420] font-semibold uppercase tracking-wider mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2.5 text-xs text-[#202420] focus:outline-none focus:border-[#62756A]"
                  >
                    <option value="Order & Delivery Status">Order & Delivery Status</option>
                    <option value="Product Advice / Ingredients">Product Advice / Ingredients</option>
                    <option value="Payment / COD Inquiry">Payment / COD Inquiry</option>
                    <option value="Returns & Exchanges">Returns & Exchanges</option>
                    <option value="Wholesale / Partnership">Wholesale / Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#202420] font-semibold uppercase tracking-wider mb-1">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you today?"
                  className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2.5 text-xs text-[#202420] focus:outline-none focus:border-[#62756A]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#62756A] text-[#F7F5F0] py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#202420] transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
