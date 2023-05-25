import { useState, useEffect } from 'react';
import Page from '../../../Page';
import {
    Button, Card, CardContent, Container,
    Link, Stack, TextField, Typography,
    InputAdornment, InputLabel, MenuItem
}
    from '@mui/material';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider, ErrorMessage, Field } from 'formik';

import * as Yup from 'yup';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack'
import { CloseFullscreen } from '@mui/icons-material';
import { apiInstance } from 'src/utils/apiAuth';


// const apiInstance = axios.create({
//     baseURL: "http://127.0.0.1:8000/api/v1/",
//     timeout: 10000
// });


export default function CandRequiredDetails({candData, candAge}) {

    const { enqueueSnackbar } = useSnackbar();

    const hrToken = localStorage.getItem("authToken");

    const navigate = useNavigate();

    const [locData, setlocData] = useState([]);

    const [FSDMemData, setFSDMemData] = useState([]);

    let JobAppData = candData?.candidateData?.job_application?.map((app_obj) => {
        if(app_obj?.is_candidate_selected===true){
            return app_obj
        }
    }).filter(obj => obj)

    const [disableValue, setDisableValue] = useState(false)

    useEffect(() => {
        getLocationsList();
        getFSDMemList();
        setOtherValues();
    }, [])

    const setOtherValues = () => 
    {
        let user = JSON.parse(localStorage.getItem("user"))
        let user_role = user.role.role_name
            
        if (user_role === 'BU_HEAD' || user_role === 'OnBoarding_HR')
        { setDisableValue(true)  }

        else{ setDisableValue(false) }
    }

    const getLocationsList = () => {

        apiInstance({
            method: "get",
            url: "office-locations/",
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                const locData = getLocArray(response.data.data)
                setlocData(locData)
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

    const getFSDMemList = () => {

        apiInstance({
            method: "get",
            url: "fsd-members/recruiters_list/",
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                const fsdMem = getFSDArray(response.data.data)
                setFSDMemData(fsdMem)
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

    const getLocArray = (locData) =>
        locData.map((locObj) => ({
            pk: locObj?.id,
            office_loc: locObj?.office_location,
            loc_status: locObj?.is_active,
        }));
    
    const getFSDArray = (MemData) =>
    MemData.map((MemObj) => ({
        pk: MemObj?.id,
        first_name: MemObj?.member?.first_name,
        last_name: MemObj?.member?.last_name,
    }));


    const callUpdateCandidate = (formValues) => {
        var cand_id = candData?.candidateData?.id
        var job_app_id = JobAppData?.[0].id


        var apiData = {
            "salutation": formValues.Salutation,
            "sdf_of": formValues.SDW_Of,
            "age": formValues.Cand_Age,
            "current_add": formValues.CurrAdd,
            "permanent_add": formValues.PerAdd,
            "joining_loc_id": formValues.JoinLoc,
            "middle_name": formValues.MiddleName,
            "drm_id": formValues.DRM,
            "process_month": formValues.ProcessMonth,
            "process_week": formValues.ProcessWeek,
            "hr_call_id": formValues.HRCall,
            "job_app_id": job_app_id,
            "is_required_details": true,            
        }


        apiInstance({
            method: "put",
            url: "candidate-viewset/" + cand_id + '/',
            headers: {
                Authorization: "token " + hrToken,
            },
            data: apiData,
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
                navigate("/resumeX/candidates", { replace: true });
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

    const handleAddCheckbox = (e) =>{
        let addStatus = e.target.checked

        if (addStatus){
            setFieldValue("PerAdd", values.CurrAdd)
        }
        else{
            setFieldValue("PerAdd", "")
        }
    }


    const CandidateSchema = Yup.object().shape({
        Salutation: Yup.string()
            .required('Salutation is required.'),
        FirstName: Yup.string()
            .min(2, "Too Short!")
            .max(50, "Too Long!")
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed.")
            .required("First name required"),
        MiddleName: Yup.string()
            .min(2, "Too Short!")
            .max(50, "Too Long!")
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed.")
            .required("Middle name required"),
        LastName: Yup.string()
            .min(2, "Too Short!")
            .max(50, "Too Long!")
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed.")
            .required("Last name required"),
        SDW_Of: Yup.string()
            .min(2, "Too Short!")
            .max(50, "Too Long!")
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed.")
            .required("Surety details are required."),
        Cand_Age: Yup.number()
            .integer()
            .min(18)
            .required("Candidate\'s age is required."),
        DRM: Yup.string()
            .required('DRM is required.'),
        ProcessMonth: Yup.date()
            .required("Processing month is required."),
        ProcessWeek: Yup.string()
            .required("processing week is required."),
        JoinLoc: Yup.string()
            .required("Candidate Joining Location is required."),
        HRCall: Yup.string()
            .required("HR Call is required."),
        CurrAdd: Yup.string()
            .required("Candidate\'s current address is required. "),
        PerAdd: Yup.string()
            .required("Candidate\'s permanent address is required. "),
    });


    const formik = useFormik({

        initialValues: {
            Salutation: candData?.candidateData?.salutation ?? '',
            FirstName: candData?.candidateData?.user?.first_name ?? '',
            MiddleName: candData?.candidateData?.user?.middle_name ?? '',
            LastName: candData?.candidateData?.user?.last_name ?? '',
            SDW_Of: candData?.candidateData?.sdf_of ?? '',
            Cand_Age: candAge,
            BirthDate: candData?.candidateData?.dob ?? '',
            Email: candData?.candidateData?.user?.email ?? '',
            Mobile: candData?.candidateData?.user?.mobile ?? '',
            DRM: JobAppData?.[0]?.drm_user?.fsd_mem_id ?? '',
            ProcessMonth: JobAppData?.[0]?.processing_month ?? '',
            ProcessWeek: JobAppData?.[0]?.processing_week ?? '',
            JoinLoc: candData?.candidateData?.joining_loc?.id ?? '',
            HighEdu: candData?.candidateData?.hr_analysis?.higher_education?.degree_name ?? '',
            HRCall: JobAppData?.[0]?.hr_call?.fsd_mem_id ?? '',
            CurrAdd:candData?.candidateData?.current_add ?? '',
            PerAdd: candData?.candidateData?.permanent_add ?? '',
            SimilarAdd: false,
           },

        enableReinitialize: true,
        validationSchema: CandidateSchema,
        onSubmit: (values) => {
            callUpdateCandidate(values)
            setSubmitting(false)
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, handleChange, selectedOption, setFieldValue } = formik;

    return (
        <Page title="Candidates">
            <Container maxWidth="xl">
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                        <Card sx={{ mt: 2 }} variant="outlined">
                            <CardContent sx={{ mt: 2}}>
                                <Stack spacing={3}>
                                    
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                    <TextField
                                            fullWidth
                                            label="Salutation"
                                            type="string"
                                            select
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('Salutation')}

                                            error={Boolean(touched.Salutation && errors.Salutation)}
                                            helperText={touched.Salutation && errors.Salutation}

                                        >
                                            <MenuItem key="Mr." value="Mr.">
                                            Mr.
                                            </MenuItem>
                                            <MenuItem key="Mrs." value="Mrs.">
                                            Mrs.
                                            </MenuItem>
                                            <MenuItem key="Ms." value="Ms.">
                                            Ms.
                                            </MenuItem>
                                        </TextField>


                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            required
                                            disabled

                                            {...getFieldProps('FirstName')}

                                            error={Boolean(touched.FirstName && errors.FirstName)}
                                            helperText={touched.FirstName && errors.FirstName}

                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="Middle Name"
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('MiddleName')}

                                            error={Boolean(touched.MiddleName && errors.MiddleName)}
                                            helperText={touched.MiddleName && errors.MiddleName}

                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            required
                                            disabled

                                            {...getFieldProps('LastName')}

                                            error={Boolean(touched.LastName && errors.LastName)}
                                            helperText={touched.LastName && errors.LastName}
                                        >
                                        </TextField>

                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                         <TextField
                                            fullWidth
                                            label="Son/Daughter/Wife Of"
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('SDW_Of')}

                                            error={Boolean(touched.SDW_Of && errors.SDW_Of)}
                                            helperText={touched.SDW_Of && errors.SDW_Of}

                                        >
                                        </TextField>
                                        
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            disabled

                                            {...getFieldProps('Email')}

                                            error={Boolean(touched.Email && errors.Email)}
                                            helperText={touched.Email && errors.Email}

                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="Mobile"
                                            disabled

                                            style={{ width: '50%' }}

                                            {...getFieldProps('Mobile')}
                                        />  

                                        <TextField
                                            name="BirthDate"
                                            label="BirthDate"
                                            InputLabelProps={{ shrink: true }}
                                            type="date"
                                            disabled

                                            style={{ width: '50%' }}

                                            {...getFieldProps('BirthDate')}
                                            
                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="Candidate Age"
                                            type="number"
                                            required
                                            disabled

                                            {...getFieldProps('Cand_Age')}

                                            error={Boolean(touched.Cand_Age && errors.Cand_Age)}
                                            helperText={touched.Cand_Age && errors.Cand_Age}
                                        >
                                        </TextField>                            
                                       
                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                    <TextField
                                        fullWidth
                                        label="DRM Name"
                                        type="string"
                                        select
                                        required
                                        disabled

                                        {...getFieldProps('DRM')}

                                        error={Boolean(touched.DRM && errors.DRM)}
                                        helperText={touched.DRM && errors.DRM}
                                    >
                                        {FSDMemData.map((option) => (
                                            <MenuItem key={option.pk} value={option.pk}>
                                                {option.first_name + " " + option.last_name} 
                                            </MenuItem>
                                        ))}

                                    </TextField>


                                    <TextField
                                        fullWidth
                                        label="Processing Month"
                                        type="date"
                                        required
                                        disabled={disableValue}

                                        {...getFieldProps('ProcessMonth')}

                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.ProcessMonth && errors.ProcessMonth)}
                                        helperText={touched.ProcessMonth && errors.ProcessMonth}
                                    >
                                    </TextField>

                                    <TextField
                                        fullWidth
                                        label="Processing Week"
                                        type="string"
                                        select
                                        required
                                        disabled={disableValue}

                                        {...getFieldProps('ProcessWeek')}

                                        error={Boolean(touched.ProcessWeek && errors.ProcessWeek)}
                                        helperText={touched.ProcessWeek && errors.ProcessWeek}
                                    >
                                        <MenuItem key="Wk1" value="Wk1">
                                         Wk1
                                        </MenuItem>
                                        <MenuItem key="Wk2" value="Wk2">
                                         Wk2
                                        </MenuItem>
                                        <MenuItem key="Wk3" value="Wk3">
                                         Wk3
                                        </MenuItem>
                                        <MenuItem key="Wk4" value="Wk4">
                                         Wk4
                                        </MenuItem>
                                        <MenuItem key="Wk5" value="Wk5">
                                         Wk5
                                        </MenuItem>
                                    </TextField>

                                    
                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                    <TextField
                                        fullWidth
                                        label="Joining Location"
                                        type="string"
                                        required
                                        select
                                        disabled={disableValue}

                                        {...getFieldProps('JoinLoc')}
                                        
                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.JoinLoc && errors.JoinLoc)}
                                        helperText={touched.JoinLoc && errors.JoinLoc}
                                        >

                                        {locData.map((option) => (
                                            < MenuItem key={option.pk} value={option.pk} >
                                                {option.office_loc}
                                            </ MenuItem>
                                        ))}
                                        </TextField>
                                    
                                    <TextField
                                        fullWidth
                                        label="Highest Education"
                                        type="string"
                                        required
                                        disabled

                                        {...getFieldProps('HighEdu')}

                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.HighEdu && errors.HighEdu)}
                                        helperText={touched.HighEdu && errors.HighEdu}
                                    >
                                    </TextField>

                                    <TextField
                                        fullWidth
                                        label="HR Call"
                                        type="string"
                                        required
                                        select
                                        disabled={disableValue}

                                        {...getFieldProps('HRCall')}

                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.HRCall && errors.HRCall)}
                                        helperText={touched.HRCall && errors.HRCall}
                                        >

                                        {FSDMemData.map((option) => (
                                            <MenuItem key={option.pk} value={option.pk}>
                                                {option.first_name + " " + option.last_name} 
                                            </MenuItem>
                                        ))}

                                    </TextField>
                                
                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                    
                                    <TextField
                                        fullWidth
                                        id="CurrAdd"
                                        label="Current Addresss"
                                        multiline
                                        required
                                        rows={2}
                                        disabled={disableValue}

                                        {...getFieldProps("CurrAdd")}

                                        error={Boolean(touched.CurrAdd && errors.CurrAdd)}
                                        helperText={touched.CurrAdd && errors.CurrAdd}
                                    >                                        
                                    </TextField>

                                    <TextField
                                        fullWidth
                                        id="PerAdd"
                                        label="Permanent Addresss"
                                        required
                                        multiline
                                        rows={2}
                                        disabled={disableValue}

                                        {...getFieldProps("PerAdd")}

                                        error={Boolean(touched.PerAdd && errors.PerAdd)}
                                        helperText={touched.PerAdd && errors. PerAdd}
                                    >                                        
                                    </TextField>

                                    <label
                                        onChange={handleAddCheckbox}
                                        style={{width:"50%", padding:"25px"}}
                                    >
                                        <Field
                                        fullWidth 
                                        type="checkbox" 
                                        name="SimilarAdd" 
                                        style={{width:"10%"}}
                                        disabled={disableValue}
                                        />
                                        Are Both Addresses Same ?
                                    </label>

                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ my: 3}}>

                            <LoadingButton
                                size="large"
                                type="submit"
                                variant="contained"
                                loading={isSubmitting}
                                sx={{width:"30%"}} 
                                disabled={disableValue}>                                    
                                Save Details
                            </LoadingButton>

                        </Stack>

                    </Form>
                </FormikProvider>
         </Container>
     </Page>
    )
}