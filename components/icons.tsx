import React from 'react';

const SVGIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    {props.children}
  </svg>
);

export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <SVGIcon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347c.75.411.75 1.559 0 1.97l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z" />
  </SVGIcon>
);

export const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
  <SVGIcon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
  </SVGIcon>
);

export const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <SVGIcon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
  </SVGIcon>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <SVGIcon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </SVGIcon>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <SVGIcon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </SVGIcon>
);

export const SpeedIcon: React.FC<{ className?: string }> = ({ className }) => (
    <SVGIcon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </SVGIcon>
);

export const DistanceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <SVGIcon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.267a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0ZM18.367 10.267a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75h.008v.008H12v-.008Zm-3.75 0h.008v.008H8.25v-.008Zm7.5 0h.008v.008H15.75v-.008Z" />
    </SVGIcon>
);

export const AreaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <SVGIcon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811Z" />
    </SVGIcon>
);

export const TimeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <SVGIcon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </SVGIcon>
);

export const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <SVGIcon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </SVGIcon>
);