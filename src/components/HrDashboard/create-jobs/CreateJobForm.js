import React, { useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form, FormikProvider, Field, useFormik } from "formik";
import { useState, } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { ListItemText, Container, Stack, Typography, Link, TextField, FormControlLabel, Select,MenuItem, Checkbox, FormControl, InputLabel } from '@mui/material';
// components
import Page from '../../Page';
//
import { LoadingButton } from "@mui/lab";
import axios from 'axios';
import {useSnackbar} from 'notistack';
import * as constants from "src/utils/constants";
import { apiInstance } from "src/utils/apiAuth";

// ----------------------------------------------------------------------


export default function CreateJobForm() {
const { enqueueSnackbar} = useSnackbar();
const navigate = useNavigate();
const [technologyData, setTechnologyData] = useState([])
const technologyLoad = () => {
  const apiInstance = axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/technology/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
  .then((response) => {
      setTechnologyData(response.data.data)
  })
  .catch((e) => console.log('something went wrong :(', e));
};

const [officeLocationData, setOfficeLocationData] = useState([])
const getOfficeLocation = () => {
  const apiInstance = axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/office-locations/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
  .then((response) => {
    setOfficeLocationData(response.data.data)
  })
  .catch((e) => console.log('something went wrong :(', e));
};

const [categoryData, setCategoryData] = useState([])
const getCategory = () => {
  const apiInstance = axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/job-category/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
  .then((response) => {
    setCategoryData(response.data.data)
  })
  .catch((e) => console.log('something went wrong :(', e));
};

  useEffect(() => {
    technologyLoad()
    getOfficeLocation()
    getCategory()
  }, [])

  const [openFilter, setOpenFilter] = useState(false);

  const callJobPostApi = (job_name, job_cat_id, location_id, primary_technology_id, technology_id, min_exp, max_exp, skills, requirements, responsibilities, description, total_openings, is_active) => {

    apiInstance({
      method: 'post',
      url: '/jobs/',
      headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`},
      data: {
        "job_name": job_name,
        "job_cat_id": job_cat_id,
        "primary_technology": primary_technology_id,
        "location_id": location_id,
        "technology_id": technology_id,
        "min_exp": min_exp,
        "max_exp": max_exp,
        "skills": skills,
        "requirements": requirements,
        "responsibility": responsibilities,
        "description": description,
        "total_openings": total_openings,
        "is_active": is_active
      }
    }).then(function (response) {

      if (response.status == 200) {
        enqueueSnackbar("Job created successfully !!", {
          anchorOrigin: {
                          vertical: 'top',
                          horizontal: 'right',
                        },
          variant: 'success',
          autoHideDuration: 1500,
        });
        navigate('/resumeX/create-jobs', {replace: true});
      }

    })
    .catch(function (error) {
    })
  }

  const CreateJobFormSchema = Yup.object().shape({
    // id: Yup.string()
    // .min(1, "Too Short!")
    // .max(50, "Too Long!")
    // .required("ID required"),
    // name: Yup.string()
    //   .min(2, "Too Short!")
    //   .max(50, "Too Long!")
    //   .required("Name is required"),
    // category: Yup.string()
    // .min(2, "Too Short!")
    // .max(50, "Too Long!")
    // .required("Category is required"),
    // technology: Yup.string()
    // .min(2, "Too Short!")
    // .max(50, "Too Long!")
    // .required("Technology is required"),
    // minimum_required_experience: Yup.string()
    //   .min(2, "Too Short!")
    //   .max(50, "Too Long!")
    //   .required("Minimum Experience is required"),
    //   maximum_required_experience: Yup.string()
    //   .min(2, "Too Short!")
    //   .max(50, "Too Long!")
    //   .required("Maximum Experience is required"),
    // job_location: Yup.string().required("Job Location is required"),
    // skills: Yup.string().required("Skills are required"),
    // requirements: Yup.string().required("Requirements are required"),
    // responsibilities: Yup.string().required("Responsibilities are required"),
    // description: Yup.string().required("Description is required"),
    // total_openings: Yup.string().required("Total Openings are required"),
  });

  const formik = useFormik({
    initialValues: {
      id: '',
      name: '',
      category: '',
      technology: '',
      primary_technology: '',
      minimum_required_experience: '',
      maximum_required_experience: '',
      job_location: '',
      skills: '',
      requirements: '',
      responsibilities: '',
      description: '',
      total_openings: '',
      is_active: '',
      location: ''
    },
    validationSchema: CreateJobFormSchema,
    onSubmit: (formValues) => {
      let job_name = formValues.name
      let job_cat_id = formValues.category
      let primary_technology_id = formValues.primary_technology
      let location_id = String(officeLocationState.location).split(',')
      let technology_id = String(technologyState.technology).split(',')
      let min_exp = formValues.minimum_required_experience
      let max_exp = formValues.maximum_required_experience
      let skills = formValues.skills
      let requirements = formValues.requirements
      let responsibilities = formValues.responsibilities
      let description = formValues.description
      let total_openings = formValues.total_openings
      let is_active = checked

      callJobPostApi(job_name, job_cat_id, location_id, primary_technology_id, technology_id, min_exp, max_exp, skills, requirements, responsibilities, description, total_openings, is_active)
      setOpenFilter(false);
    }
  });

  const [officeLocationState, setOfficeLocationState] = React.useState({
    location: []
  });

  const handleOfficeLocationChange = event => {
    // event.persist();
    setOfficeLocationState(officeLocationState => ({
      ...officeLocationState,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value
    }));
  };

  const [technologyState, setTechnologyState] = React.useState({
    technology: []
  });

  const handleFieldChange = event => {
    console.log(event);
    // event.persist();
    setTechnologyState(technologyState => ({
      ...technologyState,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value
    }));
  };

  const [checked, setChecked] = React.useState(true);
  const handleIsActiveChange = event =>{
    setChecked(event.target.checked);
  };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setSubmitting } = formik;
 
  return (
    <Page title="Dashboard: Hr">
      <Container>  
        <Link to="/resumeX/create-jobs" color="green" underline="hover" component={RouterLink} fontSize="20px"> Back
        </Link>

        <Typography variant="h4" sx={{ mb: 5 }} align="center">
          Create Job
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
                    {/* --------------------- ID --------------------- */}
                    <TextField
                    fullWidth
                    required
                    label="ID"
                    {...getFieldProps("id")}
                    // error={Boolean(touched.id && errors.id)}
                    // helperText={touched.id && errors.id}
                    />
                    
                    {/* --------------------- Name --------------------- */}
                    <TextField
                    fullWidth
                    required
                    label="Name"
                    {...getFieldProps("name")}
                    // error={Boolean(touched.name && errors.name)}
                    // helperText={touched.name && errors.name}
                    />

                    {/* --------------------- Category --------------------- */}
                    <TextField
                        fullWidth
                        required
                        select
                        label="Category"
                        {...getFieldProps("category")}
                        // error={Boolean(touched.category && errors.category)}
                        // helperText={touched.category && errors.category}
                        >
                      {categoryData.map((category) => (
                        <MenuItem key={category.id} value={category.id}>{category.job_category_name}</MenuItem>
                      ))}
                    </TextField>

                      {/* --------------------- Primary Technology --------------------- */}
                      <TextField
                        fullWidth
                        required
                        select
                        label="Primary Technology"
                        {...getFieldProps("primary_technology")}
                        // error={Boolean(touched.primary_technology && errors.primary_technology)}
                        // helperText={touched.primary_technology && errors.primary_technology}
                        >
                      {technologyData.map((technology) => (
                        <MenuItem key={technology.id} value={technology.id}>{technology.technology_name}</MenuItem>
                      ))}
                    </TextField>
                </Stack>


                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                      fullWidth
                      required
                      select
                      label="Secondary Technology"
                      multiple
                      value= {technologyState.technology}
                      {...getFieldProps("technology")}
                      // error={technologyState.technology.length===0 ? ((touched.technology && errors.technology)) : ""}
                      // helperText={touched.technology && errors.technology}
                      SelectProps={{
                        multiple: true,
                        value: technologyState.technology,
                        onChange: handleFieldChange
                      }}
                    >
                      {technologyData.map((technology) => (
                        <MenuItem key={technology.id} value={technology.id}>{technology.technology_name}</MenuItem>
                      ))}
                    </TextField>
                    
                    <TextField
                      fullWidth
                      required
                      select
                      label="Office Location"
                      multiple
                      // required
                      value= {officeLocationState.location}
                      {...getFieldProps("location")}
                      // error={technologyState.userRoles.length===0 ? ((touched.userRoles && errors.userRoles)) : ""}
                      // helperText={touched.userRoles && errors.userRoles}
                      SelectProps={{
                        multiple: true,
                        value: officeLocationState.location,
                        onChange: handleOfficeLocationChange
                      }}
                    >
                      {officeLocationData.map((location) => (
                        <MenuItem key={location.id} value={location.id}>{location.office_location}</MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      fullWidth
                      required
                      label="Total Openings"
                      {...getFieldProps("total_openings")}
                      // error={Boolean(touched.total_openings && errors.total_openings)}
                      // helperText={touched.total_openings && errors.total_openings}
                    />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                      fullWidth
                      required
                      select
                      label="Minimum Experience Required"
                      {...getFieldProps("minimum_required_experience")}
                      // error={Boolean(touched.minimum_required_experience && errors.minimum_required_experience)}
                      // helperText={touched.minimum_required_experience && errors.minimum_required_experience}
                      >
                      <MenuItem key={1} value="0.00">0.00</MenuItem>
                      <MenuItem key={2} value="0.06">0.06</MenuItem>
                      <MenuItem key={3} value="1.00">1.00</MenuItem>
                      <MenuItem key={4} value="1.05">1.05</MenuItem>
                      <MenuItem key={5} value="2.00">2.00</MenuItem>
                      <MenuItem key={6} value="2.05">2.05</MenuItem>
                      <MenuItem key={7} value="3.00">3.00</MenuItem>
                      <MenuItem key={8} value="3.05">3.05</MenuItem>
                      <MenuItem key={9} value="4.00">4.00</MenuItem>
                      <MenuItem key={10} value="4.05">4.05</MenuItem>
                      <MenuItem key={11} value="5.00">5.00</MenuItem>
                    </TextField>

                    <TextField
                      fullWidth
                      select
                      label="Maximum Experience Required"
                      {...getFieldProps("maximum_required_experience")}
                      // error={Boolean(touched.maximum_required_experience && errors.maximum_required_experience)}
                      // helperText={touched.maximum_required_experience && errors.maximum_required_experience}
                      >
                      <MenuItem key={1} value="0.00">0.00</MenuItem>
                      <MenuItem key={2} value="0.06">0.06</MenuItem>
                      <MenuItem key={3} value="1.00">1.00</MenuItem>
                      <MenuItem key={4} value="1.05">1.05</MenuItem>
                      <MenuItem key={5} value="2.00">2.00</MenuItem>
                      <MenuItem key={6} value="2.05">2.05</MenuItem>
                      <MenuItem key={7} value="3.00">3.00</MenuItem>
                      <MenuItem key={8} value="3.05">3.05</MenuItem>
                      <MenuItem key={9} value="4.00">4.00</MenuItem>
                      <MenuItem key={10} value="4.05">4.05</MenuItem>
                      <MenuItem key={11} value="5.00">5.00</MenuItem>
                    </TextField>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      required
                      label="Skills"
                      multiline
                      rows={2}
                      maxRows={4}
                      {...getFieldProps("skills")}
                      // error={Boolean(touched.skills && errors.skills)}
                      // helperText={touched.skills && errors.skills}
                    />

                    <TextField
                      fullWidth
                      required
                      label="Requirements"
                      multiline
                      rows={2}
                      maxRows={4}
                      {...getFieldProps("requirements")}
                      // error={Boolean(touched.requirements && errors.requirements)}
                      // helperText={touched.requirements && errors.requirements}
                    />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      required
                      label="Responsibilities"
                      multiline
                      rows={2}
                      maxRows={4}
                      {...getFieldProps("responsibilities")}
                      // error={Boolean(touched.responsibilities && errors.responsibilities)}
                      // helperText={touched.responsibilities && errors.responsibilities}
                    />

                    <TextField
                      fullWidth
                      required
                      label="Description"
                      multiline
                      rows={2}
                      maxRows={4}
                      {...getFieldProps("description")}
                      // error={Boolean(touched.description && errors.description)}
                      // helperText={touched.description && errors.description}
                    />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
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
                    Create Job
                </LoadingButton>
                </Stack>
            </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
