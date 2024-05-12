import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsIcon from '@mui/icons-material/Settings';
import CommitIcon from '@mui/icons-material/Commit';
import Typography from '@mui/material/Typography';
import '../../css/global.css';
import { Popover } from '@mui/material';
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(0.5),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    backgroundColor: '#f2f2f2',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function CustomizedMenus({ onGetDegree, setVertexInfo, vertexInfo }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [degreeAnchorEl, setDegreeAnchorEl] = React.useState(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDegreeClose = () => {
    setDegreeAnchorEl(null);
  };

  const handleDegreeClick = (event) => {
    setDegreeAnchorEl(event.currentTarget);
  };
  const onDegreeSubmit = async (vertex) => {
    await onGetDegree(vertex);
    setDegreeAnchorEl(null);
    setAnchorEl(null);
    setVertexInfo({ ...vertexInfo, degree: { vertex: '' } });
  }
  return (
    <div>
      <Button
        id="demo-customized-button"
        color="inherit"
        size="small"
        aria-controls={anchorEl ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={(event) => setAnchorEl(event.currentTarget)}
        endIcon={<KeyboardArrowDownIcon />}
      >
        <SettingsIcon />
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDegreeClick} disableRipple>
          <CommitIcon />
          Grau do Vértice
        </MenuItem>
        <MenuItem onClick={handleMenuClose} disableRipple>
          <FileCopyIcon />
          Duplicate
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleMenuClose} disableRipple>
          <ArchiveIcon />
          Archive
        </MenuItem>
        <MenuItem onClick={handleMenuClose} disableRipple>
          <MoreHorizIcon />
          More
        </MenuItem>
      </StyledMenu>

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
    </div>
  );
}