import axios from 'axios';
import * as Yup from "yup";
import {useSnackbar} from 'notistack';
import { LoadingButton } from "@mui/lab";
import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import { Button, Dialog, DialogContent, DialogActions, MenuItem, Stack, TextField, Typography } from '@mui/material';
import * as constants from 'src/utils/constants';
import { Form, FormikProvider, useFormik } from "formik";

export default function ScheduleScreeningRound(props) {
    const { id } = useParams();

    const { enqueueSnackbar} = useSnackbar();

    // HR Schedule Interview Dialog
    const [hrScheduleInterviewOpen, setHrScheduleInterviewOpen] = useState(false)

    const HrRoundData = props?.jobApplicationData?.interview_details?.filter(item => {
        return item.interview_round === 'SCREENING_ROUND'
    })

    const [employeeData, setEmployeeData] = useState([])

    const getEmployeeData = (data) => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/employee', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setEmployeeData(response.data.data)

            let defaultEmployee = response.data.data.filter(item => {
                return item.user.pk === data
            })
            handleChange("employee")(`${defaultEmployee[0].id}`)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };

    const TechnologyWiseEmployee = employeeData.filter(item => {
        return item.interview_tech.id === props?.jobApplicationData?.requisition?.tech_stack?.id
    })

    useEffect(() => {
        getEmployeeData(props?.jobApplicationData?.drm_user?.user?.pk)
    }, [props?.jobApplicationData?.drm_user?.user?.pk])

    const handleScheduleInterview = event => {
        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
        }

        const data = {"job_application_id": id}

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

    const ScheduleScreeningRoundSchema = Yup.object().shape({
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
        validationSchema: ScheduleScreeningRoundSchema,
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
                intv_round: "SCREENING_ROUND",
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
                      setHrScheduleInterviewOpen(false)
                      window.location.reload(false);                    
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
        }
    });  

    const { errors, touched, handleChange, handleSubmit, isSubmitting, getFieldProps } = formik;

    return (
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="right">
            <Button variant="contained"
                size="small"
                color="error"
                style={{width: "150px"}}
                onClick={() => setHrScheduleInterviewOpen(true)}
                disabled={props?.jobApplicationData?.resume?.candidate?.source?.source === 'HRPORTAL'}
            >
                Schedule Interview
            </Button>
            
            {/* ============================================================================================================== */}
            {/* -------------------- HR Schedule Interview Dialog -------------------- */}
            {/* {HrRoundData?.length > 0 ? (
                props?.jobApplicationData?.is_hr_interview_completed ? (
                <Dialog fullWidth open={hrScheduleInterviewOpen} onClose={() => setHrScheduleInterviewOpen(false)}>
                    <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                        Schedule Interview for HR Round
                    </Typography>
                    <DialogContent>
                        Interview has been completed on:
                    </DialogContent>
                    <DialogContent>
                        <b>Interview Date:</b> <b style={{color: "red"}}>{HrRoundData[0]?.start_date.substring(0, 10)?.split('-').reverse().join('/')}</b>
                        <br></br>
                        <b>Interview Time:</b> <b style={{color: "red"}}>{HrRoundData[0]?.start_date.substring(11, 16)}</b> to <b style={{color: "red"}}>{props?.jobApplicationData?.interview_details[0]?.end_date.substring(11, 16)}</b>
                    </DialogContent>
                </Dialog>
                ) : (
                <Dialog open={hrScheduleInterviewOpen} onClose={() => setHrScheduleInterviewOpen(false)}>
                    <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                        Schedule Interview for HR Round
                    </Typography>
                    <DialogContent>
                        Interview has already been scheduled. Below are the interview details:
                    </DialogContent>
                    <DialogContent>
                        <b>Interview Date:</b> <b style={{color: "red"}}>{props?.jobApplicationData?.interview_details[0]?.start_date.substring(0, 10)}</b>
                        <br></br>
                        <b>Interview Time:</b> <b style={{color: "red"}}>{props?.jobApplicationData?.interview_details[0]?.start_date.substring(11, 16)}</b> to <b style={{color: "red"}}>{props?.jobApplicationData?.interview_details[0]?.end_date.substring(11, 16)}</b>
                        <br></br><br></br>
                        <b>Interview Link:</b> <a href={props?.jobApplicationData?.interview_details[0]?.interview_moderator_link}>Click here to join</a>
                    </DialogContent>
                    <DialogActions style={{justifyContent: "center", paddingTop: '15px', paddingBottom: '15px'}}>
                        <Button variant="contained" color="error" size="medium" disabled>Schedule Interview</Button>
                    </DialogActions>
                </Dialog>
            )) : (
                <Dialog open={hrScheduleInterviewOpen} onClose={() => setHrScheduleInterviewOpen(false)}>
                    <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                        Schedule Interview for HR Round
                    </Typography>
                    {props?.jobApplicationData?.is_hr_interview_mail_sent ? (
                    <DialogContent>
                        <b>Awaiting for candidate's response.</b>
                        <br></br> <br></br>
                        An email has already been sent to the candidate asking him to choose interview slot!
                    </DialogContent>
                    ) : (
                    <DialogContent>
                        An email will be sent to the candidate asking him/her to choose a slot for the interview.
                        <br></br> <br></br>
                        Before pressing the "Schedule Interview" button, Please make sure you have given slots for the Interview!
                    </DialogContent>
                    )}
                    <DialogActions style={{justifyContent: "center", paddingTop: '15px'}}>
                        <Button variant="contained" color="error" size="medium" onClick={handleScheduleInterview} disabled={props?.jobApplicationData?.is_hr_interview_mail_sent && true}>Schedule Interview</Button>
                    </DialogActions>
                </Dialog>
            )} */}
            {/* =========================================================================================================== */}

            {HrRoundData?.length > 0 ? (
                props?.jobApplicationData?.is_hr_interview_completed ? (
                <Dialog fullWidth open={hrScheduleInterviewOpen} onClose={() => setHrScheduleInterviewOpen(false)}>
                    <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                        Schedule Interview for Screening Round
                    </Typography>
                    <DialogContent>
                        Interview has been completed on:
                    </DialogContent>
                    <DialogContent>
                        <b>Interview Date:</b>&nbsp; <b style={{color: "red"}}>
                            {new Date(HrRoundData?.[0]?.start_date).toLocaleDateString()} </b>
                        <br></br>
                        <b>Interview Time:</b>&nbsp; <b style={{color: "red"}}>
                            {new Date(HrRoundData?.[0]?.start_date).toLocaleTimeString().substring(0, 5)}
                        </b> 
                            &nbsp; to &nbsp;
                        <b style={{color: "red"}}>
                            {new Date(HrRoundData?.[0]?.end_date).toLocaleTimeString().substring(0, 5)}
                        </b>
                        <br></br><br></br>
                        <b>Interviewer:</b>&nbsp; <b style={{color: "red"}}>
                            {HrRoundData?.[0]?.employee_name} </b>
                        <br></br>
                    </DialogContent>
                </Dialog>
                ) : (
                <Dialog open={hrScheduleInterviewOpen} onClose={() => setHrScheduleInterviewOpen(false)}>
                    <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                        Schedule Interview for Screening Round
                    </Typography>
                    <DialogContent>
                        Interview has already been scheduled. Below are the interview details:
                    </DialogContent>
                    <DialogContent>
                        <b>Interviewer:</b>&nbsp; <b style={{color: "red"}}>
                            {HrRoundData?.[0]?.employee_name} </b>
                        <br></br>
                        <b>Interview Date:</b>&nbsp; <b style={{color: "red"}}>
                            {new Date(HrRoundData?.[0]?.start_date).toLocaleDateString()} </b>
                        <br></br>
                        <b>Interview Time:</b>&nbsp; <b style={{color: "red"}}>
                            {new Date(HrRoundData?.[0]?.start_date).toLocaleTimeString().substring(0, 5)}
                        </b> 
                            &nbsp; to &nbsp;
                        <b style={{color: "red"}}>
                            {new Date(HrRoundData?.[0]?.end_date).toLocaleTimeString().substring(0, 5)}
                        </b>
                        <br></br><br></br>
                        <b>Interview Link:</b> <a href={HrRoundData?.[0]?.interview_moderator_link} target="_blank">Click here to join</a>
                    </DialogContent>
                    <DialogActions style={{justifyContent: "center", paddingTop: '15px', paddingBottom: '15px'}}>
                        <Button variant="contained" color="error" size="medium" disabled>Schedule Interview</Button>
                    </DialogActions>
                </Dialog>
            )) : (
                <Dialog open={hrScheduleInterviewOpen} onClose={() => setHrScheduleInterviewOpen(false)}>
                    <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                        Schedule Interview for Screening Round
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


                    {/* <DialogActions style={{justifyContent: "center", paddingTop: '15px'}}>
                        <Button variant="contained" color="error" size="medium" onClick={handleScheduleInterview} disabled={props?.jobApplicationData?.is_hr_interview_mail_sent && true}>Schedule Interview</Button>
                    </DialogActions> */}
                </Dialog>
            )}
        </Stack>
    )
}