import { Icon } from '@iconify/react';
import Popup from 'reactjs-popup';
import { useRef } from 'react';
import React, { useEffect } from 'react';
import { useState, } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import { Formik, Form, FormikProvider, Field, useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { LoadingButton } from "@mui/lab";
// material
import { Button, Dialog, DialogContent, Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Container, Stack, TextField, Checkbox, Typography } from '@mui/material';
import {useSnackbar} from 'notistack';
import { Modal } from 'react-bootstrap';
import * as constants from 'src/utils/constants';

// ----------------------------------------------------------------------
const experience = [
  {
    exp: "0.00"
  },
  {
    exp: "0.06"
  },
  {
    exp: "1.00"
  },
  {
    exp: "1.05"
  },
  {
    exp: "2.00"
  },
  {
    exp: "2.05"
  },
  {
    exp: "3.00"
  },
  {
    exp: "3.05"
  },
  {
    exp: "4.00"
  },
  {
    exp: "4.05"
  },
  {
    exp: "5.00"
  },
]
export default function JobMoreMenu(props) {
  const { enqueueSnackbar} = useSnackbar();
  const ref = useRef(null);

  // popup open state
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setIsOpen(false);
  }

  // menu open state
  const [isOpen, setIsOpen] = useState(false);

  // job state
  const [job, setJob]  = useState([]);

  // job state
  const [jobData, setJobData]  = useState({
    jobName: props.jobName,
    jobCategory: props.jobCategory,
    jobLocation: props.jobLocation,
    jobMaxExp: props. jobMaxExp,
    jobMinExp: props.jobMinExp,
    jobSkills: props.jobSkills,
    jobRequirements: props.jobRequirements,
    jobResponsibility: props.jobResponsibility,
    jobDescription: props.jobDescription,
    jobTechnology: props.jobTechnology,
    jobPrimaryTechnology: props.jobPrimaryTechnology,
    jobOpenings: props.jobOpenings,
    jobActive: props.jobActive
  });

  // const technologies = []
  // const locations = []

  // jobData.jobTechnology.forEach(technology => {
  //   technologies.push(technology.technology_name)
  // });

  const [categoryData, setCategoryData] = useState([])
  const getCategory = () => {
  const apiInstance = axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/job-category/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
  .then((response) => {
    setCategoryData(response.data.data)
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

  const [technologyData, setTechnologyData] = useState([])
  const getTechnology = () => {
  const apiInstance = axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/technology/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
  .then((response) => {
      setTechnologyData(response.data.data)
  })
  .catch((e) => console.log('something went wrong :(', e));
};

  useEffect(() => {
    getCategory()
    getOfficeLocation()
    getTechnology()
  }, [])

  const [officeLocationState, setOfficeLocationState] = React.useState({
    location: props.jobLocation.map(location => location.id)
  });

  const handleOfficeLocationChange = event => {
    setOfficeLocationState(officeLocationState => ({
      ...officeLocationState,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value
    }));
  };


  const [technologyState, setTechnologyState] = React.useState({
    technology: props.jobTechnology.map(jobtech => jobtech.id)
  });

  const handleTechnologyChange = event => {
    setTechnologyState(technologyState => ({
      ...technologyState,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value
    }));
  };

  // is_active flag state
  const [checked, setChecked] = React.useState(jobData.jobActive);
  const handleIsActiveChange = event =>{
    setChecked(event.target.checked);
  };

  const EditJobSchema = Yup.object().shape({
    // job: Yup.string()
    //   .min(2, "Too Short!")
    //   .max(50, "Too Long!")
    //   .required("Job is required"),
  });
  const formik = useFormik({
    initialValues: {
      job_name: '',
      is_active: '',
    },
    validationSchema: EditJobSchema,
    onSubmit: (formValues) => {

    const data = {job_name: jobData.jobName, job_cat_id: jobData.jobCategory, 
      primary_technology: jobData.jobPrimaryTechnology, technology_id: technologyState.technology, 
      location_id: officeLocationState.location, min_exp: jobData.jobMinExp, max_exp: jobData.jobMaxExp, 
      skills: jobData.jobSkills, requirements: jobData.jobRequirements, responsibility: jobData.jobResponsibility,
      description: jobData.jobDescription, total_openings: jobData.jobOpenings, is_active: checked};

    const headers = {
      'Authorization': `Token ${localStorage.getItem('authToken')}`,
    }

    axios.put(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + "/api/v1/jobs/" + props.id + '/', data, {headers})
        .then(function (response) {
              if (response.status == 200) {
                enqueueSnackbar("Job updated successfully !!", {
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
    const apiInstance = axios.delete(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/jobs/' + props.id, {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
    .then(function (response) {
      if (response.status == 204) {
        enqueueSnackbar("Job deleted successfully !!", {
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

      <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
          <Typography align="center" variant="h6" sx={{ mt: 2, ml: 2, mr: 2}}>
              Edit Job
          </Typography>
          <DialogContent  sx={{ mt: 2 }}>
          <FormikProvider value={formik}>
          <Form autoComplete="off" onSubmit={handleSubmit}>
              <Stack spacing={3}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  {/* --------------------- Job ID--------------------- */}
                  <TextField
                  fullWidth
                  label="Job ID"
                  defaultValue={props.id}
                  onChange={(event) => setJob(event.target.value)}
                  />

                  {/* --------------------- Job Name --------------------- */}
                  <TextField
                  fullWidth
                  label="Job Name"
                  defaultValue={jobData.jobName}
                  onChange={(event) => {
                    jobData.jobName = event.target.value;
                    setJobData(jobData);
                  }}
                  />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  {/* --------------------- Job Category --------------------- */}
                  <TextField
                  fullWidth
                  select
                  defaultValue={jobData.jobCategory}
                  label="Job Category"
                  onChange={(event) => {
                    jobData.jobCategory = event.target.value;
                    setJobData(jobData);
                  }}
                  >
                  {categoryData.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.job_category_name}
                    </MenuItem>
                  ))}
                  </TextField>

                  {/* --------------------- Job Location --------------------- */}
                  <TextField
                    fullWidth
                    required
                    select
                    label="Office Location"
                    multiple
                    // required
                    value= {officeLocationState.location}
                    {...getFieldProps("location")}
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
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                {/* --------------------- Primary Technology --------------------- */}
                <TextField
                  fullWidth
                  select
                  defaultValue={jobData.jobPrimaryTechnology}
                  label="Primary Technology"
                  onChange={(event) => {
                    jobData.jobPrimaryTechnology = event.target.value;
                    setJobData(jobData);
                  }}
                  >
                  {technologyData.map((technology) => (
                    <MenuItem key={technology.id} value={technology.id}>
                      {technology.technology_name}
                    </MenuItem>
                  ))}
                  </TextField>

                  {/* --------------------- Job Technology --------------------- */}
                  <TextField
                    fullWidth
                    required
                    select
                    label="Technology"
                    multiple
                    value= {technologyState.technology}
                    {...getFieldProps("technology")}
                    SelectProps={{
                      multiple: true,
                      value: technologyState.technology,
                      onChange: handleTechnologyChange
                    }}
                  >
                    {technologyData.map((technology) => (
                      <MenuItem key={technology.id} value={technology.id}>
                        {technology.technology_name}
                      </MenuItem>
                    ))}
                  </TextField>

                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                {/* --------------------- Total Openings --------------------- */}
                <TextField
                  fullWidth
                  label="Total Openings"
                  defaultValue={jobData.jobOpenings}
                  onChange={(event) => {
                    jobData.jobOpenings = event.target.value;
                    setJobData(jobData);
                  }}
                  />

                  {/* --------------------- Minimum Experience --------------------- */}
                  <TextField
                  fullWidth
                  select
                  defaultValue={jobData.jobMinExp}
                  label="Minimum Experience Required"
                  onChange={(event) => {
                    jobData.jobMinExp = event.target.value;
                    setJobData(jobData);
                  }}
                  >
                  {experience.map((option) => (
                    <MenuItem key={option.exp} value={option.exp}>
                      {option.exp}
                    </MenuItem>
                  ))}
                  </TextField>

                {/* --------------------- Maximum Experience --------------------- */}
                <TextField
                  fullWidth
                  select
                  defaultValue={jobData.jobMaxExp}
                  label="Maximum Experience Required"
                  onChange={(event) => {
                    jobData.jobMaxExp = event.target.value;
                    setJobData(jobData);
                  }}
                  >
                  {experience.map((option) => (
                    <MenuItem key={option.exp} value={option.exp}>
                      {option.exp}
                    </MenuItem>
                  ))}
                </TextField>
                
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  {/* --------------------- Job Skills --------------------- */}
                  <TextField
                    fullWidth
                    label="Skills"
                    multiline
                    rows={4}
                    maxRows={4}
                    defaultValue={jobData.jobSkills}
                    onChange={(event) => {
                      jobData.jobSkills = event.target.value;
                      setJobData(jobData);
                    }}
                  />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  {/* --------------------- Job Requirements --------------------- */}
                  <TextField
                    fullWidth
                    label="Requirements"
                    multiline
                    rows={4}
                    maxRows={4}
                    defaultValue={jobData.jobRequirements}
                    onChange={(event) => {
                      jobData.jobRequirements = event.target.value;
                      setJobData(jobData);
                    }}
                  />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  {/* --------------------- Job Responsibilities --------------------- */}
                  <TextField
                    fullWidth
                    label="Responsibilities"
                    multiline
                    rows={4}
                    maxRows={4}
                    defaultValue={jobData.jobResponsibility}
                    onChange={(event) => {
                      jobData.jobResponsibility = event.target.value;
                      setJobData(jobData);
                    }}
                  />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  {/* --------------------- Job Description --------------------- */}
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    maxRows={4}
                    defaultValue={jobData.jobDescription}
                    onChange={(event) => {
                      jobData.jobDescription = event.target.value;
                      setJobData(jobData);
                    }}
                  />
                </Stack>
                  
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                  {/* --------------------- active --------------------- */}
                  <Typography>
                  <Checkbox checked={checked} onChange={handleIsActiveChange}/>
                    Active
                  </Typography>
                </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">

              <Button fullWidth variant="contained" color="error" size="large" onClick={handleClose}>Cancel</Button>
              <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  onClick
              >
                  Update Job
              </LoadingButton>
              </Stack>
              </Stack>
              </Form>
          </FormikProvider>
        </DialogContent>
      </Dialog>

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

        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleShow}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
