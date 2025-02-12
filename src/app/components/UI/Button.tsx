import React from 'react'

interface ButtonProps {
    text: string;
    onClick?: () => void;
    action: 'success' | 'edit' | 'delete' | 'add' | 'download';
    disabled?: boolean;
}

const Button = ({ text, onClick, action, disabled }: ButtonProps) => {
    let buttonColor;

    switch (action) {
        case 'success':
            buttonColor = 'bg-green-500 hover:bg-green-600';
            break;
        case 'edit':
            buttonColor = 'bg-blue-500 hover:bg-blue-600';
            break;
        case 'delete':
            buttonColor = 'bg-red-500 hover:bg-red-600';
            break;
        case 'add':
            buttonColor = 'bg-blue-500 hover:bg-blue-600';
            break;
        case 'download':
            buttonColor = 'bg-violet-500 hover:bg-violet-600';
            break;
        default:
            buttonColor = 'bg-gray-500 hover:bg-gray-600';
    }

    return (
        <button 
            onClick={onClick}
            className={`mt-4 text-white px-4 py-2 rounded-lg transition-all ${buttonColor} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
        >
            {text}
        </button>
    )
}

export default Button;
