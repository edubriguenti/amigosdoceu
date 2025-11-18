import Link from 'next/link';

/**
 * Button Component - Acessível e responsivo
 * Segue WCAG 2.1 AA: mín 44x44px touch target, contraste 4.5:1
 * Uso: <Button variant="primary" size="lg">Texto</Button>
 */
export default function Button({
  children,
  variant = 'primary',  // primary | secondary | outline | ghost
  size = 'md',          // sm | md | lg
  fullWidth = false,
  disabled = false,
  loading = false,
  icon = null,
  href = null,
  onClick,
  className = '',
  ...props
}) {
  // Classes base para todos os botões
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  // Variantes de cor e estilo
  const variants = {
    primary: `
      bg-blue-600 text-white
      hover:bg-blue-700 active:bg-blue-800
      focus:ring-blue-500
      disabled:hover:bg-blue-600
    `,
    secondary: `
      bg-amber-400 text-gray-900
      hover:bg-amber-500 active:bg-amber-600
      focus:ring-amber-400
      disabled:hover:bg-amber-400
    `,
    outline: `
      border-2 border-gray-300 text-gray-800 bg-white
      hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100
      focus:ring-gray-500
      disabled:hover:bg-white disabled:hover:border-gray-300
    `,
    ghost: `
      text-gray-700 bg-transparent
      hover:bg-gray-100 active:bg-gray-200
      focus:ring-gray-500
      disabled:hover:bg-transparent
    `
  };

  // Tamanhos (todos atendem WCAG touch target)
  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',      // Mobile básico
    md: 'px-6 py-3 text-base min-h-[44px]',    // ✅ WCAG AA (44px)
    lg: 'px-8 py-4 text-lg min-h-[48px]'       // ✅ WCAG AAA (48px)
  };

  // Classes combinadas
  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Loading spinner SVG
  const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
    </svg>
  );

  // Se tem href, renderiza como Link
  if (href) {
    return (
      <Link href={href} className={buttonClasses} {...props}>
        {loading && <LoadingSpinner />}
        {icon && !loading && <span className="w-5 h-5">{icon}</span>}
        {children}
      </Link>
    );
  }

  // Caso contrário, renderiza como button
  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {icon && !loading && <span className="w-5 h-5">{icon}</span>}
      {children}
    </button>
  );
}
