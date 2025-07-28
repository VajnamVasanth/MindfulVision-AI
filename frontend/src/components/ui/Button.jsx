import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  to, 
  href,
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none';
  
  // Only apply these styles if no custom className is provided or if className doesn't override these properties
  const variantStyles = !className.includes('bg-') ? {
    primary: 'bg-transparent text-primary hover:bg-primary/10 rounded-md px-6 py-3',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md px-6 py-3',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-6 py-3',
  } : {};

  // Combine styles, with className taking precedence
  const styles = cn(baseStyles, variant && !className.includes('bg-') ? variantStyles[variant] : '', className);

  if (to) {
    return (
      <Link to={to} className={styles} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={styles} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}

export default Button;
