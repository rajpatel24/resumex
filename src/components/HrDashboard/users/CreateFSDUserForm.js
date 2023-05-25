import { useState, useEffect } from 'react';
import Page from '../../Page';
import {
    Card, CardContent, Container,Checkbox,
    Link, Stack, TextField, Typography,
    InputAdornment, MenuItem
}
    from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import * as constants from 'src/utils/constants';
import { apiInstance } from 'src/utils/apiAuth';

export default function CreateFSDUserForm() {

    const { enqueueSnackbar } = useSnackbar();
    const hrToken = localStorage.getItem("authToken");
    const navigate = useNavigate();
    const [UserData, setUserData] = useState([]);

    // get business units
    const [BusinessUnitData, setBusinessUnitData] = useState([])
    const getBusinessUnits = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/business-units/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setBusinessUnitData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };  

    // get Interview Roles
    const [InterviewData, setInterviewData] = useState([])
    const getInterviews = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/interview-role/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setInterviewData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };      

    // get Roles
    const [RolesData, setRolesData] = useState([])
    const getRoles = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/roles/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setRolesData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };    

    // is_active state
    const [checked, setChecked] = useState(true);
    const handleIsActiveChange = event =>{
        setChecked(event.target.checked);
    };

    useEffect(() => {
        getUserList();
        getBusinessUnits();
        getInterviews();
        getRoles();
    }, [])

    const getUserList = () => {
        apiInstance({
            method: "get",
            url: "fsd-members/",
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                const UserData = getUserArray(response.data.data)
                setUserData(UserData)
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

    const callCreateUser = async (formValues) => {

        var new_mobile_no = "+91" + formValues.Mobile_no;
        var bodyFormData = new FormData();

        bodyFormData.append("first_name", formValues.FirstName);
        bodyFormData.append("last_name", formValues.LastName);
        bodyFormData.append("email", formValues.Email);
        bodyFormData.append("mobile", new_mobile_no);
        bodyFormData.append("bu_group_id", formValues.BusinessUnit);
        bodyFormData.append("intv_role_id", formValues.InterviewRole);
        bodyFormData.append("role_id", formValues.Role);
        bodyFormData.append("is_active",checked);
        
        await apiInstance({
            method: "post",
            url: "fsd-members/",
            headers: {
                Authorization: "token " + hrToken,
            },
            data: bodyFormData,
        })
            .then(async function (response) {                
                enqueueSnackbar(response.data?.message, {
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    variant: 'success',
                    autoHideDuration: 2000,
                });
                navigate("/resumeX/fsdusers", { replace: true });
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

    const getUserArray = (UserData) =>
        UserData.map((UserObj) => ({
            pk: UserObj.id,
            UserName: UserObj.User
        }));

    const UserSchema = Yup.object().shape({
        Mobile_no: Yup.string()
            .min(10, 'Mobile Number must be of 10 digit')
            .max(15, 'Mobile Number must be of 10 digit')
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
        Email: Yup.string()
            .email("Email must be a valid email address")
            .required("Email is required"),
        BusinessUnit: Yup.string()
            .required("BusinessUnit is required."),
        InterviewRole: Yup.string()
            .required("InterviewRole is required."),
        Role: Yup.string()
            .required("Role is required."),
        IsActive: Yup.bool(),
    });

    const formik = useFormik({
        initialValues: {
            FirstName: '',
            LastName: '',
            Email: '',
            Mobile_no: '',
            BusinessUnit: '',
            InterviewRole: '',
            Role: '',
            IsActive: '',
        },
        validationSchema: UserSchema,
        onSubmit: (values) => {
            // call create User API
            callCreateUser(values)
        }
    });

    //-----------------------------Functions-----------------------------------

    const thisFsdRoleData = RolesData.map((items) => { if(items.role_name == "FSD_HOD" || items.role_name == "DRM" || items.role_name == "FSD_Admin" ){ return items } })
    const FsdRoleData = thisFsdRoleData.filter(function (el) { return el != null; });
    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, setFieldValue } = formik;

    return (
        <Page title="FSD Member">
            <Container maxWidth="xl">
                <Link to="/resumeX/fsdusers" color="green" underline="hover" component={RouterLink} fontSize="20px"> Back
            </Link>
                <Typography variant="h4" sx={{ mb: 5 }} align="center" color="black">
                    Create FSD Member
                </Typography>

                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                        <Card sx={{ mt: 2 }} variant="outlined" style={{ border: "none", boxShadow: "none" }}>
                            <CardContent sx={{ mb: 5 }}>    
                                <Typography variant="h6" color="#aaaa55" fontStyle="italic" gutterBottom>
                                    <div style={{float: "left", width: "50%", marginTop: "20px"}}>
                                    FSD Member Details
                                    </div>
                                </Typography>
                            </CardContent>
                            <CardContent>
                                <Stack spacing={3}>
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
                                    </Stack>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                    <TextField
                                            fullWidth
                                            select
                                            label="Role"
                                            {...getFieldProps('Role')}
                                            error={Boolean(touched.Role && errors.Role)}
                                            helperText={touched.Role && errors.Role}
                                        >
                                            {FsdRoleData.map((unit) => (
                                                <MenuItem key={unit.id} value={unit.id}>{unit.role_name}</MenuItem>
                                            ))}
                                        </TextField>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Business Unit"
                                            {...getFieldProps("BusinessUnit")}
                                            error={Boolean(touched.BusinessUnit && errors.BusinessUnit)}
                                            helperText={touched.BusinessUnit && errors.BusinessUnit}
                                        >
                                            {BusinessUnitData.map((unit) => (
                                                <MenuItem key={unit.id} value={unit.id}>{unit.bu_name}</MenuItem>
                                            ))}
                                        </TextField>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Interview Role"
                                            {...getFieldProps("InterviewRole")}
                                            error={Boolean(touched.InterviewRole && errors.InterviewRole)}
                                            helperText={touched.InterviewRole && errors.InterviewRole}
                                        >
                                            {InterviewData.map((unit) => (
                                                <MenuItem key={unit.id} value={unit.id}>{unit.interview_role}</MenuItem>
                                            ))}
                                        </TextField>
                                    </Stack>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <TextField
                                    style={{width: "25%"}}
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
                            <Stack spacing={2} >
                                    {/* ---- Is Active ---- */}
                                    <Typography>
                                        <Checkbox onChange={handleIsActiveChange}/>
                                        Active
                                    </Typography>
                            </Stack>
                            </Stack>
                            </Stack>
                            </CardContent>
                        </Card>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />
                        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} > Add FSD Member </LoadingButton>
                    </Form>
                </FormikProvider>
            </Container>
        </Page >
    )
}