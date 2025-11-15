import Link from 'next/link'

export default function AparicaoCard({ aparicao }) {
  return (
    <Link href={`/aparicoes/${aparicao.slug}`} className="group block overflow-hidden rounded-lg">
      <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
        <img src={aparicao.imagem} alt={aparicao.nome} className="w-full h-full object-cover transform group-hover:scale-105 transition" />
      </div>
      <div className="mt-3">
        <h3 className="font-serif text-lg">{aparicao.nome}</h3>
        <p className="text-sm text-gray-600 mt-1">{aparicao.local}</p>
        <p className="text-xs text-gray-500 mt-1">{aparicao.data}</p>
      </div>
    </Link>
  )
}
