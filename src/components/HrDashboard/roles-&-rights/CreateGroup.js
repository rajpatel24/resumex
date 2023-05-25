import { useState, useEffect } from 'react';
import Page from '../../Page';
import {
    Button, Card, CardContent, Container,
    Link, Stack, TextField, Typography,
    MenuItem, Autocomplete
}
    from '@mui/material';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider, ErrorMessage, Field } from 'formik';

import * as Yup from 'yup';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack'
import Switch from '@mui/material/Switch';

import { apiInstance } from 'src/utils/apiAuth';

export default function CreateGroup() {

    const { enqueueSnackbar } = useSnackbar();

    const hrToken = localStorage.getItem("authToken");

    const navigate = useNavigate();

    const [permData, setPermData] = useState([]);

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

    const getPermArray = (permissionObj) =>
    permissionObj.map((obj) => ({
        pk: obj.id,
        permName: obj.permission_name,
        isActive: obj.is_active
    }));

    const callCreateRoleAPI = (formValues) => {

        apiInstance({
            method: "post",
            url: "roles/",
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


    useEffect(() => {
        getPermissionsList();
        getMasterRolesList();
    }, [])

    
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
            .min(1, "Permissions are required")
    });

    const formik = useFormik({
        initialValues: {
            RoleName: '',
            ParentRole: '', 
            Permissions: [],
            is_active: '',
            
        },
        validationSchema: RoleSchema,
        onSubmit: (values) => {

            let formData = {
                "role_name": values.RoleName,
                "master_role_id": values.ParentRole,
                "permissions_id": values.Permissions,
                "is_active": values.is_active
            }

            // call create role API
            callCreateRoleAPI(formData)
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, setFieldValue, handleChange } = formik;

    return (
        <Page title="Create Roles">
            <Container maxWidth="xl">
                <Link to="/resumeX/roles" color="green" underline="hover" component={RouterLink} fontSize="20px"> Back
                </Link>
                <Typography variant="h4" sx={{ mb: 5 }} align="center" color="black">
                    Add Role
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

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            label="Parent Role"
                                            select

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

                                    </Stack>
                                    <Stack>
                                        {/* <TextField
                                        fullWidth
                                        id="Permissions"
                                        label="Permissions"
                                        select

                                        SelectProps={{
                                            multiple: true,
                                            value: formik.values.Permissions,
                                            onChange: (selectedOption) => handleChange("Permissions")(selectedOption),
                                            MenuProps: {
                                                style: {
                                                    maxHeight: 200,
                                                },
                                            },

                                        }}

                                        {...getFieldProps("Permissions")}

                                        error={Boolean(touched.Permissions && errors.Permissions)}
                                        helperText={touched.Permissions && errors.Permissions}
                                        >
                                        {permData.map((option) => (
                                            <MenuItem key={option.id} value={option.pk}>
                                            {option.permName}
                                            </MenuItem>
                                        ))}
                                        </TextField> */}


                                        <Autocomplete
                                            multiple
                                            id="permission-list"
                                            options={permData}
                                            getOptionLabel={(option) => option.permName}
                                            //defaultValue={null}
                                            filterSelectedOptions
                                            onChange={(event, value) => {
                                                var list = value.map((v) => v.pk)
                                                setFieldValue("Permissions", list);
                                              }}
                                            renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Permissions"
                                                placeholder="Select"

                                                {...getFieldProps("Permissions")}

                                            error={Boolean(touched.Permissions && errors.Permissions)}
                                            helperText={touched.Permissions && errors.Permissions}
                                            />
                                            )}
                                        />

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
                                                // checked={values.is_active}
                                                onChange={(event, checked) => {
                                                    setFieldValue("is_active", checked ? "true" : "false");
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
                            Add Role
                       </LoadingButton>

                      </Form>
                </FormikProvider>
            </Container>
        </Page >
    )
}