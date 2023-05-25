import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import homeFill from '@iconify/icons-eva/home-fill';
import personFill from '@iconify/icons-eva/person-fill';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { alpha } from '@mui/material/styles';
import { Button, Box, Divider, MenuItem, Typography, Avatar, IconButton } from '@mui/material';
// components
import MenuPopover from '../../MenuPopover';
//
import account from '../../../_mocks_/account';
import axios from 'axios';
import {useSnackbar} from 'notistack';
import { apiInstance } from 'src/utils/apiAuth';
import { useAuth } from 'src/utils/auth';
import UserInfo from '../../../utils/Authorization/UserInfo';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: homeFill,
    linkTo: '/employee-dashboard/app'
  },
  {
    label: 'Change Password',
    icon: settings2Fill,
    linkTo: '/employee-dashboard/change-password/'
  },
  // {
  //   label: 'Settings',
  //   icon: settings2Fill,
  //   linkTo: '#'
  // }
];

// ----------------------------------------------------------------------

export default function EmployeeAccountPopover() {
  const { enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();
  const employeeEmail = localStorage.getItem('employeeEmail');
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const auth = useAuth()
  const userData = UserInfo()

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function LogOutHandler() {  
    apiInstance({
      method: 'post',
      url: '/user/logout/',
      headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`},
    }).then(function (response) {
  
      if (response.status === 200) {
        auth.logout()
        localStorage.clear()
        enqueueSnackbar(response.data.detail, {
          anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
            variant: 'success',
            autoHideDuration: 1500,

          });
          navigate('/employee-login', { replace: true });
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
            {userData.first_name + " " + userData.last_name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userData.email}
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
