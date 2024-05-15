import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  display: 'flex',
  flexDirection: 'column',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BatchModal({ open, handleClose, onBatchModalSubmit, batchInput, setBatchInput, graphInfos, onSetGraphType }) {
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

              <textarea value={batchInput} onChange={e => setBatchInput(e.target.value)} />
              <label>
                <div className='checkbox-wrapper'>
                  <input
                    type='checkbox'
                    checked={graphInfos.isDirected}
                    onChange={() => onSetGraphType(!graphInfos.isDirected)}
                  />
                </div>
                Grafo Direcionado
              </label>
              <button className='func-button' onClick={onBatchModalSubmit}>Enviar</button>
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

