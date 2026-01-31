'use client';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AuthOverlay({ isLogin, locked, toggleMode }) {
  return (
    <div
      className={`hidden md:flex flex-1 bg-primary relative transition-all duration-700 ease-in-out items-center justify-center p-12 overflow-hidden ${
        isLogin ? 'order-last' : 'order-first'
      }`}
    >
      {/* ব্যাকগ্রাউন্ড ডেকোরেশন */}
      <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-bg/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-bg/10 rounded-full blur-[100px] animate-pulse delay-700" />

      <div
        className={`text-text text-center max-w-sm space-y-8 transition-all duration-500 relative z-10 ${
          locked ? 'opacity-0 scale-90 blur-sm' : 'opacity-100 scale-100 blur-0'
        }`}
      >
        {/* আইকন বক্স */}
        <div className="w-24 h-24 mx-auto bg-text rounded-4xl flex items-center justify-center backdrop-blur-xl shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500">
          <Sparkles size={48} className="text-primary animate-bounce" fill="currentColor" />
        </div>

        <div className="space-y-4">
          <h2 className="text-5xl font-black tracking-tighter leading-none italic uppercase">
            {isLogin ? 'নতুন এখানে?' : 'কেমন আছেন?'}
          </h2>

          <p className="font-bold text-text/90 leading-relaxed text-sm">
            {isLogin
              ? 'সেরা সব গ্যাজেট এবং এক্সক্লুসিভ অফার পেতে আজই আমাদের সাথে যুক্ত হন।'
              : 'আপনার অর্ডার এবং সংরক্ষিত গ্যাজেটগুলো দেখতে পুনরায় লগইন করুন।'}
          </p>
        </div>

        {/* কাস্টম টগল বাটন */}
        <button
          aria-label="toggle auth"
          onClick={toggleMode}
          className="group relative px-12 py-5 overflow-hidden border-2 border-text rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-primary transition-colors duration-300">
            {isLogin ? (
              <>
                নিবন্ধন করুন <ArrowRight size={14} />
              </>
            ) : (
              <>
                <ArrowLeft size={14} /> লগইন করুন
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-text translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out cursor-pointer" />
        </button>
      </div>

      {/* সাইড গ্রাফিক্স */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 border-2 border-bg w-10 h-10 rounded-full" />
        <div className="absolute bottom-20 right-10 border-2 border-bg w-16 h-16 rotate-45" />
      </div>
    </div>
  );
}
