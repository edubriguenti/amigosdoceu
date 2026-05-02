import Link from 'next/link'

export default function HomeSecondaryCard({ href, icon, title, description }) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center text-center gap-2 p-4 bg-white/70 border border-amber-200 rounded-xl hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
    >
      <span className="text-3xl" role="img" aria-hidden="true">
        {icon}
      </span>
      <span className="font-serif text-base md:text-lg text-neutral-900 group-hover:text-amber-700 transition-colors">
        {title}
      </span>
      {description && (
        <span className="text-xs text-neutral-600 leading-snug">{description}</span>
      )}
    </Link>
  )
}
