import React, { useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form, FormikProvider, Field, useFormik } from "formik";
import { useState, } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { ListItemText, Container, Stack, Typography, Link, TextField, FormControlLabel, Select,MenuItem, Checkbox, FormControl, InputLabel } from '@mui/material';
// components
import Page from '../../../Page';
//
import { LoadingButton } from "@mui/lab";
import axios from 'axios';
import {useSnackbar} from 'notistack';
import * as constants from "src/utils/constants";
import { constantCase } from "change-case";

// ----------------------------------------------------------------------

export default function ProfileUpdateForm() {
const { enqueueSnackbar} = useSnackbar();
const navigate = useNavigate();
// const [candidateData, setCandidateData] = useState([])
// const getCandidateDetails = () => {
//   const apiInstance = axios.get('http://127.0.0.1:8000/api/v1/candidate/', {headers: {"Authorization" : `Token ${localStorage.getItem('candidateToken')}`}})
//   .then((response) => {
//     setCandidateData(response.data.data.user)
//   })
//   .catch((e) => console.log('something went wrong :(', e));
// };

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

  const [emailData, setEmailData]  = useState([]);
  const getEmail = () => {
    const apiInstance = axios.get(constants.HTTP_METHOD+constants.HTTP_URL+constants.HTTP_PORT+'/api/v1/candidate/', {headers: {"Authorization" : `Token ${localStorage.getItem('candidateToken')}`}})
    .then((response) => {
      setEmailData(response.data.data.user.email)
    })
    .catch((e) => console.log('something went wrong :(', e));
  };

  const [mobileData, setMobileData]  = useState([]);
  const getMobile = () => {
    const apiInstance = axios.get(constants.HTTP_METHOD+constants.HTTP_URL+constants.HTTP_PORT+'/api/v1/candidate/', {headers: {"Authorization" : `Token ${localStorage.getItem('candidateToken')}`}})
    .then((response) => {
      setMobileData(response.data.data.user.mobile)
    })
    .catch((e) => console.log('something went wrong :(', e));
  };

  const [dobData, setDOBData]  = useState([]);
  const getDOB = () => {
    const apiInstance = axios.get(constants.HTTP_METHOD+constants.HTTP_URL+constants.HTTP_PORT+'/api/v1/candidate/', {headers: {"Authorization" : `Token ${localStorage.getItem('candidateToken')}`}})
    .then((response) => {
      setDOBData(response.data.data.dob)
    })
    .catch((e) => console.log('something went wrong :(', e));
  };

  useEffect(() => {
    // getCandidateDetails()
    getFirstName()
    getLastName()
    getEmail()
    getMobile()
    getDOB()
  }, [])

  const [openFilter, setOpenFilter] = useState(false);

  const CreateJobFormSchema = Yup.object().shape({
    // firstName: Yup.string()
    // .min(1, "Too Short!")
    // .max(50, "Too Long!")
    // .required("First Name is required"),
    // lastName: Yup.string()
    //   .min(2, "Too Short!")
    //   .max(50, "Too Long!")
    //   .required("Last Name is required"),
    // email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    // dob: Yup.string().required("Birth date is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      dob: '',
    },
    validationSchema: CreateJobFormSchema,
    onSubmit: (formValues) => {

    const data = {first_name: firstNameData, last_name: lastNameData, email: emailData, dob: dobData};
    const headers = {
      'Authorization': `Token ${localStorage.getItem('candidateToken')}`,
    }

    axios.put(constants.HTTP_METHOD+constants.HTTP_URL+constants.HTTP_PORT+"/api/v1/candidate/", data, {headers})
        .then(function (response) {
              if (response.status == 200) {
                enqueueSnackbar("Profile updated successfully !!", {
                  anchorOrigin: {
                                  vertical: 'top',
                                  horizontal: 'right',
                                },
                  variant: 'success',
                  autoHideDuration: 1500,
                });
                navigate('/dashboard/app', {replace: true});
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
    <Page title="Profile Update | ResumeX">
      <Container>  
        <Typography variant="h4" sx={{ mb: 5 }} align="center">
          Update Profile
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
                    {/* --------------------- First Name --------------------- */}
                    <TextField
                    fullWidth
                    required
                    label="First Name"
                    // {...getFieldProps("firstName")}
                    defaultValue="Hello World"
                    value={firstNameData}
                    // error={Boolean(touched.firstName && errors.firstName)}
                    // helperText={touched.firstName && errors.firstName}
                    onChange={(event) => setFirstNameData(event.target.value)}
                    />
                    
                    {/* --------------------- Last Name --------------------- */}
                    <TextField
                    fullWidth
                    required
                    label="Last Name"
                    {...getFieldProps("lastName")}
                    defaultValue="Hello World"
                    value={lastNameData}
                    error={lastNameData.length===0 ? ((touched.lastName && errors.lastName)) : ""}
                    // helperText={touched.lastName && errors.lastName}
                    onChange={(event) => setLastNameData(event.target.value)}
                    /> 
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    {/* --------------------- Mobile --------------------- */}
                    <TextField
                    fullWidth
                    disabled
                    label="Mobile"
                    {...getFieldProps("mobile")}
                    defaultValue="Hello World"
                    value={mobileData}
                    // error={Boolean(touched.lastName && errors.lastName)}
                    // helperText={touched.lastName && errors.lastName}
                    onChange={(event) => setMobileData(event.target.value)}
                    />
                    {/* --------------------- Email --------------------- */}
                    <TextField
                    fullWidth
                    required
                    label="Email"
                    {...getFieldProps("email")}
                    defaultValue="Hello World"
                    value={emailData}
                    // error={Boolean(touched.email && errors.email)}
                    // helperText={touched.email && errors.email}
                    onChange={(event) => setEmailData(event.target.value)}
                    /> 

                    {/* --------------------- DOB --------------------- */}
                    <TextField
                    fullWidth
                    type='date'
                    required
                    label="DOB"
                    {...getFieldProps("dob")}
                    defaultValue="Hello World"
                    value={dobData}
                    // error={Boolean(touched.email && errors.email)}
                    // helperText={touched.email && errors.email}
                    onChange={(event) => setDOBData(event.target.value)}
                    />
                </Stack>

                <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                >
                    Update
                </LoadingButton>
                </Stack>
            </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
