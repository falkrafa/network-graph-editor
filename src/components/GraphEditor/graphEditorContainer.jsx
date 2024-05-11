import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import GraphEditor from './graphEditor';
import { graphEditorStyle } from './graphEditor.Style';

const GraphEditorContainer = () => {
  const [elements, setElements] = useState([]);
  const [modes, setModes] = useState({ isRemovalMode: false, isAddMode: false });
  const [graphInfos, setGraphInfos] = useState({ order: 0, size: 0, isDirected: false, vertex: '', edge: { u: '', v: '', weight: '' } });
  const [vertexInfo, setVertexInfo] = useState({ vertex: '', degree: { vertex: '' }, neighborsBetween: { u: '', v: '' } });
  const [pathInfo, setPathInfo] = useState({ source: '', target: '', path: [], length: null });
  const [modalOpen, setModalOpen] = useState(false);
  const [batchInput, setBatchInput] = useState('');
  const cyRef = useRef(null);
  const editorStyle = { cytoscapeStyle: graphEditorStyle.cytoscapeStyle(graphInfos.isDirected) };
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    const setupCytoscapeEventHandlers = () => {
      cy.on('tap', 'node', (event) => {
        if (modes.isRemovalMode) {
          const nodeId = event.target.id();
          onRemoveVertex(nodeId);
          setModes({ ...modes, isRemovalMode: false });
        }
      });

      cy.on('tap', 'edge', async (event) => {
        if (modes.isRemovalMode) {
          const edge = event.target;
          const sourceNodeId = edge.source().id();
          const targetNodeId = edge.target().id();
          const weight = edge.data('label');
          await onRemoveEdge(sourceNodeId, targetNodeId, weight);
          setModes({ ...modes, isRemovalMode: false });
        }
      });

      cy.on('tap', handleClick);
    };

    const handleClick = async (event) => {
      if (!modes.isAddMode || (event.target && event.target !== cy)) return;

      const position = event.position || event.cyPosition;
      const newNodeId = `${cy.nodes().length + 1}`;
      const newNode = { data: { id: newNodeId, label: newNodeId }, position };

      try {
        await onAddVertex(newNodeId);
        cy.add(newNode);
      } catch (error) {
        console.error('Failed to add vertex:', error);
        alert('Error adding vertex.');
      }
    };

    setupCytoscapeEventHandlers();

    return () => {
      cy.removeListener('tap', 'node');
      cy.removeListener('tap', 'edge');
      cy.removeListener('tap', handleClick);
    };
  }, [modes, cyRef]);


  const onSetGraphType = async (directed) => {
    await axios.post('http://localhost:5000/set_graph_type', { directed });
    setGraphInfos(prevInfos => ({
      ...prevInfos,
      isDirected: directed
    }));
    fetchGraphData();
  };

  const onAddVertex = async (vertexId) => {
    await axios.post('http://localhost:5000/add_vertex', { vertex: vertexId });
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

  const onRemoveEdge = async (sourceNodeId, targetNodeId, weight) => {
    console.log(sourceNodeId, targetNodeId, weight)
    try {
      const response = await axios.post('http://localhost:5000/remove_edge', { u: sourceNodeId, v: targetNodeId, weight: weight });
      if (response.status === 200) {
        alert("edge removed successfully")
        fetchGraphData();
      }
    } catch (error) {
      console.error('Failed to remove edge:', error);
      alert('Error removing edge.');
    }
  };

  const fetchGraphData = async () => {
    const response = await axios.get('http://localhost:5000/graph_data');
    const { nodes, edges, order, size } = response.data;
    const formattedElements = nodes.map(node => ({
      data: { id: node.id, label: node.id }
    })).concat(edges.map(edge => ({
      data: {
        id: `${edge.u}-${edge.v}-${edge.weight ? edge.weight : '0'}`,
        source: edge.u,
        target: edge.v,
        label: edge.weight ? `${edge.weight} ` : '0'
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
      alert(`Neighbors: ${response.data.neighbors} \n` +
        (graphInfos.isDirected ? `In - Neighbors: ${response.data.in_neighbors} \nOut - Neighbors: ${response.data.out_neighbors} ` : ''));
    } catch (error) {
      console.error('Failed to get neighbors:', error);
      alert('Error fetching neighbors.');
    }
  };

  const onGetDegree = async (vertex) => {
    try {
      const response = await axios.post('http://localhost:5000/get_degree', { vertex });
      alert(
        (graphInfos.isDirected ? `In - Degree: ${response.data.in_degree} \nOut - Degree: ${response.data.out_degree} \n` : `degree: ${response.data.degree} `));
    } catch (error) {
      console.error('Failed to get degree:', error);
      alert('Error fetching degree.');
    }
  }

  const onCheckIfNeighbors = async (u, v) => {
    try {
      const response = await axios.post('http://localhost:5000/get_check_if_adjacents', { u, v });
      alert(`Neighbors between ${u} and ${v}: ${response.data.message} `);
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
      alert(`Shortest path length: ${response.data.length} \nPath: ${response.data.path.join(' -> ')} `);
    } catch (error) {
      console.error('Failed to get the shortest path:', error);
      alert('Error fetching the shortest path.');
    }
  };

  const onBatchSubmit = async () => {
    onClearGraph();
    const lines = batchInput.split('\n');

    const nodes = [];
    const edges = [];

    lines.forEach(line => {

      const values = line.trim().split(/\s+/);
      console.log(values)

      if (values.length === 3) {
        edges.push({ source: values[0], target: values[1], weight: parseInt(values[2]) });
      }

      else if (values.length === 2) {
        edges.push({ source: values[0], target: values[1], weight: 0 });
      }
      else {
        nodes.push({ id: values[0] });
      }
    });

    const payload = { nodes, edges };
    try {
      await axios.post('http://localhost:5000/upload_batch-graph', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert('Batch input processed successfully!');
      fetchGraphData();
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to process batch input:', error);
      alert('Error processing batch input.');
    }
  };

  return (
    <GraphEditor
      elements={elements}
      modes={modes}
      setModes={setModes}
      setVertexInfo={setVertexInfo}
      vertexInfo={vertexInfo}
      onDownloadGraphImage={onDownloadGraphImage}
      graphInfos={graphInfos}
      setGraphInfos={setGraphInfos}
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
      onBatchSubmit={onBatchSubmit}
      cyRef={cyRef}
      editorStyle={editorStyle}
    />
  );
};

export default GraphEditorContainer;