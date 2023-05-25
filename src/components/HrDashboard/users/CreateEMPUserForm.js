import { useState, useEffect } from 'react';
import Page from '../../Page';
import {
    Card, CardContent, Container,Checkbox,
    Link, Stack, TextField, Typography,
    InputAdornment, MenuItem
}
    from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack'
import * as constants from 'src/utils/constants';
import { apiInstance } from 'src/utils/apiAuth';
import { sortBy } from 'lodash';

export default function CreateEMPUserForm() {

    const [selectRoleData , setSelectRoleData] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const hrToken = localStorage.getItem("authToken");
    var showIntTech = 0;
    const navigate = useNavigate();
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const [EmployeeData, setEmployeeData] = useState([]);

    useEffect(() => {
        getEmployeeList();
        getIntTech();
        getRoles();
        getBU();
    }, [])

    // get Business Units
    const [buData, setBUData] = useState([])
    const getBU = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/business-units/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
            setBUData(response.data.data)
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

    // is_active state
    const [checked, setChecked] = useState(true);
    const handleIsActiveChange = event =>{  
        setChecked(event.target.checked);
    };

    const getEmployeeList = () => {
        apiInstance({
            method: "get",
            url: "employee/",
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                const EmployeeData = getEmployeeArray(response.data.data)
                setEmployeeData(EmployeeData)
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

    const callCreateEmployee = async (formValues) => {

        var new_mobile_no = "+91" + formValues.Mobile_no;
        var bodyFormData = new FormData();

        bodyFormData.append("first_name", formValues.FirstName);
        bodyFormData.append("last_name", formValues.LastName);
        bodyFormData.append("email", formValues.Email);
        bodyFormData.append("mobile", new_mobile_no);
        bodyFormData.append("gender", formValues.Gender);
        bodyFormData.append("dob", formValues.DateOfBirth);
        bodyFormData.append("is_active",checked);
        bodyFormData.append("role_id", formValues.Roles);
        bodyFormData.append("bu_group_id", formValues.BU);
        bodyFormData.append("interview_tech_id", formValues.IntTech);

        await apiInstance({
            method: "post",
            url: "employee/",
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

    const getEmployeeArray = (EmployeeData) =>
        EmployeeData.map((EmployeeObj) => ({
            pk: EmployeeObj.id,
            UserName: EmployeeObj.User
        }));


    const EmployeeSchema = Yup.object().shape({
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
        Email: Yup.string()
            .email("Email must be a valid email address")
            .required("Email is required"),
        IsActive: Yup.bool(),
        IntTech: Yup.string(),
        BU: Yup.string()
            .required("Business Units is required."),
        DateOfBirth: Yup.date()
            .required('DOB is required'),
        Gender: Yup.string(),
        Roles: Yup.string()
        .required('Role is required'),
    });

    const formik = useFormik({
        initialValues: {
            FirstName: '',
            LastName: '',
            Email: '',
            Mobile_no: '',
            Gender: '',
            IsActive: '',
            DateOfBirth: '',
            IntTech: '',
            Roles: '',
            BU: '',
            
        },
        validationSchema: EmployeeSchema,
        onSubmit: (values) => {
            callCreateEmployee(values)
        }
    });


    const thisEMPRoleData = RolesData.map((items) => { if(items.role_name == "BU_HEAD" || items.role_name == "OnBoarding_HR" || items.role_name == "NON_TECH_INTERVIEWER"  || items.role_name == "TECH_INTERVIEWER"  || items.role_name == "RMG" || items.role_name == "Requisitioner"){ return items } })
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
                <Typography variant="h4" sx={{ mb: 5 }} align="center" color="black">
                    Create Employee
                </Typography>
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Card sx={{ mt: 2 }} variant="outlined" style={{ border: "none", boxShadow: "none" }}>
                            <CardContent sx={{ mb: 5 }}>    
                                <Typography variant="h6" color="#aaaa55" fontStyle="italic" gutterBottom>
                                    <div style={{float: "left", width: "50%", marginTop: "20px"}}>
                                        Employee Details
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
                                    <TextField
                                        fullWidth
                                        type = "date"
                                        label="Date of Birth"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        {...getFieldProps('DateOfBirth')}

                                        error={Boolean(touched.DateOfBirth && errors.DateOfBirth)}
                                        helperText={touched.DateOfBirth && errors.DateOfBirth}
                                    >
                                    </TextField>
                                </Stack>
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                 <TextField
                                    fullWidth
                                    select
                                    label="Role"
                                    {...getFieldProps('Roles')}
                                    // onClick={handleAssignRole}
                                >
                                {EMPRoleData.map((unit) => (
                                    <MenuItem key={unit.id} value={unit.id} onClick={(e) => {setSelectRoleData(unit.id)}}>{unit.role_name}</MenuItem>
                                ))}
                                </TextField>
                                <TextField
                                    fullWidth
                                    select
                                    label="Interview Technology"
                                    {...getFieldProps("IntTech")}
                                    error={Boolean(touched.IntTech && errors.IntTech)}
                                    helperText={touched.IntTech && errors.IntTech}
                                >
                                    {IntTechData.map((unit) => (
                                        <MenuItem key={unit.id} value={unit.id}>{unit.tech_stack_name}</MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    fullWidth
                                    select
                                    label="Business Units"
                                    {...getFieldProps("BU")}
                                    error={Boolean(touched.BU && errors.BU)}
                                    helperText={touched.BU && errors.BU}
                                >
                                    {buData.map((unit) => (
                                        <MenuItem key={unit.id} value={unit.id}>{unit.bu_name}</MenuItem>
                                    ))}
                                </TextField>
                            </Stack>
                            <Stack spacing={2} alignContent="center" justifyContent="center">
                                <div role="group" >
                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        spacing={3}
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
                             {/* ----- Is Active  -----*/}
                                <Typography>
                                    <Checkbox onChange={handleIsActiveChange}/>
                                    Active
                                </Typography>
                            </Stack>  
                        </Stack>
                    </CardContent>
                        </Card>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />
                        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} > Add Employee </LoadingButton>
                    </Form>
                </FormikProvider>
            </Container>
        </Page >
    )
}


