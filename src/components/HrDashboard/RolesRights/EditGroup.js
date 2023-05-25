import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
    Button, Card, CardContent, Container,
    Link, Stack, TextField, Typography,
    Autocomplete, Chip, InputLabel, MenuItem
}
    from '@mui/material';

import Page from '../../Page';

import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack'
import Switch from '@mui/material/Switch';

import { useFormik, Form, FormikProvider, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import axios from 'axios';
import { apiInstance } from 'src/utils/apiAuth';

export default function EditGroup() {

    const { enqueueSnackbar } = useSnackbar();

    const rid = useParams()

    const hrToken = localStorage.getItem("authToken");

    const navigate = useNavigate();

    const [permData, setPermData] = useState([]);

    // Stores role information
    const [roleInfo, setRoleInfo] = useState({});

    // Stores role's permissions data
    const [userPerm, setUserPerm] = useState([]);


    // Stores deleted permissions
    const [deleteItem, setDeleteItem] = useState([]);

    const [masterRole, setMasterRole] = useState([]);

    const getPermissionsList = () => {

        apiInstance({
            method: "get",
            url: "rights/",
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                const permArray = getPermArray(response.data.data)
                setPermData(permArray)
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

    const getMasterRolesList = () => {
        apiInstance({
            method: "get",
            url: "master-roles/",
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                setMasterRole(response.data.data)
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


    const getRoleInfo = () => {
        apiInstance({
            method: "get",
            url: "roles/"+rid.id,
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                setRoleInfo(response.data.data)
                var user_perm = response.data.data.permissions
                setUserPerm(user_perm)
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

    const getPermArray = (permissionObj) =>
    permissionObj.map((obj) => {
        return ({
        id: obj.id,
        permission_name: obj.permission_name,
        is_active: obj.is_active
    })});

    // This method handles delete operations on current permission chips list.
    const handleChipDelete = (chipObj) => () => {
        deleteItem.push(chipObj)
        // Removes item from the state
        setUserPerm((chips) => chips.filter((chip) => chip.id !== chipObj.id));
        // Add item to the dropdown menu  
        permData.push(chipObj)
    }
  
    // This method handles dropdown values.
    const getMenuData = () => {
        if (deleteItem.length <= 0)
        {          
            var _ = require('lodash');

            var result = permData.filter(function(obj){
                return _.findIndex(userPerm, {'id': obj.id}) !== -1 ? false : true;
            });        
            setPermData(result)        
        }
        else{
            // This block removes the repeated item from the list
            var updatedList = [...new Map(permData.map(item => [item['id'], item])).values()]
            setPermData(updatedList)
        }
    }

    useEffect(() => {
        getRoleInfo();
        getPermissionsList();
        getMasterRolesList();
    }, [])

    const callEditRoleAPI = (formValues) => {
        apiInstance({
            method: "put",
            url: "roles/" + rid.id + "/",
            headers: {
                Authorization: "token " + hrToken,
            },
            data: formValues,
        })
            .then(function (response) {
                enqueueSnackbar(response.data.message, {
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    variant: 'success',
                    autoHideDuration: 2000,
                });
                navigate("/resumeX/roles", { replace: true });
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
    
    const RoleSchema = Yup.object().shape({
        RoleName: Yup.string()
            .min(2, "Too Short!")
            .max(50, "Too Long!")
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for role name")
            .required("Role name required"),
        ParentRole: Yup.string()
            .required("Parent role is required."),
        is_active: Yup.string()
            .required("Active status is required."),
        Permissions: Yup.array()
    });

    const formik = useFormik({
        initialValues: {
            RoleName: roleInfo?.role_name ?? '',
            ParentRole: roleInfo?.master_role?.id ?? '',
            Permissions: [],
            is_active: roleInfo?.is_active ?? false,            
        },
        enableReinitialize: true,
        validationSchema: RoleSchema,
        onSubmit: (values) => {            
            var user_perm_id = userPerm.map((obj) => obj.id )
            var new_ids_list = [...user_perm_id, ...values.Permissions]

            let formData = {
                "role_name": values.RoleName,
                "master_role_id": values.ParentRole,
                "permissions_id": new_ids_list,
                "is_active": values.is_active
            }

            // call Edit role API
            callEditRoleAPI(formData)
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, setFieldValue, handleChange } = formik;

    return (
        <Page title="Edit Roles">
            <Container maxWidth="xl">
                <Link to="/resumeX/roles" color="green" underline="hover" component={RouterLink} fontSize="20px"> Back
                </Link>
                <Typography variant="h4" sx={{ mb: 5 }} align="center" color="black">
                    Edit Role
                </Typography>

                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Card sx={{ mt: 2, ml:40 }} variant="outlined" style={{ width:'50%'}}>
                            <CardContent>
                                <Stack spacing={3}>

                                   <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            label="Role Name"

                                            {...getFieldProps('RoleName')}

                                            error={Boolean(touched.RoleName && errors.RoleName)}
                                            helperText={touched.RoleName && errors.RoleName}

                                        >
                                        </TextField>

                                    </Stack>

                                    <Stack>
                                        <div> 
                                            <InputLabel sx={{marginLeft:'10px'}}> 
                                            Current Permissions      
                                            </InputLabel>

                                            {/* {values.nameList?.length !== 0 ?
                                            <span>{values.nameList?.map((opt) => <Chip label={opt} style={{marginLeft:5, marginTop:10 }} variant='outlined' color='primary' />)} </span> : <span> <Chip label='Not assigned yet' style={{marginLeft:5, marginTop:10 }} variant='outlined' color='error' /> </span> } */}

                                            <span > 
                                            {userPerm?.length !== 0 ?
                                            userPerm?.map((opt) =>{
                                            return (
                                                <Chip key={opt.id} 
                                                    style={{marginLeft:'10px', marginTop: '5px'}}
                                                    label={opt.permission_name}
                                                    onDelete={handleChipDelete(opt)}
                                                    />
                                                )}) : 
                                                <span> 
                                                    <Chip 
                                                    key='not-available' label='Not assigned yet' style={{marginLeft:5, marginTop:10 }} variant='outlined' color='error' /> </span> }
                                            </span>

                                        </div>
                                    </Stack>

                                    <Stack>
                                        <Autocomplete
                                            multiple
                                            id="permission-list"
                                            options={permData}
                                            getOptionLabel={(option) => option.permission_name}
                                            filterSelectedOptions
                                            onOpen={getMenuData}
                                            onChange={(event, value) => {
                                                var list = value.map((v) => v.id)
                                                setFieldValue("Permissions", list);
                                              }}
                                            renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Add Permissions"
                                                placeholder="Select"

                                                {...getFieldProps("Permissions")}

                                            error={Boolean(touched.Permissions && errors.Permissions)}
                                            helperText={touched.Permissions && errors.Permissions}
                                            />
                                            )}
                                        />
                                        
                                        <TextField
                                            fullWidth
                                            label="Parent Role"
                                            select
                                            sx={{marginTop:3}}

                                            {...getFieldProps('ParentRole')}

                                            error={Boolean(touched.ParentRole && errors.ParentRole)}
                                            helperText={touched.ParentRole && errors.ParentRole}
                                        >
                                            {masterRole.map((option) => (
                                            <MenuItem key={option.id} value={option.id}>
                                            {option.master_role}
                                            </MenuItem>
                                            ))}

                                        </TextField>

                                        <div role="group" style={{ width: '40%' }}>
                                        <Stack
                                            direction={{ xs: "column", sm: "row" }}
                                            spacing={3}
                                            style={{ padding: "20px 0 0 12px"}}
                                        >
                                            <div id="switch-label" style={{ color: '#637381', marginTop:'5px'}}> Is Role Active ? </div>

                                            <Switch
                                                name="is_active"
                                                value="true"
                                                checked={values.is_active}
                                                onChange={(event, checked) => {
                                                    setFieldValue("is_active", checked);
                                            }}
                                            />
                                        </Stack>
                                        <ErrorMessage name="is_active">
                                            {(msg) => <span style={{ color: "#FF4842", fontSize: "12px" ,marginLeft:15}}>{msg}</span>}
                                        </ErrorMessage>
                                     </div>     
                                    </Stack>
                                </Stack>
                                   
                            </CardContent>
                        </Card>


                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2}} />

                        <LoadingButton
                            size="large"
                            type="submit"
                            variant="contained"
                            loading={isSubmitting}
                            style={{marginLeft:550, width:300}}
                        >
                            Update Role
                       </LoadingButton>

                      </Form>
                </FormikProvider>
            </Container>
        </Page >
    )
}