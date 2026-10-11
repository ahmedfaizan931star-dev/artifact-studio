import { useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Stage, Layer, Rect, Text, Transformer, Circle } from 'react-konva'
import type Konva from 'konva'
import { useEditorStore, useCurrentPage } from './store'
import {
  Type, Square, Circle as CircleIcon, MousePointer2,
  ZoomIn, ZoomOut, Grid3X3, Trash2, Plus, Download, ArrowLeft
} from 'lucide-react'

export function EditorPage() {
  const {
    artifact, selectedLayerIds, zoom, activeTool, showGrid,
    createPost, addTextLayer, addShapeLayer, updateLayer,
    deleteSelectedLayers, selectLayers, clearSelection,
    setZoom, setActiveTool, toggleGrid, addPage, setCurrentPage
  } = useEditorStore()
  const page = useCurrentPage()
  const transformerRef = useRef<Konva.Transformer>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const selectedShapeRef = useRef<Konva.Node | null>(null)

  useEffect(() => { if (!artifact) createPost('instagram-square') }, [artifact, createPost])

  useEffect(() => {
    const tr = transformerRef.current
    if (!tr) return
    if (selectedShapeRef.current && selectedLayerIds.length === 1) tr.nodes([selectedShapeRef.current])
    else tr.nodes([])
    tr.getLayer()?.batchDraw()
  }, [selectedLayerIds])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); deleteSelectedLayers() }
      if (e.key === 'v' || e.key === 'V') setActiveTool('select')
      if (e.key === 't' || e.key === 'T') { setActiveTool('text'); addTextLayer() }
      if (e.key === 'r' || e.key === 'R') { setActiveTool('rect'); addShapeLayer('rect') }
      if (e.key === 'o' || e.key === 'O') { setActiveTool('ellipse'); addShapeLayer('ellipse') }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [deleteSelectedLayers, setActiveTool, addTextLayer, addShapeLayer])

  const handleExport = useCallback(() => {
    if (!stageRef.current) return
    const oldScale = stageRef.current.scaleX()
    const w = stageRef.current.width() / oldScale
    const h = stageRef.current.height() / oldScale
    stageRef.current.scale({ x: 1, y: 1 })
    stageRef.current.size({ width: w, height: h })
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2, mimeType: 'image/png' })
    stageRef.current.scale({ x: oldScale, y: oldScale })
    stageRef.current.size({ width: w * oldScale, height: h * oldScale })
    const link = document.createElement('a')
    link.download = `${(artifact?.name || 'export').replace(/[^a-z0-9]+/gi, '-')}.png`
    link.href = dataURL
    link.click()
  }, [artifact?.name])

  if (!artifact || !page) {
    return <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-white">Loading editor…</div>
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
      <header className="h-14 border-b border-zinc-800 flex items-center px-4 gap-3 shrink-0">
        <Link to="/" className="p-2 rounded-lg hover:bg-zinc-800"><ArrowLeft size={18} /></Link>
        <input value={artifact.name} onChange={(e) => useEditorStore.getState().updateArtifactName(e.target.value)}
          className="bg-transparent border-none outline-none text-sm font-medium max-w-[200px]" />
        <div className="h-6 w-px bg-zinc-800" />
        <button onClick={() => setActiveTool('select')} className={`p-2 rounded-lg ${activeTool==='select'?'bg-zinc-700':'hover:bg-zinc-800'}`}><MousePointer2 size={16}/></button>
        <button onClick={() => { setActiveTool('text'); addTextLayer() }} className="p-2 rounded-lg hover:bg-zinc-800"><Type size={16}/></button>
        <button onClick={() => { setActiveTool('rect'); addShapeLayer('rect') }} className="p-2 rounded-lg hover:bg-zinc-800"><Square size={16}/></button>
        <button onClick={() => { setActiveTool('ellipse'); addShapeLayer('ellipse') }} className="p-2 rounded-lg hover:bg-zinc-800"><CircleIcon size={16}/></button>
        <button onClick={toggleGrid} className="p-2 rounded-lg hover:bg-zinc-800"><Grid3X3 size={16}/></button>
        <button onClick={deleteSelectedLayers} className="p-2 rounded-lg hover:bg-zinc-800"><Trash2 size={16}/></button>
        <div className="flex-1" />
        <button onClick={() => setZoom(zoom - 0.1)} className="p-1.5 rounded hover:bg-zinc-800"><ZoomOut size={16}/></button>
        <span className="text-xs text-zinc-400 w-12 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(zoom + 0.1)} className="p-1.5 rounded hover:bg-zinc-800"><ZoomIn size={16}/></button>
        <button onClick={handleExport} className="ml-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium flex items-center gap-2">
          <Download size={14}/> Export PNG
        </button>
      </header>
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-48 border-r border-zinc-800 p-2">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs text-zinc-400 uppercase">Pages</span>
            <button onClick={addPage} className="p-1 hover:bg-zinc-800 rounded"><Plus size={14}/></button>
          </div>
          {artifact.pages.map((p, i) => (
            <button key={p.id} onClick={() => setCurrentPage(p.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${p.id===page.id?'bg-zinc-800':'text-zinc-400 hover:bg-zinc-900'}`}>
              {p.name || `Page ${i+1}`}
            </button>
          ))}
        </aside>
        <main className="flex-1 overflow-auto bg-[#111] flex items-center justify-center p-8">
          <div style={{ width: page.width * zoom, height: page.height * zoom, boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 25px 50px -12px rgba(0,0,0,0.8)' }}>
            <Stage ref={stageRef} width={page.width * zoom} height={page.height * zoom} scaleX={zoom} scaleY={zoom}
              onClick={(e) => { if (e.target === e.target.getStage()) clearSelection() }}>
              <Layer>
                <Rect x={0} y={0} width={page.width} height={page.height} fill={page.background} listening={false} />
                {showGrid && Array.from({ length: Math.ceil(page.width / 50) }).map((_, i) => (
                  <Rect key={i} x={i*50} y={0} width={1} height={page.height} fill="rgba(255,255,255,0.03)" listening={false} />
                ))}
                {page.layers.filter(l => l.visible).map((layer) => {
                  if (layer.type === 'text') {
                    const t = layer as any
                    return <Text key={layer.id} id={layer.id} x={layer.x} y={layer.y} width={layer.width} text={t.text}
                      fontSize={t.fontSize} fontFamily={t.fontFamily} fill={t.fill} align={t.align} opacity={layer.opacity}
                      fontStyle={Number(t.fontWeight) >= 600 ? 'bold' : 'normal'} draggable={!layer.locked}
                      onClick={() => selectLayers([layer.id])}
                      onDragEnd={(e) => updateLayer(layer.id, { x: e.target.x(), y: e.target.y() })}
                      ref={(node) => { if (node && selectedLayerIds.includes(layer.id)) selectedShapeRef.current = node }}
                    />
                  }
                  if (layer.type === 'rect') {
                    const s = layer as any
                    return <Rect key={layer.id} id={layer.id} x={layer.x} y={layer.y} width={layer.width} height={layer.height}
                      fill={s.fill} cornerRadius={s.cornerRadius||0} opacity={layer.opacity} draggable={!layer.locked}
                      onClick={() => selectLayers([layer.id])}
                      onDragEnd={(e) => updateLayer(layer.id, { x: e.target.x(), y: e.target.y() })}
                      onTransformEnd={(e) => {
                        const n = e.target
                        updateLayer(layer.id, { x: n.x(), y: n.y(), width: Math.max(10, n.width()*n.scaleX()), height: Math.max(10, n.height()*n.scaleY()), rotation: n.rotation() })
                        n.scaleX(1); n.scaleY(1)
                      }}
                      ref={(node) => { if (node && selectedLayerIds.includes(layer.id)) selectedShapeRef.current = node }}
                    />
                  }
                  if (layer.type === 'ellipse') {
                    const s = layer as any
                    return <Circle key={layer.id} id={layer.id} x={layer.x+layer.width/2} y={layer.y+layer.height/2}
                      radius={Math.min(layer.width,layer.height)/2} fill={s.fill} opacity={layer.opacity} draggable={!layer.locked}
                      onClick={() => selectLayers([layer.id])}
                      onDragEnd={(e) => updateLayer(layer.id, { x: e.target.x()-layer.width/2, y: e.target.y()-layer.height/2 })}
                      ref={(node) => { if (node && selectedLayerIds.includes(layer.id)) selectedShapeRef.current = node }}
                    />
                  }
                  return null
                })}
                <Transformer ref={transformerRef} rotateEnabled
                  boundBoxFunc={(oldBox, newBox) => (newBox.width < 10 || newBox.height < 10) ? oldBox : newBox} />
              </Layer>
            </Stage>
          </div>
        </main>
        <aside className="w-56 border-l border-zinc-800 p-4 text-sm text-zinc-400">
          <p className="text-xs uppercase text-zinc-500 mb-2">Properties</p>
          {selectedLayerIds.length === 0 ? (
            <p>Select a layer to edit. Canvas: {page.width}×{page.height}</p>
          ) : (
            <p>{selectedLayerIds.length} layer(s) selected. Use tools above to add shapes/text.</p>
          )}
        </aside>
      </div>
    </div>
  )
}
