import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
    Card, CardContent, Container,
    Link, Stack, TextField, Typography,
}
    from '@mui/material';

import Page from '../../Page';

import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack'
import Switch from '@mui/material/Switch';

import { useFormik, Form, FormikProvider, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { apiInstance } from 'src/utils/apiAuth';

export default function EditNoticePeriod() {

    const { enqueueSnackbar } = useSnackbar();

    const rid = useParams()

    const hrToken = localStorage.getItem("authToken");

    const navigate = useNavigate();


    // Stores NoticePeriod information
    const [NoticePeriodInfo, setNoticePeriodInfo] = useState({});


    const getNoticePeriodInfo = () => {
        apiInstance({
            method: "get",
            url: "notice-period/"+rid.id,
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                setNoticePeriodInfo(response.data.data)
            })
            .catch(function (error) {
                enqueueSnackbar('Something went wrong. Please try after sometime.', {
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    variant: 'error',
                    autoHideDuration: 2000,
                });
            });
    }


    useEffect(() => {
        getNoticePeriodInfo();
    }, [])

    const callEditNoticePeriodAPI = (formValues) => {
        apiInstance({
            method: "put",
            url: "notice-period/" + rid.id + "/",
            headers: {
                Authorization: "token " + hrToken,
            },
            data: formValues,
        })
            .then(function (response) {
                enqueueSnackbar(response.data.message, {
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    variant: 'success',
                    autoHideDuration: 2000,
                });
                navigate("/resumeX/notice-period", { replace: true });
            })
            .catch(function (error) {
                enqueueSnackbar('Something went wrong. Please try after sometime.', {
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    variant: 'error',
                    autoHideDuration: 2000,
                });
                setSubmitting(false)
            });
    }
    
    const NoticePeriodSchema = Yup.object().shape({
        NoticePeriodName: Yup.string()
            .required("Notice Period name required"),
    });

    const formik = useFormik({
        initialValues: {
            NoticePeriodName: NoticePeriodInfo?.notice_period ?? '',        
        },
        enableReinitialize: true,
        validationSchema: NoticePeriodSchema,
        onSubmit: (values) => {            

            let formData = {
                "notice_period": values.NoticePeriodName,
            }

            // call Edit NoticePeriod API
            callEditNoticePeriodAPI(formData)
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, setFieldValue, handleChange } = formik;

    return (
        <Page title="Edit Notice Period">
            <Container maxWidth="xl">
                <Link to="/resumeX/notice-period" color="green" underline="hover" component={RouterLink} fontSize="20px"> Back
                </Link>
                <Typography variant="h4" sx={{ mb: 5 }} align="center" color="black">
                    Edit Notice Period
                </Typography>

                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Card sx={{ mt: 2, ml:40 }} variant="outlined" style={{ width:'50%'}}>
                            <CardContent>
                                <Stack spacing={3}>

                                   <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            label="Notice Period"

                                            {...getFieldProps('NoticePeriodName')}

                                            error={Boolean(touched.NoticePeriodName && errors.NoticePeriodName)}
                                            helperText={touched.NoticePeriodName && errors.NoticePeriodName}

                                        >
                                        </TextField>

                                    </Stack>
                                        
                                    </Stack>
                                   
                            </CardContent>
                        </Card>


                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2}} />

                        <LoadingButton
                            size="large"
                            type="submit"
                            variant="contained"
                            loading={isSubmitting}
                            style={{marginLeft:550, width:300}}
                        >
                            Update Notice Period
                       </LoadingButton>

                      </Form>
                </FormikProvider>
            </Container>
        </Page >
    )
}