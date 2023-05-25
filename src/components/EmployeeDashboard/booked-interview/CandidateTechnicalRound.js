import axios from 'axios';
import {useSnackbar} from 'notistack';
import { React, useState } from "react";
import { Button, Card, CardContent, Checkbox, Dialog, DialogContent, DialogActions, Typography, TextField } from '@mui/material';
import * as constants from 'src/utils/constants';

export default function CandidateTechnicalRound(props) {
    const { enqueueSnackbar} = useSnackbar();

    // Open submit result dialog box
    const [openSubmitResultDialog, setOpenSubmitResultDialog] = useState(false)

    const [tempConfirmedInterviewId, setTempConfirmedInterviewId] = useState("")

    const handleTempConfirmedInterviewId = (props) => {
        setOpenSubmitResultDialog(true)
        setTempConfirmedInterviewId(props.id)
    }

    // Mark Technical Interview as Completed flag state
    const [technicalInterviewChecked, setTechnicalInterviewChecked] = useState(false);

    const [technicalRoundResult, setTechnicalRoundResult] = useState("")

    const handleTechnicalRoundResult = () => {
        const confirmed_interview_id = tempConfirmedInterviewId

        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
            }

        const data = {"is_interview_completed": technicalInterviewChecked, "interview_feedback": technicalRoundResult}

        axios.put(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/confirmed-interviews/' + confirmed_interview_id + '/', data, {headers})
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
            window.location.reload(false);
            }
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }

    return(
        <Card variant="outlined" align="left" sx={{width: 500, mb:5}}>
        <CardContent>
            <Typography align="center" variant="h6" color="#00AB55" gutterBottom>
                Interview Details
            </Typography>
            <CardContent>
                    <b>Status: {props?.status=="COMPLETED" ? <b style={{color: 'green'}}>Completed</b>: <b style={{color: '#c7291e'}}>Pending</b>}</b>
                    <br></br>
                    <br></br>
                <b>Candidate: </b>{props?.candidateName}
                <br></br>
                <br></br>
                <b>Technology:</b> {props?.employeeData?.interview_tech?.technology_name}
                <br></br>
                <br></br>
                <b>Date:</b> {new Date(props?.start).toLocaleString("en-In", { year: 'numeric', month: '2-digit', day: '2-digit',})}
                <br></br>
                <br></br>
                <b>Time: </b> 
                    {new Date(props?.start).toLocaleTimeString("en-In", { hour12: false, hour: '2-digit', minute:'2-digit' })}
                    &nbsp; to &nbsp;
                    {new Date(props?.end).toLocaleTimeString("en-In", { hour12: false, hour: '2-digit', minute:'2-digit' })}
                <br></br>
                <br></br>
                <b>Interview Link: </b> <a style={{color: "darkblue"}} href={props?.link}>Click here to join</a>
                <br></br>
                <br></br>
                <br></br>
                <Button variant="contained" size="small" color="error" style={{fontWeight: 'bold'}} onClick={() => handleTempConfirmedInterviewId({'id': props?.id})}>Submit Result</Button>
                <Dialog open={openSubmitResultDialog} onClose={() => setOpenSubmitResultDialog(false)}>
                    <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                        Technical Round Result
                    </Typography>
                    <DialogContent>
                        Mark Technical Interview as Completed:
                        <Checkbox checked={technicalInterviewChecked} onChange={(event) => setTechnicalInterviewChecked(event.target.checked)} required/>
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
                        maxRows={4}
                        // defaultValue={technicalRoundResult}
                        onChange={(event) => setTechnicalRoundResult(event.target.value)}
                    />
                    </DialogContent>
                    <DialogActions style={{justifyContent: "center", paddingTop: '15px', paddingBottom: '15px'}}>
                        <Button variant="contained" color="error" size="medium" onClick={() => handleTechnicalRoundResult()}>Submit</Button>
                    </DialogActions>
                </Dialog>
            </CardContent>
        </CardContent>
    </Card>
    )
}