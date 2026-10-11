/** Artifact Studio — Core Document Model */

export type ArtifactType = 'post' | 'deck'

export type PlatformPreset =
  | 'instagram-square'
  | 'instagram-portrait'
  | 'instagram-story'
  | 'linkedin'
  | 'twitter'
  | 'tiktok'
  | 'custom'

export interface DesignToken {
  id: string
  name: string
  type: 'color' | 'typography' | 'spacing' | 'radius' | 'elevation' | 'motion'
  value: string | number
  description?: string
}

export interface DesignSystem {
  id: string
  name: string
  tokens: DesignToken[]
  version: number
}

export type LayerType = 'text' | 'rect' | 'ellipse' | 'image' | 'group' | 'component'

export interface BaseLayer {
  id: string
  type: LayerType
  name: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  visible: boolean
  locked: boolean
  parentId?: string
}

export interface TextLayer extends BaseLayer {
  type: 'text'
  text: string
  fontFamily: string
  fontSize: number
  fontWeight: number | string
  fill: string
  align: 'left' | 'center' | 'right'
  lineHeight: number
  letterSpacing: number
}

export interface ShapeLayer extends BaseLayer {
  type: 'rect' | 'ellipse'
  fill: string
  stroke?: string
  strokeWidth?: number
  cornerRadius?: number
}

export interface ImageLayer extends BaseLayer {
  type: 'image'
  src: string
  cropX?: number
  cropY?: number
  cropWidth?: number
  cropHeight?: number
}

export type Layer = TextLayer | ShapeLayer | ImageLayer | BaseLayer

export interface Page {
  id: string
  name: string
  width: number
  height: number
  background: string
  layers: Layer[]
}

export interface Artifact {
  id: string
  type: ArtifactType
  name: string
  createdAt: string
  updatedAt: string
  designSystemId?: string
  platform?: PlatformPreset
  pages: Page[]
  currentPageId: string
}

export interface Project {
  id: string
  name: string
  ownerId: string
  artifacts: Artifact[]
  designSystems: DesignSystem[]
  createdAt: string
  updatedAt: string
}

export const PLATFORM_SIZES: Record<PlatformPreset, { width: number; height: number; label: string }> = {
  'instagram-square': { width: 1080, height: 1080, label: 'Instagram Square' },
  'instagram-portrait': { width: 1080, height: 1350, label: 'Instagram Portrait' },
  'instagram-story': { width: 1080, height: 1920, label: 'Instagram Story' },
  linkedin: { width: 1200, height: 627, label: 'LinkedIn' },
  twitter: { width: 1200, height: 675, label: 'X / Twitter' },
  tiktok: { width: 1080, height: 1920, label: 'TikTok' },
  custom: { width: 1920, height: 1080, label: 'Custom' }
}

export const DEFAULT_DESIGN_SYSTEM: DesignSystem = {
  id: 'default-ds',
  name: 'Artifact Default',
  version: 1,
  tokens: [
    { id: 'color-primary', name: 'Primary', type: 'color', value: '#3b82f6' },
    { id: 'color-bg', name: 'Background', type: 'color', value: '#0a0a0a' },
    { id: 'color-surface', name: 'Surface', type: 'color', value: '#111111' },
    { id: 'color-text', name: 'Text', type: 'color', value: '#fafafa' },
    { id: 'color-muted', name: 'Muted Text', type: 'color', value: '#a1a1aa' },
    { id: 'font-sans', name: 'Sans', type: 'typography', value: 'Inter, system-ui, sans-serif' },
    { id: 'space-1', name: 'Space 1', type: 'spacing', value: 4 },
    { id: 'space-2', name: 'Space 2', type: 'spacing', value: 8 },
    { id: 'space-3', name: 'Space 3', type: 'spacing', value: 12 },
    { id: 'space-4', name: 'Space 4', type: 'spacing', value: 16 },
    { id: 'radius-md', name: 'Radius MD', type: 'radius', value: 8 }
  ]
}
