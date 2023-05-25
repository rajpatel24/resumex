import axios from 'axios';
import {useSnackbar} from 'notistack';
import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogContent, Stack, TextField, Typography } from '@mui/material';
import * as constants from 'src/utils/constants';

export default function CTORoundRecording(props) {
    const { enqueueSnackbar} = useSnackbar();

    // Technical Interview Recording State
    const [CTORoundRecording, setCTORoundRecording] = useState("")

    // Open Technical Interview Recording
    const [openCTORoundRecording, setOpenCTORoundRecording] = useState(false)

    const [ctoRoundRecordingNotes, setCTORoundRecordingNotes] = useState("")

    const CTORoundData = props?.jobApplicationData?.interview_details?.filter(item => {
        return item.interview_round === 'CTO_ROUND'
    })

    const handleCTOInterviewRecording = () => {
        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
        }

        const data = {"id": CTORoundData?.[0]?.id}

        axios.post(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/interview-recording/', data, {headers})
        .then(function (response) {
          if (response.status === 200) {
            setCTORoundRecording(response.data.data)
            setOpenCTORoundRecording(true)
          }
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }

    const handleCTORoundRecordingNotes = event => {
        const confirmed_interview_id = CTORoundData?.[0].id

        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
        }

        const data = {
            "is_interview_completed":  CTORoundData?.[0].interview_status === "COMPLETED",
            // "is_technical_interview_two_completed":  CTORoundData?.[0].interview_status === "COMPLETED",
            "interview_feedback": CTORoundData?.[0].interview_feedback,

            "interview_recording_notes": ctoRoundRecordingNotes
        }
        axios.put(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/confirmed-interviews/' + confirmed_interview_id + '/', data, {headers})
        .then(function (response) {
          if (response.status === 200) {
            enqueueSnackbar("Recording Notes Submitted Successfully !!", {
              anchorOrigin: {
                              vertical: 'top',
                              horizontal: 'right',
                            },
              variant: 'success',
              autoHideDuration: 2000,
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
        setCTORoundRecordingNotes(CTORoundData?.[0]?.interview_recording_notes)
    }, [
        CTORoundData?.[0]?.interview_recording_notes,
    ])

    return (
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right">
            <Button 
                variant="contained" 
                size="small" 
                color="error" 
                style={{width: "150px"}}
                onClick={handleCTOInterviewRecording}
                disabled={(props?.jobApplicationData?.is_hr_interview_completed!==true)}>
                Interview Recording
            </Button>

            <Dialog fullWidth maxWidth="lg" open={openCTORoundRecording} onClose={() => setOpenCTORoundRecording(false)}>
                <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                    CTO / Manager / HR Interview Recording
                </Typography>

                {CTORoundRecording !== "Not Available" ? ( 
                <DialogContent>
                <div>
                    <table style={{width: "100%"}}>
                        <tr>
                            <td style={{width: "70%"}}>
                            <iframe width="100%" height="550"
                                src={CTORoundRecording}
                            ></iframe>
                            </td>
                            <td style={{width: "3%"}}></td>
                            <td>
                            <TextField
                                fullWidth
                                label="Notes"
                                style={{ height: 500 }}
                                multiline
                                rows={19}
                                maxRows={4}
                                defaultValue={ctoRoundRecordingNotes}
                                onChange={(event) => setCTORoundRecordingNotes(event.target.value)}
                            />
                            <Button 
                                variant="contained" 
                                size="medium" 
                                color="error"
                                style={{left: "35%"}}
                                onClick={handleCTORoundRecordingNotes}
                            >
                                Submit Notes
                            </Button>
                            </td>
                        </tr>
                    </table>
                </div>
                </DialogContent>
                ) : (
                <DialogContent align="center">
                    <b>No Recordings Available! &nbsp; Please try again in sometime.</b>
                </DialogContent>   
                )}
            </Dialog>
        </Stack>
    )
}