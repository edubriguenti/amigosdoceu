import Link from 'next/link'
import ImagemSagrada from './ImagemSagrada'
import FavoritoButton from './FavoritoButton'

export default function SaintCard({ saint }) {
  return (
    <div className="relative group">
      <Link href={`/santos/${saint.slug}`} className="block overflow-hidden rounded-lg">
        <div className="relative aspect-[4/5] bg-cosmic-surface overflow-hidden">
          <ImagemSagrada
              src={saint.imagem}
              icone="✨"
              alt={`Imagem de ${saint.nome}${saint.periodo ? ' — ' + saint.periodo : ''}`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transform group-hover:scale-105 transition"
            />
        </div>
        <div className="mt-3">
          <h3 className="font-serif text-lg">{saint.nome}</h3>
          <p className="text-sm text-neutral-400 line-clamp-2">{saint.descricao}</p>
        </div>
      </Link>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <FavoritoButton tipo="santos" item={saint} size="sm" />
      </div>
    </div>
  )
}
