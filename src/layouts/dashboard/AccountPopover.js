import { Icon } from '@iconify/react';
import { useRef, useState, useEffect } from 'react';
import homeFill from '@iconify/icons-eva/home-fill';
import personFill from '@iconify/icons-eva/person-fill';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
import * as constants from "src/utils/constants";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { alpha } from '@mui/material/styles';
import { Button, Box, Divider, MenuItem, Typography, Avatar, IconButton } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';
//
import account from '../../_mocks_/account';

import axios from 'axios';
import {useSnackbar} from 'notistack';
import { apiInstance } from 'src/utils/apiAuth';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: homeFill,
    linkTo: '/dashboard/app'
  },
  {
    label: 'Profile',
    icon: personFill,
    linkTo: '/user/profile'
  },
];

// ----------------------------------------------------------------------


export default function CandidateAccountPopover() {


  const [firstNameData, setFirstNameData]  = useState([]);
  const getFirstName = () => {
    const apiInstance = axios.get(constants.HTTP_METHOD+constants.HTTP_URL+constants.HTTP_PORT+'/api/v1/candidate/', {headers: {"Authorization" : `Token ${localStorage.getItem('candidateToken')}`}})
    .then((response) => {
      setFirstNameData(response.data.data.user.first_name)
      localStorage.setItem("candidateFirstName", response.data.data.user.first_name); 
    })
    .catch((e) => console.log('something went wrong :(', e));
  };

  const [lastNameData, setLastNameData]  = useState([]);
  const getLastName = () => {
    const apiInstance = axios.get(constants.HTTP_METHOD+constants.HTTP_URL+constants.HTTP_PORT+'/api/v1/candidate/', {headers: {"Authorization" : `Token ${localStorage.getItem('candidateToken')}`}})
    .then((response) => {
      setLastNameData(response.data.data.user.last_name)
    })
    .catch((e) => console.log('something went wrong :(', e));
  };
  
  const { enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getFirstName()
    getLastName()
  },[])

  function LogOutHandler() {  
    apiInstance({
      method: 'post',
      url: 'user/logout/',
      headers: {"Authorization" : 'Token ' + localStorage.getItem('candidateToken')},
    }).then(function (response) {
  
      if (response.status === 200) {
        localStorage.clear()
        enqueueSnackbar(response.data.detail, {
          anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
            variant: 'success',
            autoHideDuration: 1500,

          });
          navigate('/', { replace: true });
      }
      
    })
    .catch(function (error) {
      enqueueSnackbar(error.response.data.detail, {
        anchorOrigin: {
                          vertical: 'top',
                          horizontal: 'right',
                      },
          variant: 'error',
          autoHideDuration: 2000,  
        });
    });   
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
          {firstNameData} {lastNameData}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {localStorage.getItem('candidateEmail')}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            to={option.linkTo}
            component={RouterLink}
            onClick={handleClose}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            <Box
              component={Icon}
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            />

            {option.label}
          </MenuItem>
        ))}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="inherit" variant="outlined" onClick={LogOutHandler}>
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
