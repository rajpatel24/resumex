import axios from 'axios';
import Page from '../../Page';
import * as Yup from "yup";
import {useSnackbar} from 'notistack';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import StarIcon from '@mui/icons-material/Star';
import { LoadingButton } from "@mui/lab";
import { Form, FormikProvider, useFormik, ErrorMessage } from "formik";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Accordion, AccordionSummary, AccordionDetails, Alert, Button, ButtonGroup, Box, Card, 
    CardContent, Checkbox, Container, Grid, Link, MenuItem, Rating, Stack,
    Table, TableContainer, TableRow, TableHead, TextField, TableBody, TableCell, Typography, Tooltip} from '@mui/material';  
import * as constants from 'src/utils/constants';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import PreviousRoundsDetailCards from '../booked-interview/PreviousRoundsDetailCards';
    
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const labels = {
    1: 'Useless',
    2: 'Poor',
    3: 'Ok',
    4: 'Good',
    5: 'Excellent',
  };

function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

export default function CandidateInterview() {
    const { enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();

    const location = useLocation()

    // state for ratings
    const [overallRatingValue, setOverallRatingValue] = React.useState(2);
    const [hover, setHover] = React.useState(-1);

    // skills rating section

    const [skillRatingFields, setSkillRatingFields] = useState([
        {skill: '', rating: '2', hover: ''}
    ])

    const handleFormChange = (index, event) => {
        let data = [...skillRatingFields];
        data[index][event.target.name] = event.target.value;
        setSkillRatingFields(data);
        handleChange("candidateSkillRating")(`${"test"}`)
    }

    const addFields = () => {
        let newfield = { skill: '', rating: '', hover: '' }
    
        setSkillRatingFields([...skillRatingFields, newfield])
    }

    const removeFields = (index) => {
        let data = [...skillRatingFields];
        data.splice(index, 1)
        setSkillRatingFields(data)
    }

    // training areas section

    const [trainingAreasFields, setTrainingAreasFields] = useState([
        {skill: '', duration: ''}
    ])

    const handleTrainingAreasFormChange = (index, event) => {
        let data = [...trainingAreasFields];
        data[index][event.target.name] = event.target.value;
        setTrainingAreasFields(data);
    }

    const addTrainingAreasFields = () => {
        let newfield = { skill: '', duration: '' }
    
        setTrainingAreasFields([...trainingAreasFields, newfield])
    }

    const removeTrainingAreasFields = (index) => {
        let data = [...trainingAreasFields];
        data.splice(index, 1)
        setTrainingAreasFields(data)
    }

    delete skillRatingFields[0].hover;
    // Linear progress bar state
    const [isLoading, setIsLoading] = useState(true)

    // get confirmed interview data
    const [confirmedInterviewData, setConfirmedInterviewData] = useState([])

    // get all confirmed interview data for a particular job opening
    const [allConfirmedInterviewData, setAllConfirmedInterviewData ] = useState([])

    const confirmedInterviewDataLoad = () => {
        const id = location?.state?.id

        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/confirmed-interviews/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            // setConfirmedInterviewData(response.data.data)
            setAllConfirmedInterviewData(response.data.data?.filter(obj => {
                return obj.job_application.id === location?.state?.jobApplicationId
            }))

            setConfirmedInterviewData(response?.data?.data?.filter(obj => {
                return obj.id === id
            })[0])
            setIsLoading(false)
        })
        .catch((e) => console.log('something went wrong :(', e));
    }

    // Technical Interview Recording State
    const [technicalInterviewRecording, setTechnicalInterviewRecording] = useState("")

    const handleTechnicalInterviewRecording = () => {
        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
        }

        const data = {"id": location?.state?.id}

        axios.post(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/interview-recording/', data, {headers})
        .then(function (response) {
          if (response.status === 200) {
            setTechnicalInterviewRecording(response.data.data)
          }
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }


    // const [jobApplicationData, setJobApplicationData] = useState([])
    // const [screeningRoundData, setScreeningRoundData] = useState("")
    
    // const getJobApplicationData = () => {
    //     const job_application_id = location?.state?.jobApplicationId

    //     axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/job-application/' + job_application_id + '/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
    //     .then((response) => {
    //         setJobApplicationData(response.data.data)
    //         handleChange("fitBU")(`${response.data.data.job.requisitions.business_unit}`)

    //         setScreeningRoundData(
    //             response.data.data.interview_details.filter(item => {
    //                 return item.interview_round === 'SCREENING_ROUND'
    //             })[0]
    //         )
    //     })
    //     .catch((e) => console.log('something went wrong :(', e));       
    // }

    // get business units
    const [businessUnitData, setBusinessUnitData] = useState([])
    const getBusinessUnits = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT +  '/api/v1/business-units/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setBusinessUnitData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };  

    const candidateTechnologies = []

    confirmedInterviewData?.candidate?.technology.forEach((technology, index) => {
        candidateTechnologies.push((index ? ', ': '') + technology.technology_name)
      });

    const candidateLocations = []

    confirmedInterviewData?.candidate?.preferred_location.forEach((location, index) => {
        candidateLocations.push((index ? ', ': '') + location.office_location);
    });

    useEffect(() => {
        confirmedInterviewDataLoad()
        // getJobApplicationData()
        getBusinessUnits()
        handleTechnicalInterviewRecording()
    }, [])

    const handleReviewRoundResult = () => {
        const id = location.state.id

        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
            }

        const data = {"is_interview_completed": true, "interview_feedback": technicalRoundResult}

        axios.put(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/confirmed-interviews/' + id + '/', data, {headers})
        .then(function (response) {
            if (response.status == 200) {
            enqueueSnackbar("Interview Result Submitted Successfully !!", {
                anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                variant: 'success',
                autoHideDuration: 1500,
            });
            navigate('/employee-dashboard/booked-interview', {replace: true});
            window.location.reload(false);
            }
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }

    // Mark Technical Interview as Completed flag state
    const [technicalInterviewChecked, setTechnicalInterviewChecked] = useState(false);

    // Mark Technical Interview as Completed flag state
    const [technicalInterviewCompletedFlag, setTechnicalInterviewCompletedFlag] = useState(false);

    const [technicalRoundResult, setTechnicalRoundResult] = useState("")

    // const handleTechnicalRoundResult = () => {
    //     const id = location.state.id

    //     const headers = {
    //         'Authorization': `Token ${localStorage.getItem('authToken')}`,
    //         }

    //     const data = confirmedInterviewData?.interview_round?.round_name === 'TECHNICAL_ROUND_ONE' ? {
    //         "is_technical_interview_one_completed": technicalInterviewChecked,                 
    //         "is_interview_completed": technicalInterviewChecked, 
    //         "interview_feedback": technicalRoundResult
    //     } : {
    //         "is_technical_interview_two_completed": technicalInterviewChecked,                 
    //         "is_interview_completed": technicalInterviewChecked, 
    //         "interview_feedback": technicalRoundResult
    //     }

    //     axios.put('http://127.0.0.1:8000/api/v1/confirmed-interviews/' + id + '/', data, {headers})
    //     .then(function (response) {
    //         if (response.status == 200) {
    //         enqueueSnackbar("Interview Result Submitted Successfully !!", {
    //             anchorOrigin: {
    //                             vertical: 'top',
    //                             horizontal: 'right',
    //                         },
    //             variant: 'success',
    //             autoHideDuration: 1500,
    //         });
    //         navigate('/employee-dashboard/booked-interview', {replace: true});
    //         window.location.reload(false);
    //         }
    //     })
    //     .catch(error => {
    //         console.error('There was an error!', error);
    //     });
    // }

    const CandidateInterviewResultSchema = Yup.object().shape({
        candidateStrength: Yup.string()
        .required("Candidate's Strong Areas are required"),
        candidateWeakness: Yup.string()
        .required("Candidate's Weak Areas are required"),
        fitBU: Yup.string()
        .required("Fit BU is required"),
        fitProject: Yup.string()
        .required("Fit project is required"),
        fitLevel: Yup.string()
        .required("Fit level is required"),
        interviewerComment: Yup.string()
        .required("Interviewer Comment is required"),
        // technicalInterviewCompleted: Yup.boolean()
        // .oneOf([true], "You must mark the interview as completed or pending"),
        // candidateEligibility:  Yup.boolean()
        // .oneOf([true], "You must mark the candidate as eligible or not"),
        candidateSkillRating: Yup.string()
        .required("Candidate's skill ratings are required"),
    })
    const formik = useFormik({
        initialValues: {
            candidateStrength: '',
            candidateWeakness: '',
            fitBU: '',
            fitProject: '',
            fitLevel: '',
            interviewerComment: '',
            technicalInterviewCompleted: false,
            candidateEligibility: false,
            candidateSkillRating: ''
        },
        validationSchema: CandidateInterviewResultSchema,
        onSubmit: (formValues) => {

            const id = location.state.id
    
            const headers = {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
                }
    
            delete skillRatingFields[0].hover;

            const data = {
                // "is_technical_interview_one_completed": formValues.technicalInterviewCompleted,
                "intv_round": confirmedInterviewData?.interview_round?.round_name,                 
                "is_interview_completed": formValues.technicalInterviewCompleted, 
                "interview_feedback": formValues.interviewerComment,
                "candidate_eligibility": formValues.candidateEligibility,
                "candidate_strength": formValues.candidateStrength,
                "candidate_weakness": formValues.candidateWeakness,
                "fit_bu": formValues.fitBU,
                "fit_project": formValues.fitProject,
                "fit_level": formValues.fitLevel,
                "skills_rating": skillRatingFields,
                "training_areas": trainingAreasFields,
                "overall_rating": overallRatingValue
            }
    
            axios.put(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/confirmed-interviews/' + id + '/', data, {headers})
            .then(function (response) {
                if (response.status == 200) {
                enqueueSnackbar("Interview Result Submitted Successfully !!", {
                    anchorOrigin: {
                                    vertical: 'top',
                                    horizontal: 'right',
                                },
                    variant: 'success',
                    autoHideDuration: 1500,
                });
                navigate('/employee-dashboard/booked-interview', {replace: true});
                window.location.reload(false);
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
        }
    })

    const handleNoShowCandidateInterview = () => {
        const id = location.state.id
    
        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
            }

        delete skillRatingFields[0].hover;

        const data = {
            "intv_round": confirmedInterviewData?.interview_round?.round_name,                 
            "is_interview_completed": true, 
            "interview_feedback": "Candidate didn't show up !",
            "candidate_eligibility": false,
        }

        axios.put(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/confirmed-interviews/' + id + '/', data, {headers})
        .then(function (response) {
            if (response.status == 200) {
            enqueueSnackbar("Interview has been completed !!", {
                anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                variant: 'success',
                autoHideDuration: 1500,
            });
            navigate('/employee-dashboard/booked-interview', {replace: true});
            window.location.reload(false);
            }
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }

    const { errors, handleChange, setFieldValue, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

    return(
        <Page title="Interview Details | ResumeX">
            <Container maxWidth='xl'>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={72} sx={{ mb: 5}}>
                    <Link to="/employee-dashboard/booked-interview/"
                        color="green" 
                        underline="hover" 
                        component={RouterLink} 
                        fontSize="20px">
                            <ArrowCircleLeftIcon fontSize="large" />
                    </Link>

                    <h2 align="center" style={{fontSize: '25px', fontWeight: '800'}}>Interview Details</h2>
                </Stack>
                
                {isLoading ? (
                    
                <Typography variant="h4" sx={{ mt: 0 }} align="center">
                    <LinearProgress />
                </Typography>

                ) : (

                <div>
                <Stack spacing={3}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={0}>
                        <Card sx={{mt: 2}} variant="outlined" style={{width: "50%", border: "none", boxShadow: "none"}}>
                            <CardContent sx={{mb: -5}}>
                                <Typography variant="h6" color="text.secondary" >
                                    Personal Details
                                </Typography>
                            </CardContent>
                            <CardContent>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                    </TableHead>
                                    <TableBody>
                                        <StyledTableRow>
                                            <TableCell><b>Name:</b></TableCell>
                                            <TableCell>{confirmedInterviewData?.candidate?.user?.first_name + " " + confirmedInterviewData.candidate?.user?.last_name}</TableCell>
                                            <TableCell><b>Gender:</b></TableCell>
                                            <TableCell>{confirmedInterviewData?.candidate?.gender}</TableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <TableCell><b>Mobile No:</b></TableCell>
                                            <TableCell>{confirmedInterviewData?.candidate?.user?.mobile}</TableCell>
                                            <TableCell><b>Email:</b></TableCell>
                                            <TableCell>{confirmedInterviewData?.candidate?.user?.email}</TableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <TableCell><b>Experience:</b></TableCell>
                                            <TableCell>{confirmedInterviewData?.candidate?.total_experience} Years</TableCell>
                                            <TableCell><b>Technology:</b></TableCell>
                                            <TableCell>{candidateTechnologies}</TableCell>
                                        </StyledTableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            </CardContent>
                        </Card>

                        <Card sx={{mt: 2}} variant="outlined" style={{width: "50%", border: "none", boxShadow: "none"}}>
                            <CardContent sx={{mb: -5}}>
                                <Typography variant="h6" color="text.secondary" >
                                    Interview Schedule
                                </Typography>
                            </CardContent>

                            <CardContent align="center">
                            <TableContainer style={{ width: "100%" }}>
                                <Table>
                                    <TableHead>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                    </TableHead>
                                    <TableBody>
                                        <StyledTableRow>
                                            <TableCell><b>Status:</b></TableCell>
                                            <TableCell>{confirmedInterviewData?.status=="COMPLETED" ? <b style={{color: 'green'}}>Completed</b>: <b style={{color: '#c7291e'}}>Pending</b>}</TableCell>
                                            <TableCell><b>Round:</b></TableCell>
                                            <TableCell>
                                                <b style={{color: '#c7291e'}}>
                                                    {confirmedInterviewData?.interview_round?.round_name === 'REVIEW_CANDIDATE' ? "Review Candidate" : "Technical Round"}
                                                </b>
                                            </TableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <TableCell><b>Date:</b></TableCell>
                                            <TableCell><b>{new Date(confirmedInterviewData?.start_date).toLocaleString("en-In", { year: 'numeric', month: '2-digit', day: '2-digit',})}</b></TableCell>
                                            <TableCell><b>Time:</b></TableCell>
                                            <TableCell>
                                                {confirmedInterviewData?.interview_round?.round_name === 'REVIEW_CANDIDATE' ? ("--------"
                                                ) : (
                                                <b>
                                                {new Date(confirmedInterviewData?.start_date).toLocaleTimeString("en-In", { hour12: false, hour: '2-digit', minute:'2-digit' })}
                                                &nbsp; to &nbsp;
                                                {new Date(confirmedInterviewData?.end_date).toLocaleTimeString("en-In", { hour12: false, hour: '2-digit', minute:'2-digit' })}
                                                </b>
                                                )}
                                            </TableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <TableCell><b>Resume:</b></TableCell>
                                            <TableCell><a href={confirmedInterviewData?.job_application?.resume?.resume} target="_blank" style={{color: "green", fontWeight: "bold"}}>Click here to check</a></TableCell>
                                            <TableCell><b>Interview Link:</b></TableCell>
                                            <TableCell>
                                                {confirmedInterviewData?.interview_round?.round_name === 'REVIEW_CANDIDATE' ? ("--------"
                                                ) : (
                                                    <a href={confirmedInterviewData?.interview_moderator_link} target="_blank" style={{color: "green", fontWeight: "bold"}}>Click here to join</a>
                                                )}
                                            </TableCell>
                                        </StyledTableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            </CardContent>
                        </Card>
                    </Stack>
                </Stack>

                <Alert variant="outlined" severity="error" action={
                    <Button color="error" size="small" variant="outlined" onClick={() => handleNoShowCandidateInterview()}>
                        END INTERVIEW
                    </Button>
                }>
                    Candidate didn't show up for the interview ? Mark this interview as completed:
                </Alert>

                <Accordion sx={{mt: 5}}>
                    <AccordionSummary
                        sx={{
                            backgroundColor: "#F5F5F5"
                        }}
                        expandIcon={<ExpandCircleDownOutlinedIcon />}
                        
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                        <Typography variant="h6" color="text.secondary" >
                            View Recordings of Previous Rounds
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        <Grid container spacing={3} alignContent="center" justifyContent="center" sx={{mt: 5}} >
                        {allConfirmedInterviewData.filter(obj => {
                            return obj.interview_round.round_name !== confirmedInterviewData?.interview_round?.round_name
                        }).map((interview, index) => (
                            <PreviousRoundsDetailCards key={interview.id} post={interview} index={index} />
                            ))}
                        </Grid>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{mt: 5}}>
                    <AccordionSummary
                        sx={{
                            backgroundColor: "#F5F5F5"
                        }}
                        expandIcon={<ExpandCircleDownOutlinedIcon />}
                        
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                        <Typography variant="h6" color="text.secondary" >
                            Current Interview Round Recording
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <div>
                        <table style={{width: "100%"}}>
                            <tr>
                            <td style={{width: "50%"}}>
                            {technicalInterviewRecording !== 'Not Available' ? (
                            <iframe width="100%" height="450"
                                src={technicalInterviewRecording}
                            ></iframe>
                            ):("Recording is not generated yet. Please reload the page.")}
                            </td>
                            </tr>
                        </table>
                    </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{mt: 5}}>
                    <AccordionSummary
                        sx={{
                            backgroundColor: "#F5F5F5"
                        }}
                        expandIcon={<ExpandCircleDownOutlinedIcon />}
                        
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                        <Typography variant="h6" color="text.secondary" >
                            Submit Result
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormikProvider value={formik}>
                            <Form autoComplete="off" onSubmit={handleSubmit}>
                                <Stack spacing={3}>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField 
                                            fullWidth
                                            label="Candidate's Strong Areas"
                                            placeholder="Ex: OOPS, Core-Java, Spring"
                                            {...getFieldProps("candidateStrength")}
                                            error={Boolean(touched.candidateStrength && errors.candidateStrength)}
                                            helperText={touched.candidateStrength && errors.candidateStrength}
                                        />
                                        <TextField 
                                            fullWidth
                                            label="Candidate's Weak Areas"
                                            placeholder="Ex: Java-8, Reflection"
                                            {...getFieldProps("candidateWeakness")}
                                            error={Boolean(touched.candidateWeakness && errors.candidateWeakness)}
                                            helperText={touched.candidateWeakness && errors.candidateWeakness}
                                        />
                                    </Stack>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField 
                                            fullWidth
                                            select
                                            label="Fit for BU"
                                            {...getFieldProps("fitBU")}
                                            error={Boolean(touched.fitBU && errors.fitBU)}
                                            helperText={touched.fitBU && errors.fitBU}
                                        >
                                            {businessUnitData.map((unit) => (
                                                <MenuItem key={unit.id} value={unit.id}>{unit.bu_name}</MenuItem>
                                            ))}
                                        </TextField>

                                        <TextField 
                                            fullWidth
                                            label="Fit for project"
                                            {...getFieldProps("fitProject")}
                                            error={Boolean(touched.fitProject && errors.fitProject)}
                                            helperText={touched.fitProject && errors.fitProject}
                                        />

                                        <TextField 
                                            fullWidth
                                            select
                                            label="Fit level"
                                            {...getFieldProps("fitLevel")}
                                            error={Boolean(touched.fitLevel && errors.fitLevel)}
                                            helperText={touched.fitLevel && errors.fitLevel}
                                        >
                                            <MenuItem key='SE' value='Software Engineer'>Software Engineer</MenuItem>
                                            <MenuItem key='SSE' value='Senior Software Engineer'>Senior Software Engineer</MenuItem>
                                            <MenuItem key='AP' value='Analyst Programmer'>Analyst Programmer</MenuItem>
                                            <MenuItem key='SAP' value='Senior Analyst Programmer'>Senior Analyst Programmer</MenuItem>
                                            <MenuItem key='TL' value='Tech Lead'>Tech Lead</MenuItem>
                                            <MenuItem key='Jr/Sr Architect' value='Jr/Sr Architect'>Jr/Sr Architect</MenuItem>
                                            <MenuItem key='PM' value='Project Manager'>Project Manager</MenuItem>
                                        </TextField>
                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="center" paddingTop="25px" spacing={2}>
                                        <b>Add skill wise rating</b>
                                    </Stack>

                                    {skillRatingFields.map((input, index) => {
                                        return (
                                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                                <TextField 
                                                style={{width: "50%"}}
                                                label="Skill"
                                                name='skill'
                                                value={input.skill}
                                                onChange={event => handleFormChange(index, event)}
                                                />
                                                
                                                <Stack direction={{ xs: "column", sm: "column" }} spacing={1}>
                                                <Rating
                                                    name="rating"
                                                    value={input.rating}
                                                    precision={1}
                                                    // getLabelText={getLabelText}
                                                    style={{paddingLeft: "20px"}}
                                                    onChange={event => handleFormChange(index, event)}
                                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                                />
                                                {input.rating !== null && (
                                                    <Box style={{paddingLeft: "22px"}} sx={{ ml: 2 }}>{labels[input.hover !== -1 ? input.rating : input.hover]}</Box>
                                                )}
                                                </Stack>

                                            <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                                                <Tooltip title="Add More" arrow>
                                                    <Button variant="text" color="success" onClick={addFields}>{<AddCircleOutlineIcon fontSize="large"/>}</Button>
                                                </Tooltip>
                                                <Tooltip title="Remove" arrow>
                                                    <Button variant="text" color="error" onClick={removeFields}>{<RemoveCircleOutlineIcon fontSize="large"/>}</Button>
                                                </Tooltip>
                                            </ButtonGroup>
                                            </Stack>
                                        )
                                    })}

                                    <ErrorMessage name="candidateSkillRating">
                                        {(msg) => <span style={{ color: "#FF4842", fontSize: "14px" }}>{msg}</span>}
                                    </ErrorMessage>


                                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="center" paddingTop="25px" spacing={2}>
                                        <b>Mention training areas (If needed)</b>
                                    </Stack>

                                    {trainingAreasFields.map((input, index) => {
                                        return (
                                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                                <TextField 
                                                style={{width: "40%"}}
                                                label="Skill"
                                                name='skill'
                                                value={input.skill}
                                                onChange={event => handleTrainingAreasFormChange(index, event)}
                                                />
                                                
                                                <TextField
                                                style={{width: "40%"}}
                                                select
                                                label="Duration"
                                                name='duration'
                                                value={input.duration}
                                                onChange={event => handleTrainingAreasFormChange(index, event)}
                                                >
                                                    <MenuItem key='1 week' value='1 week'>1 week</MenuItem>
                                                    <MenuItem key='2 weeks' value='2 weeks'>2 weeks</MenuItem>
                                                    <MenuItem key='3 weeks' value='3 weeks'>3 weeks</MenuItem>
                                                    <MenuItem key='4 weeks' value='4 weeks'>4 weeks</MenuItem>
                                                    <MenuItem key='5 weeks' value='5 weeks'>5 weeks</MenuItem>
                                                    <MenuItem key='6 weeks' value='6 weeks'>6 weeks</MenuItem>
                                                </TextField>

                                            <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                                                <Tooltip title="Add More" arrow>
                                                    <Button variant="text" color="success" onClick={addTrainingAreasFields}>{<AddCircleOutlineIcon fontSize="large"/>}</Button>
                                                </Tooltip>
                                                <Tooltip title="Remove" arrow>
                                                    <Button variant="text" color="error" onClick={removeTrainingAreasFields}>{<RemoveCircleOutlineIcon fontSize="large"/>}</Button>
                                                </Tooltip>
                                            </ButtonGroup>
                                            </Stack>
                                        )
                                    })}

                                    <Stack direction={{ xs: "column", sm: "row" }} paddingTop="25px" spacing={2}>
                                        <TextField 
                                            fullWidth
                                            label="Interviewer Comment"
                                            multiline
                                            rows={3}
                                            maxRows={4}
                                            {...getFieldProps("interviewerComment")}
                                            error={Boolean(touched.interviewerComment && errors.interviewerComment)}
                                            helperText={touched.interviewerComment && errors.interviewerComment}
                                        />
                                    </Stack>

                                    <Box
                                    sx={{
                                        width: "100%",
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    paddingTop="25px"
                                    >

                                    Overall Rating: &emsp;
                                    <Rating
                                        name="hover-feedback"
                                        value={overallRatingValue}
                                        precision={1}
                                        getLabelText={getLabelText}
                                        onChange={(event, newValue) => {
                                        setOverallRatingValue(newValue);
                                        }}
                                        onChangeActive={(event, newHover) => {
                                        setHover(newHover);
                                        }}
                                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                    />
                                    {overallRatingValue !== null && (
                                        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : overallRatingValue]}</Box>
                                    )}
                                    </Box>

                                    <Box
                                    sx={{
                                        width: "100%",
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    paddingTop="25px"
                                    paddingBottom="25px"
                                    >

                                    Is candidate eligible for the next round of interview?:
                                    <Checkbox 
                                        {...getFieldProps("candidateEligibility")}
                                        error={Boolean(touched.candidateEligibility && errors.candidateEligibility)}
                                        helperText={touched.candidateEligibility && errors.candidateEligibility}
                                    />
                                    
                                    &emsp;&emsp;&emsp;&emsp;&emsp;
                            
                                    Mark interview as completed:
                                    <Checkbox 
                                        {...getFieldProps("technicalInterviewCompleted")}
                                        error={Boolean(touched.technicalInterviewCompleted && errors.technicalInterviewCompleted)}
                                        helperText={touched.technicalInterviewCompleted && errors.technicalInterviewCompleted}
                                    />
                                    </Box>

                                    <LoadingButton
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        loading={isSubmitting}
                                    >
                                        Submit Result
                                    </LoadingButton>
                                </Stack>
                            </Form>
                        </FormikProvider>
                    </AccordionDetails>
                </Accordion>
                </div>
                )}
            </Container>
        </Page>
    )
}