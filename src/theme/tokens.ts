

export const paletteTokens = {
  primary: {
    50: '#eef5ff',
    100: '#d9e9ff',
    200: '#b4d3ff',
    300: '#8cbcfe',
    400: '#639ffe',
    500: '#2563ff', 
    600: '#1d52d6',
    700: '#1741aa',
    800: '#112f7c',
    900: '#0b1f52'
  },
  accent: {
    pink: '#ec4899',
    violet: '#8b5cf6',
    sky: '#0ea5e9',
    teal: '#14b8a6',
    amber: '#f59e0b'
  },
  success: '#16a34a',
  warning: '#f59e0b',
  error: '#ef4444',
  
  status: {
    done: '#16a34a',
    inProgress: '#2563ff',
    pending: '#94a3b8'
  }
};

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  pill: 999
};


export const spacingUnit = 4; 
export const spacing = (factor: number) => `${(spacingUnit * factor) / 16}rem`;

export const shadows = {
  xs: '0 1px 2px rgba(15,23,42,0.08)',
  sm: '0 2px 4px rgba(15,23,42,0.08)',
  md: '0 4px 12px rgba(15,23,42,0.10)',
  lg: '0 8px 24px rgba(15,23,42,0.12)',
  xl: '0 14px 42px -4px rgba(15,23,42,0.18)'
};

export const gradients = {
  primary: 'linear-gradient(135deg,#2563ff,#4f46e5 55%,#6366f1)',
  success: 'linear-gradient(135deg,#16a34a,#10b981)',
  error: 'linear-gradient(135deg,#ef4444,#dc2626)',
  warning: 'linear-gradient(135deg,#f59e0b,#f97316)',
  info: 'linear-gradient(135deg,#0ea5e9,#2563ff)'
};

export const glass = {
  light: 'rgba(255,255,255,0.55)',
  dark: 'rgba(30,41,59,0.55)'
};

export const patterns = {
  dots: (color: string) => `radial-gradient(circle at 1px 1px, ${color} 1px, transparent 0)`
};

export const duration = {
  quickest: '90ms',
  fast: '140ms',
  normal: '220ms',
  slow: '380ms'
};

export const easing = {
  standard: 'cubic-bezier(.4,0,.2,1)',
  emphasized: 'cubic-bezier(.4,0,.2,1)', 
  entrance: 'cubic-bezier(0.4, 0, 0.2, 1)',
  exit: 'cubic-bezier(0.4, 0, 0.2, 1)'
};

export type DesignTokens = typeof paletteTokens & {
  radius: typeof radius;
};
