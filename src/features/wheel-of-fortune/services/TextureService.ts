import { ITextureService, TextureError, ValidationError } from './interfaces'

// ============================================================================
// TEXTURE SERVICE IMPLEMENTATION
// ============================================================================

export class TextureService implements ITextureService {
  private readonly MAX_TEXTURE_SIZE = 2048 // Max texture dimension
  private readonly SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  async loadTexture(url: string): Promise<string> {
    try {
      if (!this.validateTextureUrl(url)) {
        throw new ValidationError('Invalid texture URL')
      }

      return new Promise((resolve, reject) => {
        const img = new Image()

        img.onload = () => {
          try {
            // Validate image dimensions
            if (img.width > this.MAX_TEXTURE_SIZE || img.height > this.MAX_TEXTURE_SIZE) {
              reject(new ValidationError(`Texture dimensions too large. Max: ${this.MAX_TEXTURE_SIZE}x${this.MAX_TEXTURE_SIZE}`))
              return
            }

            // Convert to base64
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            if (!ctx) {
              reject(new TextureError('Failed to create canvas context'))
              return
            }

            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)

            const base64 = canvas.toDataURL('image/png')
            resolve(base64)
          } catch (error) {
            reject(new TextureError('Failed to process texture', { error }))
          }
        }

        img.onerror = () => {
          reject(new TextureError('Failed to load texture image', { url }))
        }

        img.crossOrigin = 'anonymous'
        img.src = url
      })
    } catch (error) {
      throw new TextureError('Failed to load texture', { error, url })
    }
  }

  validateTextureUrl(url: string): boolean {
    try {
      const urlObj = new URL(url)
      return ['http:', 'https:', 'data:'].includes(urlObj.protocol)
    } catch {
      return false
    }
  }

  async createTextureFromFile(file: File): Promise<string> {
    try {
      if (!this.validateTextureFile(file)) {
        throw new ValidationError('Invalid texture file format or size')
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
          try {
            const result = e.target?.result as string
            if (!result) {
              reject(new TextureError('Failed to read file'))
              return
            }

            // Validate the loaded image
            this.validateLoadedImage(result)
              .then(() => resolve(result))
              .catch(reject)
          } catch (error) {
            reject(new TextureError('Failed to process texture file', { error }))
          }
        }

        reader.onerror = () => {
          reject(new TextureError('Failed to read texture file', { fileName: file.name }))
        }

        reader.readAsDataURL(file)
      })
    } catch (error) {
      throw new TextureError('Failed to create texture from file', { error, fileName: file.name })
    }
  }

  /**
   * Compress texture to reduce file size
   */
  async compressTexture(dataUrl: string, quality: number = 0.8): Promise<string> {
    try {
      if (quality < 0.1 || quality > 1) {
        throw new ValidationError('Quality must be between 0.1 and 1')
      }

      return new Promise((resolve, reject) => {
        const img = new Image()

        img.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            if (!ctx) {
              reject(new TextureError('Failed to create canvas context'))
              return
            }

            // Calculate new dimensions (maintain aspect ratio)
            const maxSize = 1024
            let { width, height } = img

            if (width > maxSize || height > maxSize) {
              const ratio = Math.min(maxSize / width, maxSize / height)
              width *= ratio
              height *= ratio
            }

            canvas.width = width
            canvas.height = height
            ctx.drawImage(img, 0, 0, width, height)

            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
            resolve(compressedDataUrl)
          } catch (error) {
            reject(new TextureError('Failed to compress texture', { error }))
          }
        }

        img.onerror = () => {
          reject(new TextureError('Failed to load image for compression'))
        }

        img.src = dataUrl
      })
    } catch (error) {
      throw new TextureError('Failed to compress texture', { error })
    }
  }

  /**
   * Get texture metadata
   */
  async getTextureMetadata(dataUrl: string): Promise<{
    width: number
    height: number
    format: string
    size: number
  }> {
    try {
      return new Promise((resolve, reject) => {
        const img = new Image()

        img.onload = () => {
          try {
            const format = dataUrl.split(';')[0].split(':')[1] || 'unknown'
            const size = Math.round((dataUrl.length * 3) / 4) // Approximate size in bytes

            resolve({
              width: img.width,
              height: img.height,
              format,
              size,
            })
          } catch (error) {
            reject(new TextureError('Failed to extract texture metadata', { error }))
          }
        }

        img.onerror = () => {
          reject(new TextureError('Failed to load image for metadata extraction'))
        }

        img.src = dataUrl
      })
    } catch (error) {
      throw new TextureError('Failed to get texture metadata', { error })
    }
  }

  /**
   * Create a thumbnail of the texture
   */
  async createThumbnail(dataUrl: string, maxSize: number = 128): Promise<string> {
    try {
      if (maxSize < 32 || maxSize > 512) {
        throw new ValidationError('Thumbnail size must be between 32 and 512 pixels')
      }

      return new Promise((resolve, reject) => {
        const img = new Image()

        img.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            if (!ctx) {
              reject(new TextureError('Failed to create canvas context'))
              return
            }

            // Calculate thumbnail dimensions (maintain aspect ratio)
            let { width, height } = img

            if (width > maxSize || height > maxSize) {
              const ratio = Math.min(maxSize / width, maxSize / height)
              width *= ratio
              height *= ratio
            }

            canvas.width = width
            canvas.height = height
            ctx.drawImage(img, 0, 0, width, height)

            const thumbnailDataUrl = canvas.toDataURL('image/png')
            resolve(thumbnailDataUrl)
          } catch (error) {
            reject(new TextureError('Failed to create thumbnail', { error }))
          }
        }

        img.onerror = () => {
          reject(new TextureError('Failed to load image for thumbnail creation'))
        }

        img.src = dataUrl
      })
    } catch (error) {
      throw new TextureError('Failed to create thumbnail', { error })
    }
  }

  private validateTextureFile(file: File): boolean {
    return (
      this.SUPPORTED_FORMATS.includes(file.type) &&
      file.size <= this.MAX_FILE_SIZE &&
      file.size > 0
    )
  }

  private async validateLoadedImage(dataUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image()

      img.onload = () => {
        if (img.width > this.MAX_TEXTURE_SIZE || img.height > this.MAX_TEXTURE_SIZE) {
          reject(new ValidationError(`Image dimensions too large. Max: ${this.MAX_TEXTURE_SIZE}x${this.MAX_TEXTURE_SIZE}`))
          return
        }

        if (img.width === 0 || img.height === 0) {
          reject(new ValidationError('Invalid image dimensions'))
          return
        }

        resolve()
      }

      img.onerror = () => {
        reject(new ValidationError('Invalid image data'))
      }

      img.src = dataUrl
    })
  }
}
