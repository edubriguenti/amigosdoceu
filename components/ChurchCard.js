import Link from 'next/link'
import ImagemSagrada from './ImagemSagrada'
import FavoritoButton from './FavoritoButton'

export default function ChurchCard({ church }) {
  return (
    <div className="relative group">
      <Link href={`/igrejas/${church.slug}`} className="block overflow-hidden rounded-lg">
        <div className="relative aspect-[4/3] bg-cosmic-surface overflow-hidden">
          <ImagemSagrada
            src={church.imagem}
            icone="⛪"
            alt={church.nome}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transform group-hover:scale-105 transition"
          />
        </div>
        <div className="mt-3">
          <h3 className="font-serif text-lg">{church.nome}</h3>
          <p className="text-sm text-neutral-400 mb-1">{church.local}</p>
          <p className="text-sm text-neutral-400 line-clamp-2">{church.descricao}</p>
        </div>
      </Link>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <FavoritoButton tipo="igrejas" item={church} size="sm" />
      </div>
    </div>
  )
}
