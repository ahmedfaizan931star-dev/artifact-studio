import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthProvider'
import { useEditorStore } from '@/features/editor/store'

export function HomePage() {
  const { user, signOut } = useAuth()
  const createPost = useEditorStore((s) => s.createPost)
  const createDeck = useEditorStore((s) => s.createDeck)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">AS</div>
            <span className="font-semibold text-lg tracking-tight">Artifact Studio</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-zinc-400">{user.email}</span>
                <button onClick={() => signOut()} className="text-sm text-zinc-400 hover:text-white">Sign out</button>
              </>
            ) : (
              <Link to="/login" className="text-sm px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition">Sign in</Link>
            )}
          </div>
        </div>
      </header>
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          Design posts & decks<br />
          <span className="text-blue-500">with deterministic intelligence</span>
        </h1>
        <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
          Better than Canva. Design-system native. Less AI dependency. More intelligence.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/editor" onClick={() => createPost('instagram-square')}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-medium transition">Create a Post</Link>
          <Link to="/editor" onClick={() => createDeck()}
            className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-medium transition border border-zinc-700">Create a Deck</Link>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">
        {[
          { title: 'Deterministic Layout', desc: 'Constraint solvers and content analysis instead of random generative AI.' },
          { title: 'Design System First', desc: 'Tokens and components are law. Brand consistency is enforced.' },
          { title: 'Posts + Decks', desc: 'One unified canvas for social formats and multi-page presentations.' }
        ].map((f) => (
          <div key={f.title} className="p-6 rounded-2xl bg-[#111] border border-zinc-800">
            <h3 className="font-semibold text-lg">{f.title}</h3>
            <p className="mt-2 text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>
      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
        Artifact Studio — Built for the ArtifactLoop ecosystem
      </footer>
    </div>
  )
}
