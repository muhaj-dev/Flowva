import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  noPadding = false,
}) => {
  const baseStyles = 'card-shadow rounded-2xl border border-[var(--color-border)] overflow-hidden transition-all duration-200';
  const hoverStyles = hover ? 'hover:-translate-y-1 hover:card-shadow-hover' : '';
  const paddingStyles = noPadding ? '' : 'p-6';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${paddingStyles} ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  colored?: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  colored = false,
}) => {
  const bgColor = colored ? 'bg-[var(--color-primary-light)]' : 'bg-white';

  return (
    <div className={`p-4 border-b border-[var(--color-border)] ${bgColor} ${className}`}>
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};
