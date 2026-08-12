'use client';
import React from 'react';
import { AlertCircle } from 'lucide-react';

const AuthField = React.forwardRef(({ icon, error, ...props }, ref) => (
  <div className="space-y-1.5 w-full">
    <div className="relative group">
      {/* আইকন সেকশন */}
      <div
        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 z-10 ${
          error
            ? 'text-red-500'
            : 'text-pText/40 group-focus-within:text-primary group-focus-within:scale-110'
        }`}
      >
        {React.cloneElement(icon, { size: 18, strokeWidth: 2.5 })}
      </div>

      {/* ইনপুট ফিল্ড */}
      <input
        {...props}
        ref={ref}
        className={`w-full py-4 pl-12 pr-4 rounded-0 bg-bg/30 border border-border outline-none font-medium text-sm text-text transition-all duration-500 placeholder:text-pText ${
          error
            ? 'border-red-500/30 bg-red-500/5 focus:border-red-500 shadow-sm'
            : 'border-bg/5 focus:border-primary/40 focus:bg-bg/[0.07] focus:scale-[1.01] shadow-inner'
        }`}
      />

      {/* ফোকাস গ্লো ইফেক্ট (ডেকোরেটিভ) */}
      <div
        className={`absolute inset-0 rounded-0 -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-xl ${error ? 'bg-red-500/5' : 'bg-primary/5'}`}
      />
    </div>

    {/* এরর মেসেজ */}
    {error && (
      <div className="flex items-center gap-1.5 px-3 py-1 text-red-500 animate-in fade-in slide-in-from-top-1 duration-300">
        <AlertCircle size={12} strokeWidth={3} className="shrink-0" />
        <span className="text-[12px] font-medium uppercase tracking-tighter leading-none">
          {error.message}
        </span>
      </div>
    )}
  </div>
));

AuthField.displayName = 'AuthField';
export default AuthField;
