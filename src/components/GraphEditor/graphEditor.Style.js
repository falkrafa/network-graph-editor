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
];

const globalStyle = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f4a261',
    },
    title: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#e76f51',
    },
    button: {
        padding: '0.5rem 1rem',
        margin: '0.5rem',
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#e76f51',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    input: {
        padding: '0.5rem',
        margin: '0.5rem',
        fontSize: '1rem',
        border: '1px solid #e76f51',
        borderRadius: '5px',
    },
    label: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#264653',
    },
    error: {
        fontSize: '1rem',
        color: '#e63946',
    },
};

export const graphEditorStyle = { cytoscapeStyle, globalStyle };