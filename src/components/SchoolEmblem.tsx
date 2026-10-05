import React from 'react';

interface SchoolEmblemProps {
  className?: string;
  size?: number;
}

export const SchoolEmblem: React.FC<SchoolEmblemProps> = ({ className = 'w-10 h-10', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-sm ${className}`}
      aria-label="Huy hiệu Trường PTDTBT TH&THCS Quản Bạ"
    >
      <defs>
        <linearGradient id="emblemGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="emblemBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        <linearGradient id="emblemRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
      </defs>

      {/* Outer border ring */}
      <circle cx="50" cy="50" r="48" fill="url(#emblemBlue)" stroke="#F59E0B" strokeWidth="2.5" />
      
      {/* Inner decorative circle */}
      <circle cx="50" cy="50" r="43" fill="#FFFFFF" stroke="#DBEAFE" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="41" fill="#F8FAFC" />

      {/* Laurel branches on the sides */}
      <path
        d="M20 54C20 68 33 78 50 78C67 78 80 68 80 54"
        stroke="#10B981"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Small laurel leaves */}
      <circle cx="26" cy="64" r="2.2" fill="#059669" />
      <circle cx="36" cy="73" r="2.2" fill="#059669" />
      <circle cx="50" cy="76" r="2.5" fill="#059669" />
      <circle cx="64" cy="73" r="2.2" fill="#059669" />
      <circle cx="74" cy="64" r="2.2" fill="#059669" />

      {/* Open Book symbol */}
      <path
        d="M50 56C42 50 28 50 25 53V39C28 36 42 36 50 42C58 36 72 36 75 39V53C72 50 58 50 50 56Z"
        fill="#1E40AF"
        stroke="#F59E0B"
        strokeWidth="1.5"
      />
      <line x1="50" y1="42" x2="50" y2="56" stroke="#FFFFFF" strokeWidth="1.5" />

      {/* Flaming Torch of Knowledge & Red Pioneer Scarf element */}
      <path
        d="M48 37C48 31 50 24 50 24C50 24 52 31 52 37H48Z"
        fill="url(#emblemRed)"
      />
      <circle cx="50" cy="28" r="4" fill="url(#emblemGold)" />
      
      {/* Pioneer 5-pointed Golden Star */}
      <polygon
        points="50,18 52,22 56,22 53,25 54,29 50,26 46,29 47,25 44,22 48,22"
        fill="#FBBF24"
      />

      {/* Top Banner text arc simulation / badge label */}
      <rect x="22" y="60" width="56" height="12" rx="3" fill="#1E3A8A" />
      <text
        x="50"
        y="68.5"
        textAnchor="middle"
        fill="#F8FAFC"
        fontSize="6.5"
        fontWeight="bold"
        fontFamily="sans-serif"
        letterSpacing="0.5"
      >
        QUẢN BẠ
      </text>
    </svg>
  );
};
