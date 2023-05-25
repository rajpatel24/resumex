import React, { useState, useEffect } from 'react';
import Page from '../../Page';
import { Button, Card, CardContent, Checkbox, Container, Dialog, DialogContent, DialogActions, Stack, Typography, TextField } from '@mui/material';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import {useSnackbar} from 'notistack';

import ScheduleScreeningRound from './candidate-timeline/screening-round/ScheduleScreeningRound';
import ScreeningRoundRecording from './candidate-timeline/screening-round/ScreeningRoundRecording';
import ScreeningRoundResult from './candidate-timeline/screening-round/ScreeningRoundResult';
import ScreeningRoundStatus from './candidate-timeline/screening-round/ScreeningRoundStatus';

import InitialRoundCandidateForm from './candidate-timeline/initial-hr-call/InitialRoundCandidateForm'
import InitialRoundCallRecording from './candidate-timeline/initial-hr-call/InitialRoundCallRecording';
import InitialRoundFeedback from './candidate-timeline/initial-hr-call/InitialRoundFeedback';
import InitialRoundStatus from './candidate-timeline/initial-hr-call/InitialRoundStatus';

import SendForReview from './candidate-timeline/review-candidate/SendForReview';
import ReviewFeedback from './candidate-timeline/review-candidate/ReviewFeedback';
import ReviewCandidateStatus from './candidate-timeline/review-candidate/ReviewCandidateStatus';

import ScheduleTechnicalRoundOne from './candidate-timeline/technical-round-one/ScheduleTechnicalRoundOne';
import TechnicalRoundOneRecording from './candidate-timeline/technical-round-one/TechnicalRoundOneRecording';
import TechnicalRoundOneResult from './candidate-timeline/technical-round-one/TechnicalRoundOneResult';
import TechnicalRoundOneStatus from './candidate-timeline/technical-round-one/TechnicalRoundOneStatus';

import ScheduleTechnicalRoundTwo from './candidate-timeline/technical-round-two/ScheduleTechnicalRoundTwo';
import TechnicalRoundTwoRecording from './candidate-timeline/technical-round-two/TechnicalRoundTwoRecording';
import TechnicalRoundTwoResult from './candidate-timeline/technical-round-two/TechnicalRoundTwoResult';
import TechnicalRoundTwoStatus from './candidate-timeline/technical-round-two/TechnicalRoundTwoStatus';

import ScheduleCTORound from './candidate-timeline/cto-round/ScheduleCTORound';
import CTORoundRecording from './candidate-timeline/cto-round/CTORoundRecording';
import CTORoundResult from './candidate-timeline/cto-round/CTORoundResult';
import CTORoundStatus from './candidate-timeline/cto-round/CTORoundStatus';

import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import PreviewIcon from '@mui/icons-material/Preview';
import GroupsIcon from '@mui/icons-material/Groups';
import LaptopChromebookOutlinedIcon from '@mui/icons-material/LaptopChromebookOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import * as constants from 'src/utils/constants';

export default function CandidateTimeline() {
    const { id } = useParams();

    const { enqueueSnackbar} = useSnackbar();

    const [jobApplicationData, setJobApplicationData] = useState([])
    const getJobApplicationData = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/job-application/' + id + '/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setJobApplicationData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
      };

    useEffect(() => {
        getJobApplicationData()
    }, [])

    // HR Schedule Interview Dialog
    const [hrScheduleInterviewOpen, setHrScheduleInterviewOpen] = useState(false)

    // Technical Schedule Interview Dialog
    const [practicalScheduleInterviewOpen, setPracticalScheduleInterviewOpen] = useState(false)

    const handleScheduleInterview = event => {
        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
          }
        const data = {"job_application_id": id}
        axios.post(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/send-interview-slot-mail/', data, {headers})
        .then(function (response) {
          if (response.status === 200) {
            enqueueSnackbar("Mail has been sent to the candidate successfully !!", {
              anchorOrigin: {
                              vertical: 'top',
                              horizontal: 'right',
                            },
              variant: 'success',
              autoHideDuration: 1500,
            });
            window.location.reload(false);
          }
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }

    // Mark HR Interview as Completed flag state
    const [hrInterviewChecked, setHrInterviewChecked] = React.useState();

    const handleHrInterviewCheckedChange = event =>{
        setHrInterviewChecked(event.target.checked);
    };

    // Mark Candidate as Selected
    const [markCandidateAsSelected, setMarkCandidateAsSelected] = React.useState();

    const handleMarkCandidateAsSelectedCheckedChange = event =>{
        setMarkCandidateAsSelected(event.target.checked);
        setMarkCandidateAsRejected(false)
    };

    // Mark Candidate as Rejected
    const [markCandidateAsRejected, setMarkCandidateAsRejected] = React.useState();

    const handleMarkCandidateAsRejectedChange = event =>{
        setMarkCandidateAsRejected(event.target.checked);
        setMarkCandidateAsSelected(false)
    };

    const [hrRoundResult, setHrRoundResult] = useState("")

    const [hrInterviewRecordingNotes, setHrInterviewRecordingNotes] = useState("")

    const [jobApplicationResult, setJobApplicationResult] = useState("")

    const HrRoundData = jobApplicationData?.interview_details?.filter(item => {
        return item.interview_round === 'SCREENING_ROUND'
    })

    // set initial values
    useEffect(() => {
        setHrInterviewChecked(HrRoundData?.[0]?.interview_status === "COMPLETED")
        setMarkCandidateAsSelected(jobApplicationData?.is_candidate_selected)
        setMarkCandidateAsRejected(jobApplicationData?.is_candidate_rejected)
        setHrRoundResult(HrRoundData?.[0]?.interview_feedback)
        setHrInterviewRecordingNotes(HrRoundData?.[0]?.interview_recording_notes)
        setJobApplicationResult(jobApplicationData?.job_application_result)
    }, [
        HrRoundData?.[0]?.interview_status === "COMPLETED", 
        jobApplicationData?.is_candidate_selected,
        jobApplicationData?.is_candidate_rejected,
        HrRoundData?.[0]?.interview_feedback,
        HrRoundData?.[0]?.interview_recording_notes,
        jobApplicationData?.job_application_result
    ])

    // HR Schedule Interview Result Dialog
    const [hrScheduleInterviewResultOpen, setHrScheduleInterviewResultOpen] = useState(false)

    // Job Application Result Dialog
    const [jobApplicationResultOpen, setJobApplicationResultOpen] = useState(false)

    // Open HR Interview Recording
    const [openHrInterviewRecording, setOpenHrInterviewRecording] = useState(false)

    // HR Interview Recording State
    const [hrInterviewRecording, setHrInterviewRecording] = useState("")

    const handleHrInterviewRecording = () => {
        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
          }
        const data = {"id": jobApplicationData?.interview_details?.[0]?.id}
        axios.post(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/interview-recording/', data, {headers})
        .then(function (response) {
          if (response.status === 200) {
            setHrInterviewRecording(response.data.data)
            setOpenHrInterviewRecording(true)
          }
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }

    const handleHrRoundResult = event => {
        const confirmed_interview_id = jobApplicationData?.interview_details?.[0]?.id

        setHrScheduleInterviewResultOpen(false)
        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
          }
        const data = {
            "is_interview_completed": hrInterviewChecked,
            "is_hr_interview_completed": hrInterviewChecked,
            "interview_feedback": hrRoundResult, 
            "interview_recording_notes": hrInterviewRecordingNotes
        }
        axios.put(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/confirmed-interviews/' + confirmed_interview_id + '/', data, {headers})
        .then(function (response) {
          if (response.status === 200) {
            enqueueSnackbar("Interview Result Submitted Successfully !!", {
              anchorOrigin: {
                              vertical: 'top',
                              horizontal: 'right',
                            },
              variant: 'success',
              autoHideDuration: 1500,
            });
            window.location.reload(false);
          }
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }

    const handleJobApplicationResult = event => {
        setJobApplicationResultOpen(false)
        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
          }
        const data = {
            "is_candidate_selected": markCandidateAsSelected,
            "is_candidate_rejected": markCandidateAsRejected,
            "job_application_result": jobApplicationResult,
            "is_interviewed": true
        }
        axios.put(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/job-application/' + id + '/', data, {headers})
        .then(function (response) {
          if (response.status === 200) {
            enqueueSnackbar("Interview Result Submitted Successfully !!", {
              anchorOrigin: {
                              vertical: 'top',
                              horizontal: 'right',
                            },
              variant: 'success',
              autoHideDuration: 1500,
            });
            window.location.reload(false);
          }
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }

    function getHRInterviewDateTime(){ 
        const HRDateTime = jobApplicationData?.interview_details.filter(item => {
            return item.interview_round === 'SCREENING_ROUND'
        })
        return HRDateTime[0].modified.substring(0, 10).split('-').reverse().join('/') + " | " + HRDateTime[0].modified.substring(11, 16)
    }

    const date1 = new Date(jobApplicationData?.resume?.candidate?.user?.joined_date)
    const date2 = new Date(jobApplicationData?.modified)
    const seconds = (date2.getTime() - date1.getTime())/1000 ? (date2.getTime() - date1.getTime())/1000 : 0
    const totalTime = (Math.floor(seconds/86400) + ":" + (new Date(seconds * 1000)).toISOString().substr(11, 8)).split(":")

    return(
    <Page>
        <Container maxWidth="xl" sx={{ mt:0 }}>
            <Card sx={{mt: 2}} variant="outlined" style={{ border: "none", boxShadow: "none" }}>
            <CardContent>
            <Timeline position="alternate">
            <TimelineItem>
                    <TimelineSeparator>
                    <TimelineDot variant="outlined" color="error">
                        <HowToRegOutlinedIcon />
                    </TimelineDot>
                    <TimelineConnector sx={{ bgcolor: 'error.main' }}/> 
                    </TimelineSeparator>
                    <TimelineContent sx={{ mt: 1}}>
                        <Typography variant="h6">
                            Candidate Registration
                        </Typography>
                        <br></br>
                        <b>Date:</b> {jobApplicationData?.resume?.candidate?.user?.joined_date.substring(0, 10).split('-').reverse().join('/')} <br></br>
                        <b>Time:</b> {jobApplicationData?.resume?.candidate?.user?.joined_date.substring(11, 16)}
                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                        </Stack>
                    </TimelineContent>
                </TimelineItem>


                {/* <TimelineItem>
                    <TimelineSeparator>
                    <TimelineDot variant="outlined" color="error"/>
                    <TimelineConnector sx={{ bgcolor: 'error.main' }}/> 
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography variant="h6">
                            Initial HR Call
                        </Typography>
                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right" sx={{ mt:3, mb: 3 }}>
                            <InitialRoundCandidateForm />
                        </Stack>
                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right" sx={{ mt:3, mb: 3 }}>
                            <InitialRoundCallRecording />
                        </Stack>
                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right" sx={{ mt:3, mb: 3 }}>
                            <InitialRoundFeedback />
                        </Stack>
                        <InitialRoundStatus />
                    </TimelineContent>
                </TimelineItem> */}


                <TimelineItem>
                    <TimelineSeparator>
                    <TimelineDot variant="outlined" color="error">
                        <VideoCallOutlinedIcon />
                    </TimelineDot>
                    <TimelineConnector sx={{ bgcolor: 'error.main' }}/>
                    </TimelineSeparator>
                    <TimelineContent sx={{ mt: 1}}>
                        <Typography variant="h6">
                            Screening Round
                        </Typography>

                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right" sx={{ mt:5, mb: 3 }}>
                            <ScheduleScreeningRound jobApplicationData={jobApplicationData}/>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right" sx={{ mt:3, mb: 3 }}>
                            <ScreeningRoundRecording jobApplicationData={jobApplicationData}/>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right" sx={{ mt:3, mb: 3 }}>
                            <ScreeningRoundResult jobApplicationData={jobApplicationData}/>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right" sx={{ mt:3, mb: 3 }}>
                            <ScreeningRoundStatus jobApplicationData={jobApplicationData}/>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                        </Stack>
                    </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                    <TimelineSeparator>
                    <TimelineDot variant="outlined" color="error">
                        <PreviewIcon />
                    </TimelineDot>
                    <TimelineConnector sx={{ bgcolor: 'error.main' }}/> 
                    </TimelineSeparator>
                    <TimelineContent sx={{ mt: 1}}>
                        <Typography variant="h6">
                            Review Candidate
                        </Typography>
                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                            <SendForReview jobApplicationData={jobApplicationData}/>
                        </Stack>
                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                            <ReviewFeedback jobApplicationData={jobApplicationData}/>
                        </Stack>
                        <ReviewCandidateStatus jobApplicationData={jobApplicationData}/>
                    </TimelineContent>
                </TimelineItem>                

                <TimelineItem>
                    <TimelineSeparator>
                    <TimelineDot variant="outlined" color="error">
                        <GroupsIcon />
                    </TimelineDot>
                    <TimelineConnector sx={{ bgcolor: 'error.main' }}/>
                    </TimelineSeparator>
                    <TimelineContent sx={{mt: 1}}>
                        <Typography variant="h6">
                            Technical Round 1
                        </Typography>

                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right" sx={{ mt:5, mb: 3 }}>
                            <ScheduleTechnicalRoundOne jobApplicationData={jobApplicationData}/>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right" sx={{ mt:3, mb: 3 }}>
                            <TechnicalRoundOneRecording jobApplicationData={jobApplicationData}/>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right" sx={{ mt:3, mb: 3 }}>
                            <TechnicalRoundOneResult jobApplicationData={jobApplicationData}/>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                        </Stack>

                        <TechnicalRoundOneStatus jobApplicationData={jobApplicationData} />

                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                        </Stack>
                    </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                    <TimelineSeparator>
                    <TimelineDot variant="outlined" color="error">
                        <GroupsIcon />
                    </TimelineDot>
                    <TimelineConnector sx={{ bgcolor: 'error.main' }}/>
                    </TimelineSeparator>
                    <TimelineContent sx={{mt: 1}}>
                        <Typography variant="h6">
                            Technical Round 2
                        </Typography>

                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:5, mb: 3 }}>
                            <ScheduleTechnicalRoundTwo jobApplicationData={jobApplicationData}/>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                            <TechnicalRoundTwoRecording jobApplicationData={jobApplicationData}/>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                            <TechnicalRoundTwoResult jobApplicationData={jobApplicationData}/>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                        </Stack>

                        <TechnicalRoundTwoStatus jobApplicationData={jobApplicationData} />

                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                        </Stack>
                    </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                    <TimelineSeparator>
                    <TimelineDot variant="outlined" color="error">
                        <GroupsIcon />
                    </TimelineDot>
                    <TimelineConnector sx={{ bgcolor: 'error.main' }}/>
                    </TimelineSeparator>
                    <TimelineContent sx={{mt: 1}}>
                        <Typography variant="h6">
                            CTO / Manager / HR Round
                        </Typography>

                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right" sx={{ mt:5, mb: 3 }}>
                            <ScheduleCTORound jobApplicationData={jobApplicationData}/>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right" sx={{ mt:3, mb: 3 }}>
                            <CTORoundRecording jobApplicationData={jobApplicationData}/>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right" sx={{ mt:3, mb: 3 }}>
                            <CTORoundResult jobApplicationData={jobApplicationData}/>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                        </Stack>

                        <CTORoundStatus jobApplicationData={jobApplicationData} />

                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                        </Stack>
                    </TimelineContent>
                </TimelineItem>

                {/* <TimelineItem>
                    <TimelineSeparator>
                    <TimelineDot variant="outlined" color="error">
                        <LaptopChromebookOutlinedIcon />
                    </TimelineDot>
                    <TimelineConnector sx={{ bgcolor: 'error.main' }}/>
                    </TimelineSeparator>
                    <TimelineContent sx={{ mt: 1}}>
                        <Typography variant="h6">
                            Practical Round
                        </Typography>

                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:5, mb: 3 }}>
                            <Button 
                                variant="contained"
                                size="small" 
                                color="error" 
                                style={{width: "150px"}}
                                onClick={() => setPracticalScheduleInterviewOpen(true)}
                                // disabled={(jobApplicationData?.interview_details?.[0]?.interview_status!="COMPLETED" ? jobApplicationData?.interview_details?.[1]?.interview_status!="COMPLETED" : jobApplicationData?.interview_details?.[1]?.interview_status!="COMPLETED")}
                                disabled
                                >
                                    Schedule Interview
                                </Button>
                            
                            {jobApplicationData?.interview_details?.[2] ? (
                                <Dialog open={practicalScheduleInterviewOpen} onClose={() => setPracticalScheduleInterviewOpen(false)}>
                                    <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                                        Schedule Interview for Practical Round
                                    </Typography>
                                    <DialogContent>
                                        Interview has already been scheduled. Below are the interview details:
                                    </DialogContent>
                                    <DialogContent>
                                        <b>Interview Date:</b> <b style={{color: "red"}}>{jobApplicationData?.interview_details[2]?.start_date.substring(0, 10)}</b>
                                        <br></br>
                                        <b>Interview Time:</b> <b style={{color: "red"}}>{jobApplicationData?.interview_details[2]?.start_date.substring(11, 16)}</b> to <b style={{color: "red"}}>{jobApplicationData?.interview_details[2]?.end_date.substring(11, 16)}</b>
                                        <br></br><br></br>
                                        <b>Interview Link:</b> <a href={jobApplicationData?.interview_details[2]?.interview_moderator_link}>Click here to join</a>
                                    </DialogContent>
                                    <DialogActions style={{justifyContent: "center", paddingTop: '15px', paddingBottom: '15px'}}>
                                        <Button variant="contained" color="error" size="medium" disabled>Schedule Interview</Button>
                                    </DialogActions>
                                </Dialog>
                            ) : (
                                <Dialog open={practicalScheduleInterviewOpen} onClose={() => setPracticalScheduleInterviewOpen(false)}>
                                    <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                                        Schedule Interview for Practical Round
                                    </Typography>
                                    {jobApplicationData?.is_practical_interview_mail_sent ? (
                                    <DialogContent>
                                        <b>Awaiting for candidate's response.</b>
                                        <br></br> <br></br>
                                        An email has already been sent to the candidate asking him to choose interview slot!
                                    </DialogContent>
                                    ) : (
                                    <DialogContent>
                                        An email will be sent to the candidate asking him/her to choose a slot for the interview.
                                        <br></br> <br></br>
                                        Before pressing the "Schedule Interview" button, Please make sure you have given slots for the Interview!
                                    </DialogContent>
                                    )}
                                    <DialogActions style={{justifyContent: "center", paddingTop: '15px'}}>
                                        <Button variant="contained" color="error" size="medium" onClick={handleScheduleInterview} disabled={jobApplicationData?.is_practical_interview_mail_sent && true}>Schedule Interview</Button>
                                    </DialogActions>
                                </Dialog>
                            )}

                        </Stack>


                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                        <Button variant="contained" size="small" color="error"  style={{width: "150px"}} disabled>Interview Result</Button>
                        </Stack>
                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                        <Button variant="contained" size="small" color="error" style={{width: "150px"}} disabled>Interview Recording</Button>
                        </Stack>
                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                        </Stack>
                        <b>Status:</b> <b style={{color: "red"}}>------</b> 
                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                        </Stack>
                    </TimelineContent>
                </TimelineItem> */}

                <TimelineItem>
                    <TimelineSeparator>
                    <TimelineDot variant="outlined" color="error">
                        <ListAltOutlinedIcon />
                    </TimelineDot>
                    <TimelineConnector sx={{ bgcolor: 'error.main' }}/>
                    </TimelineSeparator>
                    <TimelineContent sx={{ mt: 1}}>
                        <Typography variant="h6">
                            Overall Performance
                        </Typography>
                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                            <Button 
                                variant="contained" 
                                size="small" 
                                color="success" 
                                onClick={() => setJobApplicationResultOpen(true)}
                                disabled={(jobApplicationData?.interview_details?.[0]?.interview_status!=="COMPLETED" ? jobApplicationData?.interview_details?.[1]?.interview_status!=="COMPLETED" : jobApplicationData?.interview_details?.[1]?.interview_status!=="COMPLETED")}>
                                Job Application Result
                            </Button>

                            <Dialog open={jobApplicationResultOpen} onClose={() => setJobApplicationResultOpen(false)}>
                                <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                                    Candidate Job Application Result
                                </Typography>
                                <DialogContent>
                                    Mark Candidate as Selected:
                                    <Checkbox checked={markCandidateAsSelected} onChange={handleMarkCandidateAsSelectedCheckedChange} required/>
                                </DialogContent>
                                <DialogContent>
                                    Mark Candidate as Rejected:
                                    <Checkbox checked={markCandidateAsRejected} onChange={handleMarkCandidateAsRejectedChange} required/>
                                </DialogContent>
                                <DialogContent>
                                    Please give feedback below:
                                </DialogContent>
                                <DialogContent>
                                <TextField
                                    fullWidth
                                    label="Feedback"
                                    style={{ width: 500 }}
                                    multiline
                                    rows={6}
                                    maxRows={4}
                                    defaultValue={jobApplicationResult}
                                    onChange={(event) => setJobApplicationResult(event.target.value)}
                                />
                                </DialogContent>
                                <DialogActions style={{justifyContent: "center", paddingTop: '15px', paddingBottom: '15px'}}>
                                    <Button variant="contained" color="error" size="medium" onClick={handleJobApplicationResult}>Submit</Button>
                                </DialogActions>
                            </Dialog>
                        </Stack>
                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                        </Stack>
                        <b>Selected:</b> <b style={{color: markCandidateAsSelected ? "Green" : "red"}}>{markCandidateAsSelected ? 'Yes' : 'No'}</b>
                        <br></br>
                        {jobApplicationData?.job_application_result ? (
                        <b>Date Time: &nbsp;
                            <b style={{color: markCandidateAsSelected ? "Green" : "red"}}>
                                {jobApplicationData?.modified?.substring(0, 10).split('-').reverse().join('/') + " | " + jobApplicationData?.modified?.substring(11, 16)}</b>
                            </b>
                        ) : ("")}
                        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt:3, mb: 3 }}>
                        </Stack>
                    </TimelineContent>
                </TimelineItem>
            </Timeline>
            </CardContent>
            <CardContent>
            <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                Total Time Taken <br></br>
                {jobApplicationData?.job_application_result ? (
                <b style={{color: "red"}}>{totalTime[0] + " Days " + totalTime[1] + " Hours " + totalTime[2] + " Minutes " + totalTime[3] + " Seconds "}</b>
                ) : (<b style={{color: "red"}}>Recruitment process is in progress !</b>) }
            </Typography>
            </CardContent>
            </Card>
        </Container>
    </Page>
    )
}