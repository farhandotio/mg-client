'use client';
import React from 'react';
import { AlertCircle } from 'lucide-react';

const AuthField = React.forwardRef(({ icon, error, ...props }, ref) => (
  <div className="space-y-1">
    <div className="relative group">
      <div
        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
          error ? 'text-red-400' : 'text-pText group-focus-within:text-primary'
        }`}
      >
        {icon}
      </div>
      <input
        {...props}
        ref={ref}
        className={`w-full py-4 pl-12 pr-4 rounded-2xl bg-white/5 border-border border-2 outline-none font-bold text-sm text-text transition-all duration-300 
          ${
            error
              ? 'border-red-400/50 bg-red-400/5 focus:border-red-400'
              : 'border-border focus:border-primary/50 focus:bg-white/10 focus:scale-[1.01]'
          }`}
      />
    </div>
    {error && (
      <div className="flex items-center gap-1.5 px-2 text-red-400 animate-in slide-in-from-top-1 duration-300">
        <AlertCircle size={12} strokeWidth={3} />
        <span className="text-[10px] font-black uppercase tracking-wider">{error.message}</span>
      </div>
    )}
  </div>
));

AuthField.displayName = 'AuthField';
export default AuthField;
