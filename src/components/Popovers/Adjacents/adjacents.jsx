import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Popover } from '@mui/material';

export default function AdjacentsPopover({ adjacentsAnchor, handleAdjacentsClose, vertexInfo, setVertexInfo, onGetNeighbors }) {
  return (
    <Popover
      id="degree-popover"
      open={Boolean(adjacentsAnchor)}
      anchorEl={adjacentsAnchor}
      onClose={handleAdjacentsClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Typography sx={{ p: 2, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'start', backgroundColor: '#f2f2f2' }}>
        <input
          type="text"
          value={vertexInfo.vertex}
          onChange={e => setVertexInfo({ ...vertexInfo, vertex: e.target.value })}
          placeholder="ID do Vértice"
          className='func-input'
        />
        <button className='func-button' onClick={() => onGetNeighbors(vertexInfo.vertex)}>Obter Vizinhos</button>
      </Typography>
    </Popover>
  );
}
