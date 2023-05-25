import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Checkbox, Dialog, DialogContent, Rating, Stack, Table, TableContainer, TableRow, TableHead, TableBody, TableCell, Typography, TextField } from '@mui/material';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function ReviewFeedback(props) {

    const confirmedInterviewData = props.jobApplicationData?.interview_details?.filter(item => {
        return item.interview_round === 'REVIEW_CANDIDATE'
    })

    // technical review feedback dialog state
    const [technicalReviewFeedbackDialog, setTechnicalReviewFeedbackDialog] = useState(false)
    
    // Mark Technical Review as Completed flag state
    const [technicalReviewChecked, setTechnicalReviewChecked] = React.useState();

    const handleTechnicalReviewCheckedChange = event =>{
        setTechnicalReviewChecked(event.target.checked);
    };

    const [technicalReviewResult, setTechnicalReviewResult] = useState()

    useEffect(() => {
        setTechnicalReviewChecked(confirmedInterviewData?.[0]?.interview_status === "COMPLETED")
        setTechnicalReviewResult(confirmedInterviewData?.[0]?.interview_feedback)
    }, [
        confirmedInterviewData?.[0]?.interview_status === "COMPLETED",
        confirmedInterviewData?.[0]?.interview_feedback
    ])
    return(
        <Stack>
            <Button 
            variant="contained" 
            size="small" 
            color="success" 
            style={{width: "150px"}} 
            onClick={() => setTechnicalReviewFeedbackDialog(true)}
            disabled={props?.jobApplicationData?.is_hr_interview_completed!==true}
            >Review Feedback</Button>

            <Dialog open={technicalReviewFeedbackDialog} onClose={() => setTechnicalReviewFeedbackDialog(false)}>
            <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                Technical Review Result
            </Typography>
            {/* <DialogContent>
                Mark Technical Review as Completed:
                <Checkbox checked={technicalReviewChecked} onChange={handleTechnicalReviewCheckedChange} required/>
            </DialogContent>
            <DialogContent>
                Please give interview result below:
            </DialogContent>
            <DialogContent>
            <TextField
                fullWidth
                label="Result"
                style={{ width: 500 }}
                multiline
                rows={6}
                defaultValue={technicalReviewResult}
                onChange={(event) => setTechnicalReviewResult(event.target.value)}
            />
            </DialogContent> */}
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
                                    <TableCell>{confirmedInterviewData?.[0]?.candidate_strong_areas}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Candidate's Weak Areas:</b></TableCell>
                                    <TableCell>{confirmedInterviewData?.[0]?.candidate_weak_areas}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Skills Rating:</b></TableCell>
                                    <TableCell>
                                        {confirmedInterviewData?.[0]?.skills_rating.map(item => 
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
                                        {confirmedInterviewData?.[0]?.training_areas.map(item => 
                                        <TableRow>
                                            <TableCell padding="none">{item.skill}:</TableCell>
                                            <TableCell>{item.duration}</TableCell>
                                        </TableRow>
                                        )}
                                    </TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Fit for BU:</b></TableCell>
                                    <TableCell>{confirmedInterviewData?.[0]?.fit_bu}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Fit for Project:</b></TableCell>
                                    <TableCell>{confirmedInterviewData?.[0]?.fit_project}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Fit for Level:</b></TableCell>
                                    <TableCell>{confirmedInterviewData?.[0]?.fit_level}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Interview Feedback:</b></TableCell>
                                    <TableCell>{confirmedInterviewData?.[0]?.interview_feedback}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Interview Round Result:</b></TableCell>
                                    <TableCell>
                                    {confirmedInterviewData?.[0]?.candidate_eligibility ? <b style={{color:"green"}}>Selected</b> : <b style={{color:"red"}}>Rejected</b>}
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