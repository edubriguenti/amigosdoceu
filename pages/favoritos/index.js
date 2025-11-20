import { useState } from 'react';
import Layout from '../../components/Layout';
import { useFavoritos } from '../../hooks/useFavoritos';
import SaintCard from '../../components/SaintCard';
import ChurchCard from '../../components/ChurchCard';
import AparicaoCard from '../../components/AparicaoCard';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function FavoritosPage() {
  const {
    favoritos,
    listas,
    loaded,
    createLista,
    updateLista,
    deleteLista,
    addToLista,
    removeFromLista,
    exportAsText,
    exportAsJSON,
    clearAllFavoritos
  } = useFavoritos();

  const [activeTab, setActiveTab] = useState('todos');
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [showAddToListModal, setShowAddToListModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingLista, setEditingLista] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  const getTotalFavorites = () => {
    return (favoritos.santos?.length || 0) +
      (favoritos.igrejas?.length || 0) +
      (favoritos.aparicoes?.length || 0);
  };

  const handleExportText = () => {
    const text = exportAsText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `favoritos-amigos-do-ceu-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const json = exportAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `favoritos-amigos-do-ceu-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateList = () => {
    if (newListName.trim()) {
      createLista(newListName.trim(), newListDesc.trim());
      setNewListName('');
      setNewListDesc('');
      setShowCreateListModal(false);
    }
  };

  const handleUpdateList = () => {
    if (editingLista && newListName.trim()) {
      updateLista(editingLista.id, {
        nome: newListName.trim(),
        descricao: newListDesc.trim()
      });
      setEditingLista(null);
      setNewListName('');
      setNewListDesc('');
    }
  };

  const handleDeleteList = (listaId) => {
    if (confirm('Tem certeza que deseja excluir esta lista?')) {
      deleteLista(listaId);
    }
  };

  const handleAddToList = (listaId) => {
    if (selectedItem) {
      addToLista(listaId, selectedItem.tipo, selectedItem.item);
      setShowAddToListModal(false);
      setSelectedItem(null);
    }
  };

  const openAddToListModal = (tipo, item) => {
    setSelectedItem({ tipo, item });
    setShowAddToListModal(true);
  };

  const startEditList = (lista) => {
    setEditingLista(lista);
    setNewListName(lista.nome);
    setNewListDesc(lista.descricao);
  };

  if (!loaded) {
    return (
      <Layout title="Meus Favoritos">
        <div className="py-12 text-center">
          <p className="text-neutral-600">Carregando favoritos...</p>
        </div>
      </Layout>
    );
  }

  const totalFavorites = getTotalFavorites();

  return (
    <Layout title="Meus Favoritos - Amigos do Céu">
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-neutral-900 mb-2">Meus Favoritos</h1>
          <p className="text-neutral-600">
            {totalFavorites === 0
              ? 'Você ainda não tem favoritos. Explore o site e favorite seus santos, igrejas e aparições preferidos!'
              : `Você tem ${totalFavorites} ${totalFavorites === 1 ? 'favorito' : 'favoritos'} salvos`
            }
          </p>
        </div>

        {/* Actions */}
        {totalFavorites > 0 && (
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={handleExportText}
              className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium"
            >
              📄 Exportar como Texto
            </button>
            <button
              onClick={handleExportJSON}
              className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium"
            >
              💾 Exportar como JSON
            </button>
            <button
              onClick={() => setShowCreateListModal(true)}
              className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors text-sm font-medium"
            >
              ➕ Criar Lista
            </button>
            <button
              onClick={() => {
                if (confirm('Tem certeza que deseja limpar todos os favoritos?')) {
                  clearAllFavoritos();
                }
              }}
              className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium ml-auto"
            >
              🗑️ Limpar Tudo
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-neutral-200 mb-6">
          <nav className="flex gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('todos')}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'todos'
                  ? 'border-accent-500 text-accent-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              Todos ({totalFavorites})
            </button>
            <button
              onClick={() => setActiveTab('santos')}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'santos'
                  ? 'border-accent-500 text-accent-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              📿 Santos ({favoritos.santos?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('igrejas')}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'igrejas'
                  ? 'border-accent-500 text-accent-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              ⛪ Igrejas ({favoritos.igrejas?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('aparicoes')}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'aparicoes'
                  ? 'border-accent-500 text-accent-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              ✨ Aparições ({favoritos.aparicoes?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('listas')}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'listas'
                  ? 'border-accent-500 text-accent-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              📋 Minhas Listas ({listas?.length || 0})
            </button>
          </nav>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'todos' && (
            <motion.div
              key="todos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {totalFavorites === 0 ? (
                <EmptyState />
              ) : (
                <>
                  {favoritos.santos?.length > 0 && (
                    <Section title="Santos" icon="📿">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {favoritos.santos.map(santo => (
                          <div key={santo.slug} className="relative">
                            <SaintCard saint={santo} />
                            <button
                              onClick={() => openAddToListModal('santos', santo)}
                              className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors flex items-center justify-center text-sm"
                              title="Adicionar a uma lista"
                            >
                              ➕
                            </button>
                          </div>
                        ))}
                      </div>
                    </Section>
                  )}

                  {favoritos.igrejas?.length > 0 && (
                    <Section title="Igrejas" icon="⛪">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {favoritos.igrejas.map(igreja => (
                          <div key={igreja.slug} className="relative">
                            <ChurchCard church={igreja} />
                            <button
                              onClick={() => openAddToListModal('igrejas', igreja)}
                              className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors flex items-center justify-center text-sm"
                              title="Adicionar a uma lista"
                            >
                              ➕
                            </button>
                          </div>
                        ))}
                      </div>
                    </Section>
                  )}

                  {favoritos.aparicoes?.length > 0 && (
                    <Section title="Aparições Marianas" icon="✨">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {favoritos.aparicoes.map(aparicao => (
                          <div key={aparicao.slug} className="relative">
                            <AparicaoCard aparicao={aparicao} />
                            <button
                              onClick={() => openAddToListModal('aparicoes', aparicao)}
                              className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors flex items-center justify-center text-sm"
                              title="Adicionar a uma lista"
                            >
                              ➕
                            </button>
                          </div>
                        ))}
                      </div>
                    </Section>
                  )}
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'santos' && (
            <motion.div
              key="santos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {favoritos.santos?.length === 0 ? (
                <EmptyState message="Você ainda não favoritou nenhum santo." />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {favoritos.santos.map(santo => (
                    <div key={santo.slug} className="relative">
                      <SaintCard saint={santo} />
                      <button
                        onClick={() => openAddToListModal('santos', santo)}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors flex items-center justify-center text-sm"
                        title="Adicionar a uma lista"
                      >
                        ➕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'igrejas' && (
            <motion.div
              key="igrejas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {favoritos.igrejas?.length === 0 ? (
                <EmptyState message="Você ainda não favoritou nenhuma igreja." />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {favoritos.igrejas.map(igreja => (
                    <div key={igreja.slug} className="relative">
                      <ChurchCard church={igreja} />
                      <button
                        onClick={() => openAddToListModal('igrejas', igreja)}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors flex items-center justify-center text-sm"
                        title="Adicionar a uma lista"
                      >
                        ➕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'aparicoes' && (
            <motion.div
              key="aparicoes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {favoritos.aparicoes?.length === 0 ? (
                <EmptyState message="Você ainda não favoritou nenhuma aparição mariana." />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {favoritos.aparicoes.map(aparicao => (
                    <div key={aparicao.slug} className="relative">
                      <AparicaoCard aparicao={aparicao} />
                      <button
                        onClick={() => openAddToListModal('aparicoes', aparicao)}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors flex items-center justify-center text-sm"
                        title="Adicionar a uma lista"
                      >
                        ➕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'listas' && (
            <motion.div
              key="listas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {listas.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-600 mb-4">Você ainda não criou nenhuma lista personalizada.</p>
                  <button
                    onClick={() => setShowCreateListModal(true)}
                    className="px-6 py-3 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors font-medium"
                  >
                    ➕ Criar Minha Primeira Lista
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {listas.map(lista => (
                    <div key={lista.id} className="bg-white rounded-lg border border-neutral-200 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-serif text-neutral-900 mb-1">
                            📋 {lista.nome}
                          </h3>
                          {lista.descricao && (
                            <p className="text-sm text-neutral-600">{lista.descricao}</p>
                          )}
                          <p className="text-xs text-neutral-500 mt-2">
                            {lista.items.length} {lista.items.length === 1 ? 'item' : 'itens'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditList(lista)}
                            className="px-3 py-1 text-sm text-neutral-600 hover:text-accent-600 transition-colors"
                            title="Editar lista"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteList(lista.id)}
                            className="px-3 py-1 text-sm text-neutral-600 hover:text-red-600 transition-colors"
                            title="Excluir lista"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {lista.items.length === 0 ? (
                        <p className="text-sm text-neutral-500 italic">Lista vazia. Adicione itens dos seus favoritos.</p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {lista.items.map((item, idx) => (
                            <div key={`${item.tipo}-${item.slug}-${idx}`} className="relative">
                              {item.tipo === 'santos' && <SaintCard saint={item} />}
                              {item.tipo === 'igrejas' && <ChurchCard church={item} />}
                              {item.tipo === 'aparicoes' && <AparicaoCard aparicao={item} />}
                              <button
                                onClick={() => removeFromLista(lista.id, item.tipo, item.slug)}
                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full shadow-sm hover:bg-red-600 transition-colors flex items-center justify-center text-sm"
                                title="Remover da lista"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal: Criar/Editar Lista */}
        {(showCreateListModal || editingLista) && (
          <Modal
            onClose={() => {
              setShowCreateListModal(false);
              setEditingLista(null);
              setNewListName('');
              setNewListDesc('');
            }}
          >
            <h2 className="text-2xl font-serif mb-4">
              {editingLista ? 'Editar Lista' : 'Criar Nova Lista'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Nome da Lista *
                </label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Ex: Santos Padroeiros, Igrejas para Visitar"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                  maxLength={50}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  placeholder="Uma breve descrição da sua lista..."
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                  rows={3}
                  maxLength={200}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowCreateListModal(false);
                    setEditingLista(null);
                    setNewListName('');
                    setNewListDesc('');
                  }}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={editingLista ? handleUpdateList : handleCreateList}
                  disabled={!newListName.trim()}
                  className="px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingLista ? 'Salvar Alterações' : 'Criar Lista'}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal: Adicionar a Lista */}
        {showAddToListModal && selectedItem && (
          <Modal onClose={() => {
            setShowAddToListModal(false);
            setSelectedItem(null);
          }}>
            <h2 className="text-2xl font-serif mb-2">Adicionar a uma Lista</h2>
            <p className="text-sm text-neutral-600 mb-6">
              Adicionar <strong>{selectedItem.item.nome}</strong> a:
            </p>

            {listas.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral-600 mb-4">Você ainda não tem listas.</p>
                <button
                  onClick={() => {
                    setShowAddToListModal(false);
                    setShowCreateListModal(true);
                  }}
                  className="px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
                >
                  Criar Lista
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {listas.map(lista => {
                  const alreadyInList = lista.items.some(
                    item => item.tipo === selectedItem.tipo && item.slug === selectedItem.item.slug
                  );
                  return (
                    <button
                      key={lista.id}
                      onClick={() => handleAddToList(lista.id)}
                      disabled={alreadyInList}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                        alreadyInList
                          ? 'border-neutral-200 bg-neutral-50 text-neutral-400 cursor-not-allowed'
                          : 'border-neutral-300 hover:border-accent-500 hover:bg-accent-50'
                      }`}
                    >
                      <div className="font-medium">{lista.nome}</div>
                      {lista.descricao && (
                        <div className="text-sm text-neutral-600">{lista.descricao}</div>
                      )}
                      {alreadyInList && (
                        <div className="text-xs text-neutral-500 mt-1">✓ Já está nesta lista</div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </Modal>
        )}
      </div>
    </Layout>
  );
}

// Componente auxiliar: Section
function Section({ title, icon, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-serif text-neutral-900 mb-4 flex items-center gap-2">
        <span>{icon}</span>
        <span>{title}</span>
      </h2>
      {children}
    </div>
  );
}

// Componente auxiliar: Empty State
function EmptyState({ message }) {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🤍</div>
      <p className="text-neutral-600 mb-6">
        {message || 'Você ainda não tem favoritos.'}
      </p>
      <Link href="/santos" className="inline-block px-6 py-3 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors font-medium">
        Explorar Santos
      </Link>
    </div>
  );
}

// Componente auxiliar: Modal
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
      >
        {children}
      </motion.div>
    </div>
  );
}
