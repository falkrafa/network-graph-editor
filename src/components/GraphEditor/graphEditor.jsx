import CytoscapeComponent from 'react-cytoscapejs';
import Modal from 'react-modal';

const GraphEditor = ({
  elements,
  modes,
  setModes,
  graphInfos,
  setGraphInfos,
  onAddEdge,
  onSetGraphType,
  onClearGraph,
  cyRef,
  editorStyle,
  onDownloadGraphImage,
  setVertexInfo,
  vertexInfo,
  onGetNeighbors,
  onGetDegree,
  onCheckIfNeighbors,
  onGetShortestPath,
  pathInfo,
  setPathInfo,
  modalOpen,
  setModalOpen,
  batchInput,
  setBatchInput,
  onBatchSubmit,
}) => (
  <div>
    <label>
      <input
        type='checkbox'
        checked={graphInfos.isDirected}
        onChange={() => onSetGraphType(!graphInfos.isDirected)}
      />
      Grafo Direcionado
    </label>
    <button onClick={onClearGraph}>Limpar Grafo</button>
    <button onClick={() => setModes(prevState => ({ ...prevState, isRemovalMode: !modes.isRemovalMode }))}>
      {modes.isRemovalMode ? 'Desativar Modo de Remoção' : 'Ativar Modo de Remoção'}
    </button>

    <button onClick={() => setModes(prevState => ({ ...prevState, isAddMode: !modes.isAddMode }))}>
      {modes.isAddMode ? 'Cancelar adição' : 'Adicionar Vértice'}
    </button>

    <input
      type="text"
      value={graphInfos.edge.u}
      onChange={e => setGraphInfos({ ...graphInfos, edge: { ...graphInfos.edge, u: e.target.value } })}
      placeholder="Início da Aresta"
    />
    <input
      type="text"
      value={graphInfos.edge.v}
      onChange={e => setGraphInfos({ ...graphInfos, edge: { ...graphInfos.edge, v: e.target.value } })}
      placeholder="Fim da Aresta"
    />
    <input
      type="text"
      value={graphInfos.edge.weight}
      onChange={e => setGraphInfos({ ...graphInfos, edge: { ...graphInfos.edge, weight: e.target.value } })}
      placeholder="Peso (opcional)"
    />
    <button onClick={onAddEdge}>Adicionar Aresta</button>
    <button onClick={onDownloadGraphImage}>Baixar Grafo como Imagem</button>

    <input
      type="text"
      value={vertexInfo.vertex}
      onChange={e => setVertexInfo({ ...vertexInfo, vertex: e.target.value })}
      placeholder="ID do Vértice"
    />
    <button onClick={() => onGetNeighbors(vertexInfo.vertex)}>Obter Vizinhos</button>

    <input
      type="text"
      value={vertexInfo.degree.vertex}
      onChange={e => setVertexInfo({ ...vertexInfo, degree: { ...vertexInfo.degree, vertex: e.target.value } })}
      placeholder="ID do Vértice"
    />
    <button onClick={() => onGetDegree(vertexInfo.degree.vertex)}>Obter Grau</button>

    <input
      type="text"
      value={vertexInfo.neighborsBetween.u}
      onChange={e => setVertexInfo({ ...vertexInfo, neighborsBetween: { ...vertexInfo.neighborsBetween, u: e.target.value } })}
      placeholder="ID do vértice 1"
    />
    <input
      type="text"
      value={vertexInfo.neighborsBetween.v}
      onChange={e => setVertexInfo({ ...vertexInfo, neighborsBetween: { ...vertexInfo.neighborsBetween, v: e.target.value } })}
      placeholder="ID do vértice 2"
    />
    <button onClick={() => onCheckIfNeighbors(vertexInfo.neighborsBetween.u, vertexInfo.neighborsBetween.v)}>Verificar Vizinhos</button>

    <input
      type="text"
      value={pathInfo.source}
      onChange={e => setPathInfo({ ...pathInfo, source: e.target.value })}
      placeholder="Vértice de Origem"
    />
    <input
      type="text"
      value={pathInfo.target}
      onChange={e => setPathInfo({ ...pathInfo, target: e.target.value })}
      placeholder="Vértice de Destino"
    />
    <button onClick={onGetShortestPath}>Encontrar o Caminho Mais Curto</button>

    <div style={{ position: 'relative' }}>
      <div style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}>
        <CytoscapeComponent
          elements={elements}
          style={{ width: '100%', height: '100%' }}
          layout={{ name: 'random' }}
          stylesheet={editorStyle.cytoscapeStyle}
          cy={(cy) => {
            cyRef.current = cy;
          }}
        />
      </div>
      <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255, 255, 255, 0.7)', padding: '10px', borderRadius: '5px' }}>
        <h3>Ordem e Tamanho:</h3>
        <div>Ordem: {graphInfos.order}</div>
        <div>Tamanho: {graphInfos.size}</div>
      </div>
    </div>

    <button onClick={() => setModalOpen(true)}>Entrada em lote</button>
    <Modal
      isOpen={modalOpen}
      onRequestClose={() => setModalOpen(false)}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
          width: '50%',
          height: '50%',
          margin: 'auto',
        },
      }}
    >
      <textarea value={batchInput} onChange={e => setBatchInput(e.target.value)} />
      <label>
        <input
          type='checkbox'
          checked={graphInfos.isDirected}
          onChange={() => onSetGraphType(!graphInfos.isDirected)}
        />
        Grafo Direcionado
      </label>
      <button onClick={onBatchSubmit}>Enviar</button>
    </Modal>
  </div>
);

export default GraphEditor;
