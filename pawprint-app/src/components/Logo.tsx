import { PawPrint } from 'lucide-react';

interface LogoProps {
    className?: string;
    iconClassName?: string;
}

export const Logo = ({ className = "w-16 h-16", iconClassName = "w-10 h-10" }: LogoProps) => {
    return (
        <div className={`bg-pawprint-green rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] ${className}`}>
           <PawPrint className={`text-pawprint-dark ${iconClassName}`} fill="currentColor" />
        </div>
    );
};
