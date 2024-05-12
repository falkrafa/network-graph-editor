import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Popover } from '@mui/material';

export default function VerifyAdjacencyPopover({ verifyAdjacentsAnchor, handleVerifyAdjacentsClose, vertexInfo, setVertexInfo, onCheckIfNeighbors }) {
  return (
    <Popover
      id="degree-popover"
      open={Boolean(verifyAdjacentsAnchor)}
      anchorEl={verifyAdjacentsAnchor}
      onClose={handleVerifyAdjacentsClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Typography sx={{ p: 2, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'start', backgroundColor: '#f2f2f2' }}>
        <input
          type="text"
          value={vertexInfo.neighborsBetween.u}
          onChange={e => setVertexInfo({ ...vertexInfo, neighborsBetween: { ...vertexInfo.neighborsBetween, u: e.target.value } })}
          placeholder="ID do vértice 1"
          className='func-input'
        />
        <input
          type="text"
          value={vertexInfo.neighborsBetween.v}
          onChange={e => setVertexInfo({ ...vertexInfo, neighborsBetween: { ...vertexInfo.neighborsBetween, v: e.target.value } })}
          placeholder="ID do vértice 2"
          className='func-input'
        />
        <button className='func-button' onClick={() => onCheckIfNeighbors(vertexInfo.neighborsBetween.u, vertexInfo.neighborsBetween.v)}>Verificar Adjacencia</button>
      </Typography>
    </Popover>
  );
}
