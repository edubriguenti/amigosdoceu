import ChurchCard from './ChurchCard'

export default function ChurchGallery({ churches }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
      {churches.map(church => (
        <ChurchCard key={church.slug} church={church} />
      ))}
    </div>
  )
}
