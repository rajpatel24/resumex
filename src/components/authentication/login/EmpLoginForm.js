import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import axios from 'axios';
import {useSnackbar} from 'notistack';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAuth } from 'src/utils/auth';
import { apiInstance } from 'src/utils/apiAuth';

// ----------------------------------------------------------------------

export default function EmpLoginForm() {
  const { enqueueSnackbar} = useSnackbar();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  
  const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

  const [loginUser, setLoginUser] = useState({})

  const auth = useAuth()

  const EmpLoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().min(8, 
                          "Minimum Password Length is 8").matches(PasswordRegex, 
                          'Password must have atleast 1 lower,upper,number and special character').required('Password is required')
  });

  const callEmpLoginApi = (email, password) => {

    apiInstance({
      method: 'post',
      url: '/user/login/',
      data: {
        "email": email,
        "password": password
      }
    }).then(function (response) {

      if (response.status == 200) {
        localStorage.setItem('user',  JSON.stringify(response.data.user))
        localStorage.setItem('authToken', response.data.key)

        auth.login(response.data.user)

        if(response?.data?.key && response?.data?.key?.length !== 0)
        {
          var m_role = response?.data?.user?.master_role?.master_role
          var m_role_status = response?.data?.user?.master_role?.is_active
          var role_status = response?.data?.user?.role?.is_active
          var user_status = response?.data?.user?.is_active

          // ----- Master Role: Employee -----
          if (m_role === 'Employee' && m_role_status)
          {
            if (role_status && user_status)
            {
              enqueueSnackbar("Logged in successfully !!", {
                anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                              },
                variant: 'success',
                autoHideDuration: 1000,
              });
              navigate('/employee-dashboard/app', {replace: true});
            } 
            else{
              enqueueSnackbar("Please check your active status !!", {
                anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                              },
                variant: 'error',
                autoHideDuration: 1500,
              });
              navigate('/401', {replace: true});
            }                      
          }
          
        // ----- Master Role: Manager / Admin -----

        else if ((m_role === 'Manager' || m_role === 'Admin') && m_role_status)
          {         
            if (role_status && user_status){
              enqueueSnackbar("Logged in successfully !!", {
                anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                              },
                variant: 'success',
                autoHideDuration: 1000,
              });
            navigate('/resumeX/app', {replace: true});
            }
            else{
              enqueueSnackbar("Please check your active status !!", {
                anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                              },
                variant: 'error',
                autoHideDuration: 1500,
              });
              navigate('/401', {replace: true});
            }            
          }

        // Master roles are inactive
        else{
          enqueueSnackbar("Please check your active status !!", {
            anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                          },
            variant: 'error',
            autoHideDuration: 1500,
          });
          navigate('/401', {replace: true});
        }            
      }

      // When user key is absent.
      else {
        enqueueSnackbar("No user found !!", {
          anchorOrigin: {
                          vertical: 'top',
                          horizontal: 'right',
                        },
          variant: 'warning',
          autoHideDuration: 1500,
        });
        navigate('/login', {replace: true}) }
      }
    })
    .catch(function (error) {
      enqueueSnackbar(error.response.data.non_field_errors, {
        anchorOrigin: {
                          vertical: 'top',
                          horizontal: 'right',
                      },
          variant: 'error',
          autoHideDuration: 2000,  
        });
      
      setSubmitting(false)
    })
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: EmpLoginSchema,
    onSubmit: (formValues) => {

      let email = formValues.email
      let password = formValues.password

      localStorage.setItem('employeeEmail', email)
      callEmpLoginApi(email, password)

    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}/>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          name='emp-login-btn'
        >
         Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}