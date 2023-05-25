import axios from 'axios';
import {useSnackbar} from 'notistack';
import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Dialog, DialogContent, DialogActions, Stack, TextField, Typography } from '@mui/material';
import * as constants from 'src/utils/constants';

export default function ScreeningRoundResult (props) {
    const { enqueueSnackbar} = useSnackbar();

    // HR Schedule Interview Result Dialog
    const [hrScheduleInterviewResultOpen, setHrScheduleInterviewResultOpen] = useState(false)

    // Mark HR Interview as Completed flag state
    const [hrInterviewChecked, setHrInterviewChecked] = React.useState();

    const handleHrInterviewCheckedChange = event =>{
        setHrInterviewChecked(event.target.checked);
    };

    const HrRoundData = props?.jobApplicationData?.interview_details?.filter(item => {
        return item.interview_round === 'SCREENING_ROUND'
    })

    const [hrRoundResult, setHrRoundResult] = useState("")

    const handleHrRoundResult = event => {
        const confirmed_interview_id = props?.jobApplicationData?.interview_details?.[0]?.id

        setHrScheduleInterviewResultOpen(false)
        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
          }
        const data = {
            "is_interview_completed": hrInterviewChecked,
            "is_hr_interview_completed": hrInterviewChecked,
            "interview_feedback": hrRoundResult, 

            "interview_recording_notes":  HrRoundData?.[0]?.interview_recording_notes
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
        setHrInterviewChecked(HrRoundData?.[0]?.interview_status === "COMPLETED")
        setHrRoundResult(HrRoundData?.[0]?.interview_feedback)
    }, [
        HrRoundData?.[0]?.interview_status === "COMPLETED", 
        HrRoundData?.[0]?.interview_feedback,
    ])

    return (
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right">
            <Button variant="contained"
                size="small"
                color="error"
                style={{width: "150px"}}
                onClick={() => setHrScheduleInterviewResultOpen(true)}
                // disabled={props?.jobApplicationData?.resume?.candidate?.source?.source === 'HRPORTAL' || props?.jobApplicationData?.is_hr_interview_mail_sent!=true || HrRoundData?.length === 0}
                disabled={props?.jobApplicationData?.resume?.candidate?.source?.source === 'HRPORTAL' || HrRoundData?.length === 0}
                >
                    Interview Result
            </Button>
                <Dialog open={hrScheduleInterviewResultOpen} onClose={() => setHrScheduleInterviewResultOpen(false)}>
                        <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                            Screening Round Result
                        </Typography>
                        <DialogContent>
                            Is candidate selected for the next round ?
                            <Checkbox checked={hrInterviewChecked} onChange={handleHrInterviewCheckedChange} required/>
                            {hrInterviewChecked ? <b style={{color:"green"}}>Selected</b> : <b style={{color:"red"}}>Rejected</b>}
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
                            defaultValue={hrRoundResult}
                            onChange={(event) => setHrRoundResult(event.target.value)}
                        />
                        </DialogContent>
                        <DialogActions style={{justifyContent: "center", paddingTop: '15px', paddingBottom: '15px'}}>
                            <Button variant="contained" color="error" size="medium" onClick={handleHrRoundResult}>Submit</Button>
                        </DialogActions>
                </Dialog>
        </Stack>
    )
}