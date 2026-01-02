'use client';
import { Sparkles } from 'lucide-react';

export default function AuthOverlay({ isLogin, locked, toggleMode }) {
  return (
    <div
      className={`hidden md:flex flex-1 bg-primary relative transition-all duration-700 ease-in-out items-center justify-center p-12 ${
        isLogin ? 'order-last' : 'order-first'
      }`}
    >
      <div
        className={`text-bg text-center max-w-sm space-y-6 transition-all duration-500 ${
          locked ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <div className="w-20 h-20 mx-auto bg-bg/10 rounded-3xl flex items-center justify-center backdrop-blur-md border border-bg/20 shadow-xl">
          <Sparkles size={40} className="text-bg" fill="currentColor" />
        </div>

        <h2 className="text-5xl font-black tracking-tighter leading-none italic">
          {isLogin ? 'New Here?' : 'Hey Friend!'}
        </h2>

        <p className="font-bold text-bg/80 leading-relaxed">
          {isLogin
            ? 'Discover the latest gadgets and exclusive deals by joining us today.'
            : 'Log back in to manage your orders and saved gadgets.'}
        </p>

        <button
          onClick={toggleMode}
          className="group relative px-10 py-4 overflow-hidden border-2 border-bg rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:text-primary"
        >
          <span className="relative z-10">{isLogin ? 'Sign Up' : 'Sign In'}</span>
          <div className="absolute inset-0 bg-bg translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-bg/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-bg/5 rounded-full blur-3xl animate-pulse delay-1000" />
    </div>
  );
}
