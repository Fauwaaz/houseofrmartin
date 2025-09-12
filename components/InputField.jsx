import React from 'react';
import { Eye, EyeOff, XCircle } from 'lucide-react';

export const InputField = ({
    value,
    onChange,
    type,
    name,
    placeholder,
    icon: Icon,
    showPasswordToggle,
    showPassword,
    onTogglePassword,
    error
}) => (
    <div className="relative w-full">
        {/* Icon */}
        <div
            className={`absolute left-3 ${error ? 'top-1/3' : 'top-1/2'
                } transform -translate-y-1/2 text-black/70 pointer-events-none`}
        >
            <Icon size={18} />
        </div>

        {/* Input */}
        <input
            type={showPasswordToggle && showPassword ? 'text' : type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg bg-white text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${error ? 'border-black bg-gray-100' : 'border-gray-400 hover:border-black'
                }`}
            autoComplete="off"
        />

        {/* Show/Hide Password Button */}
        {showPasswordToggle && (
            <button
                type="button"
                onClick={onTogglePassword}
                className={`absolute right-3 ${error ? 'top-1/3' : 'top-1/2'
                } transform -translate-y-1/2 text-black/50 hover:text-black focus:outline-none`}
            >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        )}

        {/* Error Message */}
        {error && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
                <XCircle size={14} className="mr-1" />
                {error}
            </div>
        )}
    </div>
);
