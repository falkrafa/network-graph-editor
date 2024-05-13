const cytoscapeStyle = (isDirected) => [
    {
        selector: 'node',
        style: {
            label: 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'background-color': '#2a9d8f',
            'font-size': '16px',
            color: '#ffffff',
            'text-wrap': 'wrap',
            'text-max-width': '100px',
            'border-width': '2px',
            'border-color': '#ffffff',
            'border-opacity': 0.5,
            'shape': 'ellipse',
            'height': '30px',
            'width': '30px',
        },
    },
    {
        selector: 'edge',
        style: {
            width: 2,
            'line-color': '#2a9d8f',
            'target-arrow-color': '#2a9d8f',
            'target-arrow-shape': isDirected ? 'triangle' : 'none',
            'curve-style': 'bezier',
            label: 'data(label)',
            'text-background-color': '#ffffff',
            'text-background-opacity': 0.7,
            'text-background-padding': '4px',
            color: '#2a9d8f',
            'font-size': '16px',
        },
    },
    {
        selector: '.highlighted',
        style: {
            'background-color': '#ff5722',
            'border-width': '3px',
            'border-color': '#ff5722',
            'line-color': '#ff5722',
            'target-arrow-color': '#ff5722',
            'transition-property': 'background-color, line-color, target-arrow-color, border-color',
            'transition-duration': '0.5s'
        }
    }
];

export const graphEditorStyle = { cytoscapeStyle };
