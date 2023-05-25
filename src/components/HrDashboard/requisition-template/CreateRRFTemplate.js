import React, { useState, useEffect } from 'react';
import Page from '../../Page';
import { Box, Checkbox,Container, MenuItem, Stack, TableCell, Table, TableContainer, TableRow, 
    TableHead, TextField, Typography, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from "formik";
import axios from 'axios';
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";
import {useSnackbar} from 'notistack';
import * as constants from 'src/utils/constants';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

export default function CreateRRFTemplate() {
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
        })
        .catch((e) => console.log('something went wrong :(', e));
    };

    const [technologyData, setTechnologyData] = useState([])
    const [secondaryTechnologyArray, setSecondaryTechnologyArray] = useState([])

    const getTechnologyData = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/technology/', {headers: {"Authorization": `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setTechnologyData(response.data.data)
            const filterSTarr = response.data.data.map((item) => { if(item.is_active === true){return item}})
            const thisSTarr = filterSTarr.filter(function (el) { return el != null; });
            setSecondaryTechnologyArray(thisSTarr)
        })
        .catch((e) => console.log('something went wrong (:', e));
    };

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

        var secondaryTechnologyData = technologyData.filter(obj => {
            return !tech_ids.includes(obj.id)
        })

        setSecondaryTechnologyArray(secondaryTechnologyData)
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

    const [stackRecruiterData, setStackRecruiterData] = useState([])

    // for multiselect dropdown

    // const getAssignedRecruiter = (props) => {
    //     handleChange("techStack")(props)
    //     const data = {
    //         tech_stack: props.target.value
    //     }
    //     axios.post('http://127.0.0.1:8000/api/v1/techstack-recruiter/', data, {headers: {"Authorization": `Token ${localStorage.getItem('authToken')}`}})
    //     .then((response) => {
    //         setStackRecruiterData(response.data.data)
    //         setFieldValue("fsdMember", [response.data.data[0].id])
    //     })
    //     .catch((e) => console.log('something went wrong (:', e));
    // }

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

    useEffect(() => {
        getTechStackTechnology()
        getTechnologyData()
        getRequisitionDepartment()
        getRequisitionRequiredExperience()
    }, [])

    const RequisitionTemplateSchema = Yup.object().shape({
        techStack: Yup.string()
        .required("Techstack is required"),
        assignedFsdMember: Yup.string()
        .required("FSD Member is required"),
        jobName: Yup.string()
        .trim("Job name cannot include spaces")
        // .min(2, "Too Short!")
        // .max(50, "Too Long!")
        .required("Job name is required"),
        jobDescription: Yup.string()
        // .min(2, "Too Short!")
        .trim("Job name cannot include spaces")
        .required("Job description is required"),
        responsibilities: Yup.string()
        // .min(2, "Too Short!")
        .trim("Job name cannot include spaces")
        .required("Responsibilities are required"),
        primaryTechnology: Yup.array()
        .min(1, "Must have technologies are required")
        .required("Must have technologies are required"),
        secondaryTechnology: Yup.array()
        .min(1, "Good to have technologies are required")
        .required("Good to have technologies are required"),
        department: Yup.string()
        .required("Department is required"),
        requiredExperience: Yup.string()
        .required("Required experience is required"),
    })
    const formik = useFormik({
        initialValues: {
            techStack: "",
            assignedFsdMember: "",
            jobName: "",
            jobDescription: "",
            responsibilities: "",
            primaryTechnology: [],
            secondaryTechnology: [],
            department: "",
            requiredExperience: "",
        },
        validationSchema: RequisitionTemplateSchema,
        onSubmit: (formValues) => {
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

            axios.post(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/requisition-template/', data, {headers})
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

    const { errors, handleChange, setFieldValue, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

    return (
        <Page>
            <Container maxWidth="xl">          
                <Stack direction={{ xs: "column", sm: "row" }} spacing={72}>
                    <Link to="/resumeX/rrf-templates"
                        color="green" 
                        underline="hover" 
                        component={RouterLink} 
                        fontSize="20px">
                            <ArrowCircleLeftIcon fontSize="large" />
                    </Link>

                    <h2 align="center" justifyContent="center" style={{fontSize: '25px', fontWeight: '800'}}>Create Requisition Template</h2>

                    {/* <Typography variant="h4" sx={{ mb:5 }} align="center">
                        Create Requisition Template
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
                                    label="Department"
                                    InputLabelProps={{
                                        required: true,
                                    }}
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
                                    InputLabelProps={{
                                        required: true,
                                    }}
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
                                    InputLabelProps={{
                                        required: true,
                                    }}
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
                                    InputLabelProps={{
                                        required: true,
                                    }}
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
                                    label="Must Have Technologies"
                                    InputLabelProps={{
                                        required: true,
                                    }}
                                    // disabled= {"true" ? formik.values.primaryTechnology.length === 5 : "false"}
                                    // disabled
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
                                    {technologyData.map((technology) => (
                                        <MenuItem key={technology.id} value={technology.id}>{technology.technology_name}</MenuItem>
                                    ))}
                                </TextField>

                                {/* --------------------- Secondary Technology --------------------- */}
                                <TextField
                                    fullWidth
                                    select
                                    label="Good To Have Technologies"
                                    InputLabelProps={{
                                        required: true,
                                    }}
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
                                    {secondaryTechnologyArray.map((technology) => (
                                        <MenuItem key={technology.id} value={technology.id}>{technology.technology_name}</MenuItem>
                                    ))}
                                </TextField>

                                {/* --------------------- Assigned FSD Member (working) --------------------- */}
                                {/* <TextField
                                    fullWidth
                                    disabled
                                    select
                                    label="Default FSD Member *"
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
                                    InputLabelProps={{
                                        required: true,
                                    }}
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
                                    InputLabelProps={{
                                        required: true,
                                    }}
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
                                Create Requisition Template
                            </LoadingButton>
                        </Stack>
                    </Form>
                </FormikProvider>
            </Container>
        </Page>
    )
}