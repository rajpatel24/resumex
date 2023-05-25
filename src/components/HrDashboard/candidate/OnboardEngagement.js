import { useState, useEffect } from 'react';
import Page from '../../Page';
import {
    Button, Card, CardContent, Container,
    Link, Stack, TextField, Typography,
    InputAdornment, InputLabel, MenuItem, Tooltip, Fade, Autocomplete
}
    from '@mui/material';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider, ErrorMessage, Field, useFormikContext, useField } from 'formik';

import * as Yup from 'yup';
import axios from 'axios';
import { DateTimePicker, LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack'
import { CenterFocusStrong } from '@mui/icons-material';
import OnboardEngagementList from './ListCandOnboardEngagement';
import DatePicker from 'react-datepicker';
import { border } from '@mui/system';
import { apiInstance } from 'src/utils/apiAuth';


const DatePickerField = ({ ...props }) => {
    const { setFieldValue } = useFormikContext();
    const [field] = useField(props);
   
    return (   
      <DatePicker
        {...field}
        {...props}

        showTimeSelect        

        selected={(field.value && new Date(field.value)) || null}

        onChange={(val) => {
          setFieldValue(field.name, val);
        }}

        dateFormat="MMMM d, yyyy h:mm aa"
        // dateFormat="yyyy-MM-dd h:mm:ss aa"
      />
    );
  };

export default function OnboardEngagement(candData) {
    const { enqueueSnackbar } = useSnackbar();
    const hrToken = localStorage.getItem("authToken");
    const navigate = useNavigate();

    const contact_person = [
        'Aashruti D Pagey',
        'Aesha P Shah',
        'Ajay K Chawla',
        'Alap D Mistry',
    ]

    const [disableValue, setDisableValue] = useState(false)
   
    const setOtherValues = () => 
    {
        let user = JSON.parse(localStorage.getItem("user"))
        let user_role = user.role.role_name
            
        if (user_role === 'BU_HEAD')
        { setDisableValue(true)  }

        else{ setDisableValue(false) }
    }

    useEffect(() => {
        setOtherValues();
    }, [])


    const callEngagementCreateAPI = (apiData) => {

        apiInstance({
            method: "post",
            url: "onboard-engagements/",
            headers: {
                Authorization: "token " + hrToken,
            },
            data: apiData,
        })
            .then(async function (response) {
                enqueueSnackbar(response.data.message, {
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    variant: 'success',
                    autoHideDuration: 2000,
                });
                navigate("/resumeX/candidates", { replace: true });
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

    const EngagementSchema = Yup.object().shape({
        ContactPerson: Yup.string()
                          .required("Contact person is required."),
        MeetingDT: Yup.date()
                      .min(new Date(), "Invalid meeting date & time.")
                      .required("Schedule date & time is required."),
        Mode: Yup.string()
                 .required("Contact mode is required."),
        IM: Yup.string()
               .when("Mode",{
                is: (val) => val !== "BBB" && val !== "Face To Face",
                then: Yup.string().required('IM is required')
               } ),
        Agenda: Yup.string()
                    .required("Agenda for call is required."),
    });

    const formik = useFormik({
        initialValues: {
            ContactPerson: '',
            MeetingDT: new Date(),
            Mode: '',
            IM: '',
            Agenda: '',
        },
        validationSchema: EngagementSchema,
        onSubmit: (values) => {
            let cand_id = candData?.candidateData?.id

            let formData = {
                "candidate_id": cand_id,
                "call_with": values.ContactPerson,
                "schedule_dt": values.MeetingDT,
                "mode": values.Mode,
                "im": values.IM,
                "agenda": values.Agenda
            }
            callEngagementCreateAPI(formData)
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, setFieldValue, } = formik;

    return (
        <Page title="Candidates">
            <Container maxWidth="xl">

                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                        <Card sx={{ mt: 2 }} variant="outlined">

                            <CardContent>
                                <Stack spacing={3}>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                    <Autocomplete
                                        fullWidth
                                        id="ContactPerson"
                                        type="string"
                                        options={contact_person}

                                        onChange={(event, value) => {
                                            setFieldValue("ContactPerson", value);
                                          }}
                                          
                                        renderInput={(params) => <TextField {...params} 
                                        
                                        label="Call/Meeting With ?" 
                                        disabled={disableValue}

                                        error={Boolean(touched.ContactPerson && errors.ContactPerson)}
                                        helperText={touched.ContactPerson && errors.ContactPerson}
                                        />}
                                    />

                                    <div className="form-group" 
                                         style={{ display: 'flex', justifyContent: 'space-between', paddingTop:15, width:"100%" }}
                                    >

                                        <InputLabel id="schedule-date-time"
                                        style={{ width: "50%"}}> 
                                            Scheduled Date and Time: 
                                        </InputLabel>
                                        <TextField 
                                        style={{width: "100%"}}  label="Meeting" 
                                        type="datetime-local" 
                                        name="MeetingDT"  
                                        disabled={disableValue}

                                        InputLabelProps={{shrink: true }}/>

                                        <ErrorMessage name="MeetingDT">
                                            {(msg) => <span
                                                style={{width:"inherit", color: "#FF4842", fontSize: "13px", textAlign: "inherit"}}>
                                                {msg}
                                            </span>}
                                        </ErrorMessage>                       
                                    </div>

                                    </Stack>
                                    

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            id="Mode"
                                            type="string"
                                            label="Meeting Mode"
                                            disabled={disableValue}

                                            select

                                            {...getFieldProps("Mode")}
                                            error={Boolean(touched.Mode && errors.Mode)}
                                            helperText={touched.Mode && errors.Mode}
                                        >
                                        
                                        <MenuItem key="Audio" value="Audio">
                                            Audio
                                        </MenuItem>
                                        <MenuItem key="BBB" value="BBB">
                                            BBB
                                        </MenuItem>
                                        <MenuItem key="Skype" value="Skype">
                                            Skype
                                        </MenuItem>
                                        <MenuItem key="Face2Face" value="Face To Face">
                                            Face To Face
                                        </MenuItem>
                                      
                                        </TextField>

                                        { values.Mode !== 'BBB' && values.Mode !== 'Face To Face'? 

                                        <TextField
                                            fullWidth
                                            id="IM"
                                            type="string"
                                            label="IM"
                                            disabled={disableValue}

                                            {...getFieldProps("IM")}

                                            error={Boolean(touched.IM && errors.IM)}
                                            helperText={touched.IM && errors.IM}
                                        />  : null }                                   
                                    </Stack>

                                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} >

                                        <TextField
                                            fullWidth
                                            id="Agenda"
                                            label="Agenda of the call "
                                            multiline
                                            rows={3}
                                            disabled={disableValue}

                                            {...getFieldProps("Agenda")}

                                            error={Boolean(touched.Agenda && errors.Agenda)}
                                            helperText={touched.Agenda && errors.Agenda}
                                        />
                                    </Stack>

                                </Stack>


                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

                                <LoadingButton
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    loading={isSubmitting}
                                    disabled={disableValue}
                                >
                                    Schedule Call
                                </LoadingButton>

                            </CardContent>
                        </Card>
                    </Form>
                </FormikProvider>

                <Card sx={{ mt: 2 }} variant="outlined">
                    <CardContent>
                        <OnboardEngagementList  tableContent={candData} />                        
                    </CardContent>
                </Card>

            </Container >
        </Page >
    )
}