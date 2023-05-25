import { useState, useEffect } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react'
import Page from '../../Page';
import {
    Button, Card, CardContent, Container,
    Link, Stack, TextField, Typography,
    InputAdornment, InputLabel, MenuItem,
    SpeedDial, SpeedDialIcon, SpeedDialAction
}
    from '@mui/material';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider, ErrorMessage, Field, setFieldValue } from 'formik';

import * as Yup from 'yup';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack'

import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import { apiInstance } from 'src/utils/apiAuth';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

const actions = [
    { icon: <FileCopyIcon />, name: 'Copy' },
    { icon: <PrintIcon />, name: 'Print' },
    { icon: <EmailIcon />, name: 'Email' },
    { icon: <CallIcon />, name: 'Call' },
];

export default function CreateCandidateForm() {

    const { enqueueSnackbar } = useSnackbar();

    const hrToken = localStorage.getItem("authToken");

    const navigate = useNavigate();

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const [statusData, setstatusData] = useState([]);

    const [sourceData, setsourceData] = useState([]);

    const [requisitionData, setRequisitionData] = useState([])

    const [noticePeriodData, setNoticePeriodData] = useState([]);

    const [recordfile, setrecordFile] = useState(null);

    const [resumefile, setResumeFile] = useState(null);

    const [parsedResumeData, setParsedResumeData] = useState(null);

    const parseButton = React.useRef()

    const [parseClicked, setParseClicked] = useState(1);

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
      };

    let user = JSON.parse(localStorage.getItem("user"))
    let user_role = user.role.role_name

    useEffect(() => {
        getStatusList();
        getSourceList();
        getRequisitionData();
        getNoticePeriodList();
    }, [])

    const handleRecordingUpload = (event) => {
        const recordingFile = event.target.files[0]
        formik.setFieldValue("Recording", recordingFile);
        setrecordFile(recordingFile)
    };

    const handleResumeUpload = (event) => {
        const resumeFile = event.target.files[0]
        formik.setFieldValue("Resume", resumeFile);
        setResumeFile(resumeFile)
        setParseClicked(1)
    };

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

    const getRequisitionData = () => {
        apiInstance({
            method: "get",
            url: "requisitions/",
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                const requisiteData = getRequisiteArray(response.data.data)
                setRequisitionData(requisiteData)
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

    const callCreateCandidate = async (formValues) => {
        var new_mobile_no = "+91" + formValues.Mobile_no;

        var bodyFormData = new FormData();

        bodyFormData.append("first_name", formValues.FirstName);
        bodyFormData.append("last_name", formValues.LastName);
        bodyFormData.append("email", formValues.Email);
        bodyFormData.append("mobile", new_mobile_no);
        bodyFormData.append("total_experience", formValues.TotalExp);
        bodyFormData.append("notice_period_id", formValues.NoticePeriod);
        bodyFormData.append("gender", formValues.Gender);
        bodyFormData.append("current_location", formValues.CurrentLocation.toUpperCase());
        bodyFormData.append("last_company", formValues.LastCompany);
        bodyFormData.append("current_ctc", formValues.CurrentCtc);
        bodyFormData.append("expected_ctc", formValues.ExpectedCtc);
        bodyFormData.append("requisition_id", formValues.Requisition);
        bodyFormData.append("status_id", formValues.Status);
        bodyFormData.append("source_id", formValues.Source);
        // bodyFormData.append("recording_file", recordfile);
        bodyFormData.append("exp_hike", formValues.Exp_Hike);
        bodyFormData.append("referred_by", formValues.Referred_By);

        if (recordfile != null){
            bodyFormData.append("recording_file", recordfile); }
        else{
            bodyFormData.append("recording_file", ""); 
        }

        if (resumefile != null){
            bodyFormData.append("resume_file", resumefile); }
        else{
            bodyFormData.append("resume_file", ""); 
        }


        await apiInstance({
            method: "post",
            url: "candidate-viewset/",
            headers: {
                Authorization: "token " + hrToken,
                'Content-Type': "multipart/form-data",
            },
            data: bodyFormData,
        })
            .then(async function (response) { 
                enqueueSnackbar(response.data.message, {
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    variant: 'success',
                    autoHideDuration: 2000,
                });
                navigate("/resumeX/candidates", { replace: true });
                            //NESTED API FOR JOB APPLICATION CREATION
                            // let candId = response?.data?.data?.id
                            // if (resumefile != null){
                            //     bodyFormData.append("resume_file", resumefile); }
                            // else{
                            //     bodyFormData.append("resume_file", ""); 
                            // }
                            // await apiInstance({
                            //     method: "put",
                            //     url: "candidate-viewset/" + candId + "/",
                            //     headers: {
                            //         Authorization: "token " + hrToken,
                            //         'Content-Type': "multipart/form-data",
                            //     },
                            //     data: bodyFormData,
                            // })
                            //     .then(async function (response) {
                                    // enqueueSnackbar(response.data.message, {
                                    //     anchorOrigin: {
                                    //         vertical: 'top',
                                    //         horizontal: 'right',
                                    //     },
                                    //     variant: 'success',
                                    //     autoHideDuration: 2000,
                                    // });
                                    // navigate("/resumeX/candidates", { replace: true });
                            //     })
                            //     .catch(function (error) {
                            //         enqueueSnackbar('Something went wrong. Please try after sometime.', {
                            //             anchorOrigin: {
                            //                 vertical: 'top',
                            //                 horizontal: 'right',
                            //             },
                            //             variant: 'error',
                            //             autoHideDuration: 2000,
                            //         });
                            // })
            })
            .catch(function (error) {
                let error_msg_key = Object.keys(error.response.data)[0]
                let err_msg = error.response.data?.[error_msg_key]

                enqueueSnackbar(err_msg, {
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

    const getRequisiteArray = (reqData) => {
        if(user_role === 'DRM')
        {
            let uid = user.pk
            const result = reqData
                .map(item => ({
                    ...item,
                    children: item.assigned_fsd_user?.filter(child => child?.member?.pk === uid)
                }))
                .filter(item => item.children.length > 0)
            
            const filteredReq = result.map((reqObj) => ({
                pk: reqObj.id,
                requisiteNumber: reqObj.requisite_number,
                type: reqObj.requisite_type.req_type_name,
                department: reqObj.department.job_category_name,
                bu_group: reqObj.bu_group.bu_name,
                job_name: reqObj.job_name,
            })) 
            return filteredReq
        }
        else
        {
            let req_data = reqData.map((reqObj) => ({
                        pk: reqObj.id,
                        requisiteNumber: reqObj.requisite_number,
                        type: reqObj.requisite_type.req_type_name,
                        department: reqObj.department.job_category_name,
                        bu_group: reqObj.bu_group.bu_name,
                        job_name: reqObj.job_name,
                    })) 
        
            return req_data
        }
    }

    const getNoticePeriodArray = (NPData) =>
        NPData.map((NPObj) => ({
            pk: NPObj.id,
            notice_period: NPObj.notice_period
        }));

    const calculateExpHike = e => {   
        let present_ctc = values.CurrentCtc
        let demand_ctc = e.target.value

        let hike = ((demand_ctc*100)/present_ctc)- 100
        
        setFieldValue("Exp_Hike", Math.round(hike))
    }

    const CandidateSchema = Yup.object().shape({
        Mobile_no: Yup.string()
            .matches(phoneRegExp, 'Mobile Number is not valid')
            .min(10, 'Mobile Number must be of 10 digit')
            .max(10, 'Mobile Number must be of 10 digit')
            .required('Mobile Number is required'),
        FirstName: Yup.string()
            .min(2, "Too Short!")
            .max(50, "Too Long!")
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for first name ")
            .required("First name required"),
        LastName: Yup.string()
            .min(2, "Too Short!")
            .max(50, "Too Long!")
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for last name ")
            .required("Last name required"),
        CurrentLocation: Yup.string()
            .min(2, "Too Short!")
            .max(50, "Too Long!")
            // .matches(/^[A-Z\s]+$/, "Only uppercase letters are allowed for current location")
            .required("Current Location required"),
        Email: Yup.string()
            .email("Email must be a valid email address")
            .required("Email is required"),
        TotalExp: Yup.string()
            .matches(/^[0-9]{1,2}[.][0-9]{1}$/, "Invalid Input")
            .required("Total Experience required"),
        NoticePeriod: Yup.string()
            .matches(/^[0-9]+$/, "Only numbers are allowed.")
            .required("Notice Period required"),
        // CurrentCtc: Yup.string()
        //     .matches(/^[0-9]{1,2}[.][0-9]{1,2}$/, "Invalid Input")
        //     .required("Current CTC Is required"),
        // ExpectedCtc: Yup.string()
        //     .matches(/^[0-9]{1,2}[.][0-9]{1,2}$/, "Invalid Input")
        //     .required("Expected CTC Is required"),
        CurrentCtc: Yup.number()
        .required("Current CTC Is required"),
        ExpectedCtc: Yup.number()
        .required("Expected CTC Is required"),
        Status: Yup.string()
            .required("Status is required."),
        LastCompany: Yup.string(),
        Requisition: Yup.string()
            .required("Requisition is required."),
        Source: Yup.string()
            .required("Source is required."),
        Gender: Yup.string()
            .required("Gender is required."),
        Referred_By: Yup.string(),
        Exp_Hike: Yup.string(),
        Recording: Yup.mixed(),
        Resume: Yup.mixed(),

    });


    const formik = useFormik({
        initialValues: {
            FirstName: '',
            LastName: '',
            CurrentLocation: '',
            Email: '',
            TotalExp: '',
            NoticePeriod: '',
            Mobile_no: '',
            CurrentCtc: '',
            ExpectedCtc: '',
            Status: '',
            LastCompany: '',
            Source: '',
            Gender: '',
            Recording: '',
            Resume: '',
            Requisition: '',
            Referred_By: '',
            Exp_Hike: '',
            
        },
        validationSchema: CandidateSchema,
        onSubmit: (values) => {
            // call create candidate API
            callCreateCandidate(values)
        }
    });

    function parseThisResume(){
        if (parseClicked<3) {
          setParseClicked(parseClicked+1)
        var parseData = new FormData();
        parseData.append("resume_file", resumefile); 
        apiInstance({
            method: "post",
            url: "parse-resume/",
            headers: {
                Authorization: "token " + hrToken,
                'Content-Type': "multipart/form-data",
            },
            data: parseData,
        })  
            .then(function (response) {
                setParsedResumeData(response.data.data);
                setFieldValue("FirstName", parsedResumeData?.First_Name);
                setFieldValue("LastName", parsedResumeData?.Last_Name);
                setFieldValue("Email", parsedResumeData?.Email);
                setFieldValue("Mobile_no", parsedResumeData?.PhoneNo);
                setFieldValue("CurrentLocation", parsedResumeData?.City);
                setFieldValue("TotalExp", parsedResumeData?.Experience_Years + ".0");
                parseButton.current.click()
            })
            .catch(function (error) {
                console.log("Error")
            });
        }
    }

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, setFieldValue } = formik;


    return (
        <Page title="Candidates">
            <Container maxWidth="xl">
                <Stack direction={{ xs: "column", sm: "row" }} spacing={72} sx={{ mb: 2 }}>
                    <Link to="/resumeX/candidates" 
                        color="green" 
                        underline="hover" 
                        component={RouterLink} 
                        fontSize="20px"> 
                            <ArrowCircleLeftIcon fontSize="large" />
                    </Link>

                    {/* <Typography variant="h4" sx={{ mb: 5 }} align="center" color="black">
                        Create Candidate
                    </Typography> */}

                    <h2 align="center" style={{fontSize: '25px', fontWeight: '800', marginBottom: '30px'}}>Create Candidate</h2>
                </Stack>


                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Card sx={{ mt: 2 }} variant="outlined" style={{ border: "none", boxShadow: "none" }}>
                            <CardContent>
                                <Stack  direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <InputLabel id="resume-upload-label" style={{ width: "8%", padding: "8px 0px 0px 0px" }} > Resume: </InputLabel>
                                <input id="Resume" name="Resume" type="file" className="form-control" sx={{height: "80%"}} accept=".pdf" onChange={handleResumeUpload} />
                                <ErrorMessage name="Resume"> {(msg) => <span style={{ width: "30%", color: "#FF4842", fontSize: "14px", textAlign: "center" }}> {msg} </span>} </ErrorMessage>
                                <LoadingButton size="small" variant="outlined" ref={parseButton} onClick={parseThisResume} > Parse </LoadingButton>
                                </Stack> 
                            </CardContent>
                        </Card>
                        <Card sx={{ mt: 2 }} variant="outlined" style={{ border: "none", boxShadow: "none" , marginTop: "-1.4%"}}>
                            <CardContent sx={{ mb: 3 }}>
                                <Typography variant="h6" color="text.secondary" fontStyle="italic" gutterBottom>
                                    <div style={{float: "left", width: "50%", marginTop: "20px"}}>
                                        Candidate Details
                                    </div>
                                    <div style={{float: "left", textAlign: "right", width: "50%"}}>
                                        <SpeedDial
                                            ariaLabel="SpeedDial basic example"
                                            icon={<SpeedDialIcon />}
                                            direction="left"
                                        >
                                            {actions.map((action) => (
                                            <SpeedDialAction
                                                key={action.name}
                                                icon={action.icon}
                                                tooltipTitle={action.name}
                                            />
                                            ))}
                                        </SpeedDial>
                                    </div>
                                </Typography>
                            </CardContent>
                            <CardContent>
                                <Stack spacing={3}>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            id="Requisition"
                                            type="string"
                                            label="Requisition"
                                            select
                                            SelectProps={{
                                                MenuProps: {
                                                    style: {
                                                        maxHeight: 300,
                                                    },
                                                }
        
                                            }}
                                            {...getFieldProps("Requisition")}
                                            error={Boolean(touched.Requisition && errors.Requisition)}
                                            helperText={touched.Requisition && errors.Requisition}
                                        >

                                            {requisitionData.map((option) => (
                                                <MenuItem key={option.pk} value={option.pk}>
                                                    {option.requisiteNumber + ' | ' +
                                                        option.type + ' | ' +
                                                        option.department + ' | ' +
                                                        option.bu_group + ' | ' + option.job_name.toUpperCase()
                                                    }
                                                </MenuItem>
                                            ))}


                                        </TextField>
                                    </Stack>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            label="First Name"

                                            {...getFieldProps('FirstName')}

                                            error={Boolean(touched.FirstName && errors.FirstName)}
                                            helperText={touched.FirstName && errors.FirstName}

                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="Last Name"

                                            {...getFieldProps('LastName')}

                                            error={Boolean(touched.LastName && errors.LastName)}
                                            helperText={touched.LastName && errors.LastName}
                                        >
                                        </TextField>

                                        {<TextField
                                            fullWidth
                                            label="Email"

                                            {...getFieldProps('Email')}

                                            error={Boolean(touched.Email && errors.Email)}
                                            helperText={touched.Email && errors.Email}

                                        >
                                        </TextField>}

                                        <TextField
                                            fullWidth
                                            label="Mobile"

                                            {...getFieldProps('Mobile_no')}

                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">
                                                    +91
                                                </InputAdornment>,
                                            }}

                                            error={Boolean(touched.Mobile_no && errors.Mobile_no)}
                                            helperText={touched.Mobile_no && errors.Mobile_no}
                                        >
                                        </TextField>

                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            label="Current Location "

                                            {...getFieldProps('CurrentLocation')}

                                            error={Boolean(touched.CurrentLocation && errors.CurrentLocation)}
                                            helperText={touched.CurrentLocation && errors.CurrentLocation}
                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="Total Experience"
                                            placeholder="Ex: 1.6 - 1 year 6 months, 0.0 - Fresher"

                                            {...getFieldProps('TotalExp')}

                                            error={Boolean(touched.TotalExp && errors.TotalExp)}
                                            helperText={touched.TotalExp && errors.TotalExp}
                                        >
                                        </TextField>

                                        <div role="group" style={{width: "50%"}}>
                                            <Stack
                                                direction={{ xs: "column", sm: "row" }}
                                                spacing={3}
                                                style={{ padding: "14px 0" }}
                                            >
                                                <div id="gender-radio-group" style={{ color: '#637381' }}> Gender </div>
                                                <label>
                                                    <Field type="radio" name="Gender" value="MALE" />
                                                &nbsp; Male
                                                </label>

                                                <label>
                                                    <Field type="radio" name="Gender" value="FEMALE" />
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

                                <Typography variant="h6" color="text.secondary" fontStyle="italic" gutterBottom sx={{mb: -3}}>
                                    Work Details
                                </Typography>

                            </CardContent>

                            <CardContent>

                                <Stack spacing={3}>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            label="Notice Period"
                                            select

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

                                        <TextField
                                            fullWidth
                                            label="Current CTC"
                                            placeholder="450000"
                                            type="number"

                                            {...getFieldProps('CurrentCtc')}

                                            error={Boolean(touched.CurrentCtc && errors.CurrentCtc)}
                                            helperText={touched.CurrentCtc && errors.CurrentCtc}
                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="Expected CTC"
                                            placeholder="550000"
                                            type="number"

                                            onInput={calculateExpHike}

                                            {...getFieldProps('ExpectedCtc')}

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

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            label="Last Company Name"
                                            placeholder="Ex:- Google"

                                            {...getFieldProps('LastCompany')}

                                            error={Boolean(touched.LastCompany && errors.LastCompany)}
                                            helperText={touched.LastCompany && errors.LastCompany}

                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            id="Status"
                                            type="string"
                                            label="Status"
                                            select
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

                                        <TextField
                                            fullWidth
                                            label="Referred By"
                                            type="string"

                                            {...getFieldProps('Referred_By')}

                                            error={Boolean(touched.Referred_By && errors.Referred_By)}
                                            helperText={touched.Referred_By && errors.Referred_By}
                                        >
                                        </TextField>

                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <InputLabel
                                            id="recording-upload-label"
                                            style={{ width: "8%", padding: "8px 0" }}
                                        >
                                            Recording:
                                        </InputLabel>

                                        <input
                                            id="Recording"
                                            name="Recording"
                                            type="file"
                                            className="form-control"
                                            accept=".mp3"
                                            onChange={handleRecordingUpload}

                                        />
                                    </Stack>

                                    <ErrorMessage name="Recording">
                                        {(msg) => <span
                                            style={{ width: "30%", color: "#FF4842", fontSize: "14px", textAlign: "center" }}>
                                            {msg}
                                        </span>}
                                    </ErrorMessage>

                                </Stack>

                            </CardContent>
                        </Card>


                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 1 }} />

                        <LoadingButton
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            loading={isSubmitting}
                        >
                            Add Candidate
                       </LoadingButton>

                    </Form>
                </FormikProvider>
            
                <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
                >
                    Let the magic happen... &emsp; 
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Container>
        </Page >
    )
}