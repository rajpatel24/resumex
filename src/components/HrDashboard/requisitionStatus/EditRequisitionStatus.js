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

export default function EditRequisitionStatus() {

    const { enqueueSnackbar } = useSnackbar();

    const rid = useParams()

    const hrToken = localStorage.getItem("authToken");

    const navigate = useNavigate();


    // Stores Requisition Status information
    const [RequisitionStatusInfo, setRequisitionStatusInfo] = useState({});


    const getRequisitionStatusInfo = () => {
        apiInstance({
            method: "get",
            url: "requisition-status/"+rid.id,
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                setRequisitionStatusInfo(response.data.data)
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
        getRequisitionStatusInfo();
    }, [])

    const callEditRequisitionStatusAPI = (formValues) => {
        apiInstance({
            method: "put",
            url: "requisition-status/" + rid.id + "/",
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
                navigate("/resumeX/requisition-status", { replace: true });
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
    
    const RequisitionStatusSchema = Yup.object().shape({
        RequisitionStatusName: Yup.string()
            .required("Requisition Status name required"),
        is_active: Yup.string()
            .required("Active status is required."),
    });

    const formik = useFormik({
        initialValues: {
            RequisitionStatusName: RequisitionStatusInfo?.requisition_status ?? '',
            is_active: RequisitionStatusInfo?.is_active ?? false,            
        },
        enableReinitialize: true,
        validationSchema: RequisitionStatusSchema,
        onSubmit: (values) => {            

            let formData = {
                "requisition_status": values.RequisitionStatusName,
                "is_active": values.is_active
            }

            // call Edit Requisition Status API
            callEditRequisitionStatusAPI(formData)
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, setFieldValue, handleChange } = formik;

    return (
        <Page title="Edit Requisition Status">
            <Container maxWidth="xl">
                <Link to="/resumeX/requisition-status" color="green" underline="hover" component={RouterLink} fontSize="20px"> Back
                </Link>
                <Typography variant="h4" sx={{ mb: 5 }} align="center" color="black">
                    Edit Requisition Status
                </Typography>

                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Card sx={{ mt: 2, ml:40 }} variant="outlined" style={{ width:'50%'}}>
                            <CardContent>
                                <Stack spacing={3}>

                                   <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            label="Requisition Status"

                                            {...getFieldProps('RequisitionStatusName')}

                                            error={Boolean(touched.RequisitionStatusName && errors.RequisitionStatusName)}
                                            helperText={touched.RequisitionStatusName && errors.RequisitionStatusName}

                                        >
                                        </TextField>

                                    </Stack>
                                        


                                        <div role="group" style={{ width: '40%' }}>
                                        <Stack
                                            direction={{ xs: "column", sm: "row" }}
                                            spacing={3}
                                            style={{ padding: "20px 0 0 12px"}}
                                        >
                                            <div id="switch-label" style={{ color: '#637381', marginTop:'5px'}}> Is Active ? </div>

                                            <Switch
                                                name="is_active"
                                                value="true"
                                                checked={values.is_active}
                                                onChange={(event, checked) => {
                                                    setFieldValue("is_active", checked);
                                            }}
                                            />
                                        </Stack>
                                        <ErrorMessage name="is_active">
                                            {(msg) => <span style={{ color: "#FF4842", fontSize: "12px" ,marginLeft:15}}>{msg}</span>}
                                        </ErrorMessage>
                                     </div>     
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
                            Update Requisition Status
                       </LoadingButton>

                      </Form>
                </FormikProvider>
            </Container>
        </Page >
    )
}