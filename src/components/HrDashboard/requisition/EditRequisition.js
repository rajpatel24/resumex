import axios from 'axios';
import * as Yup from "yup";
import Page from '../../Page';
import {useSnackbar} from 'notistack';
import { LoadingButton } from "@mui/lab";
import React, { useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from "formik";
import {Link as RouterLink, useNavigate, useParams, useLocation} from 'react-router-dom';
import { Card, CardContent, Checkbox, Container, FormControl, InputLabel, Link, MenuItem, Select, Stack, TextField,Typography } from '@mui/material';
import * as constants from 'src/utils/constants';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { preventDefault } from '@fullcalendar/react';

export default function EditRequisition() {
    const { id } = useParams();
    const location = useLocation()
    const { enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const [disableValue, setDisableValue] = useState(true)
    const [backPath, setBackPath ] = useState('')

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
            setSecondaryTechnologyArray(response.data.data)
        })
        .catch((e) => console.log('something went wrong (:', e));
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

    }

    // is_active state
    const [checked, setChecked] = useState(true);
    const handleIsActiveChange = event =>{
        setChecked(event.target.checked);
    };

    // requisition template data state
    const [requisitionTemplateData, setRequisitionTemplateData] = useState([])
    const getRequisitionTemplates = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/requisition-template/', {headers: {"Authorization": `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setRequisitionTemplateData(response.data.data)
        })
        .catch((e) => console.log('something went wrong (:', e));
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
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/requisition-types/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setRequisitionTypeData(response.data.data)
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

    // set initial values for office location
    const getSelectInitialState = () => {
        const initialSelectedMock = location.state.from[0].job_loc
    
        const initialSelected = location.state.office.filter((loc) => {
            if (
            initialSelectedMock.find((initialLocation) => initialLocation.id === loc.id)
            ) {
            return true;
            }
            return false;
        });
        return initialSelected;
    };
    
    const initialSelectState = getSelectInitialState();    
    const [jobLocationState, setJobLocationState] = useState(
    initialSelectState
    );

    // set initial values for assigned fsd members
    const getSelectInitialFsdMembersState = () => {
        const initialSelectedFsdMembersMock = location.state.from[0].assigned_fsd_user
    
        const initialSelectedFsdMembers =  location.state.fsdMembers.filter((member) => {
            if (
                initialSelectedFsdMembersMock.find((initialMember) => initialMember.id === member.id)
            ) {
            return true;
            }
            return false;
        });
        return initialSelectedFsdMembers;
    };

    const setOtherValues = (from_page) => {
        let user = JSON.parse(localStorage.getItem("user"))
        let user_role = user.role.role_name

        if(from_page === 'OtherRequisition'){
            setBackPath('/resumeX/otherrequisition')
            if (user_role === 'FSD_Admin')
            { setDisableValue(false)  }
            else{ setDisableValue(true)  }
        }
        else if (user_role === 'DRM'){
            setBackPath('/resumeX/drm-requisition')
            setDisableValue(true)
        }
        else{
            setBackPath('/resumeX/myrequisition')
            setDisableValue(false)
        }
    }
    
    const initialSelectFsdMembers = getSelectInitialFsdMembersState();

    const [assignedFsdMemberState, setAssignedFsdMemberState] = useState(
    initialSelectFsdMembers
    );


    const editRequisitionSchema = Yup.object().shape({
        designation: Yup.string()
        .required("Designation is required"),
        positions: Yup.number()
        .required("Number of Positions is required"),
        techStack: Yup.string()
        .required("Tech Stack is required"),
        defaultFsdMember: Yup.string()
        .required("Default FSD Member is required"),
        assignedFsdMember: Yup.array(),
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
        requisitionStatus: Yup.string(),

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
        // jobLocation: Yup.array()
        // .min(1, "Job location is required")
        // .required("Job location is required"),
        maxBudget: Yup.string()
        .required("Maximum budget is required"),
        clientInterview: Yup.string()
        .required("Client interview process is required"),
        targetCompany: Yup.string(),
        referenceProfile: Yup.string(),
        projectPersonalityTraits: Yup.string(),
        primaryTechnology: Yup.array()
        .min(1, "Primary technology is required")
        .required("Must have technologies are required"),
        secondaryTechnology: Yup.array()
        .min(1, "Secondary technology is required")
        .required("Good to have technologies are required"),
    })
    const formik = useFormik({
        initialValues: {
            rrfNumber: location.state.from[0].requisite_number ?? "",
            designation: location.state.from[0].designation ?? "",
            positions: location.state.from[0].positions ?? "",
            techStack: location.state.from[0].tech_stack.tech_stack_id ?? "",
            defaultFsdMember: location.state.from[0].default_fsd_users.id ?? "",
            assignedFsdMember:  [],
            businessUnit: location.state.from[0].bu_group.id ?? "",
            department: location.state.from[0].department.id ?? "",
            requisitionType: location.state.from[0].requisite_type.id ?? "",
            expectedJoiningDate: location.state.from[0].expected_join_date ?? "",

            jobName: location.state.from[0].job_name ?? "",
            requiredExperience: location.state.from[0].required_exp ?? "",
            requisitionStatus: location.state.from[0].requisite_status.id ?? "",
            primaryTechnology: location.state.from[0].primary_technology.map(obj => obj.id),
            secondaryTechnology: location.state.from[0].other_technology.map(obj => obj.id),
            projectName: location.state.from[0].project_name ?? "",
            projectLocation: location.state.from[0].project_loc ?? "",
            projectDuration: location.state.from[0].project_duration ?? "",
            opportunityID: location.state.from[0].opportunity_id ?? "",
            projectStartDate: location.state.from[0].project_start_date ?? "",
            // jobLocation: [],
            maxBudget: location.state.from[0].max_budget ?? "",
            clientInterview: location.state.from[0].client_interview ?? "",
            projectSummary: location.state.from[0].project_sum ?? "",
            // additionalSkills: location.state.from[0].additional_skills ?? "",
            // requiredSkills: location.state.from[0].required_skills ?? "",
            jobDescription: location.state.from[0].job_description ?? "",
            responsibilities: location.state.from[0].responsibilities ?? "",
            hrSummary: location.state.from[0].hr_summary ?? "",
            comment: location.state.from[0].comment ?? "",

            targetCompany: location.state.from[0].target_company ?? "",
            referenceProfile: location.state.from[0].reference_profile ?? "",
            projectPersonalityTraits: location.state.from[0].project_personality_traits ?? "",
        },
        validationSchema: editRequisitionSchema,
        onSubmit: (formValues) => {
            const id = location.state.from[0].id

            const headers = {
                'Authorization': `Token ${localStorage.getItem('authToken')}`
            }

            const data = {
                rrf_template: formValues.rrfTemplate,

                designation: formValues.designation,
                positions: formValues.positions,
                tech_stack_id: formValues.techStack,
                default_fsd_users_id: formValues.defaultFsdMember,
                assigned_fsd_user_id: assignedFsdMemberState.map(item => item.id),
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
                // job_loc_id: formValues.jobLocation,
                // job_loc_id: officeLocationState.location,
                job_loc_id: jobLocationState.map(item => item.id),
                max_budget: formValues.maxBudget,
                client_interview: formValues.clientInterview,
                project_sum: formValues.projectSummary,
                // additional_skills: formValues.additionalSkills,
                // required_skills: formValues.requiredSkills,
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

            axios.put(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + "/api/v1/requisitions/" + id + "/", data, {headers})
            .then(function (response) {
                if (response.status === 200) {
                    enqueueSnackbar("Requisition updated successfully !!", {
                        anchorOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right',
                                      },
                        variant: 'success',
                        autoHideDuration: 1500,
                      });
                      navigate('/resumeX/myrequisition/', {replace: true});
                    //   window.location.reload(false);                    
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });            
        }
    })

    const { errors, handleChange, setFieldValue, touched, handleSubmit, isSubmitting, getFieldProps, values } = formik;

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
    ]


    const [positionNum, setpositionNum] = useState([])
    const thisNewNum = {...getFieldProps("positions")}

    // const positionNum = thisNewNum.value;

    useEffect(() => {
        getTechStackTechnology()
        getTechnologyData()
        getRequisitionTemplates()
        getTechStackData()
        getBusinessUnits()
        getRequisitionDepartment()
        getRequisitionTypes()
        getRequisitionStatusData()
        setChecked(location.state.from[0].is_active)
        setStackRecruiterData(location.state.from[0].default_fsd_users)
        setOtherValues(location?.state?.fromPage)
        setpositionNum(thisNewNum.value)
    }, [])

    return (
        <Page>
            <Container maxWidth="xl" sx={{ mt:0 }}>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={72}>
                    <Link to={backPath}
                        // to="/resumeX/myrequisition"
                        color="green" 
                        underline="hover" 
                        component={RouterLink} 
                        fontSize="20px">
                            <ArrowCircleLeftIcon fontSize="large" />
                    </Link>

                    {/* <Typography variant="h4" sx={{ mb:5 }} align="center">
                        Edit Requisition
                    </Typography> */}

                    <h2 align="center" style={{fontSize: '25px', fontWeight: '800', marginBottom: '25px'}}>Edit Requisition</h2>
                </Stack>

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
                        <Card variant="outlined" style={{border: "none", boxShadow: "none"}}>
                            <CardContent>
                                <Typography variant="h6" color="text.secondary" gutterBottom sx={{mb: -1}} >
                                    Requisition Details
                                </Typography>
                            </CardContent>

                            <CardContent>
                                <Stack spacing={3}>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        {/* --------------------- RRF Number --------------------- */}
                                        <TextField
                                            fullWidth
                                            disabled
                                            label="RRF Number"
                                            {...getFieldProps("rrfNumber")}
                                            error={Boolean(touched.rrfNumber && errors.rrfNumber)}
                                            helperText={touched.rrfNumber && errors.rrfNumber}
                                        >
                                        </TextField>

                                        {/* --------------------- Requisition Status --------------------- */}
                                        <TextField
                                            fullWidth
                                            select
                                            label="Requisition Status"
                                            disabled={disableValue}

                                            {...getFieldProps("requisitionStatus")}

                                            error={Boolean(touched.requisitionStatus && errors.requisitionStatus)}
                                            helperText={touched.requisitionStatus && errors.requisitionStatus}
                                        >
                                            {requisitionStatusData.map((status) => (
                                                <MenuItem key={status.id} value={status.id}>{status.requisition_status}</MenuItem>
                                            ))}
                                        </TextField>


                                        {/* --------------------- Requisition Type --------------------- */}
                                        <TextField
                                            fullWidth
                                            select
                                            label="Requisition Type"

                                            disabled={disableValue}

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
                                            // disabled={disableValue}
                                            disabled={values.requisitionType === 1 && disableValue === false ? false : true}

                                            {...getFieldProps("opportunityID")}

                                            error={Boolean(touched.opportunityID && errors.opportunityID)}
                                            helperText={touched.opportunityID && errors.opportunityID}
                                        >
                                            {opportunityData.map((opportunity) => (
                                                <MenuItem key={opportunity.value} value={opportunity.value}>{opportunity.label}</MenuItem>
                                            ))}
                                        </TextField>


                                        {/* --------------------- Department --------------------- */}
                                        <TextField
                                            fullWidth
                                            select
                                            label="Department"

                                            disabled={disableValue}

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
                            </CardContent>

                            <CardContent>
                                <Typography variant="h6" color="text.secondary" gutterBottom sx={{mb: -1}}>
                                    Job Details
                                </Typography>
                            </CardContent>

                            <CardContent sx={{mb: 5}}>
                                <Stack spacing={3}>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        {/* --------------------- Business Unit --------------------- */}
                                        <TextField
                                            fullWidth
                                            select
                                            label="Business Unit"

                                            disabled={disableValue}

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
                                            label="Designation"
                                            {...getFieldProps("designation")}
                                            error={Boolean(touched.designation && errors.designation)}
                                            helperText={touched.designation && errors.designation}
                                            disabled={disableValue}
                                        >
                                            {designationData.map((designation) => (
                                                <MenuItem key={designation.value} value={designation.value}>{designation.label}</MenuItem>
                                            ))}
                                        </TextField>

                                        {/* --------------------- Number of Positions --------------------- */}
                                        <TextField
                                            fullWidth
                                            label="Number of Positions"
                                            type="number"
                                            onKeyDown={preventDefault}
                                            disabled={disableValue}
                                            
                                            inputProps={{ min: 1, max: positionNum ,pattern: "[0-9]*"}}

                                            {...getFieldProps("positions")}

                                            error={Boolean(touched.positions && errors.positions)}
                                            helperText={touched.positions && errors.positions}
                                        >
                                        </TextField>

                                        {/* --------------------- TechStack --------------------- */}
                                        <TextField
                                            fullWidth
                                            select
                                            label="Tech Stack"
                                            disabled={true}

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
                                    </Stack>
                                    
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        {/* --------------------- Default FSD Member --------------------- */}
                                        <TextField
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
                                        </TextField>

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

                                        {/* --------------------- Assigned FSD Member (Using MUI Select) --------------------- */}                                        
                                        <FormControl
                                            fullWidth
                                            variant="outlined"
                                            margin="normal"
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                        >
                                            <InputLabel>Assigned FSD Member</InputLabel>
                                            <Select
                                                label="Assigned FSD Member"
                                                fullWidth
                                                multiple
                                                value={assignedFsdMemberState}
                                                disabled={disableValue}

                                                renderValue={(selected) =>
                                                    selected.map((item) => item.member.first_name + " " + item.member.last_name).join(", ")
                                                }
                                                onChange={(event) => {
                                                    setAssignedFsdMemberState(event.target.value);
                                                }}
                                                >
                                                {location.state.fsdMembers.map((item, index) => (
                                                    <MenuItem key={"aa" + item.id} value={item}>
                                                    {item.member.first_name + " " + item.member.last_name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>                                      
                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        {/* --------------------- Project Name --------------------- */}
                                        <TextField
                                            fullWidth
                                            label="Project Name"
                                            disabled={disableValue}

                                            {...getFieldProps("projectName")}

                                            error={Boolean(touched.projectName && errors.projectName)}
                                            helperText={touched.projectName && errors.projectName}
                                        >
                                        </TextField>

                                        {/* --------------------- Project Location --------------------- */}
                                        <TextField
                                            select
                                            fullWidth
                                            label="Project Location"
                                            disabled={disableValue}

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
                                            disabled={disableValue}

                                            {...getFieldProps("projectDuration")}

                                            error={Boolean(touched.projectDuration && errors.projectDuration)}
                                            helperText={touched.projectDuration && errors.projectDuration}
                                        >
                                        </TextField>


                                        {/* --------------------- Max Budget for the Position --------------------- */}
                                        <TextField
                                            fullWidth
                                            label="Max Budget for the Position *"
                                            disabled={disableValue}

                                            {...getFieldProps("maxBudget")}

                                            error={Boolean(touched.maxBudget && errors.maxBudget)}
                                            helperText={touched.maxBudget && errors.maxBudget}
                                        >
                                        </TextField>   

                                    </Stack>
                                    
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        {/* --------------------- Client Interview Process --------------------- */}
                                        <TextField
                                            fullWidth
                                            select
                                            label="Client Interview Process (if any) *"
                                            disabled={disableValue}

                                            {...getFieldProps("clientInterview")}

                                            error={Boolean(touched.clientInterview && errors.clientInterview)}
                                            helperText={touched.clientInterview && errors.clientInterview}
                                        >
                                            {clientInterviewProcess.map((process) => (
                                                <MenuItem key={process.value} value={process.value}>{process.label}</MenuItem>
                                            ))}
                                        </TextField>   


                                        {/* --------------------- Tentative Project Start Date --------------------- */}
                                        <TextField
                                            fullWidth
                                            label="Tentative Project Start Date"
                                            type="date"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                            disabled={disableValue}

                                            {...getFieldProps("projectStartDate")}
                                            error={Boolean(touched.projectStartDate && errors.projectStartDate)}
                                            helperText={touched.projectStartDate && errors.projectStartDate}
                                        >
                                        </TextField>

                                        {/* --------------------- Expected Joining Date --------------------- */}
                                        <TextField
                                            fullWidth
                                            label="Expected Joining Date"
                                            type="date"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                            disabled={disableValue}

                                            {...getFieldProps("expectedJoiningDate")}

                                            error={Boolean(touched.expectedJoiningDate && errors.expectedJoiningDate)}
                                            helperText={touched.expectedJoiningDate && errors.expectedJoiningDate}
                                        >
                                        </ TextField>                                              
                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        {/* ------ Project Summary ------ */}
                                        <TextField
                                            fullWidth
                                            label="Project Summary"
                                            multiline
                                            rows={4}
                                            disabled={disableValue}

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
                                            disabled={disableValue}
                                            rows={4}
                                            {...getFieldProps("hrSummary")}
                                            error={Boolean(touched.hrSummary && errors.hrSummary)}
                                            helperText={touched.hrSummary && errors.hrSummary}
                                        >
                                        </TextField>                                        

                                        {/* ----- Comment ----- */}
                                        <TextField
                                            fullWidth
                                            label="Comment (If any)"
                                            multiline
                                            rows={4}
                                            disabled={disableValue}

                                            {...getFieldProps("comment")}

                                            error={Boolean(touched.comment && errors.comment)}
                                            helperText={touched.comment && errors.comment}
                                        >
                                        </TextField>
                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{mb: 5}}>
                                        {/* --------------------- Target Companies --------------------- */}
                                        <TextField
                                            fullWidth
                                            label="Target Companies(if Any)"
                                            disabled={disableValue}

                                            {...getFieldProps("targetCompany")}

                                            error={Boolean(touched.targetCompany && errors.targetCompany)}
                                            helperText={touched.targetCompany && errors.targetCompany}
                                        >
                                        </TextField>

                                        {/* ----------------- Reference Profile/Link of Similar Candidate ------------- */}
                                        <TextField
                                            fullWidth
                                            label="Reference Profile/Link of Similar Candidate"
                                            disabled={disableValue}

                                            {...getFieldProps("referenceProfile")}

                                            error={Boolean(touched.referenceProfile && errors.referenceProfile)}
                                            helperText={touched.referenceProfile && errors.referenceProfile}
                                        >
                                        </TextField>

                                        {/* ----------------- Personality traits for Project/Assignment ---------------- */}
                                        <TextField
                                            fullWidth
                                            label="Personality traits for Project/Assignment"
                                            disabled={disableValue}

                                            {...getFieldProps("projectPersonalityTraits")}

                                            error={Boolean(touched.projectPersonalityTraits && errors.projectPersonalityTraits)}
                                            helperText={touched.projectPersonalityTraits && errors.projectPersonalityTraits}
                                        >
                                        </TextField>
                                    </Stack>
                                </Stack>
                            </CardContent>

                            <CardContent>
                                <Typography variant="h6" color="text.secondary" gutterBottom sx={{mb: -1}}>
                                    Requirements Details
                                </Typography>
                            </CardContent>

                            <CardContent sx={{mb: 5}}>
                                <Stack spacing={3}>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        {/* --------------------- Job Name --------------------- */}
                                        <TextField
                                            fullWidth
                                            label="Job Name"
                                            disabled={disableValue}

                                            {...getFieldProps("jobName")}

                                            error={Boolean(touched.jobName && errors.jobName)}
                                            helperText={touched.jobName && errors.jobName}
                                        >
                                        </TextField>

                                        {/* --------------------- Required Experience --------------------- */}
                                        <TextField
                                            fullWidth
                                            label="Required Experience"
                                            disabled={disableValue}

                                            {...getFieldProps("requiredExperience")}

                                            error={Boolean(touched.requiredExperience && errors.requiredExperience)}
                                            helperText={touched.requiredExperience && errors.requiredExperience}
                                        >
                                        </TextField>                                            

                                        {/* --------------------- Job Location (Using Formik) --------------------- */}
                                        {/* <TextField
                                            fullWidth
                                            select
                                            label="Job Location *"
                                            multiple
                                            {...getFieldProps("jobLocation")}
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
                                        </TextField>   */}

                                        {/* --------------------- Job Location (Using State) --------------------- */}
                                        {/* <TextField
                                            fullWidth
                                            required
                                            select
                                            label="Office Location"
                                            multiple
                                            // required
                                            value= {officeLocationState.location}
                                            getOptionSelected={[1, 2]}
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
                                        </TextField> */}
                                        
                                        {/* --------------------- Job Location (Using MUI Select) --------------------- */}                                        
                                        <FormControl
                                            fullWidth 
                                            required
                                            variant="outlined"
                                            margin="normal"
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                        >
                                            <InputLabel>Office Location</InputLabel>

                                        <Select
                                            label="Office Location"
                                            required
                                            fullWidth
                                            disabled={disableValue}
                                            multiple

                                            value={jobLocationState}
                                            renderValue={(selected) =>
                                                selected.map((item) => item.office_location).join(", ")
                                            }
                                            onChange={(event) => {
                                                setJobLocationState(event.target.value);
                                            }}
                                            >
                                            {location.state.office.map((item, index) => (
                                                <MenuItem key={"aa" + item.id} value={item}>
                                                {item.office_location}
                                                </MenuItem>
                                            ))}
                                            </Select>
                                        </FormControl>
                                                                 
                                    </Stack>     

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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

                                        {/* --- Secondary Technology --- */}
                                        <TextField
                                            fullWidth
                                            select
                                            label="Good To Have Technologies *"
                                            multiple
                                            disabled={disableValue}

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
                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        {/* --------------------- Good To Have Skills --------------------- */}
                                        {/* <TextField
                                            fullWidth
                                            label="Good To Have Skills *"
                                            multiline
                                            rows={3}
                                            {...getFieldProps("additionalSkills")}
                                            error={Boolean(touched.additionalSkills && errors.additionalSkills)}
                                            helperText={touched.additionalSkills && errors.additionalSkills}
                                        >
                                        </TextField>                                         */}

                                        {/* --------------------- Must Have Skills --------------------- */}
                                        {/* <TextField
                                            fullWidth
                                            label="Must Have Skills *"
                                            multiline
                                            rows={3}
                                            {...getFieldProps("requiredSkills")}
                                            error={Boolean(touched.requiredSkills && errors.requiredSkills)}
                                            helperText={touched.requiredSkills && errors.requiredSkills}
                                        >
                                        </TextField> */}

                                        {/* ------ Job Description ------ */}
                                        <TextField
                                            fullWidth
                                            label="Job Description *"
                                            multiline
                                            rows={8}
                                            disabled={disableValue}

                                            {...getFieldProps("jobDescription")}

                                            error={Boolean(touched.jobDescription && errors.jobDescription)}
                                            helperText={touched.jobDescription && errors.jobDescription}
                                        >
                                        </TextField>                                        

                                        {/* --------------------- Responsibilities --------------------- */}
                                        <TextField
                                            fullWidth
                                            label="Responsibilities"
                                            disabled={disableValue}
                                            multiline
                                            rows={8}

                                            {...getFieldProps("responsibilities")}

                                            error={Boolean(touched.responsibilities && errors.responsibilities)}
                                            helperText={touched.responsibilities && errors.responsibilities}
                                        >
                                        </TextField>
                                    </Stack>                               
                                </Stack>
                            </CardContent>

                            <CardContent>
                                <Stack spacing={3}>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                                        {/* --------------------- Is Active --------------------- */}
                                        <Typography>
                                            <Checkbox checked={checked} onChange={handleIsActiveChange}
                                            disabled={disableValue} />
                                            Show on Job Openings Page
                                        </Typography>
                                    </Stack>                                    

                                    <LoadingButton
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        loading={isSubmitting}
                                        disabled={disableValue}
                                    >
                                        Update Requisition
                                    </LoadingButton>                                    
                                </Stack>
                            </CardContent>                                                                 
                        </Card>
                    </Form>
                </FormikProvider>
            </Container>
        </Page>
    )
}