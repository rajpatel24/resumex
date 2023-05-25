import { useState, useEffect } from 'react';
import Page from '../../Page';
import {
    Button, Card, CardContent, Container,
    Link, Stack, TextField, Typography,
    InputAdornment, InputLabel, MenuItem, Tooltip, Fade
}
    from '@mui/material';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider, ErrorMessage, Field } from 'formik';

import * as Yup from 'yup';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack'
import { CenterFocusStrong } from '@mui/icons-material';
import BasicTable from './ListCandDocuments';
import { apiInstance } from 'src/utils/apiAuth';


export default function EditCandidateDocuments(candData) {
    const { enqueueSnackbar } = useSnackbar();
    const hrToken = localStorage.getItem("authToken");
    const navigate = useNavigate();

    const [recordFile, setRecordFile] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [photoIDFile, setPhotoIDFile] = useState(null);
    const [offerLetterDoc, setOfferLetterDoc] = useState(null);
    const [payslipDoc, setPaySlipDoc] = useState([]);
    const [disableValue, setDisableValue] = useState(false)

    const setOtherValues = () => 
    {
        let user = JSON.parse(localStorage.getItem("user"))
        let user_role = user.role.role_name
            
        if (user_role === 'BU_HEAD')
        { setDisableValue(true)  }

        else{ setDisableValue(false) }
    }

    useEffect(() => {
        setOtherValues();
    }, [])

    const handleRecordingUpload = (event) => {
        const recordingFile = event.target.files[0]
        formik.setFieldValue("Recording", recordingFile);
        setRecordFile(recordingFile)
    };

    const handleResumeUpload = (event) => {
        const rexFile = event.target.files[0]
        formik.setFieldValue("Resume", rexFile);
        setResumeFile(rexFile)
    };

    const handlePhotoIDUpload = (event) => {
        const IDFile = event.target.files[0]
        formik.setFieldValue("PhotoID", IDFile);
        setPhotoIDFile(IDFile)
    };

    const handleOfferLetterUpload = (event) => {
        const offerLetterDoc = event.target.files[0]
        formik.setFieldValue("OfferLetter", offerLetterDoc);
        setOfferLetterDoc(offerLetterDoc)
    };

    const handlePaySlipUpload = (event) => {
        const paySlipFiles = event.target.files

        let slipsArray = [];

        for (var i = 0; i < paySlipFiles.length; i++) {            
            slipsArray.push(paySlipFiles[i]);
        }

        formik.setFieldValue("Payslip", slipsArray);

        setPaySlipDoc(paySlipFiles)
    };

    const callCandidateUpdateDocuments = async (formValues) => {

        var cand_id = candData?.candidateData?.id
        var bodyFormData = new FormData();

        if (recordFile != null)
        {
            bodyFormData.append("recording_file", recordFile);
        }

        if (photoIDFile != null) {
            bodyFormData.append("photo_id_file", photoIDFile);
        }

        if (resumeFile != null){
            bodyFormData.append("resume_file", resumeFile);
        } 

        if (offerLetterDoc != null){
            bodyFormData.append("offer_letter_file", offerLetterDoc);
        } 

        if (payslipDoc.length != 0){
            for (let i = 0 ; i < payslipDoc.length ; i++) {
                    bodyFormData.append("payslip_files", payslipDoc[i]);
                }
        } 
        
        await apiInstance({
            method: "put",
            url: "candidate-viewset/" + cand_id + "/",
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
        Recording: Yup.mixed().nullable(),
        PhotoID: Yup.mixed(),
        Payslip: Yup.array()
            .min(3, "3 payslips are required.")
            .max(3, "Only 3 files can be uploaded"),
        OfferLetter: Yup.mixed(),
        Resume: Yup.mixed(),
    });

    const formik = useFormik({
        initialValues: {
            Recording: '',
            PhotoID: '',
            Payslip: '',
            OfferLetter: '',
            Resume: '',
        },
        validationSchema: CandidateSchema,
        onSubmit: (values) => {
            // call create candidate API
            callCandidateUpdateDocuments(values)
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting } = formik;

    return (
        <Page title="Candidates">
            <Container maxWidth="xl">

                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                        <Card sx={{ mt: 2 }} variant="outlined">
                            <CardContent>
                                <Typography variant="h6" color="#aaaa55" align="center" fontStyle="italic" gutterBottom>
                                    Documents
                                </Typography>
                            </CardContent>

                            <CardContent>
                                <Stack spacing={3}>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <InputLabel
                                            id="recording-upload-label"
                                            style={{ width: "25%", padding: "8px 0" }}
                                        >
                                            Initial Recording
                                        </InputLabel>

                                        <input
                                            halfwidth
                                            id="Recording"
                                            name="Recording"
                                            className="form-control"
                                            type="file"
                                            accept='.mp3,.mp4'
                                            onChange={handleRecordingUpload}

                                        />

                                        <ErrorMessage name="Recording">
                                            {(msg) => <span
                                                style={{ width: "25%", color: "#FF4842", fontSize: "12px", textAlign: "left" }}>
                                                {msg}
                                            </span>}
                                        </ErrorMessage>

                                        <InputLabel
                                            id="photo-id-upload-label"
                                            style={{ width: "15%", padding: "8px 0" }}
                                        >
                                            Photo ID
                                        </InputLabel>

                                        <input
                                            halfwidth
                                            id="PhotoID"
                                            name="PhotoID"
                                            className="form-control"
                                            type="file"
                                            accept=".jpg"
                                            onChange={handlePhotoIDUpload}
                                        />

                                        <ErrorMessage name="PhotoID">
                                            {(msg) => <span
                                                style={{ width: "25%", color: "#FF4842", fontSize: "12px", textAlign: "left" }}>
                                                {msg}
                                            </span>}
                                        </ErrorMessage>

                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <InputLabel
                                            id="payslip-upload-label"
                                            style={{ width: "25%", padding: "8px 0" }}
                                        >
                                            3 Months Payslips
                                        </InputLabel>

                                        <input
                                            halfwidth
                                            id="Payslip"
                                            name="Payslip"
                                            className="form-control"
                                            type="file"
                                            multiple
                                            accept=".pdf"
                                            onChange={handlePaySlipUpload}

                                        />

                                        <ErrorMessage name="Payslip">
                                            {(msg) => <span
                                                style={{ width: "25%", color: "#FF4842", fontSize: "12px", textAlign: "left" }}>
                                                {msg}
                                            </span>}
                                        </ErrorMessage>

                                        <InputLabel
                                            id="offer-letter-upload-label"
                                            style={{ width: "15%", padding: "8px 0" }}
                                        >
                                            Offer Letter
                                        </InputLabel>

                                        <input
                                            halfwidth
                                            id="OfferLetter"
                                            name="OfferLetter"
                                            className="form-control"
                                            type="file"
                                            accept=".pdf"                                           
                                            onChange={handleOfferLetterUpload}
                                        />

                                        <ErrorMessage name="OfferLetter">
                                            {(msg) => <span
                                                style={{ width: "25%", color: "#FF4842", fontSize: "12px", textAlign: "left" }}>
                                                {msg}
                                            </span>}
                                        </ErrorMessage>

                                    </Stack>

                                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} >

                                        <InputLabel
                                            id="resume-upload-label"
                                            style={{ width: "12%", padding: "4px 0" }}
                                        >
                                            Resume
                                        </InputLabel>

                                        <input
                                            halfwidth
                                            id="Resume"
                                            name="Resume"
                                            className="form-control"
                                            type="file"
                                            accept=".pdf"                                           
                                            onChange={handleResumeUpload}
                                        />

                                        <ErrorMessage name="Resume">
                                            {(msg) => <span
                                                style={{ width: "15%", color: "#FF4842", 
                                                         fontSize: "12px", textAlign: "center" 
                                                        }}>
                                                {msg}
                                            </span>}
                                        </ErrorMessage>

                                    </Stack>

                                </Stack>


                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

                                <LoadingButton
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    loading={isSubmitting}
                                    disabled={disableValue}
                                >
                                    Upload Documents
                                </LoadingButton>

                            </CardContent>
                        </Card>
                    </Form>
                </FormikProvider>

                <Card sx={{ mt: 2 }} variant="outlined">
                    <CardContent>
                        <Typography variant="h6" color="#aaaa55" align="center" fontStyle="italic" gutterBottom>
                            Documents List
                        </Typography>
                    </CardContent>

                    <CardContent>
                        <BasicTable tableContent={candData} />                        
                    </CardContent>
                </Card>

            </Container >
        </Page >
    )
}