import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#f2f2f2',
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
};

export default function BatchModal({
  open,
  handleClose,
  onBatchModalSubmit,
  batchInput,
  setBatchInput,
  graphInfos,
  onSetGraphType
}) {
  return (
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
          <Typography id="transition-modal-title" variant="h6" component="h2" gutterBottom>
            Inserir Arestas
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={batchInput}
            onChange={e => setBatchInput(prev => ({ ...prev, batchInput: e.target.value }))}
            placeholder="vertex vertex2 peso"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={graphInfos.isDirected}
                onChange={() => onSetGraphType(!graphInfos.isDirected)}
              />
            }
            label="Grafo Direcionado"
          />
          <Button variant="contained" color="primary" onClick={onBatchModalSubmit}>
            Enviar
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}
