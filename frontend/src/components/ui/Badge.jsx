// ─── Badge component ───
// Used for difficulty levels, status tags, and topic tags.

function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-sage-pale text-sage-dark',
    easy: 'bg-[#EAF3DE] text-moss',
    medium: 'bg-amber-light text-amber',
    hard: 'bg-danger-light text-danger',
    weak: 'bg-amber-light text-amber',
    ok: 'bg-sage-pale text-sage-dark',
    mcq: 'bg-sage-pale text-sage-dark',
    info: 'bg-cream-dark text-text-muted',
  };

  return (
    <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
