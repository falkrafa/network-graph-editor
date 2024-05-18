import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 250,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  bgcolor: '#f2f2f2',
  boxShadow: 24,
  p: 4,
};

export default function CustomNode({ open, customNodeInfos, setCustomNodeInfos, onSubmitCustomNode, handleClose }) {
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title">
              <input
                type="text"
                value={customNodeInfos.vertex}
                onChange={e => setCustomNodeInfos({ ...customNodeInfos, vertex: e.target.value })}
                placeholder="ID do vértice 1"
                className='func-input'
              />
              <button className='func-button' onClick={onSubmitCustomNode}>Adicionar Vertice</button>
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

