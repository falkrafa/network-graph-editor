import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import DeviceHubOutlinedIcon from '@mui/icons-material/DeviceHubOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsIcon from '@mui/icons-material/Settings';
import CommitIcon from '@mui/icons-material/Commit';
import DegreePopover from '../Popovers/Degree/degree';
import AdjacentsPopover from '../Popovers/Adjacents/adjacents';
import VerifyAdjacencyPopover from '../Popovers/Adjacents/verifyAdjacency';
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

const CustomizedMenus = ({
  onGetDegree,
  setVertexInfo,
  vertexInfo,
  onGetNeighbors,
  onCheckIfNeighbors,
  onDownloadGraphImage
}) => {
  const [anchor, setAnchor] = useState({ menuAnchor: null, degreeAnchor: null, adjacentsAnchor: null, verifyAdjacentsAnchor: null });

  const handleMenuClose = () => {
    setAnchor({ ...anchor, menuAnchor: null });
  };
  const handleDegreeClose = () => {
    setAnchor({ ...anchor, degreeAnchor: null });
  };
  const handleAdjacentsClose = () => {
    setAnchor({ ...anchor, adjacentsAnchor: null });
  };
  const handleVerifyAdjacentsClose = () => {
    setAnchor({ ...anchor, verifyAdjacentsAnchor: null });
  };

  const handleDegreeClick = (event) => {
    setAnchor({ ...anchor, degreeAnchor: event.currentTarget });
  };
  const handleAdjacentsClick = (event) => {
    setAnchor({ ...anchor, adjacentsAnchor: event.currentTarget });
  };
  const handleVerifyAdjacentsClick = (event) => {
    setAnchor({ ...anchor, verifyAdjacentsAnchor: event.currentTarget });
  };

  const onDegreeSubmit = async (vertex) => {
    await onGetDegree(vertex);
    setAnchor({ ...anchor, degreeAnchor: null, menuAnchor: null });
    setVertexInfo({ ...vertexInfo, degree: { vertex: '' } });
  }
  const onAdjacentsSubmit = async (vertex) => {
    await onGetNeighbors(vertex);
    setAnchor({ ...anchor, adjacentsAnchor: null, menuAnchor: null });
    setVertexInfo({ ...vertexInfo, vertex: '' });
  }
  const onCheckIfNeighborsSubmit = async (u, v) => {
    await onCheckIfNeighbors(u, v);
    setAnchor({ ...anchor, verifyAdjacentsAnchor: null, menuAnchor: null });
    setVertexInfo({ ...vertexInfo, neighborsBetween: { u: '', v: '' } });
  }
  const onDownload = async () => {
    await onDownloadGraphImage();
    setAnchor({ ...anchor, menuAnchor: null });
  }
  return (
    <div>
      <Button
        id="demo-customized-button"
        color="inherit"
        size="small"
        aria-controls={anchor.menuAnchor ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={anchor.menuAnchor ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={(event) => setAnchor({ ...anchor, menuAnchor: event.currentTarget })}
        endIcon={<KeyboardArrowDownIcon />}
      >
        <SettingsIcon />
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchor.menuAnchor}
        open={Boolean(anchor.menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDegreeClick} disableRipple>
          <CommitIcon />
          Grau do Vértice
        </MenuItem>
        <MenuItem onClick={handleAdjacentsClick} disableRipple>
          <HubOutlinedIcon />
          Obter Adjacentes
        </MenuItem>
        <MenuItem onClick={handleVerifyAdjacentsClick} disableRipple>
          <DeviceHubOutlinedIcon />
          Verificar Adjacencia
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={onDownload} disableRipple>
          <CloudDownloadOutlinedIcon />
          Baixar Imagem do Grafo
        </MenuItem>
      </StyledMenu>
      <DegreePopover
        degreeAnchorEl={anchor.degreeAnchor}
        handleDegreeClose={handleDegreeClose}
        onDegreeSubmit={onDegreeSubmit}
        vertexInfo={vertexInfo}
        setVertexInfo={setVertexInfo}
      />
      <AdjacentsPopover
        adjacentsAnchor={anchor.adjacentsAnchor}
        handleAdjacentsClose={handleAdjacentsClose}
        vertexInfo={vertexInfo}
        setVertexInfo={setVertexInfo}
        onGetNeighbors={onAdjacentsSubmit}
      />
      <VerifyAdjacencyPopover
        verifyAdjacentsAnchor={anchor.verifyAdjacentsAnchor}
        handleVerifyAdjacentsClose={handleVerifyAdjacentsClose}
        vertexInfo={vertexInfo}
        setVertexInfo={setVertexInfo}
        onCheckIfNeighbors={onCheckIfNeighborsSubmit}
      />
    </div>
  );
}
export default CustomizedMenus;
