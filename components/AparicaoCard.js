import Link from 'next/link'
import FavoritoButton from './FavoritoButton'

export default function AparicaoCard({ aparicao }) {
  return (
    <div className="relative group">
      <Link href={`/aparicoes/${aparicao.slug}`} className="block overflow-hidden rounded-lg">
        <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
          <img src={aparicao.imagem} alt={aparicao.nome} className="w-full h-full object-cover transform group-hover:scale-105 transition" />
        </div>
        <div className="mt-3">
          <h3 className="font-serif text-lg">{aparicao.nome}</h3>
          <p className="text-sm text-gray-600 mt-1">{aparicao.local}</p>
          <p className="text-xs text-gray-500 mt-1">{aparicao.data}</p>
        </div>
      </Link>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <FavoritoButton tipo="aparicoes" item={aparicao} size="sm" />
      </div>
    </div>
  )
}
