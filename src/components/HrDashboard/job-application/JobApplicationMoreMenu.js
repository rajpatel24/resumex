import { Icon } from '@iconify/react';
import Popup from 'reactjs-popup';
import { useRef } from 'react';
import React, { useEffect } from 'react';
import { useState, } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import { Formik, Form, FormikProvider, Field, useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { LoadingButton } from "@mui/lab";
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Container, Stack, TextField, Checkbox, Typography } from '@mui/material';
import {useSnackbar} from 'notistack';
import * as constants from 'src/utils/constants';

// ----------------------------------------------------------------------

export default function JobApplicationMoreMenu(props) {
  const { enqueueSnackbar} = useSnackbar();
  const ref = useRef(null);

  // menu open state
  const [isOpen, setIsOpen] = useState(false);
  const handleDeleteChange = event =>{
    setIsOpen(false);
    const apiInstance = axios.delete(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/job-application/' + props.id, {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
    .then(function (response) {
      if (response.status == 204) {
        enqueueSnackbar("Job Application deleted successfully !!", {
          anchorOrigin: {
                          vertical: 'top',
                          horizontal: 'right',
                        },
          variant: 'success',
          autoHideDuration: 1500,
        });
        // navigate('/resumeX/app', {replace: true});
        window.location.reload(false);
      }
    })
    .catch(error => {
        console.error('There was an error!', error);
    });
  }

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleDeleteChange}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        {/* <MenuItem sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem> */}
      </Menu>
    </>
  );
}
