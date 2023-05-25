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

export default function EditTechnology() {

    const { enqueueSnackbar } = useSnackbar();

    const rid = useParams()

    const hrToken = localStorage.getItem("authToken");

    const navigate = useNavigate();


    // Stores Technology information
    const [technologyInfo, setTechnologyInfo] = useState({});


    const getTechnologyInfo = () => {
        apiInstance({
            method: "get",
            url: "technology/"+rid.id,
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                setTechnologyInfo(response.data.data)
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
        getTechnologyInfo();
    }, [])

    const callEditTechnologyAPI = (formValues) => {
        apiInstance({
            method: "put",
            url: "technology/" + rid.id + "/",
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
                navigate("/resumeX/technology", { replace: true });
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
    
    const technologySchema = Yup.object().shape({
        TechnologyName: Yup.string()
            .required("technology name required"),
        is_active: Yup.string()
            .required("Active status is required."),
    });

    const formik = useFormik({
        initialValues: {
            TechnologyName: technologyInfo?.technology_name ?? '',
            is_active: technologyInfo?.is_active ?? false,            
        },
        enableReinitialize: true,
        validationSchema: technologySchema,
        onSubmit: (values) => {            

            let formData = {
                "technology_name": values.TechnologyName,
                "is_active": values.is_active
            }

            // call Edit Technology API
            callEditTechnologyAPI(formData)
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, setFieldValue, handleChange } = formik;

    return (
        <Page title="Edit Technology">
            <Container maxWidth="xl">
                <Link to="/resumeX/technology" color="green" underline="hover" component={RouterLink} fontSize="20px"> Back
                </Link>
                <Typography variant="h4" sx={{ mb: 5 }} align="center" color="black">
                    Edit Technology
                </Typography>

                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Card sx={{ mt: 2, ml:40 }} variant="outlined" style={{ width:'50%'}}>
                            <CardContent>
                                <Stack spacing={3}>

                                   <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            label="Technology"

                                            {...getFieldProps('TechnologyName')}

                                            error={Boolean(touched.TechnologyName && errors.TechnologyName)}
                                            helperText={touched.TechnologyName && errors.TechnologyName}

                                        >
                                        </TextField>

                                    </Stack>
                                        


                                        <div role="group" style={{ width: '40%' }}>
                                        <Stack
                                            direction={{ xs: "column", sm: "row" }}
                                            spacing={3}
                                            style={{ padding: "20px 0 0 12px"}}
                                        >
                                            <div id="switch-label" style={{ color: '#637381', marginTop:'5px'}}> Is Tech Active ? </div>

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
                            Update Technology
                       </LoadingButton>

                      </Form>
                </FormikProvider>
            </Container>
        </Page >
    )
}