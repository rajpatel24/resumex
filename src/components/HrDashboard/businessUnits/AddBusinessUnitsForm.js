import { useState, useEffect } from 'react';
import Page from '../../Page';
import {
    Card, CardContent, Container,
    Link, Stack, TextField, Typography,
}
    from '@mui/material';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider, ErrorMessage } from 'formik';

import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack'
import Switch from '@mui/material/Switch';

import { apiInstance } from 'src/utils/apiAuth';

export default function AddBusinessUnitsForm() {

    const { enqueueSnackbar } = useSnackbar();

    const hrToken = localStorage.getItem("authToken");

    const navigate = useNavigate();

    const callAddBusinessUnitsAPI = (formValues) => {

        apiInstance({
            method: "post",
            url: "business-units/",
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
                navigate("/resumeX/business-units", { replace: true });
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


    useEffect(() => {
    }, [])

    
    const BusinessUnitsSchema = Yup.object().shape({
        BusinessUnitsName: Yup.string()
            .required("Business Unit name required"),
    });

    const formik = useFormik({
        initialValues: {
            BusinessUnitsName: '',
            
        },
        validationSchema: BusinessUnitsSchema,
        onSubmit: (values) => {

            let formData = {
                "bu_name": values.BusinessUnitsName,
            }

            // call create BusinessUnits API
            callAddBusinessUnitsAPI(formData)
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, setFieldValue, handleChange } = formik;

    return (
        <Page title="Add Business Unit">
            <Container maxWidth="xl">
                <Link to="/resumeX/business-units" color="green" underline="hover" component={RouterLink} fontSize="20px"> Back
                </Link>
                <Typography variant="h4" sx={{ mb: 5 }} align="center" color="black">
                    Add Business Unit
                </Typography>

                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                        <Card sx={{ mt: 2, ml:40 }} variant="outlined" style={{ width:'50%'}}>
                            <CardContent>
                                <Stack spacing={3}>

                                   <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            label="Business Unit Name"

                                            {...getFieldProps('BusinessUnitsName')}

                                            error={Boolean(touched.BusinessUnitsName && errors.BusinessUnitsName)}
                                            helperText={touched.BusinessUnitsName && errors.BusinessUnitsName}
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
                            style={{marginLeft:'40%', width:300}}
                        >
                            Add Business Unit
                       </LoadingButton>

                      </Form>
                </FormikProvider>
            </Container>
        </Page >
    )
}