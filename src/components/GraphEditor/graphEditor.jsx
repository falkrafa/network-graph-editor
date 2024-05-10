import CytoscapeComponent from 'react-cytoscapejs';
import Modal from 'react-modal';
import GraphModal from '../GraphModal/GraphModal';
const GraphEditor = ({
  elements,
  isRemovalMode,
  setIsRemovalMode,
  graphInfos,
  setGraphInfos,
  onAddVertex,
  onAddEdge,
  onSetGraphType,
  onClearGraph,
  cyRef,
  setupCytoscapeEventHandlers,
  cyStyles,
  downloadGraphImage,
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
    <button onClick={() => onSetGraphType(true)}>Set Directed Graph</button>
    <button onClick={() => onSetGraphType(false)}>Set Undirected Graph</button>
    <button onClick={onClearGraph}>Clear Graph</button>
    <button onClick={() => setIsRemovalMode(!isRemovalMode)}>
      {isRemovalMode ? 'Desativar Modo de Remoção' : 'Ativar Modo de Remoção'}
    </button>

    <input type="text" value={graphInfos.vertex} onChange={e => setGraphInfos({ ...graphInfos, vertex: e.target.value })} placeholder="Vertex" />
    <button onClick={onAddVertex}>Add Vertex</button>
    <input type="text" value={graphInfos.edge.u} onChange={e => setGraphInfos({ ...graphInfos, edge: { ...graphInfos.edge, u: e.target.value } })} placeholder="Edge Start" />
    <input type="text" value={graphInfos.edge.v} onChange={e => setGraphInfos({ ...graphInfos, edge: { ...graphInfos.edge, v: e.target.value } })} placeholder="Edge End" />
    <input type="text" value={graphInfos.edge.weight} onChange={e => setGraphInfos({ ...graphInfos, edge: { ...graphInfos.edge, weight: e.target.value } })} placeholder="Weight (optional)" />
    <button onClick={onAddEdge}>Add Edge</button>
    <button onClick={downloadGraphImage}>Download Graph as Image</button>
    <input type="text" value={vertexInfo.vertex} onChange={e => setVertexInfo({ ...vertexInfo, vertex: e.target.value })} placeholder="Vertex ID" />
    <button onClick={() => onGetNeighbors(vertexInfo.vertex)}>Get Neighbors</button>
    <input type="text" value={vertexInfo.degree.vertex} onChange={e => setVertexInfo({ ...vertexInfo, degree: { ...vertexInfo.degree, vertex: e.target.value } })} placeholder="degreeVertex ID" />
    <button onClick={() => onGetDegree(vertexInfo.degree.vertex)}>Get Degree</button>
    <input type="text" value={vertexInfo.neighborsBetween.u} onChange={e => setVertexInfo({ ...vertexInfo, neighborsBetween: { ...vertexInfo.neighborsBetween, u: e.target.value } })} placeholder="vertex1 ID" />
    <input type="text" value={vertexInfo.neighborsBetween.v} onChange={e => setVertexInfo({ ...vertexInfo, neighborsBetween: { ...vertexInfo.neighborsBetween, v: e.target.value } })} placeholder="vertex2 ID" />
    <button onClick={() => onCheckIfNeighbors(vertexInfo.neighborsBetween.u, vertexInfo.neighborsBetween.v)}>Check Neighbors</button>
    <input type="text" value={pathInfo.source} onChange={e => setPathInfo({ ...pathInfo, source: e.target.value })} placeholder="Source Vertex" />
    <input type="text" value={pathInfo.target} onChange={e => setPathInfo({ ...pathInfo, target: e.target.value })} placeholder="Target Vertex" />
    <button onClick={onGetShortestPath}>Find Shortest Path</button>
    <div style={{ width: '100%', height: '600px' }}>
      <CytoscapeComponent
        elements={elements}
        style={{ width: '100%', height: '100%' }}
        layout={{ name: 'cose' }}
        stylesheet={cyStyles}
        cy={(cy) => {
          cyRef.current = cy;
          setupCytoscapeEventHandlers(cy);
        }}
      />

    </div>
    <button onClick={() => setModalOpen(true)}>Batch Input</button>
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
      <input type='checkbox' checked={graphInfos.isDirected} onChange={() => onSetGraphType(!graphInfos.isDirected)} />
        Directed Graph
      </label>
      <button onClick={onBatchSubmit}>Submit</button>
    </Modal>
    <p>Order of Graph (Number of Vertices): {graphInfos.order}</p>
    <p>Size of Graph (Number of Edges): {graphInfos.size}</p>
  </div>
);

export default GraphEditor;
