import axios from "axios";
import Page from "../components/Page";
import { Form } from 'react-bootstrap';
import { useSnackbar } from "notistack";
import React,  { useEffect, useState } from "react";
import { Box, Grid, Button, Container, Stack } from "@mui/material";
import { apiInstance } from "src/utils/apiAuth";
import * as constants from "src/utils/constants";
import {
    Card, CardContent,
    Link, TextField, Typography,
    InputAdornment, InputLabel, MenuItem, Tooltip, Fade
}
    from '@mui/material';
import { Link as RouterLink, useNavigate, useParams} from 'react-router-dom';
import { useFormik, FormikProvider, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function UploadDocuments() {
    
    const [candidateData, setCandidateData]  = useState([]);
    const [visible, setVisible] = useState(false);
    const getCandidateData = () => {
      const apiInstance = axios.get(constants.HTTP_METHOD+constants.HTTP_URL+constants.HTTP_PORT+'/api/v1/candidate/', {headers: {"Authorization" : `Token ${localStorage.getItem('candidateToken')}`}})
      .then((response) => {
        setCandidateData(response.data.data)
      })
      .catch((e) => console.log('something went wrong :(', e));
    };

    useEffect(() => {
        getCandidateData()
    }, [])

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState(null);
  const [photoIDFile, setPhotoIDFile] = useState(null);
  const [payslipDoc, setPaySlipDoc] = useState([]);

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


    var bodyFormData = new FormData();
    

    if (photoIDFile != null) {
        bodyFormData.append("photo_id_file", photoIDFile);
    }

    if (resumeFile != null){
        bodyFormData.append("resume_file", resumeFile);
    } 


    if (payslipDoc.length != 0){
        for (let i = 0 ; i < payslipDoc.length ; i++) {
                bodyFormData.append("payslip_files", payslipDoc[i]);
            }
    } 
    
    await apiInstance({
        method: "put",
        url: "candidate/",
        headers: {
          Authorization: "token " + localStorage.getItem("candidateToken"),
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
            navigate("/dashboard/app", { replace: true });
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

const CandidateSchema = Yup.object().shape({
    PhotoID: Yup.mixed(),
    Payslip: Yup.array()
        .min(3, "3 payslips are required.")
        .max(3, "Only 3 files can be uploaded"),
    Resume: Yup.mixed(),
});

const formik = useFormik({
    initialValues: {
        PhotoID: '',
        Payslip: '',
        Resume: '',
    },
    validationSchema: CandidateSchema,
    onSubmit: (values) => {
        if(values.Payslip === '' && values.PhotoID === '' && values.Resume === ''){
            setSubmitting(false);
            setVisible(true);
            
        }
        else{
        // call create candidate API
        setVisible(false);
        callCandidateUpdateDocuments(values)
        }
        
    }
});

const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting } = formik;

  return (
    <Page title="Dashboard: Upload Documents ">
      <Container maxWidth="xl">

      <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

  

        <div style={{display: "flex", alignItems: "center", justifyContent: "left"}}>
          <h1 style={{fontSize: '25px', fontWeight: '600'}}>
          Upload Documents
          </h1>
        </div>
        <Card sx={{ mt: 2 }} variant="outlined">
                            <CardContent>
                            <Typography variant="h6" color="#f05e0a" align="center" fontStyle="Bold" gutterBottom>
                                    Documents
                                </Typography>
                            </CardContent>

                            <CardContent>
                                <Stack spacing={3}>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                      

                                        <InputLabel
                                            id="photo-id-upload-label"
                                            style={{ width: "15%", padding: "8px 0" }}
                                        >
                                            Display Picture:
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
                                          id="resume-upload-label"
                                          style={{ width: "15%", padding: "8px 0" }}
                                      >
                                          Resume:
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
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <InputLabel
                                            id="payslip-upload-label"
                                            style={{ width: "15%", padding: "8px 0" }}
                                        >
                                            3 Months Payslips:
                                        </InputLabel>

                                        <input halfwidth id="Payslip" name="Payslip" className="form-control" type="file" multiple accept=".pdf" onChange={handlePaySlipUpload} />
                                    </Stack>
                                    <ErrorMessage name="Payslip">
                                            {(msg) => <span
                                                style={{ width: "25%", color: "#FF4842", fontSize: "12px", textAlign: "left" }}>
                                                {msg}
                                            </span>}
                                        </ErrorMessage>
                                </Stack>
                               
                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />
                                {visible && <p id="FieldError" style={{textAlign:"center", color: "red", fontSize: "smaller"}}>Enter atleast one field</p>}
                                <LoadingButton
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    loading={isSubmitting}
                                >
                                    Upload Documents
                                </LoadingButton>
                        </CardContent>
                    </Card>
                </Form>
            </FormikProvider>
            

            
            <Card sx={{ mt: 2 }} variant="outlined">
            <CardContent>
                <Typography variant="h6" color="#f05e0a" align="center"  gutterBottom>
                    Documents List
                </Typography>
            </CardContent>

            <CardContent>

<TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Document Type </TableCell>
                        <TableCell>Document Name </TableCell>
                        <TableCell>File Size (KB)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>                                 
            {/* -------- resume --------- */}

            {candidateData?.resume?.resume_file ? (

            <TableRow
                key="resume"
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
               

                <TableCell>                         
                {candidateData?.resume && candidateData?.resume?.resume_file !== '' ? "RESUME" : ''} 
                
                </TableCell>
                <TableCell>
                <a href={constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + `${candidateData?.resume?.resume_file}`} 
                    target="_blank" style={{color: "brown", fontWeight: "italic"}
                }>
                    {candidateData?.resume?.resume_file}
                </a>    
                </TableCell>
                <TableCell>{Math.round(candidateData?.resume?.size * 0.001).toFixed(1)}</TableCell>
            

            </TableRow>  ) : null }    
        
                    {/* -------- photo_id --------- */}

                    {candidateData?.documents?.photo_id?.photo_id? (
                    <TableRow
                        key="photo_id"
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      
                        <TableCell>
                        {candidateData?.documents?.photo_id && candidateData?.documents?.photo_id?.photo_id !== null ? "PHOTO" : ''} 
                        </TableCell>
                        <TableCell>
                        <a href={constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + `${candidateData?.documents?.photo_id?.photo_id}`} 
                            target="_blank" style={{color: "brown", fontWeight: "italic"}
                        }>                       
                        {candidateData?.documents?.photo_id?.photo_id}
                        </a>
                        </TableCell>
                        <TableCell>{Math.round(candidateData?.documents?.photo_id?.size * 0.001).toFixed(1)}  </TableCell>

                    </TableRow> ) : null }
                    
                    {/* -------- payslips --------- */}

                    {candidateData?.payslips?.map((row, i) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                           
                            <TableCell> {row.payslip ? "PAYSLIP" : null }</TableCell>
                            <TableCell>
                            <a href={constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + `${row.payslip}`} 
                            target="_blank" style={{color: "brown", fontWeight: "italic"}}>
                                {row.payslip}
                            </a>
                            </TableCell>
                            <TableCell>{row.payslip ? Math.round(row.size * 0.001).toFixed(1): null}</TableCell>
                                          
                            

                        </TableRow> 
                    )) }

                </TableBody>
            </Table>
        </TableContainer>
	</CardContent>
</Card>



      </Container>
    </Page>
  );
}

