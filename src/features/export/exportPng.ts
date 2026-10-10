import type { Stage } from 'konva/lib/Stage'

export function exportStageAsPng(stage: Stage | null, filename = 'artifact-studio-export.png') {
  if (!stage) {
    console.warn('No stage to export')
    return
  }

  const oldScale = stage.scaleX()
  const oldWidth = stage.width()
  const oldHeight = stage.height()

  const pageWidth = oldWidth / oldScale
  const pageHeight = oldHeight / oldScale

  stage.scale({ x: 1, y: 1 })
  stage.size({ width: pageWidth, height: pageHeight })

  const dataURL = stage.toDataURL({
    pixelRatio: 2,
    mimeType: 'image/png'
  })

  stage.scale({ x: oldScale, y: oldScale })
  stage.size({ width: oldWidth, height: oldHeight })

  const link = document.createElement('a')
  link.download = filename
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
