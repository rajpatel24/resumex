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

export default function AddRequisitionTypeForm() {

    const { enqueueSnackbar } = useSnackbar();

    const hrToken = localStorage.getItem("authToken");

    const navigate = useNavigate();

    const callAddRequisitionTypeAPI = (formValues) => {

        apiInstance({
            method: "post",
            url: "requisition-types/",
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
                navigate("/resumeX/requisition-types", { replace: true });
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

    
    const RequisitionTypeSchema = Yup.object().shape({
        RequisitionTypeName: Yup.string()
            .required("Requisition Type name required"),
        is_active: Yup.string()
            .required("Active status is required."),
    });

    const formik = useFormik({
        initialValues: {
            RequisitionTypeName: '',
            is_active: '',
            
        },
        validationSchema: RequisitionTypeSchema,
        onSubmit: (values) => {

            let formData = {
                "req_type_name": values.RequisitionTypeName,
                "is_active": values.is_active
            }

            // call create RequisitionType API
            callAddRequisitionTypeAPI(formData)
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, setFieldValue, handleChange } = formik;

    return (
        <Page title="Add Requisition Type">
            <Container maxWidth="xl">
                <Link to="/resumeX/requisition-types" color="green" underline="hover" component={RouterLink} fontSize="20px"> Back
                </Link>
                <Typography variant="h4" sx={{ mb: 5 }} align="center" color="black">
                    Add Requisition Type
                </Typography>

                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                        <Card sx={{ mt: 2, ml:40 }} variant="outlined" style={{ width:'50%'}}>
                            <CardContent>
                                <Stack spacing={3}>

                                   <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            label="Requisition Type Name"

                                            {...getFieldProps('RequisitionTypeName')}

                                            error={Boolean(touched.RequisitionTypeName && errors.RequisitionTypeName)}
                                            helperText={touched.RequisitionTypeName && errors.RequisitionTypeName}
                                        >
                                        </TextField>
                                    </Stack>

                                    <Stack>
                                       

                                        <div role="group" style={{ width: '40%' }}>
                                        <Stack
                                            direction={{ xs: "column", sm: "row" }}
                                            spacing={3}
                                            style={{ padding: "20px 0 0 12px"}}
                                        >
                                            <div id="switch-label" style={{ color: '#637381', marginTop:'5px'}}> Is Active? </div>

                                            <Switch
                                                name="is_active"
                                                value="true"
                                                // checked={values.is_active}
                                                onChange={(event, checked) => {
                                                    setFieldValue("is_active", checked ? "true" : "false");
                                            }}
                                            />
                                        </Stack>
                                        <ErrorMessage name="is_active">
                                            {(msg) => <span style={{ color: "#FF4842", fontSize: "12px" ,marginLeft:15}}>{msg}</span>}
                                        </ErrorMessage>
                                     </div>     
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
                            Add Requisition Type
                       </LoadingButton>

                      </Form>
                </FormikProvider>
            </Container>
        </Page >
    )
}