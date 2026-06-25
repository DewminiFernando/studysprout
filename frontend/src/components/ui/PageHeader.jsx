// ─── PageHeader component ───
// Reusable header for study pages.
// Title uses Caveat (decorative); description uses Nunito (readable).

function PageHeader({ title, description, icon: Icon }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        {Icon && (
          <div className="w-9 h-9 bg-sage-pale rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon size={18} className="text-sage" />
          </div>
        )}
        <h1 className="font-caveat text-2xl font-bold text-text-base leading-tight">
          {title}
        </h1>
      </div>
      {description && (
        <p className="text-[13px] text-text-muted mt-1 ml-12 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

export default PageHeader;
