import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Popover } from '@mui/material';

export default function ShortestPath({ ShortestPathAnchor, handleShortestPopoverClose, pathInfo, setPathInfo, onGetShortestPathSubmit }) {
  return (
    <Popover
      id="degree-popover"
      open={Boolean(ShortestPathAnchor)}
      anchorEl={ShortestPathAnchor}
      onClose={handleShortestPopoverClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Typography sx={{ p: 2, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'start', backgroundColor: '#f2f2f2' }}>
        <input
          type="text"
          value={pathInfo.source}
          onChange={e => setPathInfo({ ...pathInfo, source: e.target.value })}
          placeholder="Vértice de Origem"
          className='func-input'
        />
        <input
          type="text"
          value={pathInfo.target}
          onChange={e => setPathInfo({ ...pathInfo, target: e.target.value })}
          placeholder="Vértice de Destino"
          className='func-input'
        />
        <button className='func-button' onClick={onGetShortestPathSubmit}>Obter Caminho</button>
      </Typography>
    </Popover>
  );
}
