import React from 'react';
import { useState, } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
import plusFill from '@iconify/icons-eva/plus-fill';
import {Container, Stack, TextField, Checkbox} from '@mui/material';
import { Formik, Form, FormikProvider, Field, useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { Link as RouterLink, useNavigate} from 'react-router-dom';
import * as Yup from "yup";
import axios from 'axios';
import {useSnackbar} from 'notistack';
// material
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment
} from '@mui/material';
import * as constants from 'src/utils/constants';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

UsersListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func
};

export default function UsersListToolbar({ numSelected, filterName, onFilterName }) {
  const { enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();
  const [checked, setChecked] = React.useState(true);
  const handleIsActiveChange = event =>{
    setChecked(event.target.checked);
  };
  
  const [openFilter, setOpenFilter] = useState(false);

  const AddUsersSchema = Yup.object().shape({
    User: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("User is required"),
  });
  const formik = useFormik({
    initialValues: {
      User: '',
      is_active: '',
    },
    validationSchema: AddUsersSchema,
    onSubmit: (formValues) => {

    const data = {User_name: formValues.User, is_active: checked};
    const headers = {
      'Authorization': `Token ${localStorage.getItem('authToken')}`,
    }

    axios.post(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + "/api/v1/users/", data, {headers})
        .then(function (response) {
              if (response.status == 200) {
                enqueueSnackbar("User added successfully !!", {
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
      setOpenFilter(false);
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setSubmitting } = formik;

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="Search User..."
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Icon icon={trash2Fill} />
          </IconButton>
        </Tooltip>
      ) : (
        <Popup
          contentStyle={{
            alignItems: "center",
            left: "150px"
          }}
          modal
          trigger={
            <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
          >
            Add User
          </Button>
          }
          on="click"
          // position="bottom right"
          // arrowStyle={{ left: 20 }}
        >
          <Container style={{padding: "20px"}}>  
            <Typography variant="h4" sx={{ mb: 0 }} align="center">
              Add User
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
                        {...getFieldProps("User")}
                        error={Boolean(touched.User && errors.User)}
                        helperText={touched.User && errors.User}
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
                        Add User
                    </LoadingButton>
                    </Stack>
                </Form>
            </FormikProvider>
          </Container>
        </Popup>
      )}  
    </RootStyle>
  );
}
