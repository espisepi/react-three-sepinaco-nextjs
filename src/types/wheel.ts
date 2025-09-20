export interface WheelPanel {
  id: string
  text: string
  color: string
  texture?: string // URL or base64 string for texture image
  textureScale?: number // Scale factor for texture (0.1 = small, 1 = normal, 3 = large)
  textureRotation?: number // Rotation angle in degrees (0-360)
  textureOffsetX?: number // Horizontal translation offset (-1 to 1)
  textureOffsetY?: number // Vertical translation offset (-1 to 1)
  // Text positioning and transformation properties
  textPositionX?: number // Text X position offset (-2 to 2)
  textPositionY?: number // Text Y position offset (-2 to 2)
  textPositionZ?: number // Text Z position offset (-2 to 2)
  textRotationX?: number // Text X rotation in degrees (0-360)
  textRotationY?: number // Text Y rotation in degrees (0-360)
  textRotationZ?: number // Text Z rotation in degrees (0-360)
  textScaleX?: number // Text X scale factor (0.1 to 3)
  textScaleY?: number // Text Y scale factor (0.1 to 3)
  textScaleZ?: number // Text Z scale factor (0.1 to 3)
}
