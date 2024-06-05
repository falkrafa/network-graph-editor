import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import GraphEditor from './graphEditor';
import { graphEditorStyle } from './graphEditor.Style';

const GraphEditorContainer = () => {
  const [elements, setElements] = useState([]);
  const [modes, setModes] = useState({ isRemovalMode: false, isAddMode: false });
  const [graphInfos, setGraphInfos] = useState({ order: 0, size: 0, isDirected: false, vertex: '', edge: { u: '', v: '', weight: '' } });
  const [vertexInfo, setVertexInfo] = useState({ vertex: '', degree: { vertex: '' }, neighborsBetween: { u: '', v: '' }, type: 'number' });
  const [pathInfo, setPathInfo] = useState({ source: '', target: '', path: [], length: null });
  const [customNodeInfos, setCustomNodeInfos] = useState({ vertex: '', isModalOpen: false, position: null });
  const [batchModalInfos, setBatchModalInfos] = useState({ isModalOpen: false, batchInput: '' });
  const [message, setMessage] = useState('Forneça um grafo para começar!');
  const cyRef = useRef(null);
  const editorStyle = { cytoscapeStyle: graphEditorStyle.cytoscapeStyle(graphInfos.isDirected) };
  const cy = cyRef.current;

  useEffect(() => {
    onClearGraph();
    setModes({ isRemovalMode: false, isAddMode: false });
  }, [vertexInfo.type]);

  useEffect(() => {
    if (!cy) return;
    const setupCytoscapeEventHandlers = () => {
      cy.on('tap', 'node', (event) => {
        if (modes.isRemovalMode) {
          const nodeId = event.target.id();
          cy.remove(cy.getElementById(nodeId));
          onRemoveVertex(nodeId);
        }
      });

      cy.on('tap', 'edge', async (event) => {
        if (modes.isRemovalMode) {
          const edge = event.target;
          const sourceNodeId = edge.source().id();
          const targetNodeId = edge.target().id();
          const weight = edge.data('label');
          await onRemoveEdge(sourceNodeId, targetNodeId, weight);
        }
      });

      cy.on('tap', handleClick);
    };

    const handleClick = async (event) => {
      if (!modes.isAddMode || (event.target && event.target !== cy)) return;

      if (vertexInfo.type === 'number') {
        const position = event.position || event.cyPosition;
        const newNodeId = `${cy.nodes().length + 1}`;
        const newNode = { data: { id: newNodeId, label: newNodeId }, position };

        try {
          cy.add(newNode);
          await onAddVertex(newNodeId);
        } catch (error) {
          console.error('Failed to add vertex:', error);
          alert('Error adding vertex.');
        }
      }
      else if (vertexInfo.type === 'letter') {
        const position = event.position || event.cyPosition;
        const newNodeId = String.fromCharCode(65 + cy.nodes().length);
        const newNode = { data: { id: newNodeId, label: newNodeId }, position };

        try {
          cy.add(newNode);
          await onAddVertex(newNodeId);
        } catch (error) {
          console.error('Failed to add vertex:', error);
          alert('Error adding vertex.');
        }
      }
      else if (vertexInfo.type === 'custom') {
        const position = event.position || event.cyPosition;
        setCustomNodeInfos({ ...customNodeInfos, vertex: '', isModalOpen: true, position: position });
      }
    };

    setupCytoscapeEventHandlers();

    return () => {
      cy.removeListener('tap', 'node');
      cy.removeListener('tap', 'edge');
      cy.removeListener('tap', handleClick);
    };
  }, [modes, cyRef]);

  const onSubmitCustomNode = async () => {
    const newNode = { data: { id: customNodeInfos.vertex, label: customNodeInfos.vertex }, position: customNodeInfos.position };
    console.log(newNode)
    try {
      cy.add(newNode);
      await onAddVertex(customNodeInfos.vertex);
      setCustomNodeInfos({ ...customNodeInfos, vertex: '', isModalOpen: false, position: null });
    } catch (error) {
      console.error('Failed to add vertex:', error);
      alert('Error adding vertex.');
    }
  };
  const onCloseCustonNode = () => {
    setCustomNodeInfos({ ...customNodeInfos, vertex: '', isModalOpen: false, position: null });
  }
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
    if (graphInfos.edge.u === '' || graphInfos.edge.v === '') {
      alert("Please fill in the required fields")
      return;
    }
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
        // alert("edge removed successfully")
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
    setModes({ isRemovalMode: false, isAddMode: false });
    await axios.post('http://localhost:5000/clear_graph');
    setElements([]);
    setGraphInfos(prevInfos => ({ ...prevInfos, order: 0, size: 0 }));
    setMessage('Forneça um grafo para começar!');
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
      // alert(`Neighbors: ${response.data.neighbors} \n` +
      //   (graphInfos.isDirected ? `In - Neighbors: ${response.data.in_neighbors} \nOut - Neighbors: ${response.data.out_neighbors} ` : ''));
      setMessage(`Neighbors: ${response.data.neighbors} \n` +
        (graphInfos.isDirected ? `In - Neighbors: ${response.data.in_neighbors} \nOut - Neighbors: ${response.data.out_neighbors} ` : ''));
    } catch (error) {
      console.error('Failed to get neighbors:', error);
      alert('Error fetching neighbors.');
    }
  };

  const onGetDegree = async (vertex) => {
    try {
      const response = await axios.post('http://localhost:5000/get_degree', { vertex });
      // alert(
      //   (graphInfos.isDirected ? `In - Degree: ${response.data.in_degree} \nOut - Degree: ${response.data.out_degree} \n` : `degree: ${response.data.degree} `));
      setMessage( (graphInfos.isDirected ? `In - Degree: ${response.data.in_degree} \nOut - Degree: ${response.data.out_degree} \n` : `degree: ${response.data.degree} `));
    } catch (error) {
      console.error('Failed to get degree:', error);
      alert('Error fetching degree.');
    }
  }

  const onCheckIfNeighbors = async (u, v) => {
    try {
      if (u === '' || v === '') {
        alert("Please fill in the required fields")
        return;
      }
      const response = await axios.post('http://localhost:5000/get_check_if_adjacents', { u, v });
      // alert(`Neighbors between ${u} and ${v}: ${response.data.message} `);
      setMessage(`Neighbors between ${u} and ${v}: ${response.data.message} `);
    } catch (error) {
      console.error('Failed to get neighbors between:', error);
      alert('Error fetching neighbors between.');
    }
  }

  const animateShortestPath = (path) => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.elements().removeClass('highlighted');

    path.forEach((nodeId, index) => {
      cy.getElementById(nodeId).addClass('highlighted');
      if (index < path.length - 1) {
        const nextNodeId = path[index + 1];
        const edge = cy.edges().filter(`edge[source = "${nodeId}"][target = "${nextNodeId}"], edge[source = "${nextNodeId}"][target = "${nodeId}"]`);
        edge.addClass('highlighted');
      }
    });

    let i = 0;
    const highlightNext = () => {
      if (i < path.length) {
        const node = cy.getElementById(path[i]);
        node.addClass('highlighted');
        if (i > 0) {
          const prevNodeId = path[i - 1];
          const edge = cy.edges().filter(`edge[source = "${prevNodeId}"][target = "${path[i]}"], edge[source = "${path[i]}"][target = "${prevNodeId}"]`);
          edge.addClass('highlighted');
        }
        i++;
        setTimeout(highlightNext, 1000);
      } else {
        setTimeout(() => {
          cy.elements().removeClass('highlighted');
        }, 5000);
      }
    };

    highlightNext();
  };



  const onGetShortestPath = async () => {
    try {
      const response = await axios.post('http://localhost:5000/shortest_path', {
        source: pathInfo.source,
        target: pathInfo.target
      });
      setPathInfo(prev => ({ ...prev, path: response.data.path, length: response.data.length }));
      animateShortestPath(response.data.path);
      // alert(`Shortest path length: ${response.data.length} \nPath: ${response.data.path.join(' -> ')} `);
      setMessage(`Shortest path length: ${response.data.length} \nPath: ${response.data.path.join(' -> ')} `)
    } catch (error) {
      console.error('Failed to get the shortest path:', error);
      alert('Error fetching the shortest path.');
    }
  };

  const onCheckIfEulerian = async () => {
    try {
      const response = await axios.get('http://localhost:5000/is_eulerian');
      setMessage(response.data.message);
    } catch (error) {
      console.error('Failed to check if Eulerian:', error);
      alert('Error checking if Eulerian.');
    }
  };

  const onCheckIfSemiEulerian = async () => {
    try {
      const response = await axios.get('http://localhost:5000/is_semi_eulerian');
      setMessage(response.data.message);
    } catch (error) {
      console.error('Failed to check if Semi-Eulerian:', error);
      alert('Error checking if Semi-Eulerian.');
    }
  };

  const onBatchSubmit = async () => {
    onClearGraph();
    const lines = batchModalInfos.batchInput.split('\n');

    const nodes = [];
    const edges = [];

    lines.forEach(line => {

      const values = line.trim().split(/\s+/);

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
      batchModalInfos={batchModalInfos}
      setBatchModalInfos={setBatchModalInfos}
      onBatchSubmit={onBatchSubmit}
      onSubmitCustomNode={onSubmitCustomNode}
      onCloseCustonNode={onCloseCustonNode}
      customNodeInfos={customNodeInfos}
      setCustomNodeInfos={setCustomNodeInfos}
      onCheckIfEulerian={onCheckIfEulerian}
      onCheckIfSemiEulerian={onCheckIfSemiEulerian}
      message={message}
      cyRef={cyRef}
      editorStyle={editorStyle}
    />
  );
};

export default GraphEditorContainer;