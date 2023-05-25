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

CandidateListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func
};

export default function CandidateListToolbar({ numSelected, filterName, onFilterName }) {
  const { enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();
  const [checked, setChecked] = React.useState(true);
  const handleIsActiveChange = event =>{
    setChecked(event.target.checked);
  };
  
  const [openFilter, setOpenFilter] = useState(false);

  const AddCandidateSchema = Yup.object().shape({
    location: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Location is required"),
  });
  const formik = useFormik({
    initialValues: {
      location: '',
      is_active: '',
    },
    validationSchema: AddCandidateSchema,
    onSubmit: (formValues) => {

    const data = {office_location: formValues.location, is_active: checked};
    const headers = {
      'Authorization': `Token ${localStorage.getItem('authToken')}`,
    }

    axios.post(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT +  "/api/v1/office-locations/", data, {headers})
        .then(function (response) {
              if (response.status == 200) {
                enqueueSnackbar("Office Location added successfully !!", {
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
          placeholder="Search Candidate..."
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
        ""
      )}  
    </RootStyle>
  );
}
