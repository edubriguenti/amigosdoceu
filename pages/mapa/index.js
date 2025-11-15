import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import MapaInterativo from '../../components/MapaInterativo';
import igrejasData from '../../data/igrejas.json';
import aparicoesData from '../../data/aparicoes.json';

export default function MapaPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-parchment py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-serif text-amber-900 mb-4">
              Mapa Interativo de Igrejas e Aparições
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Explore os locais sagrados ao redor do mundo, descubra igrejas próximas a você
              e conheça as rotas de peregrinação mais famosas.
            </p>
          </motion.div>

          {/* Informações sobre o Mapa */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border-2 border-amber-900/20 rounded-lg p-6 mb-8 shadow-lg"
          >
            <h2 className="text-2xl font-serif text-amber-900 mb-4">Como usar o mapa</h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-700">
              <div>
                <h3 className="font-bold text-lg mb-2 text-amber-800">Navegação</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Clique e arraste para mover o mapa</li>
                  <li>Use a roda do mouse ou os botões +/- para zoom</li>
                  <li>Clique em um marcador para ver detalhes</li>
                  <li>Use os filtros para exibir apenas igrejas ou aparições</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-amber-800">Funcionalidades</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Encontre igrejas e aparições próximas à sua localização</li>
                  <li>Visualize rotas de peregrinação famosas</li>
                  <li>Acesse informações detalhadas de cada local</li>
                  <li>Calcule distâncias a partir da sua posição</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Componente do Mapa */}
          <MapaInterativo igrejas={igrejasData} aparicoes={aparicoesData} />

          {/* Estatísticas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            <div className="bg-white border-2 border-amber-900/20 rounded-lg p-6 text-center shadow-lg">
              <div className="text-4xl font-bold text-amber-900 mb-2">
                {igrejasData.length}
              </div>
              <div className="text-gray-700 font-serif">Igrejas Catalogadas</div>
            </div>
            <div className="bg-white border-2 border-amber-900/20 rounded-lg p-6 text-center shadow-lg">
              <div className="text-4xl font-bold text-amber-900 mb-2">
                {aparicoesData.length}
              </div>
              <div className="text-gray-700 font-serif">Aparições Marianas</div>
            </div>
            <div className="bg-white border-2 border-amber-900/20 rounded-lg p-6 text-center shadow-lg">
              <div className="text-4xl font-bold text-amber-900 mb-2">
                {igrejasData.length + aparicoesData.length}
              </div>
              <div className="text-gray-700 font-serif">Locais Sagrados</div>
            </div>
          </motion.div>

          {/* Informações sobre Peregrinações */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 bg-white border-2 border-amber-900/20 rounded-lg p-8 shadow-lg"
          >
            <h2 className="text-3xl font-serif text-amber-900 mb-6 text-center">
              Rotas de Peregrinação
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-amber-800 mb-3">
                  Caminho de Santiago
                </h3>
                <p className="text-gray-700">
                  Uma das mais famosas rotas de peregrinação do mundo, o Caminho de Santiago
                  leva milhões de peregrinos anualmente até a Catedral de Santiago de Compostela,
                  na Espanha, onde se encontra o túmulo do apóstolo Santiago Maior.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-800 mb-3">
                  Rota Mariana Europeia
                </h3>
                <p className="text-gray-700">
                  Conecta os principais santuários marianos da Europa, incluindo Fátima,
                  Lourdes e La Salette. Esta rota permite aos peregrinos visitarem os locais
                  das mais importantes aparições de Nossa Senhora.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
