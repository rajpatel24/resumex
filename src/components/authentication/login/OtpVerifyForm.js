import * as Yup from 'yup';
// import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// import { Icon } from '@iconify/react';
// material
import {
  Link,
  Stack,
  TextField,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import {useSnackbar} from 'notistack'
import { apiInstance } from 'src/utils/apiAuth';

// ----------------------------------------------------------------------

// const apiInstance = axios.create({
//   baseURL: 'http://127.0.0.1:8000/api/v1/',
//   timeout: 10000,
// });

export default function OtpVerifyForm() {
  const { enqueueSnackbar } = useSnackbar(); 

  const navigate = useNavigate();

  const OtpRegex = /\d{6}$/

  const candidateMobileNo = localStorage.getItem("candidateMN");

  const candidateEmail = localStorage.getItem("candEmail")

  const LoginSchema = Yup.object().shape({
    otp: Yup.string().matches(OtpRegex, 'OTP should be number').max(6, 'OTP length should be 6').required('OTP is required'),
  });

  const callVerifyOtpApi = (userEmail, userMobileNumber, otp) => { 
   
    apiInstance({
      method: 'post',
      url: 'auth/token/',
      data: {
        "email": userEmail,
        "token": otp
      }  
    }).then(function (response) {
  
      if (response.status === 200) {
        enqueueSnackbar("OTP verified successfully !!", {
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          variant: "success",
          autoHideDuration: 1000,
        });
        
        let candidateToken = response.data.token

        localStorage.setItem("candidateToken", candidateToken);

        // Candidate details API

        callCandidateDetailsApi()   
      }    
    })
    .catch(function (error) {
      enqueueSnackbar(error.response.data.token[0], {
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
  
  const callCandidateDetailsApi = () => {

    apiInstance({
      method: 'get',
      url: 'candidate/',
      headers: {
        Authorization: "token " + localStorage.getItem("candidateToken"),
      },
    }).then(function (response) {
  
      if (
          (response.status === 200) &
          (response.data.message === "New Candidate") &
          (response.data.data.length === 0)
        ) 
      {
        enqueueSnackbar("Fill up details !", {
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          variant: "success",
          autoHideDuration: 2000,
        });

        navigate("/register", { replace: true });

      } else {

        let userDetails = response.data.data;
        let fName = userDetails.user.first_name;
        let lName = userDetails.user.last_name;
        let usrEmail = userDetails.user.email;
        let jobApplicationId = userDetails?.job_application?.[0]?.id
        let jobApplicationReq = userDetails?.requisition?.requisite_number
        let registrationDateTime = userDetails.user.joined_date
        let candIsInterviewed
        let JobAppDetails

        let objs = userDetails.job_application

        if (objs.length !== 0) {
          objs?.forEach(obj => {

            if (obj.is_interviewed) {
              candIsInterviewed = false
            }
            else {
              candIsInterviewed = true
            }
          });
        }
        else {
          candIsInterviewed = false
        }

        localStorage.setItem("candidateFirstName", fName);
        localStorage.setItem("candidateLastName", lName);
        localStorage.setItem("candidateEmail", usrEmail);
        localStorage.setItem("candIsInterviewed", candIsInterviewed)
        localStorage.setItem("jobApplicationId", jobApplicationId)
        localStorage.setItem("registrationDateTime", registrationDateTime)
        localStorage.setItem("candidateJobApplicationReq", jobApplicationReq)
        localStorage.setItem("thisJobAppDetails", JobAppDetails)

        navigate("/dashboard/app", { replace: true });

      }      
    })
    .catch(function (error) {
      enqueueSnackbar(error.response.data, {
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

  const handleResendOTP = (resendValues) => {

    // Send otp API

    apiInstance({
      method: 'post',
      url: '/auth/email/',
      data: {
        email: resendValues.email,
        mobile: resendValues.mobile
      },
    }).then(function (response) {
        if (response.status === 200) {
          enqueueSnackbar(response.data.detail, {
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            variant: "success",
            autoHideDuration: 1500,
          });
        }
      })
      .catch(function (error) {
        enqueueSnackbar(error.response.data.detail, {
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          variant: "error",
          autoHideDuration: 2000,
        });
      });
  }

  const formik = useFormik({
    initialValues: {
      mobile: candidateMobileNo,
      email: candidateEmail,
      otp: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: (formValues) => {
      let userMobileNumber = formValues.mobile;
      let userEmail = formValues.email;
      let userOTP = formValues.otp;

      // Verify otp API
      callVerifyOtpApi(userEmail, userMobileNumber, userOTP)     
    }
  });
  
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, isReseting, setSubmitting } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>

        <TextField
          disabled
          // id="C-Mobile"
          label="Email"
          defaultValue= {candidateEmail}                 
        />

          <TextField
            fullWidth
            id='C-otp'
            type="text"
            label="OTP"
            autoFocus={true}
            
            {...getFieldProps('otp')}
            
            error={Boolean(touched.otp && errors.otp)}
            helperText={touched.otp && errors.otp}
          />
        
       
       <Stack direction={{ xs: 'column', sm: 'row' }} spacing={5}>

        <LoadingButton  
            fullWidth={true}    
            size="large"
            color="error"
            variant="contained"
            loading={isReseting}
            onClick={() => handleResendOTP(values)}
            name="resend-btn"
          >
            Resend OTP
          </LoadingButton>

          <LoadingButton 
            fullWidth={true}          
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            name="verify-btn"
          >
            Verify OTP
          </LoadingButton>
        </Stack>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
