import axios from 'axios';
import Page from "../components/Page";
import {useState, useEffect} from "react";
import { styled } from '@mui/material/styles';
import * as constants from 'src/utils/constants';
import LaunchIcon from '@mui/icons-material/Launch';
import LinearProgress from '@mui/material/LinearProgress';
import { Button, Card, CardContent, Container, Table, TableContainer, TableRow, 
    TableHead, TableBody, TableCell, Typography } from '@mui/material';
    
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function InterviewDetails() {
    // Linear progress bar state
    const [isLoading, setIsLoading] = useState(true)

    const [candidateData, setCandidateData] = useState([])

    const getCandidateData = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/candidate/', {headers: {"Authorization" : `Token ${localStorage.getItem('candidateToken')}`}})
        .then((response) => {
            setCandidateData(response.data.data)
           
        })
        .catch((e) => console.log('something went wrong :(', e));
    };

    const candidateJobApplication = candidateData?.job_application?.filter(obj => {return obj.is_interviewed === false & obj.is_candidate_selected === false})

    const [confirmedInterviewData, setConfirmedInterviewData] = useState([])
    
    const getConfirmedInterviewDetails = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/confirmed-interviews/', {headers: {"Authorization" : `Token ${localStorage.getItem('candidateToken')}`}})
        .then((response) => {
            setConfirmedInterviewData(response.data.data)
            setIsLoading(false)
        })
        .catch((e) => console.log('something went wrong :(', e));
    }

    const confirmedInterviewDetails = confirmedInterviewData.filter(obj => {
        return obj.interview_status === 'CONFIRMED' && obj.interview_round !== 'REVIEW_CANDIDATE'
    })

    useEffect(() => {
        getCandidateData()
        getConfirmedInterviewDetails()
    }, [])

    return (
        <Page title='Interview Details | ResumeX'>
            <Container maxWidth="xl" align="center">
                <h2 style={{fontSize: '30px', fontWeight: '1000', paddingBottom: '25px'}}>Interview Details</h2>

                {isLoading ? (
                    <Typography variant="h4" sx={{ mt: 0 }} align="center">
                        <LinearProgress />
                    </Typography>
                    ) : ( 
                        candidateJobApplication?.length > 0 ? (
                            confirmedInterviewDetails?.length > 0 && confirmedInterviewDetails?.[0]?.interview_round?.round_name !== 'REVIEW_CANDIDATE' ? (
                                <Card align="left">
                                    <CardContent>
                                        <h5 style={{fontWeight: '1000', paddingBottom: '25px', color: "#f05e0a"}}>{confirmedInterviewDetails?.[0]?.job_application?.requisition?.job_name}</h5>
                                        <h6 style={{fontWeight: '500', paddingBottom: '25px', color: "#f05e0a"}}>{confirmedInterviewDetails?.[0]?.interview_round?.round_name}</h6>
                                    </CardContent>

                                    <CardContent sx={{mt: -5}}>
                                        <TableContainer style={{ width: "100%" }}>
                                            <Table>
                                                <TableHead>
                                                    <TableCell>Interview Schedule:</TableCell>
                                                    <TableCell>Interview Link: </TableCell>
                                                </TableHead>
                                                <TableBody>
                                                    <StyledTableRow>
                                                        <TableCell><b style={{color: "red"}}>{new Date(confirmedInterviewDetails?.[0]?.start_date).toLocaleDateString()} | &nbsp;
                                            {new Date(confirmedInterviewDetails?.[0]?.start_date).toLocaleTimeString()} - {new Date(confirmedInterviewDetails?.[0]?.end_date).toLocaleTimeString()}</b></TableCell>
                                                        <TableCell><Button variant="contained" size="small" href={confirmedInterviewDetails?.[0]?.interview_attendee_link} target="_blank">Join Meeting &nbsp;<LaunchIcon fontSize="small"></LaunchIcon></Button></TableCell>
                                                    </StyledTableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>

                                    <CardContent>
                                        <TableContainer style={{ width: "100%" }}>
                                            <Table>
                                                <TableHead>
                                                    <TableCell>Job Description:</TableCell>
                                                    <TableCell>Responsibilities:</TableCell>
                                                </TableHead>
                                                <TableBody>
                                                    <StyledTableRow>
                                                        <TableCell>{confirmedInterviewDetails?.[0]?.job_application?.requisition?.job_description}</TableCell>
                                                        <TableCell>{confirmedInterviewDetails?.[0]?.job_application?.requisition?.responsibilities}</TableCell>
                                                    </StyledTableRow>
                                                </TableBody>
                                                <TableHead>
                                                    <TableCell>Must Have Technologies:</TableCell>
                                                    <TableCell>Good To Have Technologies:</TableCell>
                                                </TableHead>
                                                <TableBody>
                                                    <StyledTableRow>
                                                        <TableCell>{confirmedInterviewDetails?.[0]?.job_application?.requisition?.primary_technology?.map((obj, index) => (index ? ', ': '') + obj.technology_name)}</TableCell>
                                                        <TableCell>{confirmedInterviewDetails?.[0]?.job_application?.requisition?.other_technology?.map((obj, index) => (index ? ', ': '') + obj.technology_name)}</TableCell>
                                                    </StyledTableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Typography variant="h4" color="#f05e0a" sx={{ mt: 2 }}>You do not have any scheduled interview !</Typography>
                            )
                        ): (
                            <Typography variant="h4" color="#f05e0a" sx={{ mt: 2 }}>You do not have any ongoing job application !</Typography>
                        )
                    )}
            </Container>
        </Page>
    )
}