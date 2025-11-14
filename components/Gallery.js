import SaintCard from './SaintCard'

export default function Gallery({ saints }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
      {saints.map(s => (
        <SaintCard key={s.slug} saint={s} />
      ))}
    </div>
  )
}
