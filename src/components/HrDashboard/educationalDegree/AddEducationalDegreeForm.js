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

export default function AddEducationalDegreeForm() {

    const { enqueueSnackbar } = useSnackbar();

    const hrToken = localStorage.getItem("authToken");

    const navigate = useNavigate();

    const callAddEducationalDegreeAPI = (formValues) => {

        apiInstance({
            method: "post",
            url: "education-degree/",
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
                navigate("/resumeX/education-degree", { replace: true });
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

    
    const EducationalDegreeSchema = Yup.object().shape({
        EducationalDegreeName: Yup.string()
            .required("Educational Degree name required"),
    });

    const formik = useFormik({
        initialValues: {
            EducationalDegreeName: '',
            
        },
        validationSchema: EducationalDegreeSchema,
        onSubmit: (values) => {

            let formData = {
                "degree_name": values.EducationalDegreeName,
            }

            // call create EducationalDegree API
            callAddEducationalDegreeAPI(formData)
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, setFieldValue, handleChange } = formik;

    return (
        <Page title="Add Educational Degree">
            <Container maxWidth="xl">
                <Link to="/resumeX/education-degree" color="green" underline="hover" component={RouterLink} fontSize="20px"> Back
                </Link>
                <Typography variant="h4" sx={{ mb: 5 }} align="center" color="black">
                    Add Educational Degree
                </Typography>

                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                        <Card sx={{ mt: 2, ml:40 }} variant="outlined" style={{ width:'50%'}}>
                            <CardContent>
                                <Stack spacing={3}>

                                   <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            label="Educational Degree Name"

                                            {...getFieldProps('EducationalDegreeName')}

                                            error={Boolean(touched.EducationalDegreeName && errors.EducationalDegreeName)}
                                            helperText={touched.EducationalDegreeName && errors.EducationalDegreeName}
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
                            Add Educational Degree
                       </LoadingButton>

                      </Form>
                </FormikProvider>
            </Container>
        </Page >
    )
}