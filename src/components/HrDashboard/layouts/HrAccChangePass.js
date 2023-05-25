import React from "react";
import Page from '../../Page';
import { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import * as Yup from "yup";
import { useFormik, FormikProvider, ErrorMessage, Field } from "formik";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { TextField, IconButton, CardContent,} from '@mui/material';
import { LoadingButton } from "@mui/lab";
import {useSnackbar} from 'notistack';
import { apiInstance } from 'src/utils/apiAuth';
import { Card, CardHeader, Container } from '@mui/material';

// ----------------------------------------------------------------------


export default function HrAccChangePass() {

    const authToken = localStorage.getItem('authToken');

    const [showPassword, setShowPassword] = useState(false);

    const [showPassword1, setShowPassword1] = useState(false);

    const [showPassword2, setShowPassword2] = useState(false);

    const handleShowPassword = () => { setShowPassword((show) => !show); };

    const handleShowPassword1 = () => { setShowPassword1((show) => !show); };

    const handleShowPassword2 = () => { setShowPassword2((show) => !show); };
    
    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();

    const thisUser = localStorage.getItem('user')
    const thisUserObject = JSON.parse(thisUser);

    const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

    const ChangePassFormSchema = Yup.object().shape({
        OldPassword: Yup.string()
            .required('Old password is required'),

        NewPassword: Yup.string()
            .min(8, "Minimum Password Length is 8")
            .matches(PasswordRegex, 'Password must have atleast 1 lower,upper,number and special character').
            required('New password is required'),

        ConfirmPassword: Yup.string()
            .min(8,"Minimum Password Length is 8")
            .matches(PasswordRegex, 'Password must have atleast 1 lower,upper,number and special character')
            .oneOf([Yup.ref('NewPassword')], 'Your passwords do not match.')
            .required('Confirm password is required')
      });

      const callChangePassword = async (formValues) => {

        var bodyFormData = new FormData();

        bodyFormData.append("old_password", formValues.OldPassword);
        bodyFormData.append("new_password1", formValues.NewPassword);
        bodyFormData.append("new_password2", formValues.ConfirmPassword);


        await apiInstance({
            method: "post",
            url: "user/password/change/",
            headers: {
                Authorization: "token " + authToken,
            },
            data: bodyFormData,
        })
            .then(async function (response) {                
                enqueueSnackbar(response.data?.detail, {
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    variant: 'success',
                    autoHideDuration: 2000,
                });
                navigate("/resumeX/app", { replace: true });
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

    const formik = useFormik({
        initialValues: {
        OldPassword: '',
        NewPassword: '',
        ConfirmPassword: '',
        },
        validationSchema: ChangePassFormSchema,
        onSubmit: (values) => {
            callChangePassword(values)
        }
    });

    const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setSubmitting } = formik;

    return (
        <Page title="Candidates">
            <center>
            <Container maxWidth="xl" style={{alignContent: "center", verticalAlign: "center"}}>
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <Card sx={{ mt: 20 }} variant="outlined" style={{width: "50%", height: "30rem"}}>
                    <CardHeader title="Change Password" /><br/><br/>
                    <CardContent>

                    <TextField 
                        style={{width: "80%"}}
                        label="Old Password" 

                        {...getFieldProps('OldPassword')}

                        type={showPassword ? 'text' : 'password'}

                        InputProps={{

                        endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleShowPassword} edge="end">
                            <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                            </IconButton>
                        </InputAdornment>
                        )}}

                        error={Boolean(touched.OldPassword && errors.OldPassword)}
                        helperText={touched.OldPassword && errors.OldPassword} />

                        <TextField 
                        style={{width: "80%", marginTop:"3%"}}
                        label="New Password" 

                        {...getFieldProps('NewPassword')}

                        type={showPassword1 ? 'text' : 'password'}

                        InputProps={{
                        endAdornment: 
                        (
                        <InputAdornment position="end">
                            <IconButton onClick={handleShowPassword1} edge="end">
                            <Icon icon={showPassword1 ? eyeFill : eyeOffFill} />
                            </IconButton>
                        </InputAdornment>
                        )}}

                        error={Boolean(touched.NewPassword && errors.NewPassword)}
                        helperText={touched.NewPassword && errors.NewPassword}

                        />
                
                        <TextField 
                        style={{width: "80%", marginTop:"3%"}}
                        label="Confirm Password" 

                        {...getFieldProps('ConfirmPassword')}

                        type={showPassword2 ? 'text' : 'password'}

                        InputProps={{
                        endAdornment: 
                        (
                        <InputAdornment position="end">
                            <IconButton onClick={handleShowPassword2} edge="end">
                            <Icon icon={showPassword2 ? eyeFill : eyeOffFill} />
                            </IconButton>
                        </InputAdornment>
                        )}}

                        error={Boolean(touched.ConfirmPassword && errors.ConfirmPassword)}
                        helperText={touched.ConfirmPassword && errors.ConfirmPassword}

                        />

                        <LoadingButton
                        style={{width: "80%", marginTop:"3%"}}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        >
                            Change Password
                        </LoadingButton>
                    </CardContent>
                </Card>
            </form>
        </Container>
        </center>
    </Page>
    )
}
