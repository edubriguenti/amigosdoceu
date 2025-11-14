import Link from 'next/link'

export default function ChurchCard({ church }) {
  return (
    <Link href={`/igrejas/${church.slug}`} className="group block overflow-hidden rounded-lg">
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={church.imagem}
          alt={church.nome}
          className="w-full h-full object-cover transform group-hover:scale-105 transition"
        />
      </div>
      <div className="mt-3">
        <h3 className="font-serif text-lg">{church.nome}</h3>
        <p className="text-sm text-gray-500 mb-1">{church.local}</p>
        <p className="text-sm text-gray-600 line-clamp-2">{church.descricao}</p>
      </div>
    </Link>
  )
}
