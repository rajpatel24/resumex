import { useState, useEffect } from 'react';
import Page from '../../Page';
import axios from 'axios';
import * as constants from 'src/utils/constants';
import {
    Button, Card, CardContent, Container,Checkbox,
    Link, Stack, TextField, Typography, MenuItem
}
    from '@mui/material';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useFormik, Form, FormikProvider, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { apiInstance } from 'src/utils/apiAuth';
import { sortBy } from 'lodash';

export default function EditEmployee(props) {
    
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const hrToken = localStorage.getItem("authToken");
    const navigate = useNavigate();
    const [UserData, setUserData] = useState([])
    const [selectRoleData , setSelectRoleData] = useState([]);
    var showIntTech = 0;
    const mobileRegex = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/

    // get Roles
    const [RolesData, setRolesData] = useState([])
    const getRoles = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/roles/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setRolesData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    }; 
    // get Technologies
    const [IntTechData, setIntTechData] = useState([])
    const getIntTech = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/tech-stack/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            let techStackList = response.data.data
            let sortedList = sortBy(techStackList, "stack_priority")
            setIntTechData(sortedList)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };   
    const getUserData = async () => {
        await axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + "/api/v1/employee/" + id + "/", { headers: { "Authorization": `Token ${localStorage.getItem('authToken')}` } })
        .then((response) => {
            setUserData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };
    useEffect(() => {
        getUserData();
        getRoles();
        getIntTech();
    }, [])
    const getUserList = () => {
        apiInstance({
            method: "get",
            url: "employee/",
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
    const callUpdateEmployee = (formValues) => {
        var employee_id = UserData?.id

        var apiData = {
            "first_name": formValues.FirstName,
            "last_name": formValues.LastName,
            "email": formValues.Email,
            "role_id": formValues.Role,
            "interview_tech_id" : formValues.IntTech,
            "mobile": formValues.Mobile_no,
            "is_active": formValues.IsActive,
        }
        apiInstance({
            method: "put",
            url: "employee/"+ employee_id + "/",
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
                navigate("/resumeX/empusers", { replace: true });
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
    const EmployeeSchema = Yup.object().shape({
        Mobile_no: Yup.string()
            .min(13, 'Please check the country code')
            .max(13, 'Please check the mobile number')
            .matches(mobileRegex, 'Mobile number is not valid')
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
        IsActive: Yup.bool(),
        Role: Yup.string()
            .required("Role is required."),
        IntTech: Yup.string()
            .required("Interview Technology is required."),
    });
    const formik = useFormik({
        initialValues: {
            FirstName: UserData?.user?.first_name ?? '',
            LastName:  UserData?.user?.last_name ?? '', 
            Email:  UserData?.user?.email ?? '', 
            Mobile_no:  UserData?.user?.mobile ?? '',
            IsActive: UserData?.user?.is_active ?? '',
            Role: UserData?.user?.role?.id ?? '',
            IntTech: UserData?.interview_tech?.id ?? '',  
        },
        enableReinitialize: true,
        validationSchema: EmployeeSchema,
        onSubmit: (values) => {
            // call Update User API
            callUpdateEmployee(values)
        }
    });

    const thisEMPRoleData = RolesData.map((items) => { if(items.role_name == "BU_HEAD" || items.role_name == "OnBoarding_HR" || items.role_name == "NON_TECH_INTERVIEWER"  || items.role_name == "TECH_INTERVIEWER"  || items.role_name == "RMG" ){ return items } })
    const EMPRoleData = thisEMPRoleData.filter(function (el) { return el != null; });

    //------------------------Functions-------------------------------

    // function handleAssignRole(){
    //     const thisSelectRole = EMPRoleData.map((item) => { if(item.id == selectRoleData){return item}})
    //     const thisRole = thisSelectRole.filter(function (el) { return el != null; });
    //     if(thisRole?.[0]?.role_name == "BU_HEAD" || thisRole?.[0]?.role_name == "RMG" || thisRole?.[0]?.role_name == "NON_TECH_INTERVIEWER"){
    //         showIntTech = 1;
    //     }
    // }
    
    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, setFieldValue } = formik;

    return (
        <Page title="Employee">
            <Container maxWidth="xl">
            <Link to="/resumeX/empusers" color="green" underline="hover" component={RouterLink} fontSize="20px"> Back
            </Link>
                <Typography variant="h4" sx={{ mb: 5 }} align="center">
                    Edit Employee
                </Typography>
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Card sx={{ mt: 2 }} variant="outlined">
                            <CardContent>
                                <Typography variant="h6" color="#aaaa55" align="center" fontStyle="italic" gutterBottom>
                                    Employee Details
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
                                            helperText={touched.FirstName && errors.FirstName}
                                        >
                                        </TextField>
                                       
                                        <TextField
                                        fullWidth
                                        label='Last Name'
                                        required
                                        {...getFieldProps('LastName')}
                                        error={ Boolean(touched.LastName && errors.LastName)}
                                        helperText = {touched.LastName && errors.LastName}
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

                                        error={Boolean(touched.Mobile_no && errors.Mobile_no)}
                                        helperText={touched.Mobile_no && errors.Mobile_no}
                                    /> 
                                    
                                    <TextField
                                    fullWidth
                                    select
                                    label="Role"
                                    required
                                    disabled={showIntTech}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    {...getFieldProps('Role')}
                                    // onClick={handleAssignRole}
                                >
                                    {EMPRoleData.map((unit) => (
                                        <MenuItem key={unit.id} value={unit.id} onClick={(e) => {setSelectRoleData(unit.id)}}>{unit.role_name}
                                        </MenuItem>
                                    ))}
                                    </TextField>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Interview Tech-Stack"
                                        required
                                        {...getFieldProps("IntTech")}
                                        error={Boolean(touched.IntTech && errors.IntTech)}
                                        helperText={touched.IntTech && errors.IntTech}
                                    >
                                        {IntTechData.map((unit) => (
                                            <MenuItem key={unit.id} value={unit.id}>{unit.tech_stack_name}</MenuItem>
                                        ))}
                                    </TextField>
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>             </Stack>                 
                                    <Stack spacing={2} >
                                        {/* ------ Is Active ----- */}
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
                        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} > Update Employee </LoadingButton>
                    </Form>
                </FormikProvider>
            </Container>
        </Page>
    )
}