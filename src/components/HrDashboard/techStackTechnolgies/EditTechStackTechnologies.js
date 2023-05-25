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

export default function EditTechStackTechnolgies() {

    const { enqueueSnackbar } = useSnackbar();

    const rid = useParams()

    const hrToken = localStorage.getItem("authToken");

    const navigate = useNavigate();

    // Stores deleted permissions
    const [deleteItem, setDeleteItem] = useState([]);

    // Stores TechStackTechnologies information
    const [TechStackTechnologiesInfo, setTechStackTechnologiesInfo] = useState({});


    const getTechStackTechnologiesInfo = () => {
        apiInstance({
            method: "get",
            url: "techstack-technologies/"+rid.id,
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                setTechStackTechnologiesInfo(response.data.data)
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
            // Stores Technology information
            const [technologyInfo, setTechnologyInfo] = useState([]);


            const getTechnologyInfo = () => {
                apiInstance({
                    method: "get",
                    url: "technology/",
                    headers: {
                        Authorization: "token " + hrToken,
                    }
                })
                    .then(function (response) {
                        const techArray = getTechArray(response.data.data)
                        setTechnologyInfo(techArray)
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
        
        const getTechArray = (techObj) =>
        techObj.map((obj) => ({
            pk: obj.id,
            techName: obj.technology_name,
            isActive: obj.is_active
        }));


        // Stores TechStack information
    const [TechStackInfo, setTechStackInfo] = useState([]);


    const getTechStackInfo = () => {
        apiInstance({
            method: "get",
            url: "tech-stack/",
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                setTechStackInfo(response.data.data)
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
        getTechStackTechnologiesInfo();
        getTechStackInfo();
        getTechnologyInfo();
    }, [])

    const callEditTechStackTechnologiesAPI = (formValues) => {
        apiInstance({
            method: "put",
            url: "techstack-technologies/" + rid.id + "/",
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
                navigate("/resumeX/techstack-technologies", { replace: true });
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
    
    const TechStackTechnologiesSchema = Yup.object().shape({
        TechStackTechnologiesName: Yup.string()
            .required("TechStackTechnologies name required"),
        Priority: Yup.number()
            .required("TechStackTechnologies Priority is required"),
        is_active: Yup.string()
            .required("Active status is required."),
    });

    const formik = useFormik({
        initialValues: {
            TechStackTechnologiesName: TechStackTechnologiesInfo?.tech_stack_name ?? '',
            Priority: TechStackTechnologiesInfo?.stack_priority ?? '',    
            is_active: TechStackTechnologiesInfo?.is_active ?? false,            
        },
        enableReinitialize: true,
        validationSchema: TechStackTechnologiesSchema,
        onSubmit: (values) => {            

            let formData = {
                "tech_stack_name": values.TechStackTechnologiesName,
                "stack_priority": values.Priority,
                "is_active": values.is_active
            }

            // call Edit TechStackTechnologies API
            callEditTechStackTechnologiesAPI(formData)
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, setFieldValue, handleChange } = formik;

    return (
        <Page title="Edit TechStackTechnologies">
            <Container maxWidth="xl">
                <Link to="/resumeX/techstack-technologies" color="green" underline="hover" component={RouterLink} fontSize="20px"> Back
                </Link>
                <Typography variant="h4" sx={{ mb: 5 }} align="center" color="black">
                    Edit TechStackTechnologies
                </Typography>

                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Card sx={{ mt: 2, ml:40 }} variant="outlined" style={{ width:'50%'}}>
                            <CardContent>
                                <Stack spacing={3}>

                                   <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            label="TechStack"

                                            {...getFieldProps('TechStackTechnologiesName')}

                                            error={Boolean(touched.TechStackTechnologiesName && errors.TechStackTechnologiesName)}
                                            helperText={touched.TechStackTechnologiesName && errors.TechStackTechnologiesName}

                                        >
                                        </TextField>

                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                    <TextField
                                            fullWidth
                                            label="Technologies"

                                            {...getFieldProps("Priority")}

                                            error={Boolean(touched.Priority && errors.Priority)}
                                            helperText={touched.Priority && errors.Priority}
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
                            Update TechStack Technologies
                       </LoadingButton>

                      </Form>
                </FormikProvider>
            </Container>
        </Page >
    )
}