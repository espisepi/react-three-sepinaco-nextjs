import { IPersistenceService, PersistenceError, ValidationError } from './interfaces'

// ============================================================================
// PERSISTENCE SERVICE IMPLEMENTATION
// ============================================================================

export class PersistenceService implements IPersistenceService {
  private readonly STORAGE_KEY = 'wheel-of-fortune-config'
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  saveConfig(config: any): boolean {
    try {
      if (!this.validateConfig(config)) {
        throw new ValidationError('Invalid configuration structure')
      }

      const configWithTimestamp = {
        ...config,
        updatedAt: new Date().toISOString(),
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(configWithTimestamp))
      return true
    } catch (error) {
      throw new PersistenceError('Failed to save configuration', { error, config })
    }
  }

  loadConfig(): any | null {
    try {
      const savedConfig = localStorage.getItem(this.STORAGE_KEY)
      if (!savedConfig) {
        return null
      }

      const parsedConfig = JSON.parse(savedConfig)

      if (!this.validateConfig(parsedConfig)) {
        console.warn('Invalid configuration found in storage, returning null')
        return null
      }

      return parsedConfig
    } catch (error) {
      throw new PersistenceError('Failed to load configuration', { error })
    }
  }

  clearConfig(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      return true
    } catch (error) {
      throw new PersistenceError('Failed to clear configuration', { error })
    }
  }

  downloadConfig(config: any): boolean {
    try {
      if (!this.validateConfig(config)) {
        throw new ValidationError('Invalid configuration structure')
      }

      const configToDownload = {
        ...config,
        downloadedAt: new Date().toISOString(),
        version: config.version || '1.0.0',
      }

      const blob = new Blob([JSON.stringify(configToDownload, null, 2)], {
        type: 'application/json',
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = this.generateFileName()

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
      return true
    } catch (error) {
      throw new PersistenceError('Failed to download configuration', { error, config })
    }
  }

  async loadConfigFromFile(file: File): Promise<any | null> {
    try {
      if (!this.validateFile(file)) {
        throw new ValidationError('Invalid file format or size')
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
          try {
            const content = e.target?.result as string
            const parsedConfig = JSON.parse(content)

            if (!this.validateConfig(parsedConfig)) {
              reject(new ValidationError('Invalid configuration structure in file'))
              return
            }

            resolve(parsedConfig)
          } catch (error) {
            reject(new PersistenceError('Failed to parse configuration file', { error }))
          }
        }

        reader.onerror = () => {
          reject(new PersistenceError('Failed to read file', { fileName: file.name }))
        }

        reader.readAsText(file)
      })
    } catch (error) {
      throw new PersistenceError('Failed to load configuration from file', { error, fileName: file.name })
    }
  }

  validateConfig(config: any): boolean {
    if (!config || typeof config !== 'object') {
      return false
    }

    // Check required fields
    const requiredFields = ['panels', 'spinDuration', 'enableOrbitControls', 'canvasWidth', 'canvasHeight']
    for (const field of requiredFields) {
      if (!(field in config)) {
        return false
      }
    }

    // Validate panels array
    if (!Array.isArray(config.panels)) {
      return false
    }

    // Validate each panel
    for (const panel of config.panels) {
      if (!this.validatePanel(panel)) {
        return false
      }
    }

    // Validate numeric fields
    if (typeof config.spinDuration !== 'number' || config.spinDuration <= 0 || config.spinDuration > 60) {
      return false
    }

    if (typeof config.enableOrbitControls !== 'boolean') {
      return false
    }

    if (typeof config.canvasWidth !== 'number' || config.canvasWidth < 10 || config.canvasWidth > 200) {
      return false
    }

    if (typeof config.canvasHeight !== 'number' || config.canvasHeight < 10 || config.canvasHeight > 200) {
      return false
    }

    return true
  }

  /**
   * Get configuration metadata
   */
  getConfigMetadata(): { hasConfig: boolean; lastModified?: string; size?: number } {
    try {
      const config = this.loadConfig()
      if (!config) {
        return { hasConfig: false }
      }

      return {
        hasConfig: true,
        lastModified: config.updatedAt,
        size: JSON.stringify(config).length,
      }
    } catch {
      return { hasConfig: false }
    }
  }

  /**
   * Export configuration with custom filename
   */
  downloadConfigWithName(config: any, filename?: string): boolean {
    try {
      if (!this.validateConfig(config)) {
        throw new ValidationError('Invalid configuration structure')
      }

      const configToDownload = {
        ...config,
        downloadedAt: new Date().toISOString(),
        version: config.version || '1.0.0',
      }

      const blob = new Blob([JSON.stringify(configToDownload, null, 2)], {
        type: 'application/json',
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || this.generateFileName()

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
      return true
    } catch (error) {
      throw new PersistenceError('Failed to download configuration with custom name', { error, config, filename })
    }
  }

  private validateFile(file: File): boolean {
    return (
      file.type === 'application/json' &&
      file.size <= this.MAX_FILE_SIZE &&
      file.name.toLowerCase().endsWith('.json')
    )
  }

  private validatePanel(panel: any): boolean {
    if (!panel || typeof panel !== 'object') {
      return false
    }

    const requiredFields = ['id', 'text', 'color']
    for (const field of requiredFields) {
      if (!(field in panel) || typeof panel[field] !== 'string') {
        return false
      }
    }

    // Validate color format
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(panel.color)) {
      return false
    }

    // Validate optional numeric fields
    const optionalNumericFields = [
      'textureScale', 'textureRotation', 'textureOffsetX', 'textureOffsetY',
      'textPositionX', 'textPositionY', 'textPositionZ',
      'textRotationX', 'textRotationY', 'textRotationZ',
      'textScaleX', 'textScaleY', 'textScaleZ'
    ]

    for (const field of optionalNumericFields) {
      if (field in panel && typeof panel[field] !== 'number') {
        return false
      }
    }

    return true
  }

  private generateFileName(): string {
    const date = new Date().toISOString().split('T')[0]
    return `ruleta-config-${date}.json`
  }
}
