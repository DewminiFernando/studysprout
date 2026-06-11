// ─── PageHeader component ───
// Reusable header for placeholder pages.

function PageHeader({ title, description, icon: Icon }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        {Icon && (
          <div className="w-9 h-9 bg-sage-pale rounded-lg flex items-center justify-center">
            <Icon size={18} className="text-sage-dark" />
          </div>
        )}
        <h1 className="text-lg font-medium text-text-base">{title}</h1>
      </div>
      {description && (
        <p className="text-[13px] text-text-muted mt-1 ml-12">{description}</p>
      )}
    </div>
  );
}

export default PageHeader;
