import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-serif">
          Amigos do Céu
        </Link>

        <nav className="flex gap-6">
          <Link href="/santos" className="hover:text-gray-600 transition">Santos</Link>
          <Link href="/igrejas" className="hover:text-gray-600 transition">Igrejas</Link>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-6">{children}</main>

      <footer className="py-8 text-center text-sm text-gray-600">
        <div>Que os santos intercedam por nós.</div>
        <div className="mt-2">Créditos das imagens: verificar licenças em /data/santos.json</div>
      </footer>
    </div>
  )
}