import CytoscapeComponent from 'react-cytoscapejs';
import CustomizedMenus from '../FuncMenu/FuncMenu';
import Edge from '../Popovers/Edge/edge';
import CustomNode from '../Modal/customNode';
import SelectLabels from '../Select/select';
import '../../css/global.css'
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
  onSubmitCustomNode,
  onCloseCustonNode,
  customNodeInfos,
  setCustomNodeInfos
}) => (
  <div className='graph-editor-container'>
    <div className='graph-editor-header'>
      <h1>Network Graph Editor</h1>
      <div className='graph-editor-navbar'>
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            id='graphTypeCheckbox'
            checked={graphInfos.isDirected}
            onChange={() => onSetGraphType(!graphInfos.isDirected)}
          />
          <label htmlFor='graphTypeCheckbox'>Grafo Direcionado</label>
        </div>
        <SelectLabels setVertexInfo={setVertexInfo} vertexInfo={vertexInfo} />
        <button className={modes.isAddMode ? 'add-vertex-buttonCheck' : 'add-vertex-button'} onClick={() => setModes(prevState => ({ ...prevState, isAddMode: !modes.isAddMode }))}>
          {modes.isAddMode ? 'Cancelar Adição' : 'Adicionar Vértices'}
        </button>
        <Edge setGraphInfos={setGraphInfos} graphInfos={graphInfos} modes={modes} onAddEdge={onAddEdge} setModes={setModes} />
        <button className={modes.isRemovalMode ? 'remove-buttonCheck' : 'remove-button'} onClick={() => setModes(prevState => ({ ...prevState, isRemovalMode: !modes.isRemovalMode }))}>
          {modes.isRemovalMode ? 'Desativar Modo de Remoção' : 'Ativar Modo de Remoção'}
        </button>
        <button className='clear-button' onClick={onClearGraph}>Limpar Grafo</button>
        <CustomizedMenus
          onGetDegree={onGetDegree}
          setVertexInfo={setVertexInfo}
          vertexInfo={vertexInfo}
          onGetNeighbors={onGetNeighbors}
          onCheckIfNeighbors={onCheckIfNeighbors}
          onDownloadGraphImage={onDownloadGraphImage}
          pathInfo={pathInfo}
          setPathInfo={setPathInfo}
          onGetShortestPath={onGetShortestPath}
          onBatchSubmit={onBatchSubmit}
          setModalOpen={setModalOpen}
          modalOpen={modalOpen}
          batchInput={batchInput}
          setBatchInput={setBatchInput}
          onSetGraphType={onSetGraphType}
          graphInfos={graphInfos}
        />
      </div>
    </div>
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <div style={{
          width: '100%',
          height: '600px',
          border: '2px solid #ccc',
          borderColor: modes.isRemovalMode ? 'red' : (modes.isAddMode ? '#0073e6' : '#ccc')
        }}>
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
      </div>
      <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255, 255, 255, 0.7)', padding: '10px', borderRadius: '5px' }}>
        <h3>Ordem e Tamanho:</h3>
        <div>Ordem: {graphInfos.order}</div>
        <div>Tamanho: {graphInfos.size}</div>
      </div>
    </div>
    <CustomNode open={customNodeInfos.isModalOpen} customNodeInfos={customNodeInfos} setCustomNodeInfos={setCustomNodeInfos} onSubmitCustomNode={onSubmitCustomNode} handleClose={onCloseCustonNode} />
  </div>
);

export default GraphEditor;
