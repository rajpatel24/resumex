import axios from 'axios';
import * as Yup from "yup";
import Page from '../../Page';
import {useSnackbar} from 'notistack';
import { LoadingButton } from "@mui/lab";
import React, { useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from "formik";
import InputAdornment from '@mui/material/InputAdornment';
import {Link as RouterLink, useNavigate, useLocation} from 'react-router-dom';
import { Checkbox, Container, FormControl, InputLabel, Link, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import * as constants from 'src/utils/constants';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

export default function EditRRFTemplate() {
    const location = useLocation()

    const { enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();

    const [techStackTechnologyAPIData, setTechStackTechnologyAPIData] = useState([])
    const [techStacksArray, setTechStacksArray] = useState([])

    const getTechStackTechnology = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/techstack-technologies/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setTechStackTechnologyAPIData(response.data.data)

            var techStacks = response.data.data.map((obj) => (obj.technology_stack))
            setTechStacksArray(techStacks)

            // var initialSecondaryTechnologyData = location.state.technologyData.filter(obj => {
            //     return !location.state.requisitionTemplate[0].primary_technology.map(obj => obj.id).includes(obj.id)
            // })

            // setSecondaryTechnologyArray(initialSecondaryTechnologyData)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };

    const [stackRecruiterData, setStackRecruiterData] = useState([])
    
    const getStackTechnologies = (props) => {
        handleChange("techStack")(props)

        const data = {
            tech_stack_id: props.target.value
        }

        axios.post(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/techstack-recruiter/', data, {headers: {"Authorization": `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setStackRecruiterData(response.data.data)
            handleChange("assignedFsdMember")(`${response.data.data.id}`)
        })
        .catch((e) => console.log('something went wrong (:', e));

        var techstack = techStackTechnologyAPIData.filter(obj => {
            return obj.technology_stack.id === data.tech_stack_id
        })[0]

        var tech_ids = techstack.technologies.map((obj) => obj.id)
        
        setFieldValue("primaryTechnology", tech_ids)

        // setFieldValue("secondaryTechnology", [1, 2])

        // Filter data for secondary technology options (Do not include selected values primary tech)

        // var secondaryTechnologyData = location.state.technologyData.filter(obj => {
        //     return !tech_ids.includes(obj.id)
        // })

        // setSecondaryTechnologyArray(secondaryTechnologyData)
    }

    // get job category / requisition department
    const [requisitionDepartmentData, setRequisitionDepartmentData] = useState([])
    const getRequisitionDepartment = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/job-category/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setRequisitionDepartmentData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    }; 

    const [checked, setChecked] = useState(true);
    const handleIsActiveChange = event =>{
      setChecked(event.target.checked);
    };

    // get required experience data for requisition
    const [requisitionRequiredExperienceData, setRequisitionRequiredExperienceData] = useState([])
    const getRequisitionRequiredExperience = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/requisition-experience/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setRequisitionRequiredExperienceData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };     

    // set initial values for secondary technology
    const getSelectInitialSecondaryTechnology = () => {
        const initialSelectedMock = location.state.requisitionTemplate[0].other_technology
    
        const initialSelected = location.state.technologyData.filter((technology) => {
            if (
            initialSelectedMock.find((initialSecondaryTechnology) => initialSecondaryTechnology.id === technology.id)
            ) {
            return true;
            }
            return false;
        });
        return initialSelected;
    };
    
    const initialSelectState = getSelectInitialSecondaryTechnology();

    const [secondaryTechnologyState, setSecondaryTechnologyState] = useState(
        initialSelectState
    );

    useEffect(() => {
        getTechStackTechnology()
        getRequisitionDepartment()
        getRequisitionRequiredExperience()
        setStackRecruiterData(location.state.requisitionTemplate[0].fsd_members)
    }, [])

    const EditRequisitionTemplateSchema = Yup.object().shape({
        techStack: Yup.string()
        .required("Techstack is required"),
        assignedFsdMember: Yup.string()
        .required("FSD Member is required"),
        jobName: Yup.string()
        .min(2, "Too Short!")
        .max(50, "Too Long!")
        .required("Job name is required"),
        jobDescription: Yup.string()
        .min(2, "Too Short!")
        .required("Job description is required"),
        responsibilities: Yup.string()
        .min(2, "Too Short!")
        .required("Responsibilities are required"),
        primaryTechnology: Yup.array()
        .min(1, "Primary technology is required")
        .required("Must have technologies are required"),
        secondaryTechnology: Yup.array()
        .min(1, "Secondary technology is required")
        .required("Good to have technologies are required"),
        department: Yup.string()
        .required("Department is required"),
        requiredExperience: Yup.string()
        .required("Required experience is required"),
    })
    const formik = useFormik({
        initialValues: {
            techStack: location.state.requisitionTemplate[0].tech_stack.id ?? "",
            assignedFsdMember: location.state.requisitionTemplate[0].fsd_members.id ?? "",
            jobName: location.state.requisitionTemplate[0].job_name ?? "",
            jobDescription: location.state.requisitionTemplate[0].job_description ?? "",
            responsibilities: location.state.requisitionTemplate[0].responsibilities ?? "",
            primaryTechnology: location.state.requisitionTemplate[0].primary_technology.map(obj => obj.id),
            secondaryTechnology: location.state.requisitionTemplate[0].other_technology.map(obj => obj.id),
            department: location.state.requisitionTemplate[0].department.id ?? "",
            requiredExperience: location.state.requisitionTemplate[0].job_exp ?? "",
        },
        validationSchema: EditRequisitionTemplateSchema,
        onSubmit: (formValues) => {
            const id = location.state.requisitionTemplate[0].id

            const headers = {
                'Authorization': `Token ${localStorage.getItem('authToken')}`
            }

            const data = {
                tech_stack_id: formValues.techStack,
                fsd_members_id: formValues.assignedFsdMember,
                job_name: formValues.jobName,
                job_description: formValues.jobDescription,
                responsibilities: formValues.responsibilities,
                primary_technology_id: formValues.primaryTechnology,
                other_technology_id: formValues.secondaryTechnology,
                department_id: formValues.department,
                job_exp: formValues.requiredExperience
            }

            axios.put(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/requisition-template/' + id + "/", data, {headers})
            .then(function (response) {
                if (response.status == 200) {
                  enqueueSnackbar("Requisition template created successfully !!", {
                    anchorOrigin: {
                                    vertical: 'top',
                                    horizontal: 'right',
                                  },
                    variant: 'success',
                    autoHideDuration: 1500,
                  });
                  navigate('/resumeX/rrf-templates', {replace: true});
                  window.location.reload(false);
                }
              })
          .catch(error => {
              console.error('There was an error!', error);
          });
        }
    })

    const { errors, handleChange, setFieldValue, touched, handleSubmit, isSubmitting, getFieldProps, values, setValues } = formik;

    return (
        <Page title='Edit RRF Template | ResumeX'>
            <Container maxWidth="xl">

                <Stack direction={{ xs: "column", sm: "row" }} spacing={72}>
                    <Link to="/resumeX/rrf-templates"
                        color="green" 
                        underline="hover" 
                        component={RouterLink} 
                        fontSize="20px">
                            <ArrowCircleLeftIcon fontSize="large" />
                    </Link>

                    <h2 style={{fontSize: '25px', fontWeight: '800'}}>Edit Requisition Template</h2>

                    {/* <Typography variant="h4" sx={{ mb:5 }} align="center">
                        Edit Requisition Template
                    </Typography> */}
                </Stack>
                
                <Stack
                    direction="row"
                    flexWrap="wrap-reverse"
                    alignItems="center"
                    justifyContent="flex-end"
                    sx={{ mb: 10 }}
                >
                </Stack>

                <FormikProvider value={formik}>
                    <Form autoComplete="off" onSubmit={handleSubmit}>
                        <Stack spacing={3}>

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                {/* --------------------- Department --------------------- */}
                                <TextField
                                    fullWidth
                                    select
                                    label="Department *"
                                    {...getFieldProps("department")}
                                    error={Boolean(touched.department && errors.department)}
                                    helperText={touched.department && errors.department}
                                >
                                    {requisitionDepartmentData.map((department) => (
                                        <MenuItem key={department.id} value={department.id}>{department.job_category_name}</MenuItem>
                                    ))}
                                </TextField>

                                {/* --------------------- Required Experience --------------------- */}
                                <TextField
                                    fullWidth
                                    select
                                    label="Required Experience"
                                    {...getFieldProps("requiredExperience")}
                                    error={Boolean(touched.requiredExperience && errors.requiredExperience)}
                                    helperText={touched.requiredExperience && errors.requiredExperience}
                                    >
                                {requisitionRequiredExperienceData.map((experience) => (
                                    <MenuItem 
                                    key={experience.id} 
                                    value={experience.requisition_experience}>
                                        {experience.requisition_experience}
                                    </MenuItem>
                                ))}
                                </TextField>   

                                {/* --------------------- Job Name --------------------- */}
                                <TextField
                                    fullWidth
                                    label="Job Name"
                                    {...getFieldProps("jobName")}
                                    error={Boolean(touched.jobName && errors.jobName)}
                                    helperText={touched.jobName && errors.jobName}
                                    >
                                </TextField>
                            </Stack>

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                {/* --------------------- Tech Stack --------------------- */}
                                <TextField
                                    fullWidth
                                    select
                                    label="Tech Stack"
                                    {...getFieldProps("techStack")}
                                    onChange={(selectedOption) => getStackTechnologies(selectedOption)}
                                    value = {formik.values.techStack}
                                    error={Boolean(touched.techStack && errors.techStack)}
                                    helperText={touched.techStack && errors.techStack}
                                    >
                                    {techStacksArray.map((techstack) => (
                                        <MenuItem key={techstack.id} value={techstack.id}>{techstack.tech_stack_name}</MenuItem>
                                    ))}
                                </TextField>

                                {/* --------------------- Primary Technology --------------------- */}
                                <TextField
                                    fullWidth
                                    select
                                    label="Must Have Technologies *"
                                    // disabled= {"true" ? formik.values.primaryTechnology.length === 5 : "false"}
                                    disabled
                                    multiple
                                    {...getFieldProps("primaryTechnology")}
                                    error={Boolean(touched.primaryTechnology && errors.primaryTechnology)}
                                    helperText={touched.primaryTechnology && errors.primaryTechnology}
                                    SelectProps={{
                                        multiple: true,
                                        value: formik.values.primaryTechnology,
                                        onChange: (selectedOption) => handleChange("primaryTechnology")(selectedOption)
                                    }}
                                    >
                                    {location.state.technologyData.map((technology) => (
                                        <MenuItem key={technology.id} value={technology.id}>{technology.technology_name}</MenuItem>
                                    ))}
                                </TextField>

                                {/* --------------------- Secondary Technology --------------------- */}
                                <TextField
                                    fullWidth
                                    select
                                    label="Good To Have Technologies *"
                                    multiple
                                    {...getFieldProps("secondaryTechnology")}
                                    error={Boolean(touched.secondaryTechnology && errors.secondaryTechnology)}
                                    helperText={touched.secondaryTechnology && errors.secondaryTechnology}
                                    SelectProps={{
                                        multiple: true,
                                        value: formik.values.secondaryTechnology,
                                        onChange: (selectedOption) => handleChange("secondaryTechnology")(selectedOption)
                                    }}
                                    >
                                    {location.state.technologyData.map((technology) => (
                                        <MenuItem key={technology.id} value={technology.id}>{technology.technology_name}</MenuItem>
                                    ))}
                                </TextField>

                                {/* --------------------- Assigned FSD Member --------------------- */}
                                {/* <TextField
                                    fullWidth
                                    disabled
                                    select
                                    label="Assigned FSD Member"
                                    {...getFieldProps("assignedFsdMember")}
                                    value = {formik.values.assignedFsdMember}
                                    error={Boolean(touched.assignedFsdMember && errors.assignedFsdMember)}
                                    helperText={touched.assignedFsdMember && errors.assignedFsdMember}
                                    >
                                        <MenuItem
                                        key={stackRecruiterData?.id} 
                                        value={stackRecruiterData?.id}>
                                            {stackRecruiterData?.recruiters?.map(
                                                (recruiter, index) => (index ? ', ': '') + recruiter?.member?.first_name + " " + recruiter?.member?.last_name)}
                                        </MenuItem>
                                </TextField> */}
                            </Stack>

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                {/* --------------------- Job Description --------------------- */}
                                <TextField
                                    fullWidth
                                    label="Job Description"
                                    multiline
                                    rows={10}
                                    {...getFieldProps("jobDescription")}
                                    error={Boolean(touched.jobDescription && errors.jobDescription)}
                                    helperText={touched.jobDescription && errors.jobDescription}
                                    >
                                </TextField>

                                {/* --------------------- Responsibilities --------------------- */}
                                <TextField
                                    fullWidth
                                    label="Responsibilities"
                                    multiline
                                    rows={10}
                                    {...getFieldProps("responsibilities")}
                                    error={Boolean(touched.responsibilities && errors.responsibilities)}
                                    helperText={touched.responsibilities && errors.responsibilities}                                   
                                />
                            </Stack>

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                                {/* --------------------- Is Active --------------------- */}
                                {/* <Typography>
                                    <Checkbox checked={checked} onChange={handleIsActiveChange}/>
                                    Active
                                </Typography> */}
                            </Stack>

                            <LoadingButton
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                loading={isSubmitting}
                            >
                                Update Requisition Template
                            </LoadingButton>
                        </Stack>
                    </Form>
                </FormikProvider>

            </Container>
        </Page>
    )
}




