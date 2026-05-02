export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`bg-white/5 animate-pulse rounded-2xl ${className}`}
      aria-hidden="true"
    />
  )
}
