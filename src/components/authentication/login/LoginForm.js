import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
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
//   baseURL: 'http://127.0.0.1:8000/api/v1/auth/',
//   timeout: 10000,
// });


export default function LoginForm() { 
  const { enqueueSnackbar } = useSnackbar(); 

  const navigate = useNavigate();

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const LoginSchema = Yup.object().shape({
    mobile_no: Yup.string().matches(phoneRegExp, 'Mobile Number is not valid').min(10, 'Mobile Number must be of 10 digit').max(10, 'Mobile Number must be of 10 digit').required('Mobile Number is required'),
    email: Yup.string()
    .email("Email must be a valid email address")
    .required("Email is required"),
    });
  
  const callSendOtpApi = (candEmail, candMobile) => {  
    apiInstance({
      method: 'post',
      url: '/auth/email/',
      data: {
        "email": candEmail,
        "mobile": candMobile
      }  
    }).then(function (response) {
  
      if (response.status === 200) {

        enqueueSnackbar(response.data.detail, {
          anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
            variant: 'success',
            autoHideDuration: 3000,

          });
          navigate('/verify-otp', { replace: true });
      }
      
    })
    .catch(function (error) {
      enqueueSnackbar("User with this mobile already exist", {
        anchorOrigin: {
                          vertical: 'top',
                          horizontal: 'right',
                      },
          variant: 'error',
          autoHideDuration: 3000,  
        });

        setSubmitting(false)
    });   
  
  }   

  const formik = useFormik({
    initialValues: {
      mobile_no: '',
      email: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {  

      let candMobile = "+91" + values.mobile_no
      localStorage.setItem('candidateMN', candMobile);
     
      //  callSendOtpApi(candMobile)

       let candEmail = values.email
       localStorage.setItem('candEmail', candEmail)

       callSendOtpApi(candEmail, candMobile)
    }
  }); 
      
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoFocus={true}
            type="text"
            label="Email"
            
            {...getFieldProps('email')}
            
            // InputProps={{
            //   startAdornment: <InputAdornment position="start">
            //     +91
            //     </InputAdornment>,
            // }}
            
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
          
        </Stack>
        
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}/>
        <TextField
            fullWidth
            type="text"
            label="Mobile Number"
            
            {...getFieldProps('mobile_no')}
            
            InputProps={{
              startAdornment: <InputAdornment position="start">
                +91
                </InputAdornment>,
            }}
            
            error={Boolean(touched.mobile_no && errors.mobile_no)}
            helperText={touched.mobile_no && errors.mobile_no}
          />

       <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}/>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Send OTP
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
