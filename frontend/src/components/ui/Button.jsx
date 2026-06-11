// ─── Reusable Button component ───
// Supports 'primary', 'secondary', and 'ghost' variants.

function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150';

  const variants = {
    primary: 'bg-sage text-white hover:bg-sage-dark px-4 py-2.5',
    secondary: 'bg-sage-pale text-sage-dark border border-sage-light hover:bg-sage-light px-4 py-2.5',
    ghost: 'bg-transparent text-text-muted border border-cream-darker hover:bg-cream px-4 py-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
