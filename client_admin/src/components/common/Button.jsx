import React from 'react';

const baseStyles = "flex items-center justify-center font-medium rounded-lg transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";

const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
};

const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 focus:ring-4 focus:ring-gray-200",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-4 focus:ring-red-300",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-4 focus:ring-green-300",
};

const Button = ({ children, onClick, variant = 'primary', size = 'md', icon, type = 'button', disabled = false, className = '', to }) => {
    const styles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

    const content = (
        <>
            {icon && React.cloneElement(icon, { className: `w-5 h-5 ${children ? 'mr-2' : ''}` })}
            {children}
        </>
    );

    if (to) {
        // Menggunakan tag <a> untuk simulasi Link/React Router Link
        return (
            <a href={to} className={styles} onClick={onClick}>
                {content}
            </a>
        );
    }

    return (
        <button
            type={type}
            className={styles}
            onClick={onClick}
            disabled={disabled}
        >
            {content}
        </button>
    );
};

export default Button;