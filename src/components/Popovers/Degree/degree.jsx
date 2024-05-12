import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Popover } from '@mui/material';

export default function DegreePopover({ degreeAnchorEl, handleDegreeClose, onDegreeSubmit, vertexInfo, setVertexInfo }) {
  return (
    <Popover
      id="degree-popover"
      open={Boolean(degreeAnchorEl)}
      anchorEl={degreeAnchorEl}
      onClose={handleDegreeClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Typography sx={{ p: 2, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'start', backgroundColor: '#f2f2f2' }}>
        <input
          type="text"
          value={vertexInfo.degree.vertex}
          onChange={e => setVertexInfo({ ...vertexInfo, degree: { ...vertexInfo.degree, vertex: e.target.value } })}
          placeholder="ID do Vértice"
          className='func-input'
        />
        <button className='func-button' onClick={() => onDegreeSubmit(vertexInfo.degree.vertex)}>Obter Grau</button>
      </Typography>
    </Popover>
  );
}
