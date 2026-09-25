import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { diaLocal } from '../lib/datas'
import { getCelebracaoDoDia, getProximasCelebracoes } from '../lib/calendarUtils'

// Data (dia local) da primeira visita. O convite só aparece a partir de outro dia:
// recarregar várias vezes no mesmo dia não conta como visita nova.
const PRIMEIRA_VISITA_KEY = 'amigos-do-ceu-primeira-visita'

export default function NotificacoesLiturgicas() {
  const router = useRouter()
  const [permissao, setPermissao] = useState(null)
  const [promptElegivel, setPromptElegivel] = useState(false)
  // Nunca na home: o painel "Hoje" é a porta de entrada e não pode ficar encoberto.
  const mostrarPrompt = promptElegivel && router.pathname !== '/'
  const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(false)

  useEffect(() => {
    // Verificar se notificações são suportadas
    if (!('Notification' in window)) {
      console.log('Este navegador não suporta notificações')
      return
    }

    // Verificar permissão atual
    setPermissao(Notification.permission)

    // Registrar a primeira visita (só depois que a página montou)
    const hoje = diaLocal()
    let primeiraVisita = hoje
    try {
      primeiraVisita = localStorage.getItem(PRIMEIRA_VISITA_KEY) || hoje
      if (primeiraVisita === hoje) localStorage.setItem(PRIMEIRA_VISITA_KEY, hoje)
    } catch {}

    // Verificar se o usuário já viu o prompt
    const jaViuPrompt = localStorage.getItem('amigos-do-ceu-notificacoes-prompt')
    const notificacoesHabilitadas = localStorage.getItem('amigos-do-ceu-notificacoes-ativadas')

    if (notificacoesHabilitadas === 'true') {
      setNotificacoesAtivadas(true)
      iniciarVerificacoes()
    } else if (!jaViuPrompt && Notification.permission === 'default' && primeiraVisita !== hoje) {
      // A partir do segundo dia de visita, após 3 segundos
      const timer = setTimeout(() => setPromptElegivel(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const solicitarPermissao = async () => {
    try {
      const resultado = await Notification.requestPermission()
      setPermissao(resultado)
      localStorage.setItem('amigos-do-ceu-notificacoes-prompt', 'true')

      if (resultado === 'granted') {
        setNotificacoesAtivadas(true)
        localStorage.setItem('amigos-do-ceu-notificacoes-ativadas', 'true')
        mostrarNotificacaoTeste()
        iniciarVerificacoes()
      }

      setPromptElegivel(false)
    } catch (erro) {
      console.error('Erro ao solicitar permissão:', erro)
    }
  }

  const desativarNotificacoes = () => {
    setNotificacoesAtivadas(false)
    localStorage.setItem('amigos-do-ceu-notificacoes-ativadas', 'false')
    setPromptElegivel(false)
  }

  const mostrarNotificacaoTeste = () => {
    const hoje = new Date()
    const celebracao = getCelebracaoDoDia(hoje)

    const titulo = 'Amigos do Céu - Notificações Ativadas!'
    const corpo = celebracao
      ? `Hoje celebramos: ${celebracao.nome}`
      : 'Você será notificado sobre as celebrações litúrgicas importantes.'

    new Notification(titulo, {
      body: corpo,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'amigos-do-ceu-teste'
    })
  }

  const iniciarVerificacoes = () => {
    // Verificar celebração do dia ao abrir a página
    verificarCelebracaoDoDia()

    // Configurar verificação diária (às 7h da manhã)
    const agora = new Date()
    const proximaVerificacao = new Date()
    proximaVerificacao.setHours(7, 0, 0, 0)

    if (proximaVerificacao <= agora) {
      proximaVerificacao.setDate(proximaVerificacao.getDate() + 1)
    }

    const tempoAteProximaVerificacao = proximaVerificacao.getTime() - agora.getTime()

    setTimeout(() => {
      verificarCelebracaoDoDia()
      // Repetir a cada 24 horas
      setInterval(verificarCelebracaoDoDia, 24 * 60 * 60 * 1000)
    }, tempoAteProximaVerificacao)
  }

  const verificarCelebracaoDoDia = () => {
    if (Notification.permission !== 'granted') return

    const hoje = new Date()
    const celebracao = getCelebracaoDoDia(hoje)

    // Verificar se já notificou hoje
    const ultimaNotificacao = localStorage.getItem('amigos-do-ceu-ultima-notificacao')
    const hojeDateString = hoje.toDateString()

    if (ultimaNotificacao === hojeDateString) {
      return // Já notificou hoje
    }

    if (celebracao && (celebracao.tipo === 'Solenidade' || celebracao.tipo === 'Festa')) {
      const titulo = `🙏 ${celebracao.nome}`
      const corpo = celebracao.descricao

      const notificacao = new Notification(titulo, {
        body: corpo,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'amigos-do-ceu-celebracao',
        requireInteraction: false
      })

      notificacao.onclick = () => {
        window.focus()
        window.location.href = '/santos-do-dia'
      }

      localStorage.setItem('amigos-do-ceu-ultima-notificacao', hojeDateString)
    }
  }

  const fecharPrompt = () => {
    setPromptElegivel(false)
    localStorage.setItem('amigos-do-ceu-notificacoes-prompt', 'true')
  }

  return (
    <AnimatePresence>
      {mostrarPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-6 sm:right-6 z-40 sm:max-w-md"
        >
          <div className="bg-white rounded-lg shadow-2xl border-2 border-amber-400 p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🔔</div>
              <div className="flex-1">
                <h3 className="font-serif text-xl mb-2 text-neutral-800">Receber lembretes?</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Ative as notificações para ser lembrado das celebrações litúrgicas importantes e festas dos santos.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={solicitarPermissao}
                    className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition text-sm font-semibold"
                  >
                    Ativar Notificações
                  </button>
                  <button
                    onClick={fecharPrompt}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm"
                  >
                    Agora Não
                  </button>
                </div>
              </div>
              <button
                onClick={fecharPrompt}
                className="text-neutral-500 hover:text-neutral-700"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
