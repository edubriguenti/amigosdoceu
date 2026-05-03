import Link from 'next/link'

export default function HomeSecondaryCard({ href, icon, title, description }) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center text-center gap-2 p-4 bg-cosmic-surface/60 border border-cosmic-border rounded-xl hover:bg-cosmic-surface-2 hover:shadow-md hover:-translate-y-0.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-blue focus-visible:ring-offset-2"
    >
      <span className="text-3xl" role="img" aria-hidden="true">
        {icon}
      </span>
      <span className="font-serif text-base md:text-lg text-neutral-100 group-hover:text-cosmic-gold transition-colors">
        {title}
      </span>
      {description && (
        <span className="text-xs text-neutral-400 leading-snug">{description}</span>
      )}
    </Link>
  )
}
