'use client';
interface AuthButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
  }
  
  export default function AuthButton({ onClick, disabled = false, children }: AuthButtonProps) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {children}
      </button>
    );
  }
  