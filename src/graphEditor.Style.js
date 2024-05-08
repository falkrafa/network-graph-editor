export const graphEditorStyle = (isDirected) => [
  {
      selector: 'node',
      style: {
          label: 'data(label)',
          'text-valign': 'center',
          'text-halign': 'center',
          'background-color': '#11479e'
      }
  },
  {
      selector: 'edge',
      style: {
          width: 3,
          'line-color': '#9dbaea',
          'target-arrow-color': '#9dbaea',
          'target-arrow-shape': isDirected ? 'triangle' : 'none',
          'curve-style': 'bezier',
          label: 'data(label)'
      }
  }
];
