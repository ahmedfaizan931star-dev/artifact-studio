import { Routes, Route, Navigate } from 'react-router-dom'
import { EditorPage } from './features/editor/EditorPage'
import { HomePage } from './app/HomePage'
import { AuthProvider } from './features/auth/AuthProvider'
import { LoginPage } from './features/auth/LoginPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/editor/:id" element={<EditorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
