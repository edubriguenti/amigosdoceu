import Link from 'next/link';

/**
 * Footer expandido — funciona como mapa do site para crawlers.
 * Inclui todas as seções principais para distribuição de PageRank
 * e descoberta de conteúdo a partir de qualquer página.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const linkClass =
    'inline-flex items-center min-h-11 hover:text-white transition-colors focus:outline-none focus:underline';

  return (
    <footer className="bg-cosmic-bg text-neutral-300 mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">

          {/* Coluna 1: Sobre */}
          <div>
            <h3 className="font-serif text-xl text-white mb-4">Amigos do Céu</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Uma jornada contemplativa pela fé católica, conectando você aos santos,
              igrejas históricas, aparições marianas e às conexões da Bíblia.
            </p>
          </div>

          {/* Coluna 2: Explorar */}
          <div>
            <h4 className="font-semibold text-white mb-4">Explorar</h4>
            <ul className="space-y-0 text-sm">
              <li><Link href="/santos" className={linkClass}>Santos Católicos</Link></li>
              <li><Link href="/igrejas" className={linkClass}>Igrejas e Basílicas</Link></li>
              <li><Link href="/aparicoes" className={linkClass}>Aparições Marianas</Link></li>
              <li><Link href="/mapa" className={linkClass}>Mapa Interativo</Link></li>
              <li><Link href="/conexoes" className={linkClass}>Conexões da Bíblia</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Devoção */}
          <div>
            <h4 className="font-semibold text-white mb-4">Devoção</h4>
            <ul className="space-y-0 text-sm">
              <li><Link href="/vida-de-cristo" className={linkClass}>Vida de Cristo</Link></li>
              <li><Link href="/oracoes" className={linkClass}>Orações Católicas</Link></li>
              <li><Link href="/novenas" className={linkClass}>Novenas</Link></li>
              <li><Link href="/rosario" className={linkClass}>Rosário</Link></li>
              <li><Link href="/intencoes" className={linkClass}>Minhas Intenções</Link></li>
            </ul>
          </div>

          {/* Coluna 4: Recursos */}
          <div>
            <h4 className="font-semibold text-white mb-4">Recursos</h4>
            <ul className="space-y-0 text-sm">
              <li><Link href="/santos-do-dia" className={linkClass}>Santos do Dia</Link></li>
              <li><Link href="/calendario" className={linkClass}>Calendário Litúrgico</Link></li>
              <li><Link href="/album-sagrado" className={linkClass}>Álbum Sagrado</Link></li>
              <li><Link href="/minha-jornada" className={linkClass}>Minha Jornada</Link></li>
              <li><Link href="/favoritos" className={linkClass}>Meus Favoritos</Link></li>
              <li><a href="#creditos" className={linkClass}>Créditos de Imagens</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-cosmic-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-400">
            <p>&copy; {currentYear} Amigos do Céu. Todos os direitos reservados.</p>
            <p className="italic text-center">"Que os santos intercedam por nós."</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
