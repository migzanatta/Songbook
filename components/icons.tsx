
import React, { SVGProps } from 'react';

const iconProps: SVGProps<SVGSVGElement> = {
  className: "w-6 h-6",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const MusicNoteIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export const FolderIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.22A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z" />
  </svg>
);

export const PlayIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export const PauseIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

export const PlusIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const MinusIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const FullscreenOpenIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);

export const FullscreenCloseIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
  </svg>
);

export const XIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const ArrowLeftIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export const TrashIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const FilePlusIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="12" y1="18" x2="12" y2="12"></line>
        <line x1="9" y1="15" x2="15" y2="15"></line>
    </svg>
);

export const ChevronDownIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className} >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);
