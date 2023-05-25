import axios from 'axios';
import Page from '../../Page';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import {Link as RouterLink, useParams} from 'react-router-dom';
import CandidateTimeline from '../candidate/CandidateTimeline';
import { Card, CardContent, Container, Link, Stack, Table, TableContainer, TableRow, 
    TableHead, TableBody, TableCell, tableCellClasses, Typography } from '@mui/material';
import * as constants from 'src/utils/constants';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.body}`]: {
        backgroundColor: '#514b4c',
        color: theme.palette.common.white,
        fontWeight: 'bold'
    },
    [`&.${tableCellClasses.head}`]: {
        fontSize: 14,
    },
}));
    
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function EditJobApplication() {
    const { id } = useParams(); 
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

    const candidateTechnologies = []
    const candidateLocations = []
    const previousJobApplication = []
  
    jobApplicationData?.resume?.candidate?.technology.forEach((technology, index) => {
        candidateTechnologies.push((index ? ', ': '') + technology.technology_name)
      });

    jobApplicationData?.resume?.candidate?.preferred_location.forEach((location, index) => {
    candidateLocations.push((index ? ', ': '') + location.office_location);
    });

    jobApplicationData?.resume?.candidate?.job_application.forEach((application) => {
        if (application.id != id) {
            previousJobApplication.push({"id": application.id, "selected": application.is_candidate_selected ? "Selected": "Rejected"})
        }
    })

    return (
        <Page title="Candidates">
            <Container  maxWidth="xl" sx={{ mt:0 }} >
                <Stack direction={{ xs: "column", sm: "row" }} spacing={72} sx={{ mb: 2 }}>
                    <Link to="/resumeX/job-application"
                        color="green"
                        underline="hover"
                        component={RouterLink}
                        fontSize="20px"> 
                            <ArrowCircleLeftIcon fontSize="large" />
                    </Link>

                    {/* <Typography variant="h4" align="center">
                        Candidate Timeline
                    </Typography> */}

                    <h2 align="center" style={{fontSize: '25px', fontWeight: '800', marginBottom: '30px'}}>Candidate Timeline</h2>
                </Stack>

                <Card sx={{mt: 2}} variant="outlined" style={{ border: "none", boxShadow: "none" }}>
                    {/* <CardContent sx={{mb: -5}}>
                        <Typography variant="h6" color="text.secondary" >
                            Personal Details
                        </Typography>
                    </CardContent> */}
                    <CardContent>
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
                                    <StyledTableCell>Name</StyledTableCell>
                                    <TableCell>{jobApplicationData?.resume?.candidate?.user?.first_name + " " + jobApplicationData?.resume?.candidate?.user?.last_name}</TableCell>
                                    <StyledTableCell>Experience</StyledTableCell>
                                    <TableCell>{jobApplicationData?.resume?.candidate?.total_experience} Years</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell>Mobile No.</StyledTableCell>
                                    <TableCell>{jobApplicationData?.resume?.candidate?.user?.mobile}</TableCell>
                                    <StyledTableCell>Notice Period</StyledTableCell>
                                    <TableCell>{jobApplicationData?.resume?.candidate?.notice_period?.notice_period}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell>Gender</StyledTableCell>
                                    <TableCell>{jobApplicationData?.resume?.candidate?.gender}</TableCell>
                                    <StyledTableCell>Current Location</StyledTableCell>
                                    <TableCell>{jobApplicationData?.resume?.candidate?.current_location}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell>DoB</StyledTableCell>
                                    <TableCell>{jobApplicationData?.resume?.candidate?.dob}</TableCell>
                                    <StyledTableCell>Current CTC</StyledTableCell>
                                    <TableCell>{jobApplicationData?.resume?.candidate?.current_ctc} LPA</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell>Email</StyledTableCell>
                                    <TableCell>{jobApplicationData?.resume?.candidate?.user?.email}</TableCell>
                                    <StyledTableCell>Expected CTC</StyledTableCell>
                                    <TableCell>{jobApplicationData?.resume?.candidate?.expected_ctc} LPA</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell>Technology</StyledTableCell>
                                    <TableCell>{candidateTechnologies}</TableCell>
                                    <StyledTableCell>Preferred Location</StyledTableCell>
                                    <TableCell>{candidateLocations}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell>Resume</StyledTableCell>
                                    <TableCell><a href={jobApplicationData?.resume?.resume} target="_blank" style={{color: "green", fontWeight: "bold"}}>{jobApplicationData?.resume?.resume?.split('/')[5]}</a></TableCell>
                                    <StyledTableCell>Applied For</StyledTableCell>
                                    <TableCell>{jobApplicationData?.requisition?.requisite_number + " | " + jobApplicationData?.requisition?.job_name + " | " + jobApplicationData?.requisition?.job_category}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell>Previous Job Application</StyledTableCell>
                                    <TableCell>
                                    {previousJobApplication.length ? (
                                        previousJobApplication.map((data) => 
                                        <b style={{color: data.selected == "Selected" ? "green" : "red"}}>
                                            <a href={"/resumeX/job-application/edit/" + data.id} style={{color: "green"}}>
                                                {"/resumeX/job-application/edit/" + data.id}
                                            </a>
                                            {data.selected}<br></br></b>)
                                            ) : (<b style={{color: "red"}}>None</b>)}
                                    </TableCell>
                                    <StyledTableCell>Source</StyledTableCell>
                                    <TableCell>{jobApplicationData?.resume?.candidate?.source?.source}</TableCell>
                                </StyledTableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    </CardContent>
                </Card>

                <CandidateTimeline></CandidateTimeline>

            </Container>
        </Page>
    )
}