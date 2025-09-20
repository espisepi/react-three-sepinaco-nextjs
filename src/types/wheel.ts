export interface WheelPanel {
  id: string
  text: string
  color: string
  texture?: string // URL or base64 string for texture image
  textureScale?: number // Scale factor for texture (0.1 = small, 1 = normal, 3 = large)
  textureRotation?: number // Rotation angle in degrees (0-360)
  textureOffsetX?: number // Horizontal translation offset (-1 to 1)
  textureOffsetY?: number // Vertical translation offset (-1 to 1)
}
