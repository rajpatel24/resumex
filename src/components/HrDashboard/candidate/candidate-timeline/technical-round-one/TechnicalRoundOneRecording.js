import axios from 'axios';
import {useSnackbar} from 'notistack';
import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogContent, Stack, TextField, Typography } from '@mui/material';
import * as constants from 'src/utils/constants';

export default function TechnicalRoundOneRecording(props) {
    const { enqueueSnackbar} = useSnackbar();

    // Technical Interview Recording State
    const [technicalInterviewRecording, setTechnicalInterviewRecording] = useState("")

    // Open Technical Interview Recording
    const [openTechnicalInterviewRecording, setOpenTechnicalInterviewRecording] = useState(false)

    const [technicalInterviewRecordingNotes, setTechnicalInterviewRecordingNotes] = useState("")

    const TechnicalRoundData = props?.jobApplicationData?.interview_details?.filter(item => {
        return item.interview_round === 'TECHNICAL_ROUND_ONE'
    })

    const handleTechnicalInterviewRecording = () => {
        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
        }

        const data = {"id": TechnicalRoundData?.[0]?.id}

        axios.post(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/interview-recording/', data, {headers})
        .then(function (response) {
          if (response.status === 200) {
            setTechnicalInterviewRecording(response.data.data)
            setOpenTechnicalInterviewRecording(true)
          }
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }

    const handleTechnicalRoundOneRecordingNotes = event => {
        const confirmed_interview_id = TechnicalRoundData?.[0].id

        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
        }

        const data = {
            "is_interview_completed":  TechnicalRoundData?.[0].interview_status === "COMPLETED",
            "is_technical_interview_one_completed":  TechnicalRoundData?.[0].interview_status === "COMPLETED",
            "interview_feedback": TechnicalRoundData?.[0].interview_feedback,

            "interview_recording_notes": technicalInterviewRecordingNotes
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
        setTechnicalInterviewRecordingNotes(TechnicalRoundData?.[0]?.interview_recording_notes)
    }, [
        TechnicalRoundData?.[0]?.interview_recording_notes,
    ])

    return (
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right">
            <Button 
                variant="contained" 
                size="small" 
                color="error" 
                style={{width: "150px"}}
                onClick={handleTechnicalInterviewRecording}
                disabled={(props?.jobApplicationData?.is_hr_interview_completed!==true)}>
                Interview Recording
            </Button>

            <Dialog fullWidth maxWidth="lg" open={openTechnicalInterviewRecording} onClose={() => setOpenTechnicalInterviewRecording(false)}>
                <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                    Technical Round-1 Interview Recording
                </Typography>

                {technicalInterviewRecording !== "Not Available" ? ( 
                <DialogContent>
                <div>
                    <table style={{width: "100%"}}>
                        <tr>
                            <td style={{width: "70%"}}>
                            <iframe width="100%" height="550"
                                src={technicalInterviewRecording}
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
                                defaultValue={technicalInterviewRecordingNotes}
                                onChange={(event) => setTechnicalInterviewRecordingNotes(event.target.value)}
                            />
                            <Button 
                                variant="contained" 
                                size="medium" 
                                color="error"
                                style={{left: "35%"}}
                                onClick={handleTechnicalRoundOneRecordingNotes}
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