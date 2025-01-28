import { FC } from 'react';

interface IconPDFProps {
    className?: string;
}

const IconPdf: FC<IconPDFProps> = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path>
            <path d="M14 2v6h6"></path>
            <rect x="9" y="12" width="6" height="8" rx="1"></rect>
            <line x1="9" y1="16" x2="15" y2="16"></line>
        </svg>
    );
};

export default IconPdf;
