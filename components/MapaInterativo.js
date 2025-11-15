import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Importar componentes do Leaflet de forma dinâmica (sem SSR)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);

export default function MapaInterativo({ igrejas, aparicoes }) {
  const [locaisVisiveis, setLocaisVisiveis] = useState('todos');
  const [mapaCarregado, setMapaCarregado] = useState(false);
  const [localizacaoUsuario, setLocalizacaoUsuario] = useState(null);
  const [mostrarRotas, setMostrarRotas] = useState(false);
  const [L, setL] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Importar Leaflet CSS e biblioteca
    import('leaflet/dist/leaflet.css');
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);

      // Corrigir ícones padrão do Leaflet
      delete leaflet.default.Icon.Default.prototype._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      setMapaCarregado(true);
    });
  }, []);

  // Função para obter localização do usuário
  const obterLocalizacao = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocalizacaoUsuario({ lat: latitude, lng: longitude });

          // Centralizar mapa na localização do usuário
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 6);
          }
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          alert('Não foi possível obter sua localização. Verifique as permissões do navegador.');
        }
      );
    } else {
      alert('Geolocalização não é suportada pelo seu navegador.');
    }
  };

  // Calcular distância entre dois pontos (fórmula de Haversine)
  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Encontrar igrejas próximas
  const encontrarIgrejasProximas = () => {
    if (!localizacaoUsuario) {
      alert('Por favor, primeiro obtenha sua localização clicando no botão "Minha Localização".');
      return [];
    }

    const todasIgrejas = [...igrejas, ...aparicoes];
    const igrejasComDistancia = todasIgrejas
      .filter(local => local.latitude && local.longitude)
      .map(local => ({
        ...local,
        distancia: calcularDistancia(
          localizacaoUsuario.lat,
          localizacaoUsuario.lng,
          local.latitude,
          local.longitude
        )
      }))
      .sort((a, b) => a.distancia - b.distancia);

    return igrejasComDistancia;
  };

  // Criar ícones personalizados
  const criarIcone = (tipo) => {
    if (!L) return null;

    const cores = {
      igreja: '#8b4513',
      aparicao: '#4169e1',
      usuario: '#ff0000'
    };

    return L.divIcon({
      className: 'custom-icon',
      html: `<div style="background-color: ${cores[tipo]}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
      iconSize: [25, 25],
      iconAnchor: [12, 12],
    });
  };

  // Rotas de peregrinação famosas
  const rotasPeregrinacao = [
    {
      nome: 'Caminho de Santiago',
      pontos: [
        [43.3623, -8.4115], // Santiago de Compostela
        [42.8805, -8.5447], // Catedral
      ],
      cor: '#ff6b6b'
    },
    {
      nome: 'Rota Mariana Europeia',
      pontos: [
        [39.6319, -8.6725],  // Fátima
        [43.0948, -0.0467],  // Lourdes
        [44.8658, 5.9892],   // La Salette
      ],
      cor: '#4ecdc4'
    }
  ];

  // Filtrar locais visíveis
  const locaisFiltrados = () => {
    const todos = [];

    if (locaisVisiveis === 'todos' || locaisVisiveis === 'igrejas') {
      todos.push(...igrejas.map(i => ({ ...i, tipo: 'igreja' })));
    }

    if (locaisVisiveis === 'todos' || locaisVisiveis === 'aparicoes') {
      todos.push(...aparicoes.map(a => ({ ...a, tipo: 'aparicao' })));
    }

    return todos.filter(local => local.latitude && local.longitude);
  };

  if (!mapaCarregado) {
    return (
      <div className="flex items-center justify-center h-96 bg-parchment">
        <p className="text-gray-600">Carregando mapa...</p>
      </div>
    );
  }

  const igrejasProximas = localizacaoUsuario ? encontrarIgrejasProximas().slice(0, 5) : [];

  return (
    <div className="space-y-6">
      {/* Controles do Mapa */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-2 border-amber-900/20 rounded-lg p-6 shadow-lg"
      >
        <h3 className="text-xl font-serif text-amber-900 mb-4">Controles do Mapa</h3>

        <div className="flex flex-wrap gap-4 mb-4">
          {/* Filtros */}
          <div className="flex gap-2">
            <button
              onClick={() => setLocaisVisiveis('todos')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                locaisVisiveis === 'todos'
                  ? 'bg-amber-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setLocaisVisiveis('igrejas')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                locaisVisiveis === 'igrejas'
                  ? 'bg-amber-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Igrejas
            </button>
            <button
              onClick={() => setLocaisVisiveis('aparicoes')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                locaisVisiveis === 'aparicoes'
                  ? 'bg-amber-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Aparições
            </button>
          </div>

          {/* Geolocalização */}
          <button
            onClick={obterLocalizacao}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Minha Localização
          </button>

          {/* Rotas */}
          <button
            onClick={() => setMostrarRotas(!mostrarRotas)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mostrarRotas
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {mostrarRotas ? 'Ocultar Rotas' : 'Mostrar Rotas de Peregrinação'}
          </button>
        </div>

        {/* Legenda */}
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#8b4513] border-2 border-white"></div>
            <span>Igrejas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#4169e1] border-2 border-white"></div>
            <span>Aparições</span>
          </div>
          {localizacaoUsuario && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white"></div>
              <span>Sua Localização</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Mapa */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="border-4 border-amber-900/30 rounded-lg overflow-hidden shadow-xl"
      >
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '600px', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Marcadores de locais */}
          {locaisFiltrados().map((local, index) => (
            <Marker
              key={`${local.tipo}-${index}`}
              position={[local.latitude, local.longitude]}
              icon={criarIcone(local.tipo === 'igreja' ? 'igreja' : 'aparicao')}
            >
              <Popup>
                <div className="p-2 max-w-xs">
                  <h4 className="font-serif text-lg font-bold text-amber-900 mb-2">
                    {local.nome}
                  </h4>
                  {local.local && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Local:</strong> {local.local}
                    </p>
                  )}
                  {local.ano && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Ano:</strong> {local.ano}
                    </p>
                  )}
                  {local.data && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Data:</strong> {local.data}
                    </p>
                  )}
                  <Link
                    href={local.tipo === 'igreja' ? `/igrejas/${local.slug}` : `/aparicoes/${local.slug}`}
                    className="inline-block mt-2 px-3 py-1 bg-amber-900 text-white text-sm rounded hover:bg-amber-800 transition-colors"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Marcador de localização do usuário */}
          {localizacaoUsuario && L && (
            <Marker
              position={[localizacaoUsuario.lat, localizacaoUsuario.lng]}
              icon={criarIcone('usuario')}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-bold">Você está aqui</h4>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Rotas de peregrinação */}
          {mostrarRotas && rotasPeregrinacao.map((rota, index) => (
            <Polyline
              key={index}
              positions={rota.pontos}
              color={rota.cor}
              weight={3}
              opacity={0.7}
            />
          ))}
        </MapContainer>
      </motion.div>

      {/* Igrejas Próximas */}
      {localizacaoUsuario && igrejasProximas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-amber-900/20 rounded-lg p-6 shadow-lg"
        >
          <h3 className="text-xl font-serif text-amber-900 mb-4">Locais Mais Próximos de Você</h3>
          <div className="space-y-3">
            {igrejasProximas.map((local, index) => (
              <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-3">
                <div>
                  <h4 className="font-semibold text-gray-800">{local.nome}</h4>
                  <p className="text-sm text-gray-600">{local.local}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-amber-900">
                    {local.distancia.toFixed(0)} km
                  </p>
                  <Link
                    href={local.tipo === 'igreja' ? `/igrejas/${local.slug}` : `/aparicoes/${local.slug}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
