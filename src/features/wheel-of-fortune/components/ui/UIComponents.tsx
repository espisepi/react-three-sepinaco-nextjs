import React from 'react'

// ============================================================================
// SLIDER COMPONENT (Reusable UI Component)
// ============================================================================

interface SliderProps {
    value: number
    min: number
    max: number
    step?: number
    onChange: (value: number) => void
    disabled?: boolean
    label?: string
    showValue?: boolean
    color?: string
    className?: string
}

export function Slider({
    value,
    min,
    max,
    step = 1,
    onChange,
    disabled = false,
    label,
    showValue = true,
    color = '#8B5CF6',
    className = ''
}: SliderProps) {
    const percentage = ((value - min) / (max - min)) * 100

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!disabled) {
            onChange(parseFloat(event.target.value))
        }
    }

    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-300">
                    {label}: {showValue && value}
                </label>
            )}

            <div className="flex items-center space-x-2">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
                    style={{
                        background: `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, #374151 ${percentage}%, #374151 100%)`
                    }}
                />

                {showValue && (
                    <span className="text-xs text-gray-400 font-mono min-w-[3rem] text-right">
                        {value}
                    </span>
                )}
            </div>

            <div className="flex justify-between text-xs text-gray-500">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    )
}

// ============================================================================
// BUTTON COMPONENT (Reusable UI Component)
// ============================================================================

interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
    size?: 'small' | 'medium' | 'large'
    className?: string
    title?: string
}

export function Button({
    children,
    onClick,
    disabled = false,
    variant = 'primary',
    size = 'medium',
    className = '',
    title
}: ButtonProps) {
    const baseClasses = 'font-medium text-white rounded transition-all duration-300'

    const variantClasses = {
        primary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
        secondary: 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
        success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
        warning: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
    }

    const sizeClasses = {
        small: 'px-2 py-1 text-xs',
        medium: 'px-4 py-2 text-sm',
        large: 'px-6 py-3 text-base'
    }

    const disabledClasses = disabled
        ? 'cursor-not-allowed opacity-50'
        : 'hover:scale-105 shadow-lg'

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
        >
            {children}
        </button>
    )
}

// ============================================================================
// INPUT COMPONENT (Reusable UI Component)
// ============================================================================

interface InputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
    type?: 'text' | 'email' | 'password' | 'number'
    className?: string
    label?: string
    error?: string
}

export function Input({
    value,
    onChange,
    placeholder,
    disabled = false,
    type = 'text',
    className = '',
    label,
    error
}: InputProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!disabled) {
            onChange(event.target.value)
        }
    }

    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-300">
                    {label}
                </label>
            )}

            <input
                type={type}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full rounded border px-3 py-2 text-white transition-colors ${error
                        ? 'border-red-400 bg-red-500/10 focus:border-red-500'
                        : 'border-white/30 bg-white/20 focus:border-white/50'
                    } focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            />

            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}
        </div>
    )
}

// ============================================================================
// CARD COMPONENT (Reusable UI Component)
// ============================================================================

interface CardProps {
    children: React.ReactNode
    title?: string
    className?: string
    variant?: 'default' | 'gradient' | 'bordered'
}

export function Card({
    children,
    title,
    className = '',
    variant = 'default'
}: CardProps) {
    const baseClasses = 'rounded-2xl p-6 backdrop-blur-sm'

    const variantClasses = {
        default: 'bg-white/10',
        gradient: 'bg-gradient-to-r from-white/10 to-white/5',
        bordered: 'bg-white/10 border border-white/20'
    }

    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {title && (
                <h3 className="mb-4 text-xl font-bold text-white">
                    {title}
                </h3>
            )}
            {children}
        </div>
    )
}

// ============================================================================
// MESSAGE COMPONENT (Reusable UI Component)
// ============================================================================

interface MessageProps {
    type: 'success' | 'error' | 'warning' | 'info'
    children: React.ReactNode
    className?: string
    onClose?: () => void
}

export function Message({
    type,
    children,
    className = '',
    onClose
}: MessageProps) {
    const typeClasses = {
        success: 'bg-green-500/20 text-green-300 border-green-400/30',
        error: 'bg-red-500/20 text-red-300 border-red-400/30',
        warning: 'bg-orange-500/20 text-orange-300 border-orange-400/30',
        info: 'bg-blue-500/20 text-blue-300 border-blue-400/30'
    }

    return (
        <div className={`rounded-lg p-3 text-sm font-medium border ${typeClasses[type]} ${className}`}>
            <div className="flex items-center justify-between">
                <span>{children}</span>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="ml-2 text-current hover:opacity-70 transition-opacity"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    )
}

// ============================================================================
// LOADING COMPONENT (Reusable UI Component)
// ============================================================================

interface LoadingProps {
    size?: 'small' | 'medium' | 'large'
    text?: string
    className?: string
}

export function Loading({
    size = 'medium',
    text = 'Cargando...',
    className = ''
}: LoadingProps) {
    const sizeClasses = {
        small: 'size-4',
        medium: 'size-8',
        large: 'size-12'
    }

    const textSizeClasses = {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg'
    }

    return (
        <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
            <div className={`${sizeClasses[size]} animate-spin rounded-full border-b-2 border-white`} />
            {text && (
                <p className={`${textSizeClasses[size]} text-white`}>{text}</p>
            )}
        </div>
    )
}
