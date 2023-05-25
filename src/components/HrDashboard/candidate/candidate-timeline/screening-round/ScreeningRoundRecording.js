import axios from 'axios';
import {useSnackbar} from 'notistack';
import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogContent, Stack, TextField, Typography } from '@mui/material';
import * as constants from 'src/utils/constants';

export default function ScreeningRoundRecording(props) {
    const { enqueueSnackbar} = useSnackbar();
    
    // Open HR Interview Recording
    const [openHrInterviewRecording, setOpenHrInterviewRecording] = useState(false)

    // HR Interview Recording State
    const [hrInterviewRecording, setHrInterviewRecording] = useState("")
    
    const HrRoundData = props?.jobApplicationData?.interview_details?.filter(item => {
        return item.interview_round === 'SCREENING_ROUND'
    })

    const [hrInterviewRecordingNotes, setHrInterviewRecordingNotes] = useState("")

    const handleHrInterviewRecording = () => {
        setOpenHrInterviewRecording(true)

        if (props?.jobApplicationData?.resume?.candidate?.source?.source === 'HRPORTAL') {
            setHrInterviewRecording(props?.jobApplicationData?.resume?.candidate?.initial_recording)
        }
        else {
            const headers = {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
            }

            const data = {"id": HrRoundData?.[0]?.id}

            axios.post(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/interview-recording/', data, {headers})
            .then(function (response) {
                if (response.status === 200) {
                    setHrInterviewRecording(response.data.data)
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
        }
    }

    const handleHrRoundResult = event => {
        const confirmed_interview_id = props?.jobApplicationData?.interview_details?.[0]?.id

        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
        }

        const data = {
            "is_interview_completed": HrRoundData?.[0].interview_status === "COMPLETED",
            "is_hr_interview_completed": HrRoundData?.[0].interview_status === "COMPLETED",
            "interview_feedback": HrRoundData?.[0].interview_feedback, 

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

    // set initial values
    useEffect(() => {
        setHrInterviewRecordingNotes(HrRoundData?.[0]?.interview_recording_notes)
    }, [
        HrRoundData?.[0]?.interview_recording_notes,
    ])

    return (
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right">
            <Button 
                variant="contained" 
                size="small" 
                color="error"
                style={{width: "150px"}}
                // disabled={props?.jobApplicationData?.is_hr_interview_mail_sent!=true || HrRoundData?.length === 0}
                disabled={HrRoundData?.length === 0}
                onClick={handleHrInterviewRecording}
                >
                    Interview Recording
            </Button>

            <Dialog fullWidth maxWidth="lg" open={openHrInterviewRecording} onClose={() => setOpenHrInterviewRecording(false)}>
                <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                    Screening Round Interview Recording
                </Typography>

                {hrInterviewRecording !== "Not Available" ? ( 
                <DialogContent>
                <div>
                    <table style={{width: "100%"}}>
                        <tr>
                            <td style={{width: "70%"}}>
                            <iframe width="100%" height="550"
                                src={hrInterviewRecording}
                            ></iframe>
                            </td>
                            <td style={{width: "3%"}}></td>

                            {/* if candidate came from portal then only show the recording notes textfield */}

                            {props?.jobApplicationData?.resume?.candidate?.source?.source != 'HRPORTAL' &&
                            <td>
                                <TextField
                                    fullWidth
                                    label="Notes"
                                    style={{ height: 500 }}
                                    multiline
                                    rows={19}
                                    maxRows={4}
                                    defaultValue={hrInterviewRecordingNotes}
                                    onChange={(event) => setHrInterviewRecordingNotes(event.target.value)}
                                />
                                <Button 
                                    variant="contained" 
                                    size="medium" 
                                    color="error"
                                    style={{left: "35%"}}
                                    onClick={handleHrRoundResult}
                                >
                                    Submit Notes
                                </Button>
                            </td>
                            }
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