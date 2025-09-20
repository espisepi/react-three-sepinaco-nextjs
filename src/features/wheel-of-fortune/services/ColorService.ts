import { IColorService, ValidationError } from './interfaces'

// ============================================================================
// COLOR SERVICE IMPLEMENTATION
// ============================================================================

export class ColorService implements IColorService {
    private readonly DEFAULT_COLORS = [
        '#FF4444', // Rojo vibrante
        '#00AA44', // Verde esmeralda
        '#0066FF', // Azul brillante
        '#FF8800', // Naranja intenso
        '#8800FF', // Púrpura vibrante
        '#00CCCC', // Cian brillante
        '#FF0088', // Rosa vibrante
        '#44AA00', // Verde lima
        '#0088FF', // Azul cielo
        '#FF6600', // Naranja rojizo
        '#AA00AA', // Magenta
        '#00AAAA', // Turquesa
        '#FFAA00', // Amarillo dorado
        '#6600FF', // Índigo
        '#AA4400', // Marrón rojizo
        '#00FF88', // Verde lima brillante
        '#FF0044', // Rojo carmesí
        '#0088AA', // Azul verdoso
        '#AA6600', // Marrón dorado
        '#8800AA'  // Púrpura oscuro
    ]

    getDefaultColors(): string[] {
        return [...this.DEFAULT_COLORS]
    }

    getRandomColor(): string {
        const randomIndex = Math.floor(Math.random() * this.DEFAULT_COLORS.length)
        return this.DEFAULT_COLORS[randomIndex]
    }

    getNextColor(currentIndex: number): string {
        if (currentIndex < 0 || currentIndex >= this.DEFAULT_COLORS.length) {
            throw new ValidationError('Invalid color index')
        }

        return this.DEFAULT_COLORS[currentIndex % this.DEFAULT_COLORS.length]
    }

    validateColor(color: string): boolean {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
    }

    /**
     * Generate a color palette with specified number of colors
     */
    generateColorPalette(count: number): string[] {
        if (count <= 0) {
            throw new ValidationError('Color count must be positive')
        }

        if (count <= this.DEFAULT_COLORS.length) {
            return this.DEFAULT_COLORS.slice(0, count)
        }

        // Generate additional colors using HSL
        const colors = [...this.DEFAULT_COLORS]
        const additionalCount = count - this.DEFAULT_COLORS.length

        for (let i = 0; i < additionalCount; i++) {
            const hue = (i * 360) / additionalCount
            const saturation = 70 + (i % 3) * 10 // Vary saturation
            const lightness = 50 + (i % 2) * 10  // Vary lightness

            colors.push(this.hslToHex(hue, saturation, lightness))
        }

        return colors
    }

    /**
     * Convert HSL to Hex color
     */
    private hslToHex(h: number, s: number, l: number): string {
        h = h / 360
        s = s / 100
        l = l / 100

        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
        }

        let r: number, g: number, b: number

        if (s === 0) {
            r = g = b = l // achromatic
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s
            const p = 2 * l - q
            r = hue2rgb(p, q, h + 1 / 3)
            g = hue2rgb(p, q, h)
            b = hue2rgb(p, q, h - 1 / 3)
        }

        const toHex = (c: number) => {
            const hex = Math.round(c * 255).toString(16)
            return hex.length === 1 ? '0' + hex : hex
        }

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`
    }

    /**
     * Get contrasting text color (black or white) for a given background color
     */
    getContrastingTextColor(backgroundColor: string): string {
        if (!this.validateColor(backgroundColor)) {
            return '#FFFFFF' // Default to white
        }

        // Remove # and convert to RGB
        const hex = backgroundColor.replace('#', '')
        const r = parseInt(hex.substr(0, 2), 16)
        const g = parseInt(hex.substr(2, 2), 16)
        const b = parseInt(hex.substr(4, 2), 16)

        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

        return luminance > 0.5 ? '#000000' : '#FFFFFF'
    }

    /**
     * Check if two colors are similar (within a threshold)
     */
    areColorsSimilar(color1: string, color2: string, threshold: number = 30): boolean {
        if (!this.validateColor(color1) || !this.validateColor(color2)) {
            return false
        }

        const rgb1 = this.hexToRgb(color1)
        const rgb2 = this.hexToRgb(color2)

        if (!rgb1 || !rgb2) {
            return false
        }

        const distance = Math.sqrt(
            Math.pow(rgb1.r - rgb2.r, 2) +
            Math.pow(rgb1.g - rgb2.g, 2) +
            Math.pow(rgb1.b - rgb2.b, 2)
        )

        return distance <= threshold
    }

    private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null
    }
}
