import { useState, useEffect } from 'react';
import Page from '../../Page';
import axios from 'axios';
import * as constants from 'src/utils/constants';
import {
    Card, CardContent, Container,Checkbox,
    Link, Stack, TextField, Typography, MenuItem
}
    from '@mui/material';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { apiInstance } from 'src/utils/apiAuth';

export default function EditFsdUser(props) {

    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const hrToken = localStorage.getItem("authToken");
    const navigate = useNavigate();
    const [UserData, setUserData] = useState([])

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

    const getUserData = async () => {
        await axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + "/api/v1/fsd-members/" + id + "/", { headers: { "Authorization": `Token ${localStorage.getItem('authToken')}` } })
        .then((response) => {
            setUserData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };

    useEffect(() => {
        getUserData();
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

    const callUpdateFSDUser = (formValues) => {
        var fsduser_id = UserData?.id
        var apiData = {
            "first_name": formValues.FirstName,
            "last_name": formValues.LastName,
            "email": formValues.Email,
            "mobile": formValues.Mobile_no,
            "role_id": formValues.Role,
            "created_by": formValues.CreatedBy,
            "joined_date": formValues.JoiningDate,
            "bu_group_id": formValues.BusinessUnit,
            "intv_role_id": formValues.InterviewRole,
            "is_active": formValues.IsActive,
        }
         apiInstance({
            method: "put",
            url: "fsd-members/"+ fsduser_id + "/",
            headers: {
                Authorization: "token " + hrToken,
            },
            data: apiData,
        })
            .then(function (response) {                
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

    const FSDUserSchema = Yup.object().shape({
        Mobile_no: Yup.string(),
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
        CreatedBy: Yup.string()
            .required("Creator is required."),
        JoiningDate: Yup.date()
        .required("Joining Date is required."),
        IsActive: Yup.bool(),
    });
    const formik = useFormik({
        initialValues: {
            FirstName: UserData?.member?.first_name ?? '',
            LastName:  UserData?.member?.last_name ?? '', 
            Email:  UserData?.member?.email ?? '', 
            Mobile_no:  UserData?.member?.mobile ?? '',
            Role: UserData?.member?.role?.id ?? '',
            CreatedBy: UserData?.created_by?.first_name + " " + UserData?.created_by?.last_name  ?? '',
            JoiningDate: UserData?.member?.joined_date ?? '',
            BusinessUnit:  UserData?.bu_group?.id ?? '', 
            InterviewRole: UserData?.interview_role?.id ?? '',
            IsActive: UserData?.is_active ?? '',
        },
        enableReinitialize: true,
        validationSchema: FSDUserSchema,
        onSubmit: (values) => {
            // call Update User API
            callUpdateFSDUser(values)
        }
    });

    const thisFsdRoleData = RolesData.map((items) => { if(items.role_name == "FSD_HOD" || items.role_name == "DRM" || items.role_name == "FSD_Admin" ){ return items } })
    const FsdRoleData = thisFsdRoleData.filter(function (el) { return el != null; });
    const date = UserData?.member?.joined_date.substring(0,10);
    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, setFieldValue } = formik;

    return (
        <Page title="FSD Member">
            <Container maxWidth="xl">
            <Link to="/resumeX/fsdusers" color="green" underline="hover" component={RouterLink} fontSize="20px"> Back
            </Link>
            <Typography variant="h4" sx={{ mb: 5 }} align="center">
                Edit FSD Member
            </Typography>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Card sx={{ mt: 2 }} variant="outlined">
                        <CardContent>
                            <Typography variant="h6" color="#aaaa55" align="center" fontStyle="italic" gutterBottom>
                                FSD Member Details
                            </Typography>
                        </CardContent>
                        <CardContent>
                            <Stack spacing={3}>
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        required
                                        {...getFieldProps('FirstName')}
                                        error={Boolean(touched.FirstName && errors.FirstName)}
                                        helperText={touched.FirstName && errors.FirstName} >
                                    </TextField>

                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        required
                                        {...getFieldProps('LastName')}
                                        error={Boolean(touched.LastName && errors.LastName)}
                                        helperText={touched.LastName && errors.LastName}
                                    >
                                    </TextField>
                                    {<TextField
                                        fullWidth
                                        label="Email"
                                        required
                                        disabled
                                        {...getFieldProps('Email')}
                                        error={Boolean(touched.Email && errors.Email)}
                                        helperText={touched.Email && errors.Email}
                                    >
                                    </TextField>}
                                </Stack>
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <TextField
                                        fullWidth
                                        label="Mobile"
                                        required
                                        {...getFieldProps('Mobile_no')}
                                    /> 
                                    <TextField
                                        fullWidth
                                        select
                                        label="Business Unit *"
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
                                        label="Interview Role *"
                                        {...getFieldProps("InterviewRole")}
                                        error={Boolean(touched.InterviewRole && errors.InterviewRole)}
                                        helperText={touched.InterviewRole && errors.InterviewRole}
                                    >
                                        {InterviewData.map((unit) => (
                                            <MenuItem key={unit.id} value={unit.id}>{unit.interview_role}</MenuItem>
                                        ))}
                                    </TextField>
                                        <TextField
                                        fullWidth
                                        label="Joining Date"
                                        value={date}
                                        disabled
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        error={Boolean(touched.JoiningDate && errors.JoiningDate)}
                                        helperText={touched.JoiningDate && errors.JoiningDate}
                                    />  
                                    </Stack>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField
                                        fullWidth
                                        select
                                        label="Role"
                                        {...getFieldProps('Role')}
                                        value = {formik.values.Role}
                                        error={Boolean(touched.Role && errors.Role)}
                                        helperText={touched.Role && errors.Role}
                                    >
                                        {FsdRoleData.map((unit) => (
                                            <MenuItem key={unit.id} value={unit.id}>{unit.role_name}</MenuItem>
                                        ))}
                                        </TextField>
                                        <TextField
                                            fullWidth
                                            id='CreatedBy'
                                            label="Created By"
                                            required
                                            disabled
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            {...getFieldProps('CreatedBy')}
                                        />
                                    <Stack spacing={2}  style={{width: "30%"}}>
                                        {/* ---- Is Active ---- */}
                                        <Typography>
                                        <Checkbox checked={values.IsActive} onChange={(event, checked) => {
                                                setFieldValue("IsActive", checked);
                                        }}/>
                                        Active
                                    </Typography>
                                    </Stack> 
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />
                    <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} >Update FSD Member </LoadingButton>
                </Form>
            </FormikProvider>
            </Container>
        </Page>
    )
}