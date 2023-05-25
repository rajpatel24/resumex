import axios from 'axios';
import {useSnackbar} from 'notistack';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, Rating, Stack, Table, TableContainer, TableRow, TableHead, TextField, TableBody, TableCell, Typography } from '@mui/material';
import * as constants from 'src/utils/constants';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function CTORoundResult(props) {
    const { enqueueSnackbar} = useSnackbar();

    // Technical Schedule Interview Result Dialog
    const [ctoScheduleInterviewResultOpen, setCTOScheduleInterviewResultOpen] = useState(false)

    // Mark Technical Interview as Completed flag state
    const [ctoInterviewChecked, setCTOInterviewChecked] = React.useState();

    const [ctoRoundResult, setCTORoundResult] = useState("")

    const CTORoundData = props?.jobApplicationData?.interview_details?.filter(item => {
        return item.interview_round === 'CTO_ROUND'
    })

    const handleTechnicalRoundOneResult = event => {
        const confirmed_interview_id = CTORoundData?.[0].id

        setCTOScheduleInterviewResultOpen(false)
        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
          }

        const data = {
            "is_interview_completed": ctoInterviewChecked,
            // "is_technical_interview_two_completed": ctoInterviewChecked,
            "interview_feedback": ctoRoundResult, 

            "interview_recording_notes": CTORoundData?.[0].interview_recording_notes
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

    // set initial values
    useEffect(() => {
        setCTOInterviewChecked(CTORoundData?.[0]?.interview_status === "COMPLETED")
        setCTORoundResult(CTORoundData?.[0]?.interview_feedback)
    }, [
        CTORoundData?.[0]?.interview_status === "COMPLETED", 
        CTORoundData?.[0]?.interview_feedback,
    ])

    return (
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right">
            <Button 
            variant="contained" 
            size="small" color="error" 
            style={{width: "150px"}}
            onClick={() => setCTOScheduleInterviewResultOpen(true)}
            disabled={props?.jobApplicationData?.is_hr_interview_completed!==true}
            >Interview Result</Button>

            <Dialog open={ctoScheduleInterviewResultOpen} onClose={() => setCTOScheduleInterviewResultOpen(false)} maxWidth="md">
                <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                    CTO / Manager / HR Round Result
                </Typography>
                <DialogContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableHead>
                            <TableBody>
                                <StyledTableRow>
                                    <TableCell><b>Candidate's Strong Areas:</b></TableCell>
                                    <TableCell>{CTORoundData?.[0]?.candidate_strong_areas}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Candidate's Weak Areas:</b></TableCell>
                                    <TableCell>{CTORoundData?.[0]?.candidate_weak_areas}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Skills Rating:</b></TableCell>
                                    <TableCell>
                                        {CTORoundData?.[0]?.skills_rating.map(item => 
                                        <TableRow>
                                            <TableCell padding="none">{item.skill}:</TableCell>
                                            <TableCell>
                                            <Rating
                                                name="hover-feedback"
                                                value={item.rating}
                                                readOnly
                                            />
                                            </TableCell>
                                        </TableRow>
                                        )}
                                    </TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Training Areas:</b></TableCell>
                                    <TableCell>
                                        {CTORoundData?.[0]?.training_areas.map(item => 
                                        <TableRow>
                                            <TableCell padding="none">{item.skill}:</TableCell>
                                            <TableCell>{item.duration}</TableCell>
                                        </TableRow>
                                        )}
                                    </TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Fit for BU:</b></TableCell>
                                    <TableCell>{CTORoundData?.[0]?.fit_bu}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Fit for Project:</b></TableCell>
                                    <TableCell>{CTORoundData?.[0]?.fit_project}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Fit for Level:</b></TableCell>
                                    <TableCell>{CTORoundData?.[0]?.fit_level}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Interview Feedback:</b></TableCell>
                                    <TableCell>{CTORoundData?.[0]?.interview_feedback}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Is candidate selected?:</b></TableCell>
                                    <TableCell>
                                    {CTORoundData?.[0]?.candidate_eligibility ? <b style={{color:"green"}}>Selected</b> : <b style={{color:"red"}}>Rejected</b>}
                                    </TableCell>
                                </StyledTableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        </Stack>
    )
}