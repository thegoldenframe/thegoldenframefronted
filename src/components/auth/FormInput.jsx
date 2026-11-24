import React, { forwardRef } from 'react'

const FormInput = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => (
  <div className={`space-y-1.5 ${className}`}>
    {label && (
      <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-gray/70">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 pointer-events-none">
          <Icon size={15} />
        </div>
      )}
      <input
        ref={ref}
        className={`w-full bg-white/[0.03] border ${error ? 'border-red-500/60' : 'border-gold/15 hover:border-gold/30 focus:border-gold/60'} text-ivory placeholder-gray/30 font-body text-sm py-3.5 pr-4 ${Icon ? 'pl-10' : 'pl-4'} outline-none transition-all duration-300 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(214,132,84,0.06)]`}
        {...props}
      />
    </div>
    {error && <p className="font-body text-[10px] text-red-400/80">{error}</p>}
  </div>
))
FormInput.displayName = 'FormInput'
export default FormInput
