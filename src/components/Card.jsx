export default function Card({ children, className = "", icon: Icon, title, action, iconBg = "bg-brand-500" }) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-card p-5 flex flex-col transition-colors ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {Icon && (
              <span className={`w-7 h-7 rounded-lg ${iconBg} text-white flex items-center justify-center shrink-0`}>
                <Icon size={15} strokeWidth={2.5} />
              </span>
            )}
            {title && <h3 className="font-semibold text-[15px] text-slate-800 dark:text-slate-100">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
