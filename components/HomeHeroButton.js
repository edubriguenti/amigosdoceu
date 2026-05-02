import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function HomeHeroButton({ href, imageSrc, imageAlt, title, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
    >
      <Link
        href={href}
        className="group block relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 aspect-[16/10] md:aspect-[4/3] motion-safe:hover:scale-[1.02] transition-transform"
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
          priority={index < 2}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/85 transition-colors" />
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
          <h2 className="font-serif text-white text-2xl md:text-3xl lg:text-4xl drop-shadow-md tracking-wide">
            {title}
          </h2>
        </div>
      </Link>
    </motion.div>
  )
}
