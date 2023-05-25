import axios from 'axios';
import * as Yup from "yup";
import {useSnackbar} from 'notistack';
import { LoadingButton } from "@mui/lab";
import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import { Button, Dialog, DialogContent, DialogActions, MenuItem, Stack, TextField, Typography } from '@mui/material';
import * as constants from 'src/utils/constants';
import { Form, FormikProvider, useFormik } from "formik";

export default function ScheduleTechnicalRoundTwo(props) {
    const { id } = useParams();

    const { enqueueSnackbar} = useSnackbar();

    // Technical Schedule Interview Dialog
    const [technicalScheduleInterviewOpen, setTechnicalScheduleInterviewOpen] = useState(false)

    const TechnicalRoundData = props?.jobApplicationData?.interview_details?.filter(item => {
        return item.interview_round === 'TECHNICAL_ROUND_TWO'
    })

    const [employeeData, setEmployeeData] = useState([])

    const getEmployeeData = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/employee', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setEmployeeData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
      };

    const TechnologyWiseEmployee = employeeData.filter(item => {
        return item.interview_tech.id === props?.jobApplicationData?.requisition?.tech_stack?.id
    })

    useEffect(() => {
        getEmployeeData()
    }, [])

    const handleScheduleInterview = event => {
        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
        }

        const data = {"job_application_id": id, "interview_round": "Technical Round-2"}

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

    const SelectEmployeeSchema = Yup.object().shape({
        employee: Yup.string()
          .required("Employee is required"),
        startDate: Yup.string()
        .required("Interview start datetime is required"),
        duration: Yup.string()
        .required("Interview duration is required"),
      });
      const formik = useFormik({
        initialValues: {
            employee: '',
            startDate: '',
            duration: 60
        },
        validationSchema: SelectEmployeeSchema,
        onSubmit: (formValues) => {
            const headers = {
                'Authorization': `Token ${localStorage.getItem('authToken')}`
            }

            // Add meeting duration minuts and 5.30 Hrs to convert in Indian time
            var endDatetime = new Date(formValues.startDate)
            endDatetime.setHours(endDatetime.getHours()+5,endDatetime.getMinutes()+30+formValues.duration,0,0)

            const data = {
                employee_id: formValues.employee,
                candidate_id: props.jobApplicationData.resume.candidate.id,
                job_application_id: props.jobApplicationData.id,
                start_date: formValues.startDate,
                end_date: endDatetime.toISOString().slice(0, 19),
                intv_round: "TECHNICAL_ROUND_TWO",
                interview_status: "CONFIRMED"
            }

            axios.post(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + "/api/v1/confirmed-interviews/", data, {headers})
            .then(function (response) {
                if (response.status === 200) {
                    enqueueSnackbar("Interview has been scheduled !!", {
                        anchorOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right',
                                      },
                        variant: 'success',
                        autoHideDuration: 1500,
                      });
                      setTechnicalScheduleInterviewOpen(false)
                      window.location.reload(false);                    
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
        }
      });    

    const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setSubmitting } = formik;

    return (
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right">
            <Button 
                variant="contained" 
                size="small" color="error" 
                style={{width: "150px"}}
                onClick={() => setTechnicalScheduleInterviewOpen(true)}
                disabled={props?.jobApplicationData?.is_hr_interview_completed!==true}
                >
                Schedule Interview
            </Button>

            {/* ====================================================================================================== */}
            {/* -------------------- Technical Schedule Interview Dialog -------------------- */}
            {/* {TechnicalRoundData?.length > 0 ? (
                <Dialog open={technicalScheduleInterviewOpen} onClose={() => setTechnicalScheduleInterviewOpen(false)}>
                    <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                        Schedule Interview for Technical Round 2
                    </Typography>
                    <DialogContent>
                        Interview has already been scheduled. Below are the interview details:
                    </DialogContent>
                    <DialogContent>
                        <b>Interview Date:</b> <b style={{color: "red"}}>{TechnicalRoundData?.[0]?.start_date.substring(0, 10)}</b>
                        <br></br>
                        <b>Interview Time:</b> <b style={{color: "red"}}>{TechnicalRoundData?.[0]?.start_date.substring(11, 16)}</b> to <b style={{color: "red"}}>{TechnicalRoundData?.[0]?.end_date.substring(11, 16)}</b>
                        <br></br><br></br>
                        <b>Interview Link:</b> <a href={TechnicalRoundData?.[0]?.interview_moderator_link}>Click here to join</a>
                    </DialogContent>
                    <DialogActions style={{justifyContent: "center", paddingTop: '15px', paddingBottom: '15px'}}>
                        <Button variant="contained" color="error" size="medium" disabled>Schedule Interview</Button>
                    </DialogActions>
                </Dialog>
            ) : (
                <Dialog open={technicalScheduleInterviewOpen} onClose={() => setTechnicalScheduleInterviewOpen(false)}>
                    <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                        Schedule Interview for Technical Round 2
                    </Typography>

                    {props?.jobApplicationData?.is_technical_interview_two_mail_sent ? (
                        
                    <DialogContent>
                        <b>Awaiting for candidate's response.</b>
                        <br></br> <br></br>
                        An email has already been sent to the candidate asking him to choose interview slot!
                    </DialogContent>
                    ) : (
                    <DialogContent>
                        An email will be sent to the candidate asking him/her to choose a slot for the interview.
                        <br></br> <br></br>
                        Before pressing the "Schedule Interview" button, Please make sure employee has given slots for the Interview!
                    </DialogContent>
                    )}
                    <DialogActions style={{justifyContent: "center", paddingTop: '15px'}}>
                        <Button variant="contained" color="error" size="medium" onClick={handleScheduleInterview} disabled={props?.jobApplicationData?.is_technical_interview_two_mail_sent && true}>Schedule Interview</Button>
                    </DialogActions>
                </Dialog>
            )}                             */}
            {/* ====================================================================================================== */}

            {TechnicalRoundData?.length > 0 ? (
                <Dialog open={technicalScheduleInterviewOpen} onClose={() => setTechnicalScheduleInterviewOpen(false)}>
                    <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                        Schedule Interview for Technical Round-2
                    </Typography>
                    <DialogContent>
                        Interview has already been scheduled. Below are the interview details:
                    </DialogContent>
                    <DialogContent>
                        <b>Interviewer:</b>&nbsp; <b style={{color: "red"}}>
                            {TechnicalRoundData?.[0]?.employee_name} </b>
                        <br></br>
                        <b>Interview Date:</b>&nbsp; <b style={{color: "red"}}>
                            {new Date(TechnicalRoundData?.[0]?.start_date).toLocaleDateString()} </b>
                        <br></br>
                        <b>Interview Time:</b>&nbsp; <b style={{color: "red"}}>
                            {new Date(TechnicalRoundData?.[0]?.start_date).toLocaleTimeString().substring(0, 5)}
                        </b> 
                            &nbsp; to &nbsp;
                        <b style={{color: "red"}}>
                            {new Date(TechnicalRoundData?.[0]?.end_date).toLocaleTimeString().substring(0, 5)}
                        </b>
                        <br></br><br></br>
                        <b>Interview Link:</b> <a href={TechnicalRoundData?.[0]?.interview_moderator_link}>Click here to join</a>
                    </DialogContent>
                    <DialogActions style={{justifyContent: "center", paddingTop: '15px', paddingBottom: '15px'}}>
                        <Button variant="contained" color="error" size="medium" disabled>Schedule Interview</Button>
                    </DialogActions>
                </Dialog>
            
            ) : (
            
                <Dialog open={technicalScheduleInterviewOpen} onClose={() => setTechnicalScheduleInterviewOpen(false)}>
                <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                    Schedule Interview for Technical Round-2
                </Typography>

                <DialogContent>
                    <FormikProvider value={formik}>
                    <Form autoComplete="off" onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                fullWidth
                                select
                                label="Select Employee"
                                {...getFieldProps("employee")}
                                error={Boolean(touched.employee && errors.employee)}
                                helperText={touched.employee && errors.employee}
                                >
                                {TechnologyWiseEmployee.map((employee) => (
                                <MenuItem key={employee.id} value={employee.id}>{employee.user.first_name + " " + employee.user.last_name}</MenuItem>
                                ))}
                            </TextField>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                fullWidth
                                label="Interview Start Datetime"
                                type="datetime-local"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...getFieldProps("startDate")}
                                error={Boolean(touched.startDate && errors.startDate)}
                                helperText={touched.startDate && errors.startDate}
                            >
                            </TextField>   

                            <TextField
                                fullWidth
                                label="Interview Duration (In Minutes)"
                                type="number"
                                {...getFieldProps("duration")}
                                error={Boolean(touched.duration && errors.duration)}
                                helperText={touched.duration && errors.duration}
                            >
                            </TextField>   
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }}>
                        <LoadingButton
                            fullWidth
                            sx={{ mt: 3}}
                            size="medium"
                            color="error"
                            type="submit"
                            variant="contained"
                            loading={isSubmitting}
                        >
                            Schedule Interview
                        </LoadingButton>
                        </Stack>
                        </Stack>
                    </Form>
                    </FormikProvider>
                </DialogContent>

            </Dialog>
            )}
        </Stack>
    )
}