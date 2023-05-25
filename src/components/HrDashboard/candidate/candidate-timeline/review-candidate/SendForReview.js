import axios from 'axios';
import * as Yup from "yup";
import {useSnackbar} from 'notistack';
import { LoadingButton } from "@mui/lab";
import React, { useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from "formik";
import { Button, Dialog, DialogContent, MenuItem, Stack, Typography, TextField } from '@mui/material';
import * as constants from 'src/utils/constants';

export default function SendForReview(props) {
    const { enqueueSnackbar} = useSnackbar();

    // send for review dialog state
    const [sendForReviewDialog, setSendForReviewDialog] = useState(false)

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

    const SentForReview = props?.jobApplicationData?.interview_details?.filter(item => {
        return item.interview_round === 'REVIEW_CANDIDATE'
    })


    useEffect(() => {
        getEmployeeData()
    }, [])

    const SelectEmployeeSchema = Yup.object().shape({
        employee: Yup.string()
          .required("Employee is required"),
        endDate: Yup.string()
        .required("Employee is required"),
      });
      const formik = useFormik({
        initialValues: {
            employee: '',
            endDate: ''
        },
        validationSchema: SelectEmployeeSchema,
        onSubmit: (formValues) => {
            const headers = {
                'Authorization': `Token ${localStorage.getItem('authToken')}`
            }

            var startDatetime = new Date()
            startDatetime.setHours(startDatetime.getHours()+5,startDatetime.getMinutes()+30,0,0)

            const data = {
                employee_id: formValues.employee,
                candidate_id: props.jobApplicationData.resume.candidate.id,
                job_application_id: props.jobApplicationData.id,
                start_date: startDatetime.toISOString().slice(0, 19),
                end_date: formValues.endDate,
                intv_round: "REVIEW_CANDIDATE",
                interview_status: "CONFIRMED"
            }

            axios.post(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + "/api/v1/confirmed-interviews/", data, {headers})
            .then(function (response) {
                if (response.status === 200) {
                    enqueueSnackbar("Application sent for review !!", {
                        anchorOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right',
                                      },
                        variant: 'success',
                        autoHideDuration: 1500,
                      });
                      setSendForReviewDialog(false)
                      window.location.reload(false);                    
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
        }
      });    

    const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setSubmitting } = formik;

    return(
        <Stack>
            <Button 
            variant="contained" 
            size="small" 
            color="success" 
            style={{width: "150px"}} 
            onClick={() => setSendForReviewDialog(true)}
            disabled={props?.jobApplicationData?.is_hr_interview_completed!==true}
            >Send For Review</Button>


            {SentForReview?.length > 0 ? (
            <Dialog open={sendForReviewDialog} onClose={() => setSendForReviewDialog(false)}>
                <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                    Send for Technical Review
                </Typography>

                <DialogContent>
                    Candidate details has already been sent to the technical person for review.
                </DialogContent>

                <DialogContent>
                    <Stack spacing={3}>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <b>Employee: </b> &nbsp; {SentForReview[0]?.employee_name}
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <b>End Date: </b> &nbsp; {SentForReview[0]?.end_date?.substring(0, 10).split('-').reverse().join('/')}
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>

            ) : (

            <Dialog fullWidth open={sendForReviewDialog} onClose={() => setSendForReviewDialog(false)}>
                <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                    Send for Technical Review
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
                            label="Review End Date"
                            type="datetime-local"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            {...getFieldProps("endDate")}
                            error={Boolean(touched.endDate && errors.endDate)}
                            helperText={touched.endDate && errors.endDate}
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
                            Send
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