import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectLabels({ setVertexInfo, vertexInfo }) {
  const handleChange = (event) => {
    setVertexInfo((prev) => ({ ...prev, type: event.target.value }));
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
      <InputLabel id="demo-simple-select-helper-label" sx={{ marginTop: '-10px', marginLeft: '-10px', fontSize: '14px' }}>Tipo do Vertice</InputLabel>
      <Select
        value={vertexInfo.type}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        sx={{
          padding: '0', height: 30, fontSize: '15px', borderRadius: '4px', backgroundColor: '#f5f5f5'
        }}
      >
        <MenuItem value="number">1...</MenuItem>
        <MenuItem value="letter">A...</MenuItem>
        <MenuItem value="custom">Custom</MenuItem>
      </Select>
    </FormControl>
  );
}
