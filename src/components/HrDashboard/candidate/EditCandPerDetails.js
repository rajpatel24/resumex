import { useState, useEffect } from 'react';
import Page from '../../Page';
import {
    Button, Card, CardContent, Container,
    Link, Stack, TextField, Typography,
    InputAdornment, InputLabel, MenuItem
}
    from '@mui/material';

import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider, ErrorMessage, Field } from 'formik';

import * as Yup from 'yup';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { apiInstance } from 'src/utils/apiAuth';


export default function EditCandidatePersonalDetails(candData) {

    const { enqueueSnackbar } = useSnackbar();

    const hrToken = localStorage.getItem("authToken");

    const navigate = useNavigate();

    const location = useLocation();

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const [statusData, setstatusData] = useState([]);

    const [sourceData, setsourceData] = useState([]);

    const [TechData, setTechData] = useState([]);

    const [locData, setlocData] = useState([]);

    const [preferLocData, setpreferlocData] = useState([]);

    const [currencyData, setCurrencyData] = useState([]);

    const [noticePeriodData, setNoticePeriodData] = useState([]);

    const InitialTechList = candData?.candidateData?.technology?.map((obj) => obj.id);

    const PreferLocList = candData?.candidateData?.preferred_location?.map((obj) => obj.id)

    const [disableValue, setDisableValue] = useState(false)

    const [statusDisable, setStatusDisable] = useState(false)

    const  user = JSON.parse(localStorage.getItem("user"))

    const  user_role = user.role.role_name

    const [backUrl, setBackUrl] = useState("/resumeX/candidates") 

    useEffect(() => {
        getStatusList();
        getSourceList();
        getTechList();
        getLocationsList();
        getCurrencyList();
        getNoticePeriodList();
        setOtherValues();
    }, [])

    const setOtherValues = () => {           
        if (user_role === 'BU_HEAD')
        { 
            setDisableValue(true)  
        }
        else if (user_role === 'OnBoarding_HR')
        {
            let back_value = location.state.fromPage
            let newBackPath = "/resumeX/" + back_value
            setDisableValue(true)
            setStatusDisable(false)
            setBackUrl(newBackPath)
        }
        else
        { 
            setDisableValue(false) 
        }
        
    }

    const getStatusList = () => {
        apiInstance({
            method: "get",
            url: "candidate-status/",
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                const statusData = getStatusArray(response.data.data)
                setstatusData(statusData)
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

    const getSourceList = () => {
        apiInstance({
            method: "get",
            url: "candidate-source/",
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                const sourceData = getSourceArray(response.data.data)
                setsourceData(sourceData)
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

    const getTechList = () => {
        apiInstance({
            method: "get",
            url: "technology/",
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                const techListData = getTechArray(response.data.data)
                setTechData(techListData)
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
                setpreferlocData(locData)
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

    const getCurrencyList = () => {

        apiInstance({
            method: "get",
            url: "currency/",
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                const currData = getCurrencyArray(response.data.data)
                setCurrencyData(currData)
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

    const getNoticePeriodList = () => {

        apiInstance({
            method: "get",
            url: "notice-period/",
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                const noticeData = getNoticePeriodArray(response.data.data)
                setNoticePeriodData(noticeData)
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

    const getStatusArray = (statusData) =>
        statusData.map((statusObj) => ({
            pk: statusObj.id,
            statusName: statusObj.status
        }));

    const getSourceArray = (sourceData) =>
        sourceData.map((sourceObj) => ({
            pk: sourceObj.id,
            sourceName: sourceObj.source
        }));

    const getTechArray = (technoData) =>
        technoData.map((technoObj) => ({
            pk: technoObj.id,
            technologyName: technoObj.technology_name
        }));

    const getLocArray = (locData) =>
        locData.map((locObj) => ({
            pk: locObj.id,
            office_loc: locObj.office_location,
            loc_status: locObj.is_active,
        }));

    const getCurrencyArray = (curData) =>
        curData.map((currObj) => ({
            pk: currObj.id,
            curr_name: currObj.curr_name,
            curr_status: currObj.is_active,
        }));

    const getNoticePeriodArray = (NPData) =>
        NPData.map((NPObj) => ({
            pk: NPObj.id,
            notice_period: NPObj.notice_period
        }));

    const calculateExpHike = e => {   
        let present_ctc = values.CurrentCtc
        let demand_ctc = e.target.value

        let hike = ((demand_ctc*100)/present_ctc)- 100

        let final_hike = (present_ctc > 0 && demand_ctc > 0) ? hike : 0
        
        setFieldValue("Exp_Hike", Math.round(final_hike))
    }

    const callUpdateCandidate = (formValues) => {
        var cand_id = candData?.candidateData?.id

        var apiData = {
            "first_name": formValues.FirstName,
            "last_name": formValues.LastName,
            "email": formValues.Email,
            "total_experience": formValues.TotalExp,
            "notice_period_id": formValues.NoticePeriod,
            "current_location": formValues.CurrentLocation.toUpperCase(),
            "last_company": formValues.LastCompany,
            "current_ctc": formValues.CurrentCtc,
            "expected_ctc": formValues.ExpectedCtc,
            "last_serving_date": formValues.LastServingDate,
            "status_id": formValues.Status,
            "source_id": formValues.Source,
            "technology_id": formValues.Technology,
            "dob": formValues.BirthDate,
            "gender": formValues.Gender,
            "currency_id": formValues.Currency,
            "profile_link": formValues.ProfileLink,
            "comments": formValues.Comments,
            "last_company": formValues.LastCompany,
            "gateway_location": formValues.ForLocation,
            "prefer_loc_id": formValues.preferLoc,
            // "join_date": formValues.JoinDate,
            "exp_hike": formValues.Exp_Hike,
            "referred_by": formValues.Referred_By
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
                navigate(0);
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
        FirstName: Yup.string()
            .min(2, "Too Short!")
            .max(50, "Too Long!")
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed.")
            .required("First name required"),
        LastName: Yup.string()
            .min(2, "Too Short!")
            .max(50, "Too Long!")
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed.")
            .required("Last name required"),
        CurrentLocation: Yup.string()
            .min(2, "Too Short!")
            .max(50, "Too Long!")
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed.")
            .required("Current Location required"),
        preferLoc: Yup.array()
            .min(1, "Prefer Location is required"),
        Email: Yup.string()
            .email("Email must be a valid email address")
            .required("Email is required"),
        TotalExp: Yup.string()
            .matches(/^[0-9]{1,2}[.][0-9]{1}$/, "Invalid Input")
            .required("Total Experience required"),
        NoticePeriod: Yup.string()
            .required("Notice Period required"),
        LastServingDate: Yup.date()
            .required("Last serving date is required"),
        CurrentCtc: Yup.number()
            .required("Current CTC Is required"),
        ExpectedCtc: Yup.number()
            .required("Expected CTC Is required"),
        Status: Yup.string()
            .required("Status is required."),
        Source: Yup.string()
            .required("Source is required."),
        Gender: Yup.string()
            .required("Gender is required."),
        LastCompany: Yup.string()
            .required("Last company name is required."),
        ForLocation: Yup.string(),
        Technology: Yup.array()
            .min(1, "Technology is required"),
        Currency: Yup.string()
            .required("Currency is required."),
        BirthDate: Yup.date()
            .required('Birthdate is required.'),
        Referred_By: Yup.string(),
        Exp_Hike: Yup.string(),
    });


    const formik = useFormik({
        initialValues: {
            FirstName: candData?.candidateData?.user?.first_name ?? '',
            LastName: candData?.candidateData?.user?.last_name ?? '',
            CurrentLocation: candData?.candidateData?.current_location ?? '',
            Email: candData?.candidateData?.user?.email ?? '',
            TotalExp: candData?.candidateData?.total_experience ?? '',
            NoticePeriod: candData?.candidateData?.notice_period?.id ?? '',
            Mobile_no: candData?.candidateData?.user?.mobile ?? '',
            CurrentCtc: candData?.candidateData?.current_ctc ?? '',
            ExpectedCtc: candData?.candidateData?.expected_ctc ?? '',
            LastServingDate: candData?.candidateData?.last_serving_date ?? '',
            Status: candData?.candidateData?.status?.id ?? '',
            Source: candData?.candidateData?.source?.id ?? '',
            Gender: candData?.candidateData?.gender ?? '',
            LastCompany: candData?.candidateData?.last_company ?? '',
            Technology: InitialTechList ?? [],
            Currency: candData?.candidateData?.currency?.id ?? '',
            ForLocation: candData?.candidateData?.gateway_location ?? '',
            Comments: candData?.candidateData?.comments ?? '',
            ProfileLink: candData?.candidateData?.profile_link ?? '',
            Requisition: candData?.candidateData?.requisition?.requisite_number ?? '',
            BuGroup: candData?.candidateData?.requisition?.bu_group ?? '',
            Role: candData?.candidateData?.requisition?.department ?? '',
            BirthDate: candData?.candidateData?.dob ?? '',
            preferLoc: PreferLocList ?? [],
            Referred_By: candData?.candidateData?.referred_by ?? '',
            Exp_Hike: candData?.candidateData?.exp_hike ?? ''
        },
        enableReinitialize: true,
        validationSchema: CandidateSchema,
        onSubmit: (values) => {
            callUpdateCandidate(values)
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, handleChange, selectedOption, setFieldValue } = formik;

    return (
        <Page title="Candidates">
            <Container maxWidth="xl">
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                        <Card sx={{ mt: 2 }} variant="outlined">
                            <CardContent sx={{mt:3}}>
                                <Stack spacing={3}>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            id="Requisition"
                                            type="string"
                                            label="Requisition"
                                            disabled
                                            required
                                            variant="standard"

                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                            {...getFieldProps('Requisition')}
                                        />


                                        <TextField
                                            fullWidth
                                            id='BuGroup'
                                            label="BU"
                                            disabled
                                            required
                                            variant="standard"

                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                            {...getFieldProps('BuGroup')}
                                        />

                                        <TextField
                                            fullWidth
                                            id='Role'
                                            label="Role"
                                            disabled
                                            required
                                            variant="standard"

                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                            {...getFieldProps('Role')}
                                        />
                                    </Stack>
                                </Stack>
                            </CardContent>

                            <CardContent>
                                <Typography variant="h6" align="center" color="text.secondary" fontStyle="italic" gutterBottom>
                                    Candidate Details
                                </Typography>
                            </CardContent>

                            <CardContent>
                                <Stack spacing={3}>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('FirstName')}

                                            error={Boolean(touched.FirstName && errors.FirstName)}
                                            helperText={touched.FirstName && errors.FirstName}

                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('LastName')}

                                            error={Boolean(touched.LastName && errors.LastName)}
                                            helperText={touched.LastName && errors.LastName}
                                        >
                                        </TextField>

                                        {<TextField
                                            fullWidth
                                            label="Email"
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('Email')}

                                            error={Boolean(touched.Email && errors.Email)}
                                            helperText={touched.Email && errors.Email}

                                        >
                                        </TextField>}

                                        <TextField
                                            fullWidth
                                            label="Mobile"
                                            disabled
                                            required

                                            {...getFieldProps('Mobile_no')}
                                        /> 

                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            name="BirthDate"
                                            label="BirthDate"
                                            InputLabelProps={{ shrink: true }}
                                            type="date"
                                            required
                                            disabled={disableValue}

                                            style={{ width: '50%' }}

                                            {...getFieldProps('BirthDate')}

                                            error={Boolean(touched.BirthDate && errors.BirthDate)}
                                            helperText={touched.BirthDate && errors.BirthDate}
                                        >
                                        </TextField>

                                        <TextField
                                        label="Current Location "
                                        required
                                        style={{ width: '35%' }}
                                        disabled={disableValue}

                                        {...getFieldProps('CurrentLocation')}

                                        error={Boolean(touched.CurrentLocation && errors.CurrentLocation)}
                                        helperText={touched.CurrentLocation && errors.CurrentLocation}
                                        >
                                        </TextField>

                                        <div role="group" style={{ width: '40%' }}>
                                            <Stack
                                                direction={{ xs: "column", sm: "row" }}
                                                spacing={3}
                                                style={{ padding: "14px 0" }}
                                            >
                                                <div id="gender-radio-group" style={{ color: '#637381' }}> Gender </div>
                                                <label>
                                                    <Field type="radio" name="Gender" 
                                                    value="MALE" 
                                                    disabled={disableValue} />
                                                &nbsp; Male
                                                </label>

                                                <label>
                                                    <Field type="radio" name="Gender" value="FEMALE" 
                                                    disabled={disableValue} />
                                                &nbsp; Female
                                                </label>
                                            </Stack>
                                            <ErrorMessage name="Gender">
                                                {(msg) => <span style={{ color: "#FF4842", fontSize: "14px" }}>{msg}</span>}
                                            </ErrorMessage>
                                        </div>                                  
                                    </Stack>

                                </Stack>
                            </CardContent>

                            <CardContent>
                                <Typography variant="h6" align="center" color="text.secondary" fontStyle="italic" gutterBottom>
                                    Work Information
                                </Typography>
                            </CardContent>

                            <CardContent>
                                <Stack spacing={3}>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            label="Total Experience"
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('TotalExp')}

                                            error={Boolean(touched.TotalExp && errors.TotalExp)}
                                            helperText={touched.TotalExp && errors.TotalExp}
                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="Last Company Name"
                                            placeholder="Ex:- Capegemini"
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('LastCompany')}

                                            error={Boolean(touched.LastCompany && errors.LastCompany)}
                                            helperText={touched.LastCompany && errors.LastCompany}
                                        >
                                        </TextField>

                                        {TechData.length > 0 ?
                                        <TextField
                                            fullWidth
                                            id="Technology"
                                            label="Technology/Skills"
                                            select
                                            required
                                            disabled={disableValue}

                                            SelectProps={{
                                                multiple: true,
                                                value: formik.values.Technology,
                                                onChange: (selectedOption) => handleChange("Technology")(selectedOption),
                                                MenuProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                    },
                                                }

                                            }}

                                            {...getFieldProps("Technology")}

                                            error={Boolean(touched.Technology && errors.Technology)}
                                            helperText={touched.Technology && errors.Technology}

                                        >
                                            {TechData.map((option) => (
                                                <MenuItem key={option.pk} value={option.pk}>
                                                    {option.technologyName}
                                                </MenuItem>
                                            ))}
                                        </TextField> : null}

                                        <TextField
                                            fullWidth
                                            label="Notice Period"
                                            placeholder="0"
                                            select
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('NoticePeriod')}

                                            error={Boolean(touched.NoticePeriod && errors.NoticePeriod)}
                                            helperText={touched.NoticePeriod && errors.NoticePeriod}
                                        >

                                            {noticePeriodData.map((option) => (
                                                <MenuItem key={option.pk} value={option.pk}>
                                                    {option.notice_period}
                                                </MenuItem>
                                            ))}

                                        </TextField>
                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            label="Last Serving Date"
                                            InputLabelProps={{ shrink: true }}
                                            type="date"
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('LastServingDate')}

                                            error={Boolean(touched.LastServingDate && errors.LastServingDate)}
                                            helperText={touched.LastServingDate && errors.LastServingDate}
                                        >
                                        </TextField>
                                        
                                        <TextField
                                            fullWidth
                                            label="Current CTC"
                                            placeholder="450000.00"
                                            type="number"
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('CurrentCtc')}

                                            error={Boolean(touched.CurrentCtc && errors.CurrentCtc)}
                                            helperText={touched.CurrentCtc && errors.CurrentCtc}
                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="Expected CTC"
                                            placeholder="550000.00"
                                            type="number"
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('ExpectedCtc')}

                                            onInput={calculateExpHike}

                                            error={Boolean(touched.ExpectedCtc && errors.ExpectedCtc)}
                                            helperText={touched.ExpectedCtc && errors.ExpectedCtc}
                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="Expected Hike (in %)"
                                            disabled

                                            {...getFieldProps('Exp_Hike')}

                                            error={Boolean(touched.Exp_Hike && errors.Exp_Hike)}
                                            helperText={touched.Exp_Hike && errors.Exp_Hike}
                                        >
                                        </TextField>
                                    </Stack>
                                </Stack>
                            </CardContent>

                            <CardContent>
                                <Typography variant="h6" align="center" color="text.secondary" align="center" fontStyle="italic" gutterBottom>
                                    Additional Information
                                </Typography>
                            </CardContent>

                            <CardContent>                            
                                <Stack spacing={3}>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            id="Currency"
                                            type="string"
                                            label="Currency"
                                            select
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps("Currency")}

                                            error={Boolean(touched.Currency && errors.Currency)}
                                            helperText={touched.Currency && errors.Currency}
                                        >

                                            {currencyData.map((option) => (
                                                <MenuItem key={option.pk} value={option.pk}>
                                                    {option.curr_name}
                                                </MenuItem>
                                            ))}

                                        </TextField>

                                        {preferLocData.length > 0 ?
                                        <TextField
                                        fullWidth
                                        id="PreferLoc"
                                        label="Prefer Location"
                                        select
                                        disabled={disableValue}

                                        SelectProps={{
                                            multiple: true,
                                            value: formik.values.preferLoc,
                                            onChange: (selectedOption) => handleChange("preferLoc")(selectedOption),
                                            MenuProps: {
                                                style: {
                                                    maxHeight: 200,
                                                },
                                            }

                                        }}

                                        {...getFieldProps("preferLoc")}

                                        error={Boolean(touched.preferLoc && errors.preferLoc)}
                                        helperText={touched.preferLoc && errors.preferLoc}
                                        >
                                        {preferLocData.map((option) => (
                                            <MenuItem key={option.pk} value={option.pk}>
                                            {option.office_loc}
                                            </MenuItem>
                                        ))}
                                        </TextField> : null }

                                        <TextField
                                            fullWidth
                                            id="ForLocation"
                                            type="string"
                                            label="Work Location"
                                            select
                                            disabled={disableValue}

                                            SelectProps={{
                                                value: formik.values.ForLocation,
                                                onChange: (selectedOption) => handleChange("ForLocation")(selectedOption),
                                                MenuProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                    },
                                                }
                                            }}

                                            {...getFieldProps("ForLocation")}

                                            error={Boolean(touched.ForLocation && errors.ForLocation)}
                                            helperText={touched.ForLocation && errors.ForLocation}
                                        >

                                            <MenuItem key="CH-1A" value="CH-1A"> CH-1A </MenuItem>
                                            <MenuItem key="CH-1B" value="CH-1B"> CH-1B </MenuItem>
                                            <MenuItem key="CH-2" value="CH-2"> CH-2 </MenuItem>
                                            <MenuItem key="CH-3" value="CH-3"> CH-3 </MenuItem>
                                            <MenuItem key="CH-4" value="CH-4"> CH-4 </MenuItem>
                                            <MenuItem key="CH-5" value="CH-5"> CH-5 </MenuItem>
                                            <MenuItem key="CH-6" value="CH-6"> CH-6 </MenuItem>
                                            <MenuItem key="CH-8" value="CH-8"> CH-8 </MenuItem>
                                            <MenuItem key="CH-9" value="CH-9"> CH-9 </MenuItem>


                                            {locData.map((option) => (
                                                option.office_loc != 'Ahmedabad' ?
                                                    < MenuItem key={option.office_loc} value={option.office_loc} >
                                                        {option.office_loc}
                                                    </ MenuItem> : ""
                                            ))}
                                        </TextField>
                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            label="Referred By"
                                            type="string"
                                            disabled={disableValue}
                                            {...getFieldProps('Referred_By')}

                                            error={Boolean(touched.Referred_By && errors.Referred_By)}
                                            helperText={touched.Referred_By && errors.Referred_By}
                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            id="Status"
                                            type="string"
                                            label="Status"
                                            select
                                            required
                                            disabled={user_role === 'OnBoarding_HR' ? statusDisable : disableValue}

                                            SelectProps={{
                                                value: formik.values.Status,
                                                onChange: (selectedOption) => handleChange("Status")(selectedOption),
                                                MenuProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                    },
                                                }
                                            }}

                                            {...getFieldProps("Status")}

                                            error={Boolean(touched.Status && errors.Status)}
                                            helperText={touched.Status && errors.Status}
                                        >

                                            {statusData.map((option) => (
                                                <MenuItem key={option.pk} value={option.pk}>
                                                    {option.statusName}
                                                </MenuItem>
                                            ))}

                                        </TextField>

                                        <TextField
                                            fullWidth
                                            id="Source"
                                            type="string"
                                            label="Source"
                                            select
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps("Source")}

                                            error={Boolean(touched.Source && errors.Source)}
                                            helperText={touched.Source && errors.Source}
                                        >

                                            {sourceData.map((option) => (
                                                <MenuItem key={option.pk} value={option.pk}>
                                                    {option.sourceName}
                                                </MenuItem>
                                            ))}


                                        </TextField>
                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            id="ProfileLink"
                                            label="Profile Link"
                                            multiline
                                            rows={4}
                                            disabled={disableValue}

                                            {...getFieldProps("ProfileLink")}
                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            id="Comments"
                                            label="Comments"
                                            multiline
                                            disabled={disableValue}
                                            rows={4}

                                            {...getFieldProps("Comments")}
                                        >
                                        </TextField>
                                    </Stack>
                                </Stack>
                            </CardContent>                               
                        </Card>

                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

                        <LoadingButton
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            loading={isSubmitting}
                            disabled={user_role === 'OnBoarding_HR' ? statusDisable : disableValue}
                        >
                            Update Profile
                        </LoadingButton>

                    </Form>
                </FormikProvider>
            </Container>
        </Page>
    )
}