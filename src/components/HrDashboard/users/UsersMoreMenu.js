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

export default function UsersMoreMenu(props) {
  const { enqueueSnackbar} = useSnackbar();
  const ref = useRef(null);

  // menu open state
  const [isOpen, setIsOpen] = useState(false);

  // popup open state
  const [popupOpen, setPopupOpen] = useState(false);
  const closePopup = () => setPopupOpen(false);

  // User state
  const [User, setUser]  = useState([]);

  // is_active flag state
  const [checked, setChecked] = React.useState(props.is_active);
  const handleIsActiveChange = event =>{
    setChecked(event.target.checked);
  };

  const AddUserSchema = Yup.object().shape({
    // User: Yup.string()
    //   .min(2, "Too Short!")
    //   .max(50, "Too Long!")
    //   .required("User is required"),
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      is_active: '',
    },
    validationSchema: AddUserSchema,
    onSubmit: (formValues) => {

    const data = {name: User.length > 0 ? User : props.name, is_active: checked};
    const headers = {
      'Authorization': `Token ${localStorage.getItem('authToken')}`,
    }

    axios.put(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + "/api/v1/users/" + props.id + '/', data, {headers})
        .then(function (response) {
              if (response.status == 200) {
                enqueueSnackbar("User updated successfully !!", {
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
      // setOpenFilter(false);
    }
  });

  const handleDeleteChange = event =>{
    setIsOpen(false);
    const apiInstance = axios.delete(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/users/' + props.id, {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
    .then(function (response) {
      if (response.status == 204) {
        enqueueSnackbar(" Users deleted successfully !!", {
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

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setSubmitting } = formik;

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Popup 
        open={popupOpen} 
        closeOnDocumentClick 
        onClose={closePopup} 
        onOpen={() => setIsOpen(false)}
        contentStyle={{
          alignItems: "center",
          left: "150px"
        }}>
        <Container style={{padding: "20px"}}>  
            <Typography variant="h4" sx={{ mb: 0 }} align="center">
              Edit User
            </Typography>

            <Stack
              direction="row"
              flexWrap="wrap-reverse"
              alignItems="center"
              justifyContent="flex-end"
              sx={{ mb: 5 }}
            >
            </Stack>

            <FormikProvider value={formik}>
                <Form autoComplete="off" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        {/* --------------------- User --------------------- */}
                        <TextField
                        fullWidth
                        label="User"
                        defaultValue={props.name}
                        onChange={(event) => setUser(event.target.value)}
                        />
                      </Stack>
                        
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                        {/* --------------------- active --------------------- */}
                        <Typography>
                        <Checkbox checked={checked} onChange={handleIsActiveChange}/>
                        Active
                        </Typography>
                      </Stack>

                    <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                    >
                        Update User
                    </LoadingButton>
                    </Stack>
                </Form>
            </FormikProvider>
          </Container>
      </Popup> 

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

        <MenuItem sx={{ color: 'text.secondary' }} onClick={() => setPopupOpen(true)}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
