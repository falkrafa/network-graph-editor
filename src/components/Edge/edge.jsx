import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import '../../css/global.css';
export default function Edge({ setGraphInfos, graphInfos, onAddEdge }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const onSubmitEdge = async () => {
    await onAddEdge();
    setAnchorEl(null);
    setGraphInfos({ ...graphInfos, edge: { u: '', v: '', weight: '' } });
  }
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
        size='small'
        sx={{
          textTransform: 'none',
          backgroundColor: '#3f51b5',
          color: '#fff',
        }}
      >
        Adicionar Aresta
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{ marginTop: 0.5 }}
      >
        <Typography sx={{ p: 2, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'start', backgroundColor: '#f2f2f2' }}>
          <input
            type="text"
            value={graphInfos.edge.u}
            onChange={e => setGraphInfos({ ...graphInfos, edge: { ...graphInfos.edge, u: e.target.value } })}
            placeholder="Vértice de Início"
            className='func-input'
          />
          <input
            type="text"
            value={graphInfos.edge.v}
            onChange={e => setGraphInfos({ ...graphInfos, edge: { ...graphInfos.edge, v: e.target.value } })}
            placeholder="Vértice de Destino"
            className='func-input'
          />
          <input
            type="text"
            value={graphInfos.edge.weight}
            onChange={e => setGraphInfos({ ...graphInfos, edge: { ...graphInfos.edge, weight: e.target.value } })}
            placeholder="Peso (opcional)"
            className='func-input'
          />
          <button className='func-button' onClick={onSubmitEdge}>Adicionar Aresta</button>
        </Typography>
      </Popover>
    </div >
  );
}