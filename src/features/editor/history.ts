/**
 * Simple undo/redo history for the editor store.
 * Keeps snapshots of the artifact state.
 */
import type { Artifact } from '@/types/document'

const MAX_HISTORY = 50

export class EditorHistory {
  private past: Artifact[] = []
  private future: Artifact[] = []

  push(artifact: Artifact) {
    this.past.push(JSON.parse(JSON.stringify(artifact)))
    if (this.past.length > MAX_HISTORY) {
      this.past.shift()
    }
    this.future = []
  }

  undo(current: Artifact): Artifact | null {
    if (this.past.length === 0) return null
    this.future.push(JSON.parse(JSON.stringify(current)))
    return this.past.pop()!
  }

  redo(current: Artifact): Artifact | null {
    if (this.future.length === 0) return null
    this.past.push(JSON.parse(JSON.stringify(current)))
    return this.future.pop()!
  }

  canUndo() {
    return this.past.length > 0
  }

  canRedo() {
    return this.future.length > 0
  }

  clear() {
    this.past = []
    this.future = []
  }
}

export const editorHistory = new EditorHistory()
