import { useState, useEffect } from 'react';
import Page from '../../Page';
import {
    Button, Card, CardContent, Container,
    Link, Stack, TextField, Typography,
    InputAdornment, InputLabel, MenuItem, Tooltip, Fade
}
    from '@mui/material';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider, ErrorMessage, Field } from 'formik';

import * as Yup from 'yup';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack'
import { apiInstance } from 'src/utils/apiAuth';


export default function EditCandidateHRAnalysis(candData) {

    const { enqueueSnackbar } = useSnackbar();

    const hrToken = localStorage.getItem("authToken");

    const navigate = useNavigate();
       
    const [degreeData, setDegreeData] = useState([]);

    const [ratingsData, setRatingsData] = useState([]);

    const [disableValue, setDisableValue] = useState(false)
  
    useEffect(() => {
        getNoticePeriodList();
        getNonVerbalCuesList();
        setOtherValues();
    }, [])

    const getNoticePeriodList = () => {

        apiInstance({
            method: "get",
            url: "education-degree/",
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                const degreeObjects = getDegreeArray(response.data.data)
                setDegreeData(degreeObjects)
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

    const getNonVerbalCuesList = () => {

        apiInstance({
            method: "get",
            url: "non-verbal-cues/",
            headers: {
                Authorization: "token " + hrToken,
            }
        })
            .then(function (response) {
                const ratingObjects = getRatingsArray(response.data.data)
                setRatingsData(ratingObjects)
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
    
    const getDegreeArray = (degreeObjects) =>
        degreeObjects.map((obj) => ({
            pk: obj.id,
            degree_name: obj.degree_name
        }));

    
    const getRatingsArray = (ratingObjects) =>
        ratingObjects.map((obj) => ({
            pk: obj.id,
            rating_name: obj.rating_name,
            sort_order: obj.sort_order,
            is_active: obj.is_active,
        }));

    const updateCandHRAnalysis = (formValues) => {
        var cand_id = candData?.candidateData?.hr_analysis?.candidate?.id ?? candData?.candidateData?.id

        var apiData = {
            "candidate_id": cand_id,
            "education_gap": formValues.EduGap,
            "undergraduation": formValues.UG,
            "higher_education_id": formValues.HE,
            "highest_edu_score": formValues.HighScore,
            "job_change_cnt": formValues.JobChangeCnt,
            "avg_stay": formValues.AvgStay,
            "job_change_cause": formValues.ChangeReason,
            "exp_gap": formValues.ExpGap,
            "long_stay": parseInt(formValues.LongStay),
            "countries_visited": formValues.CountryVisit,
            "onsite_prefer": formValues.OnsitePrefer,
            "native_place": formValues.NativePlace,
            "family_info": formValues.FamilyInfo,
            "parents_profession": formValues.ParentProfession,
            "marital_status": formValues.MaritalStatus,
            "scratch_projects": parseInt(formValues.ScratchPojects),
            "client_communication": formValues.ClientCom,
            "project_location": formValues.ProjectLoc,
            "long_pro_details": formValues.LongProDetails,
            "project_role": formValues.ProjectRR,
            "project_tools": formValues.ProjectTools,
            "understand_capability": formValues.UnderstandingAbility,
            "comm_skills": formValues.CommSkills,
            "grammatical_errors": formValues.GrammaticalMistakes,
            "conversation_skills": formValues.CoversationSkills,
            "eye_contact_id":formValues.EyeContact,
            "facial_id": formValues.FacialExpressions,
            "posture_id":formValues.Posture,
            "dressing_id":formValues.Dressing,
        }

        apiInstance({
            method: "put",
            url: "candidate-initial-analysis/" + cand_id + '/',
            headers: {
                Authorization: "token " + hrToken,
            },
            data: apiData,
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
                navigate(0);
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

    const setOtherValues = () => 
    {
        let user = JSON.parse(localStorage.getItem("user"))
        let user_role = user.role.role_name
            
        if (user_role === 'BU_HEAD')
        { setDisableValue(true)  }

        else{ setDisableValue(false) }
    }

    const eye_title = <span>
    <Typography color="inherit">  Inappropriate:    </Typography>
    <em>{"No expression, no smile, no acknowledgement of what is being talked about."} </em> 
    <Typography color="inherit"> Below Expectations: </Typography>
    <em> {"Minor intermittent nods, no expressions, no smile."} </em>
    <Typography color="inherit"> Meets Expectations: </Typography>
    <em> {"Decent constant smile, expressions while talking."}  </em>
    <Typography color="inherit"> Above Expectations: </Typography>
    <em> {"Lively expressions, vivacious, constant divine smile, giving a continuous positive vibe (wow effect)."} </em>
    </span>

    const facial_title = <span>
    <Typography color="inherit"> Inappropriate: </Typography>
    <em>{"Doesn\'t maintain eye-contact at all, looks down continuously OR will have constant stare at you."} </em> 
    <Typography color="inherit"> Below Expectations: </Typography>
    <em> {"Maintains eye-contact when questions are asked, but does not maintain eye contact continuously during the answers."} </em>
    <Typography color="inherit"> Meets Expectations:  </Typography>
    <em> {"Starts off with minimum eye-contact but gradually increases the eye-contact by looking at you when answering."}  </em>
    <Typography color="inherit"> Above Expectations: </Typography>
    <em> {"Maintains healthy eye-contact during both questions and answers, looks away to think and then maintain eye contact again when answering."} 
    </em>
    </span>

    const posture_title = <span>
    <Typography color="inherit"> Inappropriate: </Typography>
    <em>{"Lean and relaxed shoulders, hands folded or beneath the seat area. Crosses the leg over the other."} </em> 
    <Typography color="inherit"> Below Expectations: </Typography>
    <em> {"Keeps hands on the table during interview. Fidgets or moves the body continuously while sitting."} </em>
    <Typography color="inherit"> Meets Expectations: </Typography>
    <em> {"Decent constant smile, expressions while talking."} </em>
    <Typography color="inherit"> Above Expectations: </Typography>
    <em> {"Firm shoulders, few hand movements describing the answers, straight legs."} </em>
    </span>

    const dressing_title = <span>
    <Typography color="inherit">  Inappropriate: </Typography>
    <em>{"Casual, t-shirt, torn clothes, informal dresses."} </em> 
    <Typography color="inherit"> Below Expectations: </Typography>
    <em> {"Creased shirt or top with jeans."} </em>
    <Typography color="inherit"> Meets Expectations: </Typography>
    <em> {"Semi-formal clothes, checkered shirt or top with formal pants, formal shoes."} </em>
    <Typography color="inherit"> Above Expectations: </Typography>
    <em> {"Formal clothes, shoes, ironed shirt, pants."} </em>
    </span>

    const CandidateSchema = Yup.object().shape({
        EduGap: Yup.string()
            .required("Education gap information is required"),
        UG: Yup.string()
            .required("Undergraduation detail is required"),
        HighScore: Yup.string()
            .required("High Score detail is required"),
        HE: Yup.string()
            .required("Higher Education detail is required"),
        JobChangeCnt: Yup.number()
            .min(0, "Invalid Value"),
        AvgStay: Yup.number()
            .min(0, "Invalid Value"),
        ChangeReason: Yup.string()
            .required("Job Change Reason is required"),
        ExpGap: Yup.string()
            .required("Experience Gap detail is required"),
        LongStay: Yup.number()
            .min(0, "Invalid Value"),
        CountryVisit: Yup.string()
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this current location"),
        OnsitePrefer: Yup.string()
            .required("Onsite visit preference is required"),
        NativePlace: Yup.string(),
        ParentProfession: Yup.string()
            .required("Parents profession information is required"),
        MaritalStatus: Yup.string()
            .required("Marital status information is required"),
        FamilyInfo: Yup.string(),
        ScratchPojects: Yup.number()
            .min(0, "Invalid Value"),
        ClientCom: Yup.string()
            .required("Client communication information is required"),
        ProjectLoc: Yup.string(),
        LongProDetails: Yup.string(),
        ProjectRR: Yup.string()
            .required("Project role & responsibilities information is required"),
        ProjectTools: Yup.string(),
        UnderstandingAbility: Yup.string()
            .required("Above information is required"),
        CommSkills: Yup.string()
            .required("Above information is required"),
        GrammaticalMistakes: Yup.string()
            .required("Above information is required"),
        CoversationSkills: Yup.string()
            .required("Above information is required"),
        EyeContact: Yup.string(),
        FacialExpressions: Yup.string(),
        Posture: Yup.string(),
        Dressing: Yup.string(),

    });

    const formik = useFormik({
        initialValues: {
            CandID: candData?.candidateData?.hr_analysis?.candidate?.id ?? candData?.candidateData?.id,
            FirstName: candData?.candidateData?.hr_analysis?.candidate?.first_name ?? candData?.candidateData?.user?.first_name,
            LastName: candData?.candidateData?.hr_analysis?.candidate?.last_name ?? candData?.candidateData?.user?.last_name,
            EduGap: candData?.candidateData?.hr_analysis?.education_gap ?? '',
            UG: candData?.candidateData?.hr_analysis?.undergraduation ?? '',
            HighScore: candData?.candidateData?.hr_analysis?.highest_edu_score ?? '',
            HE: candData?.candidateData?.hr_analysis?.higher_education?.id ?? '',
            JobChangeCnt: candData?.candidateData?.hr_analysis?.job_change_cnt ?? '',
            AvgStay: candData?.candidateData?.hr_analysis?.avg_stay ?? '',
            ChangeReason: candData?.candidateData?.hr_analysis?.job_change_cause ?? '',
            ExpGap: candData?.candidateData?.hr_analysis?.exp_gap ?? '',
            LongStay: candData?.candidateData?.hr_analysis?.long_stay ?? '',
            CountryVisit: candData?.candidateData?.hr_analysis?.countries_visited ?? '',
            OnsitePrefer: candData?.candidateData?.hr_analysis?.onsite_prefer ?? '',
            NativePlace: candData?.candidateData?.hr_analysis?.native_place ?? '',
            ParentProfession: candData?.candidateData?.hr_analysis?.parents_profession ?? '',
            MaritalStatus: candData?.candidateData?.hr_analysis?.marital_status ?? '',
            FamilyInfo: candData?.candidateData?.hr_analysis?.family_info ?? '',
            ScratchPojects: candData?.candidateData?.hr_analysis?.scratch_projects ?? '',
            ClientCom: candData?.candidateData?.hr_analysis?.client_communication ?? '',
            ProjectLoc: candData?.candidateData?.hr_analysis?.project_location ?? '',
            LongProDetails: candData?.candidateData?.hr_analysis?.long_pro_details ?? '',
            ProjectRR: candData?.candidateData?.hr_analysis?.project_role ?? '',
            ProjectTools: candData?.candidateData?.hr_analysis?.project_tools ?? '',
            UnderstandingAbility: candData?.candidateData?.hr_analysis?.understand_capability ?? '',
            CommSkills: candData?.candidateData?.hr_analysis?.comm_skills ?? '',
            GrammaticalMistakes: candData?.candidateData?.hr_analysis?.grammatical_errors ?? '',
            CoversationSkills: candData?.candidateData?.hr_analysis?.conversation_skills ?? '',
            EyeContact: candData?.candidateData?.hr_analysis?.eye_contact?.id ?? '',
            FacialExpressions: candData?.candidateData?.hr_analysis?.facial_expression?.id ?? '',
            Posture: candData?.candidateData?.hr_analysis?.posture?.id ?? '',
            Dressing:candData?.candidateData?.hr_analysis?.dressing?.id ?? '',
        },
        enableReinitialize: true,
        validationSchema: CandidateSchema,
        onSubmit: (values) => {
            updateCandHRAnalysis(values)
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, } = formik;


    return (
        <Page title="Candidates">
            <Container maxWidth="xl">
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                        <Card sx={{ mt: 2 }} variant="outlined">
                            <CardContent>
                                <Typography variant="h6" color="#aaaa55" align="center" fontStyle="italic" gutterBottom>
                                    Education brief check
                                </Typography>
                            </CardContent>

                            <CardContent>
                                <Stack spacing={3}>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            id="CandID"
                                            type="string"
                                            label="Candidate ID"
                                            disabled

                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                            {...getFieldProps('CandID')}
                                        />


                                        <TextField
                                            fullWidth
                                            id='FirstName'
                                            label="First Name"
                                            disabled

                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                            {...getFieldProps('FirstName')}
                                        />

                                        <TextField
                                            fullWidth
                                            id='LastName'
                                            label="Last Name"
                                            disabled

                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                            {...getFieldProps('LastName')}
                                        />

                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            label="Education Gap"
                                            type="string"
                                            select
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('EduGap')}

                                            error={Boolean(touched.EduGap && errors.EduGap)}
                                            helperText={touched.EduGap && errors.EduGap}

                                        >
                                            <MenuItem key="YES" value="YES">
                                                YES
                                            </MenuItem>
                                            <MenuItem key="NO" value="NO">
                                                NO
                                            </MenuItem>
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="undergraduation"
                                            type="string"
                                            select
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('UG')}

                                            error={Boolean(touched.UG && errors.UG)}
                                            helperText={touched.UG && errors.UG}
                                        >

                                            <MenuItem key="12" value="12">
                                                12
                                            </MenuItem>
                                            <MenuItem key="DIPLOMA" value="DIPLOMA">
                                                DIPLOMA
                                            </MenuItem>

                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="Highest Education Score"
                                            select
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('HighScore')}

                                            error={Boolean(touched.HighScore && errors.HighScore)}
                                            helperText={touched.HighScore && errors.HighScore}
                                        >
                                            <MenuItem key="> 75%" value="> 75%">
                                                {'>'} 75%
                                            </MenuItem>
                                            <MenuItem key="60% - 75%" value="60% - 75%">
                                                60% - 75%
                                            </MenuItem>
                                            <MenuItem key="< 60%" value="< 60%">
                                                {'<'} 60%
                                            </MenuItem>
                                        </TextField>

                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            label="higher_education"
                                            type="string"
                                            select
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('HE')}

                                            error={Boolean(touched.HE && errors.HE)}
                                            helperText={touched.HE && errors.HE}
                                        >
                                            {degreeData.map((option) => (
                                                <MenuItem key={option.pk} value={option.pk}>
                                                    {option.degree_name}
                                                </MenuItem>
                                            ))}

                                        </TextField>
                                    </Stack>

                                </Stack>
                            </CardContent>

                            <CardContent>
                                <Typography variant="h6" color="#aaaa55" align="center" fontStyle="italic" gutterBottom>
                                    Experience Analysis
                                </Typography>

                            </CardContent>

                            <CardContent>
                                <Stack spacing={3}>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            label="No Of Job Change"
                                            type="int"
                                            disabled={disableValue}

                                            {...getFieldProps('JobChangeCnt')}

                                            error={Boolean(touched.JobChangeCnt && errors.JobChangeCnt)}
                                            helperText={touched.JobChangeCnt && errors.JobChangeCnt}
                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="Average Stay"
                                            disabled={disableValue}

                                            {...getFieldProps('AvgStay')}

                                            error={Boolean(touched.AvgStay && errors.AvgStay)}
                                            helperText={touched.AvgStay && errors.AvgStay}
                                        >
                                        </TextField>

                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            label="Job Change Reason"
                                            select
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('ChangeReason')}

                                            error={Boolean(touched.ChangeReason && errors.ChangeReason)}
                                            helperText={touched.ChangeReason && errors.ChangeReason}
                                        >
                                            <MenuItem key="VAGUE" value="VAGUE">
                                                VAGUE
                                            </MenuItem>
                                            <MenuItem key="MONEY" value="MONEY">
                                                MONEY
                                            </MenuItem>
                                            <MenuItem key="VALID" value="VALID">
                                                VALID
                                            </MenuItem>
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="Gap In Experience"
                                            type="string"
                                            select
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('ExpGap')}

                                            error={Boolean(touched.ExpGap && errors.ExpGap)}
                                            helperText={touched.ExpGap && errors.ExpGap}
                                        >

                                            <MenuItem key="YES" value="YES">
                                                YES
                                            </MenuItem>
                                            <MenuItem key="NO" value="NO">
                                                NO
                                            </MenuItem>

                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="Longest Stay in a company (Years)"
                                            type="number"
                                            disabled={disableValue}

                                            {...getFieldProps('LongStay')}

                                            error={Boolean(touched.LongStay && errors.LongStay)}
                                            helperText={touched.LongStay && errors.LongStay}
                                        >
                                        </TextField>

                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            label="Countries Visited"
                                            disabled={disableValue}

                                            {...getFieldProps('CountryVisit')}

                                            error={Boolean(touched.CountryVisit && errors.CountryVisit)}
                                            helperText={touched.CountryVisit && errors.CountryVisit}
                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="Open to Onsite"
                                            select
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('OnsitePrefer')}

                                            error={Boolean(touched.OnsitePrefer && errors.OnsitePrefer)}
                                            helperText={touched.OnsitePrefer && errors.OnsitePrefer}
                                        >

                                            <MenuItem key="SHORT TERM" value="SHORT TERM">
                                                SHORT TERM
                                            </MenuItem>
                                            <MenuItem key="LONG TERM" value="LONG TERM">
                                                LONG TERM
                                            </MenuItem>
                                            <MenuItem key="NO" value="NO">
                                                NO
                                            </MenuItem>

                                        </TextField>

                                    </Stack>
                                </Stack>
                            </CardContent>

                            <CardContent>

                                <Typography variant="h6" color="#aaaa55" align="center" fontStyle="italic" gutterBottom>
                                    Demographics
                                </Typography>

                            </CardContent>

                            <CardContent>
                                <Stack spacing={3}>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            label="Native Place"
                                            type="string"
                                            disabled={disableValue}

                                            {...getFieldProps('NativePlace')}

                                            error={Boolean(touched.NativePlace && errors.NativePlace)}
                                            helperText={touched.NativePlace && errors.NativePlace}
                                        >

                                        </TextField>
                                        <Tooltip
                                            title="Prefer-1 : Doctor/CA/GOVT Job/Teacher/Defence Prefer-2 : Pvt Job/Farmer"
                                            placement="top-start"
                                            TransitionComponent={Fade}
                                            TransitionProps={{ timeout: 100 }}
                                            arrow
                                        >
                                            <TextField
                                                fullWidth
                                                name="ParentProff"
                                                label="Parent's Profession"
                                                type="string"
                                                select
                                                required
                                                disabled={disableValue}

                                                {...getFieldProps('ParentProfession')}

                                                error={Boolean(touched.ParentProfession && errors.ParentProfession)}
                                                helperText={touched.ParentProfession && errors.ParentProfession}
                                            >

                                                <MenuItem key="PREFER 1" value="PREFER 1">
                                                    PREFER 1
                                                </MenuItem>
                                                <MenuItem key="PREFER 2" value="PREFER 2">
                                                    PREFER 2
                                                </MenuItem>
                                                <MenuItem key="OTHER" value="OTHER">
                                                    OTHER
                                                </MenuItem>

                                            </TextField>
                                        </Tooltip>


                                        <TextField
                                            fullWidth
                                            label="Marital Status"
                                            select
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('MaritalStatus')}

                                            error={Boolean(touched.MaritalStatus && errors.MaritalStatus)}
                                            helperText={touched.MaritalStatus && errors.MaritalStatus}
                                        >

                                            <MenuItem key="SINGLE" value="SINGLE">
                                                SINGLE
                                            </MenuItem>
                                            <MenuItem key="MARRIED" value="MARRIED">
                                                MARRIED
                                            </MenuItem>
                                        </TextField>

                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            id="FamilyInfo"
                                            label="Family Info. (Parents Occupation and Details)"
                                            multiline
                                            rows={4}
                                            disabled={disableValue}

                                            {...getFieldProps("FamilyInfo")}
                                        >
                                        </TextField>

                                    </Stack>

                                </Stack>
                            </CardContent>

                            <CardContent>

                                <Typography variant="h6" color="#aaaa55" align="center" fontStyle="italic" gutterBottom>
                                    Communication Details
                                </Typography>

                            </CardContent>

                            <CardContent>
                                <Stack spacing={3}>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            id="UnderstandingAbility"
                                            type="string"
                                            label="Is the person capable of understanding questions and responding appropriately ?"
                                            select
                                            required
                                            disabled={disableValue}

                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                            {...getFieldProps('UnderstandingAbility')}

                                            error={Boolean(touched.UnderstandingAbility && errors.UnderstandingAbility)}
                                            helperText={touched.UnderstandingAbility && errors.UnderstandingAbility}
                                        >

                                            <MenuItem key="YES" value="YES">
                                                YES
                                            </MenuItem>
                                            <MenuItem key="NO" value="NO">
                                                NO
                                            </MenuItem>

                                        </TextField>

                                        <TextField
                                            fullWidth
                                            id="CommSkills"
                                            type="string"
                                            label="Is the person using the correct voice modulation, 
                                                  speaking with confidence and energy, and are you explaining clearly ?"
                                            select
                                            required
                                            disabled={disableValue}

                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                            {...getFieldProps('CommSkills')}

                                            error={Boolean(touched.CommSkills && errors.CommSkills)}
                                            helperText={touched.CommSkills && errors.CommSkills}
                                        >

                                            <MenuItem key="YES" value="YES">
                                                YES
                                            </MenuItem>
                                            <MenuItem key="NO" value="NO">
                                                NO
                                            </MenuItem>

                                        </TextField>
                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            id="GrammaticalMistakes"
                                            type="string"
                                            label="Making the fewest grammatical errors ?"
                                            select
                                            required
                                            disabled={disableValue}

                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                            {...getFieldProps('GrammaticalMistakes')}

                                            error={Boolean(touched.GrammaticalMistakes && errors.GrammaticalMistakes)}
                                            helperText={touched.GrammaticalMistakes && errors.GrammaticalMistakes}
                                        >

                                            <MenuItem key="LEAST" value="LEAST">
                                                LEAST
                                            </MenuItem>
                                            <MenuItem key="MODERATE" value="MODERATE">
                                                MODERATE
                                            </MenuItem>
                                            <MenuItem key="TOO MANY" value="TOO MANY">
                                                TOO MANY
                                            </MenuItem>

                                        </TextField>

                                        <TextField
                                            fullWidth
                                            id="CoversationSkills"
                                            type="string"
                                            label="Is the person able to have a conversation with someone other than work related ? Able to connect ?"
                                            select
                                            required
                                            disabled={disableValue}

                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                            {...getFieldProps('CoversationSkills')}

                                            error={Boolean(touched.CoversationSkills && errors.CoversationSkills)}
                                            helperText={touched.CoversationSkills && errors.CoversationSkills}
                                        >

                                            <MenuItem key="YES" value="YES">
                                                YES
                                            </MenuItem>
                                            <MenuItem key="NO" value="NO">
                                                NO
                                            </MenuItem>

                                        </TextField>

                                    </Stack>

                                </Stack>
                            </CardContent>

                            <CardContent>

                                <Typography variant="h6" color="#aaaa55" align="center" fontStyle="italic" gutterBottom>
                                    Project Details(for Tech)
                                </Typography>

                            </CardContent>

                            <CardContent>
                                <Stack spacing={3}>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            id="ScratchPojects"
                                            type="number"
                                            label="Number of projects from scratch"
                                            disabled={disableValue}

                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                            {...getFieldProps('ScratchPojects')}
                                        />


                                        <TextField
                                            fullWidth
                                            id="ClientCom"
                                            type="string"
                                            label="Client communication"
                                            select
                                            required
                                            disabled={disableValue}

                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                            {...getFieldProps('ClientCom')}

                                            error={Boolean(touched.ClientCom && errors.ClientCom)}
                                            helperText={touched.ClientCom && errors.ClientCom}
                                        >

                                            <MenuItem key="CHAT" value="CHAT">
                                                CHAT
                                            </MenuItem>
                                            <MenuItem key="EMAIL" value="EMAIL">
                                                EMAIL
                                            </MenuItem>
                                            <MenuItem key="HIGHLY INVOLVED" value="HIGHLY INVOLVED">
                                                HIGHLY INVOLVED
                                            </MenuItem>
                                            <MenuItem key="NOT INVOLVED" value="NOT INVOLVED">
                                                NOT INVOLVED
                                            </MenuItem>

                                        </TextField>

                                        <TextField
                                            fullWidth
                                            id='ProjectLoc'
                                            label="Working on projects from which countries"
                                            disabled={disableValue}

                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                            {...getFieldProps('ProjectLoc')}
                                        />

                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            id="LongProDetails"
                                            type="string"
                                            label="Longest project details"
                                            multiline
                                            rows={2}
                                            disabled={disableValue}

                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                            {...getFieldProps('LongProDetails')}
                                        />


                                        <TextField
                                            fullWidth
                                            id='ProjectRR'
                                            label="Roles &amp; responsibility in project"
                                            required
                                            multiline
                                            rows={2}
                                            disabled={disableValue}

                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                            {...getFieldProps('ProjectRR')}

                                            error={Boolean(touched.ProjectRR && errors.ProjectRR)}
                                            helperText={touched.ProjectRR && errors.ProjectRR}
                                        />

                                        <TextField
                                            fullWidth
                                            id='ProjectTools'
                                            label="Tools used in the Project"
                                            multiline
                                            rows={2}
                                            disabled={disableValue}

                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                            {...getFieldProps('ProjectTools')}
                                        />

                                    </Stack>

                                </Stack>
                            </CardContent>

                            <CardContent>

                                <Typography variant="h6" color="#aaaa55" align="center" fontStyle="italic" gutterBottom>
                                    Non Verbal Cues
                                </Typography>

                            </CardContent>

                            <CardContent>
                                <Stack spacing={3}>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <Tooltip
                                            title={eye_title}
                                            placement="top-start"
                                            TransitionComponent={Fade}
                                            TransitionProps={{ timeout: 50 }}
                                            arrow
                                        >

                                        <TextField
                                            fullWidth
                                            id="eye-contact"
                                            type="string"
                                            label="Eye Contact"
                                            select
                                            required
                                            disabled={disableValue}

                                            InputLabelProps={{
                                                shrink: true,
                                            }}

                                            {...getFieldProps('EyeContact')}

                                            error={Boolean(touched.EyeContact && errors.EyeContact)}
                                            helperText={touched.EyeContact && errors.EyeContact}
                                        >
                                            {ratingsData.map((option) => (
                                                <MenuItem key={option.pk} value={option.pk}>
                                                    {option.rating_name}
                                                </MenuItem>
                                            ))}

                                        </TextField>

                                        </Tooltip>

                                        <Tooltip
                                            title={facial_title}
                                            placement="top-start"
                                            TransitionComponent={Fade}
                                            TransitionProps={{ timeout: 50 }}
                                            arrow
                                        >
                                            <TextField
                                                fullWidth
                                                id="facial-expressions"
                                                type="string"
                                                label="Facial Expressions"
                                                select
                                                required
                                                disabled={disableValue}

                                                InputLabelProps={{
                                                    shrink: true,
                                                }}

                                                {...getFieldProps('FacialExpressions')}

                                                error={Boolean(touched.FacialExpressions && errors.FacialExpressions)}
                                                helperText={touched.FacialExpressions && errors.FacialExpressions}
                                            >
                                            
                                                {ratingsData.map((option) => (
                                                    <MenuItem key={option.pk} value={option.pk}>
                                                        {option.rating_name}
                                                    </MenuItem>
                                                ))}

                                            </TextField>
                                        </Tooltip>

                                        <Tooltip
                                            title={posture_title}
                                            placement="top-start"
                                            TransitionComponent={Fade}
                                            TransitionProps={{ timeout: 50 }}
                                            arrow
                                        >
                                            <TextField
                                                fullWidth
                                                id='posture'
                                                label="Posture"
                                                select
                                                required
                                                disabled={disableValue}

                                                InputLabelProps={{
                                                    shrink: true,
                                                }}

                                                {...getFieldProps('Posture')}

                                                error={Boolean(touched.Posture && errors.Posture)}
                                                helperText={touched.Posture && errors.Posture}
                                            >

                                                {ratingsData.map((option) => (
                                                    <MenuItem key={option.pk} value={option.pk}>
                                                        {option.rating_name}
                                                    </MenuItem>
                                                ))}

                                            </TextField>
                                        </Tooltip>

                                        <Tooltip
                                            title={dressing_title}
                                            placement="top-start"
                                            TransitionComponent={Fade}
                                            TransitionProps={{ timeout: 50 }}
                                            arrow
                                        >

                                            <TextField
                                                fullWidth
                                                id='dressing'
                                                label="Dressing"
                                                select
                                                required
                                                disabled={disableValue}

                                                InputLabelProps={{
                                                    shrink: true,
                                                }}

                                                {...getFieldProps('Dressing')}

                                                error={Boolean(touched.Dressing && errors.Dressing)}
                                                helperText={touched.Dressing && errors.Dressing}
                                            >
                                            
                                                {ratingsData.map((option) => (
                                                    <MenuItem key={option.pk} value={option.pk}>
                                                        {option.rating_name}
                                                    </MenuItem>
                                                ))}

                                            </TextField>

                                        </Tooltip>

                                    </Stack>
                                </Stack>
                            </CardContent>

                        </Card>

                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

                        <LoadingButton
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            loading={isSubmitting}
                            disabled={disableValue}
                        >
                            Update Profile
                       </LoadingButton>

                    </Form>
                </FormikProvider>
            </Container >
        </Page >
    )
}