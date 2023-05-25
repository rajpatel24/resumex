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
import Autocomplete from '@mui/material/Autocomplete';
import { format } from 'date-fns';
import { apiInstance } from 'src/utils/apiAuth';

// const apiInstance = axios.create({
//     baseURL: "http://127.0.0.1:8000/api/v1/",
//     timeout: 10000
// });


export default function CandOnboardingDetails({candData}) {
    const { enqueueSnackbar } = useSnackbar();

    const hrToken = localStorage.getItem("authToken");

    const navigate = useNavigate();

    const [candOnboardDetailsData, setCandOnboardDetailsData] = useState(candData?.candidateData?.onboard_details);

    const [signingAuthorityData, setSigningAuthorityData] = useState([]);

    const [onboardingHRData, setOnboardingHRData] = useState([]);

    const [payrollCompData, setPayrollCompData] = useState([]);

    const todayDate = format(new Date(), 'yyyy-MM-dd')

    const [disableValue, setDisableValue] = useState(false)
   
    const setOtherValues = () => 
    {
        let user = JSON.parse(localStorage.getItem("user"))
        let user_role = user.role.role_name
            
        if (user_role === 'BU_HEAD' || user_role === 'OnBoarding_HR')
        { setDisableValue(true)  }

        else{ setDisableValue(false) }
    }

  
    useEffect(() => {
        getSigningAuthorityList();
        getOnboardingHRList();
        getPayrollCompanyList();
        setOtherValues();
    }, [])

    const RO_Names = [
        'Ajay K Chawla',
        'Aesha P Shah',
        'Alap D Mistry',
        'Bhoomi R Vyas',
      ]


    const getSigningAuthorityList = () => {
    apiInstance({
        method: "get",
        url: "signing-authority/",
        headers: {
            Authorization: "token " + hrToken,
        }
    })
        .then(function (response) {
            const authorityData = getAuthorityArray(response.data.data)
            setSigningAuthorityData(authorityData)
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

    const getOnboardingHRList = () => {
        apiInstance({
            method: "get",
            url: "onboarding-hr/",
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                const HRData = getHRArray(response.data.data)
                setOnboardingHRData(HRData)
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

    const getPayrollCompanyList = () => {
        apiInstance({
            method: "get",
            url: "payroll-company/",
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                const payrollData = getCompanyArray(response.data.data)
                setPayrollCompData(payrollData)
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
    
    const getAuthorityArray = (Data) =>
    Data.map((authorityObj) => ({
        pk: authorityObj?.id,
        authorityName: authorityObj?.authority_name
    }));

    const getHRArray = (HR_Data) =>
    HR_Data.map((HR_Obj) => ({
        pk: HR_Obj?.id,
        hr_name: HR_Obj?.hr_name
    }));

    const getCompanyArray = (Company_Data) =>
    Company_Data.map((company_Obj) => ({
        pk: company_Obj?.id,
        company_name: company_Obj?.company_name
    }));


    const callOnboardCreateAPI = (apiPayload) => {

        apiInstance({
            method: "post",
            url: "onboard-details/",
            headers: {
                Authorization: "token " + hrToken,
            },
            data: apiPayload,
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

    const callOnboardUpdateAPI = (apiPayload, onboard_obj_id) => {

        apiInstance({
            method: "put",
            url: "onboard-details/" + onboard_obj_id + "/",
            headers: {
                Authorization: "token " + hrToken,
            },
            data: apiPayload,
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


    const CandidateSchema = Yup.object().shape({
        Project: Yup.string()
            .min(2, "Too Short!")
            .max(50, "Too Long!")
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed.")
            .required("Project is required"),
        JoinDate: Yup.date(),
        REF_NO: Yup.string(),
        OfferDate: Yup.date()
            .required("offer date is required."),
        Report_Officer: Yup.string(),
        Sodexo: Yup.string(),
        Health_Insurance: Yup.string(),
        Sign_Auth: Yup.string()
            .required("Signing Authority is required"),
        Com_Ext: Yup.string(),
        Onboard_HR: Yup.string()
            .required("Onboarding HR is required"),
        Payroll_Cmp: Yup.string()
            .required("Payroll company is required"),
        Sys_Req: Yup.string(),
        Accommodation: Yup.string(),
        Stay_Days: Yup.number(),
        Ref_Amt: Yup.number(),
        FSD_Cmt: Yup.string()
            .required("FSD member comments are required"),
        
    });


    const formik = useFormik({
        initialValues: {
            Project: candOnboardDetailsData?.project ?? "",
            JoinDate: candOnboardDetailsData?.join_date ?? todayDate,
            REF_NO: candOnboardDetailsData?.ref_no ?? "",
            OfferDate: candOnboardDetailsData?.offer_date ?? todayDate,
            Report_Officer: candOnboardDetailsData?.reporting_officer ?? "",
            Sodexo: candOnboardDetailsData?.sodexo ?? "NO",
            Health_Insurance: candOnboardDetailsData?.health_insurance ?? "NO",
            Sign_Auth: candOnboardDetailsData?.sign_authority.id ?? "",
            Com_Ext: candOnboardDetailsData?.company_extn ?? "",
            Onboard_HR: candOnboardDetailsData?.onboarding_hr.id ?? "",
            Payroll_Cmp:candOnboardDetailsData?.payroll_com.id ?? "",
            Sys_Req: candOnboardDetailsData?.sys_req ?? "Desktop",
            Accommodation: candOnboardDetailsData?.accommodation ?? "NO",
            Stay_Days: candOnboardDetailsData?.stay_days ?? 0,
            Ref_Amt: candOnboardDetailsData?.refer_amt ?? "",
            FSD_Cmt: candOnboardDetailsData?.fsd_comments ?? "",
        },

        enableReinitialize: true,
        validationSchema: CandidateSchema,
        onSubmit: (values) => {
            var cand_id = candData?.candidateData?.id

            var apiData = {
                "candidate_id": cand_id,
                "project": values.Project,
                "join_date": values.JoinDate,
                "offer_date": values.OfferDate,
                "reporting_officer": values.Report_Officer,
                "sodexo": values.Sodexo,
                "health_insurance": values.Health_Insurance,
                "sign_authority_id": values.Sign_Auth,
                "onboarding_hr_id": values.Onboard_HR,
                "payroll_com_id": values.Payroll_Cmp,
                "company_extn": values.Com_Ext,
                "sys_req": values.Sys_Req,
                "accommodation": values.Accommodation,
                "stay_days": values.Stay_Days,
                "refer_amt": values.Ref_Amt,
                "fsd_comments": values.FSD_Cmt,
            }

            if(candOnboardDetailsData === null){
                callOnboardCreateAPI(apiData)
            }
            else{
                var onboard_id = candOnboardDetailsData.id
                callOnboardUpdateAPI(apiData, onboard_id)
            }
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, handleChange, setFieldValue } = formik;

    return (
        <Page title="Candidates">
            <Container maxWidth="xl">
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                        <Card sx={{ mt: 2 }} variant="outlined">

                            <CardContent sx={{ mt: 2 }}>
                                <Stack spacing={3}>
                                    
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            label="Project"
                                            type="string"
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('Project')}

                                            error={Boolean(touched.Project && errors.Project)}
                                            helperText={touched.Project && errors.Project}
                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="Joining Date"
                                            type="date"
                                            disabled={disableValue}
                                            required

                                            InputLabelProps={{ shrink: true }}
                                            inputProps={{
                                                min: todayDate  
                                              }}

                                            {...getFieldProps('JoinDate')}

                                            error={Boolean(touched.JoinDate && errors.JoinDate)}
                                            helperText={touched.JoinDate && errors.JoinDate}
                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="REF NO"
                                            disabled
                                            
                                            {...getFieldProps('REF_NO')}

                                            error={Boolean(touched.REF_NO && errors.REF_NO)}
                                            helperText={touched.REF_NO && errors.REF_NO}
                                        >
                                        </TextField>

                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            name="OfferDate"
                                            label="Date Of Offer"
                                            InputLabelProps={{ shrink: true }}
                                            type="date"
                                            disabled={disableValue}              
                                           
                                            {...getFieldProps('OfferDate')}

                                            error={Boolean(touched.OfferDate && errors.OfferDate)}
                                            helperText={touched.OfferDate && errors.OfferDate}
                                        >
                                        </TextField>

                                        <Autocomplete 
                                            fullWidth                         
                                            id="Report_Officer"
                                            type="string"
                                            options={RO_Names}
                                            disabled={disableValue}

                                            onChange={(event, value) => {
                                                setFieldValue("Report_Officer", value);
                                            }}

                                            defaultValue={candOnboardDetailsData?.reporting_officer}

                                            renderInput={(params) => <TextField {...params} label="Reporting Officer" />}
                                        />

                                        <TextField
                                            fullWidth
                                            label="Sodexo"
                                            type="string"
                                            disabled={disableValue}

                                            select

                                            {...getFieldProps('Sodexo')}

                                            InputLabelProps={{ shrink: true }}

                                            error={Boolean(touched.Sodexo && errors.Sodexo)}
                                            helperText={touched.Sodexo && errors.Sodexo}
                                            >

                                            <MenuItem key="YES" value="YES">
                                            YES
                                            </MenuItem>
                                            <MenuItem key="NO" value="NO">
                                            NO
                                            </MenuItem>
                                            <MenuItem key="NA" value="NA">
                                            NA
                                            </MenuItem>
                                        </TextField>
                                                 
                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                    <TextField
                                        fullWidth
                                        label="Is one covered by Health Insurance?"
                                        type="string"
                                        disabled={disableValue}

                                        select

                                        {...getFieldProps('Health_Insurance')}

                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.Health_Insurance && errors.Health_Insurance)}
                                        helperText={touched.Health_Insurance && errors.Health_Insurance}
                                        >

                                        <MenuItem key="YES" value="YES">
                                        YES
                                        </MenuItem>
                                        <MenuItem key="NO" value="NO">
                                        NO
                                        </MenuItem>

                                    </TextField>

                                    <TextField
                                        fullWidth
                                        label="Signing Authority"
                                        type="string"
                                        required
                                        disabled={disableValue}
                                        
                                        select

                                        InputLabelProps={{ shrink: true }}

                                        {...getFieldProps('Sign_Auth')}
                                        
                                        error={Boolean(touched.Sign_Auth && errors.Sign_Auth)}
                                        helperText={touched.Sign_Auth && errors.Sign_Auth}
                                        >

                                        {signingAuthorityData.map((option) => (
                                        <MenuItem key={option.pk} value={option.pk}>
                                            {option.authorityName}
                                        </MenuItem>
                                        ))}

                                    </TextField>

                                    <TextField
                                        fullWidth
                                        label="Group Company Extn."
                                        type="string"
                                        disabled={disableValue}

                                        {...getFieldProps('Com_Ext')}
                                        
                                        error={Boolean(touched.Com_Ext && errors.Com_Ext)}
                                        helperText={touched.Com_Ext && errors.Com_Ext}
                                        >

                                    </TextField>
                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                    <TextField
                                        fullWidth
                                        label="Onboarding HR"
                                        type="string"
                                        disabled={disableValue}

                                        select

                                        {...getFieldProps('Onboard_HR')}

                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.Onboard_HR && errors.Onboard_HR)}
                                        helperText={touched.Onboard_HR && errors.Onboard_HR}
                                        >

                                        {onboardingHRData.map((option) => (
                                        <MenuItem key={option.pk} value={option.pk}>
                                            {option.hr_name}
                                        </MenuItem>
                                        ))}
   
                                    </TextField>

                                    <TextField
                                        fullWidth
                                        label="Payroll Company"
                                        type="string"
                                        disabled={disableValue}

                                        select
                                        required

                                        {...getFieldProps('Payroll_Cmp')}

                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.Payroll_Cmp && errors.Payroll_Cmp)}
                                        helperText={touched.Payroll_Cmp && errors.Payroll_Cmp}
                                        >

                                        {payrollCompData.map((option) => (
                                        <MenuItem key={option.pk} value={option.pk}>
                                            {option.company_name}
                                        </MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        fullWidth
                                        label="System Requirement"
                                        type="string"
                                        disabled={disableValue}

                                        select

                                        {...getFieldProps('Sys_Req')}

                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.Sys_Req && errors.Sys_Req)}
                                        helperText={touched.Sys_Req && errors.Sys_Req}
                                        >
                                        
                                        <MenuItem key="Desktop" value="Desktop">
                                            Desktop
                                        </MenuItem>
                                        <MenuItem key="Laptop" value="Laptop">
                                            Laptop
                                        </MenuItem>
                                        <MenuItem key="Mac" value="Mac">
                                            Mac
                                        </MenuItem>
    
                                    </TextField>

                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                    <TextField
                                        fullWidth
                                        label="Accommodation"
                                        type="string"
                                        disabled={disableValue}

                                        select

                                        {...getFieldProps('Accommodation')}

                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.Accommodation && errors.Accommodation)}
                                        helperText={touched.Accommodation && errors.Accommodation}
                                        >

                                        <MenuItem key="YES" value="YES">
                                        YES
                                        </MenuItem>
                                        <MenuItem key="NO" value="NO">
                                        NO
                                        </MenuItem>
                                    </TextField>

                                    <TextField
                                        fullWidth
                                        label="Stay Days"
                                        type="number"
                                        disabled={disableValue}

                                        select

                                        {...getFieldProps('Stay_Days')}

                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.Stay_Days && errors.Stay_Days)}
                                        helperText={touched.Stay_Days && errors.Stay_Days}
                                        >

                                        <MenuItem key="0" value="0">
                                            0
                                        </MenuItem>
                                        <MenuItem key="7" value="7">
                                            7
                                        </MenuItem>
                                        <MenuItem key="10" value="10">
                                            10
                                        </MenuItem>
                                        <MenuItem key="15" value="15">
                                            15
                                        </MenuItem>
                                        <MenuItem key="30" value="30">
                                            30
                                        </MenuItem>
                                        <MenuItem key="45" value="45">
                                            45
                                        </MenuItem>
                                        <MenuItem key="60" value="60">
                                            60
                                        </MenuItem>
                                        <MenuItem key="75" value="75">
                                            75
                                        </MenuItem>
                                        <MenuItem key="90" value="90">
                                            90
                                        </MenuItem>
                                    </TextField>

                                    <TextField
                                        fullWidth
                                        label="Referral Amount"
                                        type="number"
                                        disabled={disableValue}

                                        {...getFieldProps('Ref_Amt')}

                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.Ref_Amt && errors.Ref_Amt)}
                                        helperText={touched.Ref_Amt && errors.Ref_Amt}
                                        >
                                    </TextField>
                                </Stack>

                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                    <TextField
                                        label="FSD Member Comments"
                                        type="string"
                                        multiline
                                        rows={3}
                                        disabled={disableValue}

                                        required

                                        {...getFieldProps('FSD_Cmt')}

                                        sx={{width:"50%"}}

                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.FSD_Cmt && errors.FSD_Cmt)}
                                        helperText={touched.FSD_Cmt && errors.FSD_Cmt}
                                        >
                                    </TextField>

                                </Stack>

                                </Stack>
                            </CardContent>
                        </Card>

                        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ my: 3}}>

                            <LoadingButton
                                halfWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                loading={isSubmitting}
                                sx={{width:"30%"}}
                                disabled={disableValue}
                            >
                                Save Onboarding Details
                            </LoadingButton>

                        </Stack>
                    </Form>
                </FormikProvider>
             </Container>
        </Page>
    )
}
