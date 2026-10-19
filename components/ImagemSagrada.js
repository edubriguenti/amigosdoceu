import { useState } from 'react'
import Image from 'next/image'
import PlaceholderSagrado from './PlaceholderSagrado'

/**
 * `next/image` (fill) que cai no placeholder temático quando não há `src` ou o carregamento
 * falha (imagens remotas do Wikimedia podem responder 429/500). O pai precisa ser `relative`.
 * A falha é guardada junto com o `src`, então trocar de imagem tenta de novo.
 */
export default function ImagemSagrada({ src, icone, compacto, ...props }) {
  const [falhou, setFalhou] = useState(null)
  if (!src || falhou === src) return <PlaceholderSagrado icone={icone} compacto={compacto} />
  // eslint-disable-next-line jsx-a11y/alt-text -- alt vem em props
  return <Image src={src} onError={() => setFalhou(src)} fill {...props} />
}
