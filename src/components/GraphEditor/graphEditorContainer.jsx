import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import GraphEditor from './graphEditor';
import { graphEditorStyle } from '../../graphEditor.Style';

const GraphEditorContainer = () => {
  const [elements, setElements] = useState([]);
  const [isRemovalMode, setIsRemovalMode] = useState(false);
  const [graphInfos, setGraphInfos] = useState({ order: 0, size: 0, isDirected: false, vertex: '', edge: { u: '', v: '', weight: '' } });
  const [vertexInfo, setVertexInfo] = useState({ vertex: '', degree: { vertex: '' }, neighborsBetween: { u: '', v: '' } });
  const [pathInfo, setPathInfo] = useState({ source: '', target: '', path: [], length: null });
  const [modalOpen, setModalOpen] = useState(false);
  const [batchInput, setBatchInput] = useState('');
  const cyRef = useRef(null);
  const cyStyles = graphEditorStyle(graphInfos.isDirected);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    const setupCytoscapeEventHandlers = () => {

      cy.on('tap', 'node', (event) => {
        if (isRemovalMode) {
          const nodeId = event.target.id();
          onRemoveVertex(nodeId);
          setIsRemovalMode(false);
        }
      });


      cy.on('tap', 'edge', (event) => {
        if (isRemovalMode) {
          const edgeId = event.target.id();
          const [u, v] = edgeId.split('-');
          onRemoveEdge(u, v);
          setIsRemovalMode(false);
        }
      });
    };

    setupCytoscapeEventHandlers();


    return () => {
      cy.removeListener('tap', 'node');
      cy.removeListener('tap', 'edge');
    };
  }, [isRemovalMode, cyRef]);

  const onSetGraphType = async (directed) => {
    await axios.post('http://localhost:5000/set_graph_type', { directed });
    setGraphInfos(prevInfos => ({
      ...prevInfos,
      isDirected: directed
    }));
    fetchGraphData();
  };


  const onAddVertex = async () => {
    await axios.post('http://localhost:5000/add_vertex', { vertex: graphInfos.vertex });
    fetchGraphData();
  };

  const onAddEdge = async () => {
    const payload = graphInfos.edge.weight
      ? { ...graphInfos.edge, weight: parseFloat(graphInfos.edge.weight) }
      : graphInfos.edge;

    try {
      await axios.post('http://localhost:5000/add_edge', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      fetchGraphData();
    } catch (error) {
      console.error('Failed to add edge:', error);
    }
  };

  const onRemoveVertex = async (vertexId) => {
    await axios.post('http://localhost:5000/remove_vertex', { vertex: vertexId });
    fetchGraphData();
  };

  const onRemoveEdge = async (u, v) => {
    await axios.post('http://localhost:5000/remove_edge', { u, v });
    fetchGraphData();
  };

  const fetchGraphData = async () => {
    const response = await axios.get('http://localhost:5000/graph_data');
    const { nodes, edges, order, size } = response.data;
    const formattedElements = nodes.map(node => ({
      data: { id: node.id, label: node.id }
    })).concat(edges.map(edge => ({
      data: {
        id: `${edge.u}-${edge.v}-${edge.key}`,
        source: edge.u,
        target: edge.v,
        label: edge.weight ? `Weight: ${edge.weight}` : 'Unweighted'
      }
    })));
    setElements(formattedElements);
    setGraphInfos(prevInfos => ({
      ...prevInfos,
      order: order,
      size: size
    }))
  };

  const onClearGraph = async () => {
    await axios.post('http://localhost:5000/clear_graph');
    setElements([]);
    setGraphInfos(prevInfos => ({ ...prevInfos, order: 0, size: 0 }));
  };

  const setupCytoscapeEventHandlers = (cy) => {

    cy.on('tap', 'node', (event) => {
      if (isRemovalMode) {
        const nodeId = event.target.id();
        onRemoveVertex(nodeId);
        setIsRemovalMode(false);
      }
    });


    cy.on('tap', 'edge', (event) => {
      if (isRemovalMode) {
        const edgeId = event.target.id();
        const [u, v] = edgeId.split('-');
        onRemoveEdge(u, v);
        setIsRemovalMode(false);
      }
    });
  };

  const onDownloadGraphImage = () => {
    if (!cyRef.current) {
      console.error('Cytoscape não está inicializado.');
      return;
    }
    const imageUrl = cyRef.current.png({ full: true, scale: 1.5 });
    const downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.download = "graph-image.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const onGetNeighbors = async (vertex) => {
    try {
      const response = await axios.post('http://localhost:5000/get_neighbors', { vertex });
      alert(`Neighbors: ${response.data.neighbors}\n` +
        (graphInfos.isDirected ? `In-Neighbors: ${response.data.in_neighbors}\nOut-Neighbors: ${response.data.out_neighbors}` : ''));
    } catch (error) {
      console.error('Failed to get neighbors:', error);
      alert('Error fetching neighbors.');
    }
  };

  const onGetDegree = async (vertex) => {
    try {
      const response = await axios.post('http://localhost:5000/get_degree', { vertex });
      alert(
        (graphInfos.isDirected ? `In-Degree: ${response.data.in_degree}\nOut-Degree: ${response.data.out_degree}\n` : `degree: ${response.data.degree}`));
    } catch (error) {
      console.error('Failed to get degree:', error);
      alert('Error fetching degree.');
    }
  }

  const onCheckIfNeighbors = async (u, v) => {
    try {
      const response = await axios.post('http://localhost:5000/get_check_if_adjacents', { u, v });
      alert(`Neighbors between ${u} and ${v}: ${response.data.message}`);
    } catch (error) {
      console.error('Failed to get neighbors between:', error);
      alert('Error fetching neighbors between.');
    }
  }
  const onGetShortestPath = async () => {
    try {
      const response = await axios.post('http://localhost:5000/shortest_path', {
        source: pathInfo.source,
        target: pathInfo.target
      });
      setPathInfo(prev => ({ ...prev, path: response.data.path, length: response.data.length }));
      alert(`Shortest path length: ${response.data.length}\nPath: ${response.data.path.join(' -> ')}`);
    } catch (error) {
      console.error('Failed to get the shortest path:', error);
      alert('Error fetching the shortest path.');
    }
  };

  const handleBatchSubmit = async () => {
    onClearGraph();
    try {
      const response = await axios.post('http://localhost:5000/upload_batch-graph', batchInput, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert(response.data.message);
      fetchGraphData();
    }
    catch (error) {
      console.error('Failed to process batch input:', error);
      alert('Error processing batch input.');
    }
  };

  return (
    <GraphEditor
      elements={elements}
      isRemovalMode={isRemovalMode}
      setIsRemovalMode={setIsRemovalMode}
      setVertexInfo={setVertexInfo}
      vertexInfo={vertexInfo}
      downloadGraphImage={onDownloadGraphImage}
      setupCytoscapeEventHandlers={setupCytoscapeEventHandlers}
      graphInfos={graphInfos}
      setGraphInfos={setGraphInfos}
      onAddVertex={onAddVertex}
      onAddEdge={onAddEdge}
      onSetGraphType={onSetGraphType}
      onClearGraph={onClearGraph}
      onGetNeighbors={onGetNeighbors}
      onGetDegree={onGetDegree}
      onCheckIfNeighbors={onCheckIfNeighbors}
      onGetShortestPath={onGetShortestPath}
      pathInfo={pathInfo}
      setPathInfo={setPathInfo}
      setModalOpen={setModalOpen}
      modalOpen={modalOpen}
      batchInput={batchInput}
      setBatchInput={setBatchInput}
      handleBatchSubmit={handleBatchSubmit}
      cyRef={cyRef}
      cyStyles={cyStyles}
    />
  );
};

export default GraphEditorContainer;