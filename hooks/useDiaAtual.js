import { useEffect, useState } from 'react'
import { diaLocal } from '../lib/datas'

/**
 * Escolhe qual dia da janela (lib/hoje.js → janelaDeDias) exibir.
 *
 * - SSR e hidratação: o dia do servidor (`hojeServidor`, data civil de São Paulo),
 *   para o HTML ser idêntico nos dois lados.
 * - Após o mount: se o dia local do usuário estiver na janela e for diferente, troca.
 *
 * É o único lugar que conhece essa troca; componentes só recebem o dia pronto.
 */
export default function useDiaAtual(dias, hojeServidor) {
  const [iso, setIso] = useState(hojeServidor)

  useEffect(() => {
    const local = diaLocal()
    if (local !== hojeServidor && dias?.[local]) setIso(local)
  }, [dias, hojeServidor])

  return dias?.[iso] || dias?.[hojeServidor] || null
}
