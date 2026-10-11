import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type {
  Artifact,
  Page,
  Layer,
  TextLayer,
  ShapeLayer,
  DesignSystem,
  PlatformPreset
} from '@/types/document'
import { PLATFORM_SIZES, DEFAULT_DESIGN_SYSTEM } from '@/types/document'

const uuid = () => crypto.randomUUID()

interface EditorState {
  artifact: Artifact | null
  selectedLayerIds: string[]
  zoom: number
  isDirty: boolean
  designSystem: DesignSystem
  activeTool: 'select' | 'text' | 'rect' | 'ellipse' | 'image' | 'hand'
  showGrid: boolean
  showGuides: boolean
  leftPanelOpen: boolean
  rightPanelOpen: boolean
  createPost: (platform?: PlatformPreset) => void
  createDeck: () => void
  setArtifact: (artifact: Artifact) => void
  updateArtifactName: (name: string) => void
  addPage: () => void
  setCurrentPage: (pageId: string) => void
  updatePageBackground: (color: string) => void
  addTextLayer: (text?: string) => void
  addShapeLayer: (type: 'rect' | 'ellipse') => void
  updateLayer: (layerId: string, updates: Partial<Layer>) => void
  deleteSelectedLayers: () => void
  selectLayers: (ids: string[]) => void
  clearSelection: () => void
  setZoom: (zoom: number) => void
  setActiveTool: (tool: EditorState['activeTool']) => void
  toggleGrid: () => void
  toggleLeftPanel: () => void
  toggleRightPanel: () => void
  setDesignSystem: (ds: DesignSystem) => void
}

const createEmptyPage = (width: number, height: number, name = 'Page 1'): Page => ({
  id: uuid(),
  name,
  width,
  height,
  background: '#0a0a0a',
  layers: []
})

const createEmptyArtifact = (
  type: 'post' | 'deck',
  width: number,
  height: number,
  platform?: PlatformPreset
): Artifact => {
  const page = createEmptyPage(width, height)
  return {
    id: uuid(),
    type,
    name: type === 'post' ? 'Untitled Post' : 'Untitled Deck',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    designSystemId: DEFAULT_DESIGN_SYSTEM.id,
    platform,
    pages: [page],
    currentPageId: page.id
  }
}

export const useEditorStore = create<EditorState>()(
  immer((set) => ({
    artifact: null,
    selectedLayerIds: [],
    zoom: 0.5,
    isDirty: false,
    designSystem: DEFAULT_DESIGN_SYSTEM,
    activeTool: 'select',
    showGrid: true,
    showGuides: true,
    leftPanelOpen: true,
    rightPanelOpen: true,
    createPost: (platform = 'instagram-square') => {
      const size = PLATFORM_SIZES[platform]
      const artifact = createEmptyArtifact('post', size.width, size.height, platform)
      set((s) => {
        s.artifact = artifact
        s.selectedLayerIds = []
        s.isDirty = true
        s.zoom = 0.45
      })
    },
    createDeck: () => {
      const artifact = createEmptyArtifact('deck', 1920, 1080)
      set((s) => {
        s.artifact = artifact
        s.selectedLayerIds = []
        s.isDirty = true
        s.zoom = 0.4
      })
    },
    setArtifact: (artifact) => {
      set((s) => {
        s.artifact = artifact
        s.selectedLayerIds = []
        s.isDirty = false
      })
    },
    updateArtifactName: (name) => {
      set((s) => {
        if (s.artifact) {
          s.artifact.name = name
          s.artifact.updatedAt = new Date().toISOString()
          s.isDirty = true
        }
      })
    },
    addPage: () => {
      set((s) => {
        if (!s.artifact) return
        const current = s.artifact.pages.find((p) => p.id === s.artifact!.currentPageId)
        const page = createEmptyPage(current?.width ?? 1920, current?.height ?? 1080, `Page ${s.artifact.pages.length + 1}`)
        s.artifact.pages.push(page)
        s.artifact.currentPageId = page.id
        s.artifact.updatedAt = new Date().toISOString()
        s.isDirty = true
      })
    },
    setCurrentPage: (pageId) => {
      set((s) => {
        if (s.artifact) {
          s.artifact.currentPageId = pageId
          s.selectedLayerIds = []
        }
      })
    },
    updatePageBackground: (color) => {
      set((s) => {
        if (!s.artifact) return
        const page = s.artifact.pages.find((p) => p.id === s.artifact!.currentPageId)
        if (page) {
          page.background = color
          s.artifact.updatedAt = new Date().toISOString()
          s.isDirty = true
        }
      })
    },
    addTextLayer: (text = 'Add your text') => {
      set((s) => {
        if (!s.artifact) return
        const page = s.artifact.pages.find((p) => p.id === s.artifact!.currentPageId)
        if (!page) return
        const layer: TextLayer = {
          id: uuid(), type: 'text', name: 'Text',
          x: page.width / 2 - 200, y: page.height / 2 - 40, width: 400, height: 80,
          rotation: 0, opacity: 1, visible: true, locked: false,
          text, fontFamily: 'Inter, system-ui, sans-serif', fontSize: 48, fontWeight: 600,
          fill: '#fafafa', align: 'center', lineHeight: 1.2, letterSpacing: 0
        }
        page.layers.push(layer)
        s.selectedLayerIds = [layer.id]
        s.artifact.updatedAt = new Date().toISOString()
        s.isDirty = true
        s.activeTool = 'select'
      })
    },
    addShapeLayer: (type) => {
      set((s) => {
        if (!s.artifact) return
        const page = s.artifact.pages.find((p) => p.id === s.artifact!.currentPageId)
        if (!page) return
        const layer: ShapeLayer = {
          id: uuid(), type, name: type === 'rect' ? 'Rectangle' : 'Ellipse',
          x: page.width / 2 - 150, y: page.height / 2 - 100, width: 300, height: 200,
          rotation: 0, opacity: 1, visible: true, locked: false,
          fill: '#3b82f6', cornerRadius: type === 'rect' ? 12 : undefined
        }
        page.layers.push(layer)
        s.selectedLayerIds = [layer.id]
        s.artifact.updatedAt = new Date().toISOString()
        s.isDirty = true
        s.activeTool = 'select'
      })
    },
    updateLayer: (layerId, updates) => {
      set((s) => {
        if (!s.artifact) return
        const page = s.artifact.pages.find((p) => p.id === s.artifact!.currentPageId)
        if (!page) return
        const idx = page.layers.findIndex((l) => l.id === layerId)
        if (idx === -1) return
        page.layers[idx] = { ...page.layers[idx], ...updates } as Layer
        s.artifact.updatedAt = new Date().toISOString()
        s.isDirty = true
      })
    },
    deleteSelectedLayers: () => {
      set((s) => {
        if (!s.artifact || s.selectedLayerIds.length === 0) return
        const page = s.artifact.pages.find((p) => p.id === s.artifact!.currentPageId)
        if (!page) return
        page.layers = page.layers.filter((l) => !s.selectedLayerIds.includes(l.id))
        s.selectedLayerIds = []
        s.artifact.updatedAt = new Date().toISOString()
        s.isDirty = true
      })
    },
    selectLayers: (ids) => set((s) => { s.selectedLayerIds = ids }),
    clearSelection: () => set((s) => { s.selectedLayerIds = [] }),
    setZoom: (zoom) => set((s) => { s.zoom = Math.min(3, Math.max(0.1, zoom)) }),
    setActiveTool: (tool) => set((s) => { s.activeTool = tool }),
    toggleGrid: () => set((s) => { s.showGrid = !s.showGrid }),
    toggleLeftPanel: () => set((s) => { s.leftPanelOpen = !s.leftPanelOpen }),
    toggleRightPanel: () => set((s) => { s.rightPanelOpen = !s.rightPanelOpen }),
    setDesignSystem: (ds) => set((s) => { s.designSystem = ds })
  }))
)

export const useCurrentPage = () =>
  useEditorStore((s) => {
    if (!s.artifact) return null
    return s.artifact.pages.find((p) => p.id === s.artifact!.currentPageId) ?? null
  })
