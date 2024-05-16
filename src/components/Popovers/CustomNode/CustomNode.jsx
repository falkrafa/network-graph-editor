// VertexPopover.js
import React, { useState } from 'react';

const CustomNode = ({ onSubmit }) => {
  const [vertexName, setVertexName] = useState('');

  const handleSubmit = () => {
    onSubmit(vertexName);
    setVertexName('');
  };

  return (
    <div>
      <input
        type="text"
        value={vertexName}
        onChange={(e) => setVertexName(e.target.value)}
        placeholder="Nome do Vértice"
      />
      <button onClick={handleSubmit}>Enviar</button>
    </div>
  );
};

export default CustomNode;
