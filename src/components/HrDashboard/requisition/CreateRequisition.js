import React, { useState, useEffect } from 'react';
import { Autocomplete, Box, Button,  Checkbox, Container, InputLabel, Link, MenuItem, Select, Stack, Step, Stepper, StepLabel, TextField,Typography} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from "formik";
import Page from '../../Page';
import axios from 'axios';
import * as Yup from "yup";
import { format } from 'date-fns';
import { LoadingButton } from "@mui/lab";
import {useSnackbar} from 'notistack';
import * as constants from 'src/utils/constants';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

const steps = ['New Requisition Details', 'Job Details', 'Requirements Details'];

export default function CreateRequisition() {
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

    const [options, setOptions] = useState([])

    const getTechnologyData = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/technology/', {headers: {"Authorization": `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setTechnologyData(response.data.data)
            // setSecondaryTechnologyArray(response.data.data)
            setOptions(response.data.data)
        })
        .catch((e) => console.log('something went wrong (:', e));
    };

    // dropdown1 => Must Have Technologies
    // dropdown2 => Good To Have Technologies
    const [selectedOptions1, setSelectedOptions1] = useState([]);
    const [selectedOptions2, setSelectedOptions2] = useState([]);
  
    const handleDropdown1Change = (value) => {
      const selectedOptions = value.map(obj => obj.id);
      setSelectedOptions1(selectedOptions)
      setSelectedOptions2(selectedOptions2.filter(option => !selectedOptions.includes(option)));
      setFieldValue("primaryTechnology", value.map(obj => obj.id))
    };
  
    const handleDropdown2Change = (value) => {
      const selectedOptions = value.map(obj => obj.id);
      setSelectedOptions2(selectedOptions)
      setSelectedOptions1(selectedOptions1.filter(option => !selectedOptions.includes(option)));
      setFieldValue("secondaryTechnology", value.map(obj => obj.id))
    };
  
    const dropdown1Options = options.filter(option => !selectedOptions2.includes(option.id));
    const dropdown2Options = options.filter(option => !selectedOptions1.includes(option.id));

    // set default fsd members on tech stack change
    const [stackRecruiterData, setStackRecruiterData] = useState([])

    const getStackTechnologies = (props) => {
        handleChange("techStack")(props)

        const data = {
            tech_stack_id: props.target.value
        }

        axios.post(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/techstack-recruiter/', data, {headers: {"Authorization": `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setStackRecruiterData(response.data.data)
            handleChange("defaultFsdMember")(`${response.data.data.id}`)
        })
        .catch((e) => console.log('something went wrong (:', e));

        var techstack = techStackTechnologyAPIData.filter(obj => {
            return obj.technology_stack.id === data.tech_stack_id
        })[0]

        var tech_ids = techstack.technologies.map((obj) => obj.id)
        
        // setFieldValue("primaryTechnology", tech_ids)

        // setFieldValue("secondaryTechnology", [1, 2])

        // Filter data for secondary technology options (Do not include selected values primary tech)

        var secondaryTechnologyData = technologyData.filter(obj => {
            return !tech_ids.includes(obj.id)
        })

        // setSecondaryTechnologyArray(secondaryTechnologyData)
    }

    // requisition template data state
    const [requisitionTemplateData, setRequisitionTemplateData] = useState([])
    const getRequisitionTemplates = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/requisition-template/', {headers: {"Authorization": `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setRequisitionTemplateData(response.data.data)
        })
        .catch((e) => console.log('something went wrong (:', e));

        axios.get("http://10.0.2.117:8000/api/v1/requisitions/", {headers: {"Authorization": `Token 5891032b40088d5617039a2219360d8c6dcb8003`}})
        .then((response) => {
            setRequisitionTemplateData(response.data.data)
        })
        .catch((e) => console.log('something went wrong (:', e));
    }

    // rrf-number state
    const [rrfNumberData, setRRFNumberData] = useState([])
    const getRRFNumber = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/rrf-number/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setRRFNumberData(response.data.data)
            handleChange('rrfNumber')(`${response.data.data}`)
        })
        .catch((e) => console.log('something went wrong :(', e));
    }

    // tech stack state
    const [techStackData, setTechStackData] = useState([])
    const getTechStackData = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/tech-stack/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setTechStackData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };

    // get fsd members
    const [fsdMembersData, setFsdMembers] = useState([])
    const getFsdMembers = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/fsd-members/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setFsdMembers(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };

    // get business units
    const [businessUnitData, setBusinessUnitData] = useState([])
    const getBusinessUnits = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/business-units/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setBusinessUnitData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };  
    
    // get job category / requisition department
    const [requisitionDepartmentData, setRequisitionDepartmentData] = useState([])
    const getRequisitionDepartment = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/job-category/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setRequisitionDepartmentData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    }; 
    
    // get requisition types
    const [requisitionTypeData, setRequisitionTypeData] = useState([])
    const getRequisitionTypes = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT +'/api/v1/requisition-types/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setRequisitionTypeData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };

    // get office locations
    const [officeLocationData, setOfficeLocationData] = useState([])
    const getOfficeLocations = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/office-locations/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setOfficeLocationData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };

    // get requisition status
    const [requisitionStatusData, setRequisitionStatusData] = useState([])
    const getRequisitionStatusData = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/requisition-status/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setRequisitionStatusData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };

    // pre-fill requisition create form on rrf template selection
    const fillRequisitionForm = (props) => {
        handleChange("rrfTemplate")(props)

        let requisitionTemplate = requisitionTemplateData.filter(item => {
            return item.id === props.target.value
        })

        // set default fsd members
        const data = {
            tech_stack_id: requisitionTemplate[0].tech_stack?.id
        }

        axios.post(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/techstack-recruiter/', data, {headers: {"Authorization": `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setStackRecruiterData(response.data.data)
            handleChange("defaultFsdMember")(`${response.data.data.id}`)
        })
        .catch((e) => console.log('something went wrong (:', e));

        handleChange("department")(`${requisitionTemplate[0].department.id}`)
        handleChange("techStack")(`${requisitionTemplate[0].tech_stack.id}`)
        // handleChange("additionalSkills")(`${requisitionTemplate[0].additional_skills}`)
        // handleChange("requiredSkills")(`${requisitionTemplate[0].required_skills}`)
        handleChange("jobDescription")(`${requisitionTemplate[0].job_description}`)
        handleChange("responsibilities")(`${requisitionTemplate[0].responsibilities}`)
        
        setFieldValue("primaryTechnology", requisitionTemplate[0].primary_technology.map(obj => obj.id))
        setFieldValue("secondaryTechnology", requisitionTemplate[0].other_technology.map(obj => obj.id))
        
        handleDropdown2Change(requisitionTemplate[0].other_technology)
        handleDropdown1Change(requisitionTemplate[0].primary_technology)
        
        handleChange("jobName")(`${requisitionTemplate[0].job_name}`)
        handleChange("requiredExperience")(`${requisitionTemplate[0].job_exp}`)
    }

    // is_active state
    const [checked, setChecked] = useState(true);
    const handleIsActiveChange = event =>{
      setChecked(event.target.checked);
    };

    const newDate = new Date()
    const minDate = format(newDate.setDate(newDate.getDate() + 30), 'yyyy-MM-dd')

    useEffect(() => {
        getTechStackTechnology()
        getTechnologyData()
        getRequisitionTemplates()
        getTechStackData()
        getFsdMembers()
        getBusinessUnits()
        getRequisitionDepartment()
        getRequisitionTypes()
        getOfficeLocations()
        getRequisitionStatusData()
        getRRFNumber()
    }, [])

    const createRequisitionSchema = Yup.object().shape({
        rrfTemplate:  Yup.string()
        .required("RRF template is required"),
        // rrfNumber: Yup.string()
        // .required("RRF Number is required"),
        designation: Yup.string()
        .required("Designation is required"),
        positions: Yup.number()
        .required("Positions are required"),
        techStack: Yup.string()
        .required("Tech Stack is required"),
        defaultFsdMember: Yup.string()
        .required("Default FSD Member is required"),
        // assignedFsdMember: Yup.array()
        // .min(1, "Assigned FSD Member is required")
        // .required("Assigned FSD Member is required"),
        businessUnit: Yup.string()
        .required("Business unit is required"),
        department: Yup.string()
        .required("Department is required"),
        requisitionType: Yup.string()
        .required("Requisition type is required"),
        expectedJoiningDate: Yup.string()
        .required("Expected joining date is required"),

        jobName:  Yup.string(),
        requiredExperience: Yup.string(),
        requisitionStatus: Yup.string()
        .required("Project location is required"),

        projectName:  Yup.string(),
        projectLocation: Yup.string()
        .required("Project location is required"),
        projectDuration: Yup.string(),
        opportunityID: Yup.string(),
        projectSummary: Yup.string(),
        // additionalSkills: Yup.string()
        // .required("Additional skills are required"),
        // requiredSkills: Yup.string()
        // .required("Must have skills are required"),
        jobDescription: Yup.string()
        .required("Job description is required"),
        responsibilities: Yup.string(),
        hrSummary: Yup.string(),
        projectStartDate: Yup.string(),
        jobLocation: Yup.array()
        .min(1, "Job location is required")
        .required("Job location is required").nullable(),
        maxBudget: Yup.string()
        .required("Maximum budget is required"),
        clientInterview: Yup.string()
        .required("Client interview process is required"),
        targetCompany: Yup.string(),
        referenceProfile: Yup.string(),
        projectPersonalityTraits: Yup.string(),
        primaryTechnology: Yup.array()
        .min(1, "Must have technologies are required")
        .required("Must have technologies are required").nullable(),
        secondaryTechnology: Yup.array()
        .min(1, "Good to have technologies are required")
        .required("Good to have technologies are required").nullable(),
    })
    const formik = useFormik({
        initialValues: {
            rrfTemplate: "",

            rrfNumber: "",
            designation: "",
            positions: "",
            techStack: "",
            defaultFsdMember: "",
            assignedFsdMember: [],
            businessUnit: "",
            department: "",
            requisitionType: "",
            expectedJoiningDate: minDate,

            jobName: "",
            requiredExperience: "",
            requisitionStatus: "2" ?? "",
            primaryTechnology: [],
            secondaryTechnology: [],
            projectName: "",
            projectLocation: "",
            projectDuration: "",
            opportunityID: "",
            projectStartDate: "",
            jobLocation: [],
            maxBudget: "",
            clientInterview: "",
            projectSummary: "",
            // additionalSkills: [],
            // requiredSkills: [],
            jobDescription: "",
            responsibilities: "",
            hrSummary: "",
            comment: "",

            targetCompany: "",
            referenceProfile: "",
            projectPersonalityTraits: "",
        },
        validationSchema: createRequisitionSchema,
        onSubmit: (formValues) => {
            const headers = {
                'Authorization': `Token ${localStorage.getItem('authToken')}`
            }

            const data = {
                rrf_template: formValues.rrfTemplate,

                designation: formValues.designation,
                positions: formValues.positions,
                tech_stack_id: formValues.techStack,
                default_fsd_users_id: formValues.defaultFsdMember,
                assigned_fsd_user_id: formValues.assignedFsdMember,
                bu_group_id: formValues.businessUnit,
                department_id: formValues.department,
                requisite_type_id: formValues.requisitionType,
                requisite_status_id: formValues.requisitionStatus,
                expected_join_date: formValues.expectedJoiningDate,

                job_name: formValues.jobName,
                required_exp: formValues.requiredExperience,
                project_name: formValues.projectName,
                project_loc: formValues.projectLocation,
                project_duration: formValues.projectDuration,
                opportunity_id: formValues.opportunityID,
                project_start_date: formValues.projectStartDate,
                job_loc_id: formValues.jobLocation,
                max_budget: formValues.maxBudget,
                client_interview: formValues.clientInterview,
                project_sum: formValues.projectSummary,
                additional_skills: formValues.additionalSkills,
                required_skills: formValues.requiredSkills,
                job_description: formValues.jobDescription,
                responsibilities: formValues.responsibilities,
                hr_summary: formValues.hrSummary,
                comment: formValues.comment,

                target_company: formValues.targetCompany,
                reference_profile: formValues.referenceProfile,
                project_personality_traits: formValues.projectPersonalityTraits,

                is_active: checked,

                primary_technology_id: formValues.primaryTechnology,
                other_technology_id: formValues.secondaryTechnology
            }

            axios.post(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + "/api/v1/requisitions/", data, {headers})
            .then(function (response) {
                if (response.status === 200) {
                    enqueueSnackbar("Requisition created successfully !!", {
                        anchorOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right',
                                      },
                        variant: 'success',
                        autoHideDuration: 1500,
                      });
                      navigate('/resumex/myrequisition/', {replace: true});
                      window.location.reload(false);                    
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
                setSubmitting(false)
            });            
        }
    })

    const { errors, handleChange, setFieldValue, touched, handleSubmit, isSubmitting, getFieldProps, setSubmitting, values } = formik;

    const projectLocations = [
        {
            value: 'ONSITE',
            label: 'Onsite'
        },
        {
            value: 'OFFSHORE',
            label: 'Offshore'
        },
        {
            value: 'BOTH',
            label: 'Both'
        },
    ];

    const clientInterviewProcess = [
        {
            value: 'true',
            label: 'Yes'
        },
        {
            value: 'false',
            label: 'No'
        },
    ]

    const designationData = [
        {
            value: 'Project Trainee',
            label: 'Project Trainee'
        },
        {
            value: 'Software Engineer',
            label: 'Software Engineer'
        },
        {
            value: 'Senior Software Engineer',
            label: 'Senior Software Engineer'
        },
        {
            value: 'Analyst Programmer',
            label: 'Analyst Programmer'
        },
        {
            value: 'Senior Analyst Programmer',
            label: 'Senior Analyst Programmer'
        },
        {
            value: 'Technical Lead',
            label: 'Technical Lead'
        },
        {
            value: 'Senior Technical Lead',
            label: 'Senior Technical Lead'
        },
        {
            value: 'Project Manager',
            label: 'Project Manager'
        }
    ]

    const opportunityData = [
        {
            value: 'Opportunity 1',
            label: 'Opportunity 1'
        },
        {
            value: 'Opportunity 2',
            label: 'Opportunity 2'
        },
        {
            value: 'Opportunity 3',
            label: 'Opportunity 3'
        },
        {
            value: 'Opportunity 4',
            label: 'Opportunity 4'
        },
    ]

    // ##################################  Stepper Code #################################################

    const [activeStep, setActiveStep] = useState(0);

    const isStepOptional = (step) => {
        return step === 1;
    };

    const handleNext = () => {       
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);

    };

    const handleReset = () => {
        setActiveStep(0);
    }; 

    const handleBtnClick = () => {
        if(activeStep === steps.length - 1){
            handleReset()
        }
        else{
            handleNext()
        }
    }

    function renderStepContent(step) {
        switch (step) {
          case 1:
                      
            return (
                <Stack spacing={10} sx={{mt: 10, mb: 12}}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={10}>
                        {/* --------------------- RRF Number --------------------- */}
                        <TextField
                            fullWidth
                            disabled
                            label="RRF Number"
                            variant="standard"
                            {...getFieldProps("rrfNumber")}
                            error={Boolean(touched.rrfNumber && errors.rrfNumber)}
                            helperText={touched.rrfNumber && errors.rrfNumber}
                        >
                        </TextField>

                        {/* --------------------- Requisition Status --------------------- */}
                        <TextField
                            fullWidth
                            select
                            label="Requisition Status *"
                            variant="standard"
                            {...getFieldProps("requisitionStatus")}
                            error={Boolean(touched.requisitionStatus && errors.requisitionStatus)}
                            helperText={touched.requisitionStatus && errors.requisitionStatus}
                        >
                            {requisitionStatusData.map((status) => (
                                <MenuItem key={status.id} value={status.id}>{status.requisition_status}</MenuItem>
                            ))}
                        </TextField> 
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={10}>
                        {/* --------------------- Requisition Type --------------------- */}
                        <TextField
                            fullWidth
                            select
                            label="Requisition Type *"
                            variant="standard"
                            // sx={{
                            //     "& .MuiInputLabel-root": {color: '#5A5A5A'},//styles the label
                            //     "& .MuiOutlinedInput-root": {
                            //     "& > fieldset": { borderColor: "#5A5A5A" },
                            //     },
                            // }}
                            {...getFieldProps("requisitionType")}
                            error={Boolean(touched.requisitionType && errors.requisitionType)}
                            helperText={touched.requisitionType && errors.requisitionType}
                        >
                            {requisitionTypeData.map((type) => (
                                <MenuItem key={type.id} value={type.id}>{type.req_type_name}</MenuItem>
                            ))}
                        </TextField>

                        {/* --------------------- Opportunity ID --------------------- */}
                        <TextField
                            fullWidth
                            select
                            label="Opportunity ID"
                            variant="standard"
                            disabled={values.requisitionType === 1 ? false : true}
                            // sx={{
                            //     "& .MuiInputLabel-root": {color: '#5A5A5A'},//styles the label
                            //     "& .MuiOutlinedInput-root": {
                            //     "& > fieldset": { borderColor: "#5A5A5A" },
                            //     },
                            // }}
                            {...getFieldProps("opportunityID")}
                            error={Boolean(touched.opportunityID && errors.opportunityID)}
                            helperText={touched.opportunityID && errors.opportunityID}
                        >
                            {opportunityData.map((opportunity) => (
                                <MenuItem key={opportunity.value} value={opportunity.value}>{opportunity.label}</MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={10}>
                        {/* --------------------- Requisition Template --------------------- */}
                        <TextField
                            fullWidth
                            select
                            label="Select Requisition Template"
                            variant="standard"
                            // sx={{
                            //     "& .MuiInputLabel-root": {color: '#5A5A5A'},//styles the label
                            //     "& .MuiOutlinedInput-root": {
                            //     "& > fieldset": { borderColor: "#5A5A5A" },
                            //     },
                            // }}
                            {...getFieldProps("rrfTemplate")}
                            onChange={(selectedOption) => fillRequisitionForm(selectedOption)}
                            value = {formik.values.rrfTemplate}
                            error={Boolean(touched.rrfTemplate && errors.rrfTemplate)}
                            helperText={touched.rrfTemplate && errors.rrfTemplate}
                            SelectProps={{
                                MenuProps: {
                                    style: {
                                        maxHeight: 500,
                                    },
                                }

                            }}

                        >
                            {requisitionTemplateData.map((template) => (
                                <MenuItem key={template.id} value={template.id}>
                                    {"id: " + template.id + " | " + template.job_name + " | " + template.job_exp}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* --------------------- Department --------------------- */}
                        <TextField
                            fullWidth
                            select
                            label="Department *"
                            variant="standard"
                            // sx={{
                            //     "& .MuiInputLabel-root": {color: '#5A5A5A'},//styles the label
                            //     "& .MuiOutlinedInput-root": {
                            //     "& > fieldset": { borderColor: "#5A5A5A" },
                            //     },
                            // }}
                            {...getFieldProps("department")}
                            error={Boolean(touched.department && errors.department)}
                            helperText={touched.department && errors.department}
                        >
                            {requisitionDepartmentData.map((department) => (
                                <MenuItem key={department.id} value={department.id}>{department.job_category_name}</MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </Stack>
            );

          case 2:
            return (
                <Stack spacing={3} sx={{mt: 6}}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    {/* --------------------- Business Unit --------------------- */}
                    <TextField
                        fullWidth
                        select
                        label="Business Unit *"
                        {...getFieldProps("businessUnit")}
                        error={Boolean(touched.businessUnit && errors.businessUnit)}
                        helperText={touched.businessUnit && errors.businessUnit}
                    >
                        {businessUnitData.map((unit) => (
                            <MenuItem key={unit.id} value={unit.id}>{unit.bu_name}</MenuItem>
                        ))}
                    </TextField>

                    {/* --------------------- Designation --------------------- */}
                    <TextField
                        fullWidth
                        select
                        label="Designation *"
                        {...getFieldProps("designation")}
                        error={Boolean(touched.designation && errors.designation)}
                        helperText={touched.designation && errors.designation}
                    >
                        {designationData.map((designation) => (
                            <MenuItem key={designation.value} value={designation.value}>{designation.label}</MenuItem>
                        ))}
                    </TextField>

                    {/* --------------------- Number of Positions --------------------- */}
                    <TextField
                        fullWidth
                        label="Number of Positions *"
                        type="number"
                        {...getFieldProps("positions")}
                        error={Boolean(touched.positions && errors.positions)}
                        helperText={touched.positions && errors.positions}
                    >
                    </TextField>


                    {/* --------------------- Max Budget for the Position --------------------- */}
                    <TextField
                        fullWidth
                        label="Max Budget for the Position *"
                        {...getFieldProps("maxBudget")}
                        error={Boolean(touched.maxBudget && errors.maxBudget)}
                        helperText={touched.maxBudget && errors.maxBudget}
                    >
                    </TextField> 
                </Stack>
                
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                    {/* --------------------- Default FSD Member --------------------- */}
                    {/* <TextField
                        fullWidth
                        disabled
                        select
                        label="Default FSD Member"
                        {...getFieldProps("defaultFsdMember")}
                        value = {formik.values.defaultFsdMember}
                        error={Boolean(touched.defaultFsdMember && errors.defaultFsdMember)}
                        helperText={touched.defaultFsdMember && errors.defaultFsdMember}
                        >
                            <MenuItem
                            key={stackRecruiterData?.id} 
                            value={stackRecruiterData?.id}>
                                {stackRecruiterData?.recruiters?.map(
                                    (recruiter, index) => (index ? ', ': '') + recruiter?.member?.first_name + " " + recruiter?.member?.last_name)}
                            </MenuItem>
                    </TextField> */}

                    {/* --------------------- Assigned FSD Member --------------------- */}
                    {/* <TextField
                        fullWidth
                        select
                        label="Assigned FSD Member"
                        multiple
                        {...getFieldProps("assignedFsdMember")}
                        error={Boolean(touched.assignedFsdMember && errors.assignedFsdMember)}
                        helperText={touched.assignedFsdMember && errors.assignedFsdMember}
                        SelectProps={{
                            multiple: true,
                            value: formik.values.assignedFsdMember,
                            onChange: (selectedOption) => handleChange("assignedFsdMember")(selectedOption)
                        }}
                        >
                        {fsdMembersData.map((member) => (
                            <MenuItem 
                            key={member.id} 
                            value={member.id}>
                                {member.member.first_name + " " + member.member.last_name}
                            </MenuItem>
                        ))}
                    </TextField> */}

                    {/* --------------------- Project Name --------------------- */}
                    <TextField
                        fullWidth
                        label="Project Name"
                        {...getFieldProps("projectName")}
                        error={Boolean(touched.projectName && errors.projectName)}
                        helperText={touched.projectName && errors.projectName}
                    >
                    </TextField>

                    {/* --------------------- Project Location --------------------- */}
                    <TextField
                        select
                        fullWidth
                        label="Project Location *"
                        {...getFieldProps("projectLocation")}
                        error={Boolean(touched.projectLocation && errors.projectLocation)}
                        helperText={touched.projectLocation && errors.projectLocation}
                    >
                        {projectLocations.map((location) => (
                            <MenuItem key={location.value} value={location.value}>{location.label}</MenuItem>
                        ))}
                    </TextField>

                    {/* --------------------- Project Duration --------------------- */}
                    <TextField
                        fullWidth
                        label="Project Duration"
                        {...getFieldProps("projectDuration")}
                        error={Boolean(touched.projectDuration && errors.projectDuration)}
                        helperText={touched.projectDuration && errors.projectDuration}
                    >
                    </TextField>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    {/* --------------------- Client Interview Process --------------------- */}
                    <TextField
                        fullWidth
                        select
                        label="Client Interview Process *"
                        {...getFieldProps("clientInterview")}
                        error={Boolean(touched.clientInterview && errors.clientInterview)}
                        helperText={touched.clientInterview && errors.clientInterview}
                    >
                        {clientInterviewProcess.map((process) => (
                            <MenuItem key={process.value} value={process.value}>{process.label}</MenuItem>
                        ))}
                    </TextField>
                {/* </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}> */}
                    {/* --------------------- Tentative Project Start Date --------------------- */}
                    <TextField
                        fullWidth
                        label="Tentative Project Start Date"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        {...getFieldProps("projectStartDate")}
                        error={Boolean(touched.projectStartDate && errors.projectStartDate)}
                        helperText={touched.projectStartDate && errors.projectStartDate}
                    >
                    </TextField>

                    {/* --------------------- Expected Joining Date --------------------- */}
                    <TextField
                        fullWidth
                        label="Expected Joining Date *"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{inputProps: { min: minDate} }}
                        {...getFieldProps("expectedJoiningDate")}
                        error={Boolean(touched.expectedJoiningDate && errors.expectedJoiningDate)}
                        helperText={touched.expectedJoiningDate && errors.expectedJoiningDate}
                    >
                    </TextField>                                                                                                                                                                                                                                             
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                    {/* --------------------- Project Summary --------------------- */}
                    <TextField
                        fullWidth
                        label="Project Summary"
                        multiline
                        rows={6}
                        {...getFieldProps("projectSummary")}
                        error={Boolean(touched.projectSummary && errors.projectSummary)}
                        helperText={touched.projectSummary && errors.projectSummary}
                    >
                    </TextField>

                    {/* --------------------- HR Summary --------------------- */}
                    <TextField
                        fullWidth
                        label="Confidential information for HR (If any)"
                        multiline
                        rows={6}
                        {...getFieldProps("hrSummary")}
                        error={Boolean(touched.hrSummary && errors.hrSummary)}
                        helperText={touched.hrSummary && errors.hrSummary}
                    >
                    </TextField>

                    {/* --------------------- Comment --------------------- */}
                    <TextField
                        fullWidth
                        label="Comment (If any)"
                        multiline
                        rows={6}
                        {...getFieldProps("comment")}
                        error={Boolean(touched.comment && errors.comment)}
                        helperText={touched.comment && errors.comment}
                    >
                    </TextField>
                </Stack>
                
                <Stack spacing={3}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{mb: 5}}>
                        {/* --------------------- Target Companies --------------------- */}
                        <TextField
                            fullWidth
                            label="Target Companies(if Any)"
                            {...getFieldProps("targetCompany")}
                            error={Boolean(touched.targetCompany && errors.targetCompany)}
                            helperText={touched.targetCompany && errors.targetCompany}
                        >
                        </TextField>

                        {/* ----------------- Reference Profile/Link of Similar Candidate ------------- */}
                        <TextField
                            fullWidth
                            label="Reference Profile/Link of Similar Candidate"
                            {...getFieldProps("referenceProfile")}
                            error={Boolean(touched.referenceProfile && errors.referenceProfile)}
                            helperText={touched.referenceProfile && errors.referenceProfile}
                        >
                        </TextField>

                        {/* ----------------- Personality traits for Project/Assignment ---------------- */}
                        <TextField
                            fullWidth
                            label="Personality traits for Project/Assignment"
                            {...getFieldProps("projectPersonalityTraits")}
                            error={Boolean(touched.projectPersonalityTraits && errors.projectPersonalityTraits)}
                            helperText={touched.projectPersonalityTraits && errors.projectPersonalityTraits}
                        >
                        </TextField>
                    </Stack>
                </Stack>
                            
            
            </Stack>
            );

          case 3:
            return (
                <Stack spacing={3} sx={{mt: 5}}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Typography variant="h10" color="#800000" >
                        Note: Below details will be visible on the job openings page.
                    </Typography>
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    {/* --------------------- Job Name --------------------- */}
                    <TextField
                        fullWidth
                        label="Job Name"
                        {...getFieldProps("jobName")}
                        error={Boolean(touched.jobName && errors.jobName)}
                        helperText={touched.jobName && errors.jobName}
                    >
                    </TextField>

                    {/* --------------------- Required Experience --------------------- */}
                    <TextField
                        fullWidth
                        label="Required Experience"
                        {...getFieldProps("requiredExperience")}
                        error={Boolean(touched.requiredExperience && errors.requiredExperience)}
                        helperText={touched.requiredExperience && errors.requiredExperience}
                    >
                    </TextField>

                    {/* --------------------- Job Location --------------------- */}
                    {/* <TextField
                        fullWidth
                        select
                        label="Job Location *"
                        multiple
                        red    {...getFieldProps("jobLocation")}
                        error={Boolean(touched.jobLocation && errors.jobLocation)}
                        helperText={touched.jobLocation && errors.jobLocation}
                        SelectProps={{
                            multiple: true,
                            value: formik.values.jobLocation,
                            onChange: (selectedOption) => handleChange("jobLocation")(selectedOption)
                        }}
                    >
                        {officeLocationData.map((location) => (
                            <MenuItem key={location.id} value={location.id}>{location.office_location}</MenuItem>
                        ))}
                    </TextField> */}

                    <Autocomplete
                        multiple
                        fullWidth
                        id="tags-outlined"
                        options={officeLocationData}
                        getOptionLabel={(option) => option.office_location}
                        onChange={(event, value) => setFieldValue("jobLocation", value.map(obj => obj.id))}
                        renderInput={(params) => (
                            <TextField
                            {...params}
                            variant="outlined"
                            label="Job Location *"
                            {...getFieldProps("jobLocation")}
                            error={Boolean(touched.jobLocation && errors.jobLocation)}
                            helperText={touched.jobLocation && errors.jobLocation}
                            />
                        )}
                        >
                    </Autocomplete>
                </Stack> 

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    {/* --------------------- TechStack --------------------- */}
                    <TextField
                        fullWidth
                        select
                        label="Tech Stack *"
                        sx={{width: "50%"}}
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
                    {/* <TextField
                        fullWidth
                        select
                        label="Must Have Technologies *"
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
                    </TextField> */}

                    <Autocomplete
                        multiple
                        fullWidth
                        id="tags-outlined"
                        options={dropdown1Options}
                        getOptionLabel={(option) => option.technology_name}
                        onChange={(event, value) => handleDropdown1Change(value)}
                        defaultValue={technologyData.filter(obj => {
                            return values.primaryTechnology.includes(obj.id)
                        })}
                        // onChange={(event, value) => setFieldValue("primaryTechnology", value.map(obj => obj.id))}
                        renderInput={(params) => (
                            <TextField
                            inputProps={{
                                autoComplete: 'new-password',
                              }}
                            {...params}
                            variant="outlined"
                            label="Must Have Technologies *"
                            {...getFieldProps("primaryTechnology")}
                            error={Boolean(touched.primaryTechnology && errors.primaryTechnology)}
                            helperText={touched.primaryTechnology && errors.primaryTechnology}
                            />
                        )}
                        >
                    </Autocomplete>

                    {/* --------------------- Secondary Technology --------------------- */}
                    {/* <TextField
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
                        {secondaryTechnologyArray.map((technology) => (
                            <MenuItem key={technology.id} value={technology.id}>{technology.technology_name}</MenuItem>
                        ))}
                    </TextField> */}

                    <Autocomplete
                        multiple
                        fullWidth
                        id="tags-outlined"
                        options={dropdown2Options}
                        getOptionLabel={(option) => option.technology_name}
                        onChange={(event, value) => handleDropdown2Change(value)}
                        defaultValue={technologyData.filter(obj => {
                            return values.secondaryTechnology.includes(obj.id)
                        })}
                        // onChange={(event, value) => setFieldValue("secondaryTechnology", value.map(obj => obj.id))}
                        renderInput={(params) => (
                            <TextField
                            {...params}
                            variant="outlined"
                            label="Good To Have Technologies *"
                            {...getFieldProps("secondaryTechnology")}
                            error={Boolean(touched.secondaryTechnology && errors.secondaryTechnology)}
                            helperText={touched.secondaryTechnology && errors.secondaryTechnology}
                            />
                        )}
                        >
                    </Autocomplete>

                    {/* --------------------- Good To Have Skills --------------------- */}
                    {/* <TextField
                        fullWidth
                        label="Good To Have Skills *"
                        multiline
                        rows={1}
                        {...getFieldProps("additionalSkills")}
                        error={Boolean(touched.additionalSkills && errors.additionalSkills)}
                        helperText={touched.additionalSkills && errors.additionalSkills}
                    >
                    </TextField>   */}
                    
                    {/* --------------------- Must Have Skills --------------------- */}
                    {/* <TextField
                        fullWidth
                        label="Must Have Skills *"
                        multiline
                        rows={1}
                        {...getFieldProps("requiredSkills")}
                        error={Boolean(touched.requiredSkills && errors.requiredSkills)}
                        helperText={touched.requiredSkills && errors.requiredSkills}
                    >
                    </TextField>                                       */}
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    {/* --------------------- Job Description --------------------- */}
                    <TextField
                        fullWidth
                        label="Job Description *"
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
                    >
                    </TextField>                                  
                </Stack>                        
            
                <Stack direction={{ xs: "column", sm: "row" }} spacing={0} justifyContent="center">
                    {/* --------------------- Is Active --------------------- */}
                    <Typography>
                        <Checkbox checked={checked} onChange={handleIsActiveChange}/>
                        Publish On Openings Page
                    </Typography>
                </Stack>                                    
            </Stack>
            );
           
          default:
            return <div>Not Found</div>;
        }
      }

  
    return (
        <Page title="Requisition">
            <Container maxWidth="xl" sx={{ mt:0 }} >

                <Stack direction={{ xs: "column", sm: "row" }} spacing={72} sx={{ mb: 5 }}>
                    <Link to="/resumeX/myrequisition/"
                        color="green" 
                        underline="hover" 
                        component={RouterLink} 
                        fontSize="20px">
                            <ArrowCircleLeftIcon fontSize="large" />
                    </Link>

                    <h2 align="center" style={{fontSize: '25px', fontWeight: '800', marginBottom: '30px'}}>Create Requisition</h2>

                    {/* <Typography variant="h4" sx={{ mb:5 }} align="center">
                        Create Requisition
                    </Typography> */}
                </Stack>

                <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={activeStep} alternativeLabel
                      sx={{
                        "& .MuiStepConnector-line": {
                          borderTopWidth: "4px",
                        },
                        "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
                          borderColor: "green",
                        },
                    }}
                    >
                        {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        // if (isStepOptional(index)) {
                        //     labelProps.optional = (
                        //     <Typography variant="caption">Optional</Typography>
                        //     );
                        // }
                        // if (isStepSkipped(index)) {
                        //     stepProps.completed = false;
                        // }
                        return (
                            <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                        })}
                    </Stepper>

                        <React.Fragment>
                        
                            <FormikProvider value={formik}>
                                <Form autoComplete="off" onSubmit={handleSubmit}>
                                    {renderStepContent(activeStep+1)}


                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1, fontSize: 18 }}
                            size="medium"
                            >
                            Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />

                            {activeStep === steps.length - 1 ? (
                            <Stack spacing={3}>
                                <LoadingButton
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    loading={isSubmitting}
                                >
                                    Create Requisition
                                </LoadingButton>
                            </Stack>
                            ):(
                            <Button onClick={handleNext} size="medium" sx={{fontSize: 15}} variant="contained">
                            Next
                            </Button>
                            )}
                        </Box>
                        </Form>
                            </FormikProvider>
                        </React.Fragment>
                </Box>
            </Container>

        </Page>
    )
}