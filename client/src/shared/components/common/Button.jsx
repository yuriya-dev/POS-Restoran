import React from 'react';

const baseStyles = "flex items-center justify-center font-medium rounded-lg transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";

const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
};

const variantStyles = {
    primary: "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-400",
    secondary: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-600 transition-colors",
    danger: "bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-400",
    success: "bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-400",
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