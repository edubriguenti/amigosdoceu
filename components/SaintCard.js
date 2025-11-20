import Link from 'next/link'
import FavoritoButton from './FavoritoButton'

export default function SaintCard({ saint }) {
  return (
    <div className="relative group">
      <Link href={`/santos/${saint.slug}`} className="block overflow-hidden rounded-lg">
        <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
          <img src={saint.imagem} alt={saint.nome} className="w-full h-full object-cover transform group-hover:scale-105 transition" />
        </div>
        <div className="mt-3">
          <h3 className="font-serif text-lg">{saint.nome}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{saint.descricao}</p>
        </div>
      </Link>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <FavoritoButton tipo="santos" item={saint} size="sm" />
      </div>
    </div>
  )
}