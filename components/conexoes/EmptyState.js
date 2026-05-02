export default function EmptyState({ icon = '✨', titulo, descricao, acao }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white/5 backdrop-blur-md border border-cosmic-border rounded-2xl">
      <div className="text-5xl mb-4 opacity-70" aria-hidden="true">{icon}</div>
      <h3 className="font-serif text-xl text-neutral-100 mb-2">{titulo}</h3>
      {descricao && <p className="text-sm text-neutral-400 max-w-sm">{descricao}</p>}
      {acao && <div className="mt-5">{acao}</div>}
    </div>
  )
}
