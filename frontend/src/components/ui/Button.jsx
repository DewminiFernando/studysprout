// ─── Reusable Button component ───
// Supports 'primary', 'secondary', and 'ghost' variants.
// Font: Nunito (inherited from body — no override needed).
// Radius: 10px per design spec.

function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-[10px] text-sm font-semibold cursor-pointer transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    // Filled sage — primary workflow actions (Study Mode, Practice Quiz)
    primary:
      'bg-sage text-white hover:bg-sage-dark px-4 py-2.5 border border-transparent',
    // Soft outline sage — secondary actions (Study Guide, Question Bank)
    secondary:
      'bg-sage-pale text-sage border border-sage-light hover:bg-sage-light/30 px-4 py-2.5',
    // Ghost — subtle actions (Read Extracted Text, Delete)
    ghost:
      'bg-transparent text-sage border border-[#B8D4C0] hover:bg-sage-pale px-4 py-2.5',
  };

  return (
    <button
      className={`${base} ${variants[variant] ?? variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
