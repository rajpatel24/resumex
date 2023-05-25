import { useState, useEffect } from 'react';
import Page from '../../Page';
import {
    Card, CardContent, Container,
    Link, Stack, TextField, Typography,MenuItem ,Autocomplete 
}
    from '@mui/material';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider, ErrorMessage } from 'formik';

import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack'
import Switch from '@mui/material/Switch';

import { apiInstance } from 'src/utils/apiAuth';

export default function AddTechStackTechnologiesForm() {

    const { enqueueSnackbar } = useSnackbar();

    const hrToken = localStorage.getItem("authToken");

    const navigate = useNavigate();

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


    const callAddTechStackTechnologiesAPI = (formValues) => {

        apiInstance({
            method: "post",
            url: "techstack-technologies/",
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


    useEffect(() => {
        getTechStackInfo();
        getTechnologyInfo();
    }, [])

    
    const TechStackTechnologiesSchema = Yup.object().shape({
        
        TechStack: Yup.string()
            .required("TechStack is required."),
        Technologies: Yup.array()
            .min(1, "Technologies are required"),
    });

    const formik = useFormik({
        initialValues: {
            TechStack: '',
            Technologies: [],
        },
        validationSchema: TechStackTechnologiesSchema,
        onSubmit: (values) => {

            let formData = {
                "technology_stack_id": values.TechStack,
                "technologies_id": values.Technologies,
            }

            // call create TechStackTechnologies API
            callAddTechStackTechnologiesAPI(formData)
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, setFieldValue, handleChange } = formik;

    return (
        <Page title="Add TechStack Technologies">
            <Container maxWidth="xl">
                <Link to="/resumeX/techstack-technologies" color="green" underline="hover" component={RouterLink} fontSize="20px"> Back
                </Link>
                <Typography variant="h4" sx={{ mb: 5 }} align="center" color="black">
                    Add TechStack Technologies
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
                                            select

                                            {...getFieldProps('TechStack')}

                                            error={Boolean(touched.TechStack && errors.TechStack)}
                                            helperText={touched.TechStack && errors.TechStack}
                                        >
                                            {TechStackInfo.map((option) => (
                                            <MenuItem key={option.id} value={option.id}>
                                            {option.tech_stack_name}
                                            </MenuItem>
                                            ))}
                                        </TextField>

                                    </Stack>

                                    
                                   <Stack>
                                   <Autocomplete
                                            multiple
                                            id="permission-list"
                                            options={technologyInfo}
                                            getOptionLabel={(option) => option.techName}
                                            //defaultValue={null}
                                            filterSelectedOptions
                                            onChange={(event, value) => {
                                                var list = value.map((v) => v.pk)
                                                setFieldValue("Technologies", list);
                                              }}
                                            renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Technology List"
                                                placeholder="Select"

                                                {...getFieldProps("Technologies")}

                                            error={Boolean(touched.Technologies && errors.Technologies)}
                                            helperText={touched.Technologies && errors.Technologies}
                                            />
                                            )}
                                        />
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
                            Add TechStack Technologies
                       </LoadingButton>

                      </Form>
                </FormikProvider>
            </Container>
        </Page >
    )
}