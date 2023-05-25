import { useState, useEffect, useMemo } from 'react';
import Page from '../../../Page';
import {
    Button, Card, CardContent, Container,
    Link, Stack, TextField, Typography,
    InputAdornment, InputLabel, MenuItem,
    IconButton
}
    from '@mui/material';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider, ErrorMessage, Field } from 'formik';

import * as Yup from 'yup';
import axios from 'axios';
import { DatePicker, LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack'

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import Autocomplete from '@mui/material/Autocomplete';
import { apiInstance } from 'src/utils/apiAuth';

// const apiInstance = axios.create({
//     baseURL: "http://127.0.0.1:8000/api/v1/",
//     timeout: 10000
// });


export default function CandOfferDetails({candData}) {
    const { enqueueSnackbar } = useSnackbar();

    const hrToken = localStorage.getItem("authToken");

    const navigate = useNavigate();

    const [fieldType, setFieldType] = useState('string')

    const [candOfferDetailsData, setCandOfferDetailsData] = useState(candData?.candidateData?.offer_details);

    const [disableValue, setDisableValue] = useState(false)
   
    const setOtherValues = () => 
    {
        let user = JSON.parse(localStorage.getItem("user"))
        let user_role = user.role.role_name
            
        if (user_role === 'BU_HEAD' || user_role === 'OnBoarding_HR')
        { setDisableValue(true)  }

        else{ setDisableValue(false) }
    }

    useEffect(() => {
        setOtherValues();
    }, [])

    const desig_names = [
        'Designation',
        'Junior Software Engineer',
        'Senior Software Engineer',
        'Software Analyst',
        'Project Manager',
    ]
    
    const handleCalendarClick = () => {
        if (fieldType == 'string'){
            setFieldType('date')
        }
        if (fieldType == 'date'){
            setFieldType('string')
        }
        values.Appraisal_Date=""        
    }

    const calculateOfferedAmt = (e) => {
        let offer_ctc_pa = e.target.value
        let offer_ctc_pm = (offer_ctc_pa/12).toFixed(2)
        let curr_ctc_pa = values.CurrCTC
        let offered_hike_per = ((offer_ctc_pa*100)/curr_ctc_pa)-100;

        setFieldValue("OfferCTC_PM", offer_ctc_pm)
        setFieldValue("Offered_Hike", Math.round(offered_hike_per,2).toFixed(2))


        if (offered_hike_per === ''){
            setFieldValue("Hike_Range", "NA")
        }
        else if (parseFloat(offered_hike_per) < 0){
            setFieldValue("Hike_Range", "NEGATIVE")
        }
        else if (parseFloat(offered_hike_per) > 0 &&  parseFloat(offered_hike_per) < 6){
            setFieldValue("Hike_Range", "0 to 5%")
        }
        else if (parseFloat(offered_hike_per) >= 6 &&  parseFloat(offered_hike_per) < 11){
            setFieldValue("Hike_Range", "6 to 10%")
        }
        else if (parseFloat(offered_hike_per) >= 11 &&  parseFloat(offered_hike_per) < 21){
            setFieldValue("Hike_Range", "11 to 20%")
        }
        else if (parseFloat(offered_hike_per) >= 21 &&  parseFloat(offered_hike_per) < 31){
            setFieldValue("Hike_Range", "20 to 30%")
        }
        else if (parseFloat(offered_hike_per) >= 31 &&  parseFloat(offered_hike_per) < 41){
            setFieldValue("Hike_Range", "30 to 40%")
        }
        else if (parseFloat(offered_hike_per) >= 41 &&  parseFloat(offered_hike_per) < 51){
            setFieldValue("Hike_Range", "40 to 50%")
        }
        else if (parseFloat(offered_hike_per) >= 51 &&  parseFloat(offered_hike_per) < 61){
            setFieldValue("Hike_Range", "50 to 60%")
        }
        else if (parseFloat(offered_hike_per) >= 61){
            setFieldValue("Hike_Range", ">60%")
        }
        else{
            setFieldValue("Hike_Range", "NA")
        }

    }

    const getExpRange = () => {
        var cand_exp = candData?.candidateData?.total_experience
        var exp_rg = ''
        if (parseFloat(cand_exp) < 1){
            exp_rg = '< 1'
        }
        else if (parseFloat(cand_exp) >= 1 && parseFloat(cand_exp) < 3 ){
            exp_rg = '1 to 3'
        }
        else if (parseFloat(cand_exp) >= 3 && parseFloat(cand_exp) < 5 ){
            exp_rg = '3 to 5'
        }
        else if (parseFloat(cand_exp) >= 5 && parseFloat(cand_exp) < 7 ){
            exp_rg = '5 to 7'
        }
        else if (parseFloat(cand_exp) >= 7 && parseFloat(cand_exp) < 10 ){
            exp_rg = '7 to 10'
        }
        else if (parseFloat(cand_exp) >= 10 && parseFloat(cand_exp) < 12 ){
            exp_rg = '10 to 12'
        }
        else if (parseFloat(cand_exp) >= 12 && parseFloat(cand_exp) < 15 ){
            exp_rg = '12 to 15'
        }
        else if (parseFloat(cand_exp) >= 15){
            exp_rg = '15+'
        }
        else{
            exp_rg = 'NA'
        }

        return exp_rg
    }

    const callOfferDetailsCreateAPI = (formValues) => {

        apiInstance({
            method: "post",
            url: "offer-details/",
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

    const callOfferDetailsUpdateAPI = (formValues, objID) => {  
        apiInstance({
            method: "put",
            url: "offer-details/" + objID + "/",
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


    const CandidateSchema = Yup.object().shape({
        CurrCTC: Yup.number()
            .required("Current CTC is required"),
        OfferCTC: Yup.number()
            .required("Offered CTC is required."),
        CurrCTCPM: Yup.number()
            .required("Current CTC (Per Month) is required."),
        OfferCTC_PM: Yup.number()
            .required("Offered CTC (Per Month) is required."),
        Appraisal_Date: Yup.string()
            .required('Last Appraisal Date is required.'),
        CTC_before_app: Yup.string()
            .required('CTC amount before appraisal is required.'),
        Offered_Hike: Yup.number(),
        Hike_Range: Yup.string(),
        Exp_Range: Yup.string(),
        Revision: Yup.string()
                     .required("Revision is required!"),
        Service_Agreement: Yup.string()
                              .required("Service term is required!"),
        Prob_Period: Yup.string()
                        .required("Probation period is required!"),
        PMS: Yup.string()
                .required("PMS is required!"),
        PF: Yup.string()
               .required("PF is required!"),
        ESIC: Yup.string()
                 .required("ESIC is required!"),
        Var_Type: Yup.string()
                     .required("Variable Type is required!"),
        Var_Amt: Yup.string(),
        Designation: Yup.string()
                        .required("Designation is required!"),
        
    });

    const formik = useFormik({
        initialValues: useMemo(() => {            
            let ini_values = {
                CurrCTC: candData?.candidateData?.current_ctc ?? '',
                OfferCTC: candOfferDetailsData?.offered_ctc ?? "",
                CurrCTCPM: candOfferDetailsData?.curr_ctc_monthly ?? ((candData?.candidateData?.current_ctc)/12).toFixed(2) ?? "",
                OfferCTC_PM: candOfferDetailsData?.offered_ctc_monthly ?? "",
                Appraisal_Date: candOfferDetailsData?.appraisal_date ?? "",
                CTC_before_app: candOfferDetailsData?.appraisal_ctc ?? "",
                Offered_Hike: candOfferDetailsData?.offered_hike ?? "",
                Hike_Range: candOfferDetailsData?.hike_range ?? "NA",
                Exp_Range: candOfferDetailsData?.exp_range ?? getExpRange(),
                Revision:candOfferDetailsData?.revision ?? "",
                Service_Agreement: candOfferDetailsData?.serve_agree ?? "",
                Prob_Period: candOfferDetailsData?.probation ?? "",
                PMS: candOfferDetailsData?.pms ?? "",
                PF: candOfferDetailsData?.pf ?? "",
                ESIC: candOfferDetailsData?.esic ?? "",
                Var_Type: candOfferDetailsData?.var_type ?? "",
                Designation: candOfferDetailsData?.designation ?? "",
                Var_Amt: candOfferDetailsData?.var_amt ?? ""
                
            }
            return ini_values;
          }, []),

        enableReinitialize: true,
        validationSchema: CandidateSchema,
        onSubmit: (values) => {
            var cand_id = candData?.candidateData?.id

            var apiData = {
                "candidate_id": cand_id,
                "offered_ctc": parseFloat(values.OfferCTC),
                "offered_ctc_monthly": parseFloat(values.OfferCTC_PM),
                "curr_ctc_monthly": parseFloat(values.CurrCTCPM),
                "appraisal_date": values.Appraisal_Date,
                "appraisal_ctc": values.CTC_before_app,
                "offered_hike": parseFloat(values.Offered_Hike),
                "hike_range": values.Hike_Range,
                "exp_range": values.Exp_Range,
                "revision": values.Revision,
                "serve_agree": values.Service_Agreement,
                "probation": values.Prob_Period,
                "pms": values.PMS,
                "pf": values.PF,
                "esic": values.ESIC,
                "var_type": values.Var_Type,
                "var_amt": values.Var_Amt,
                "designation": values.Designation,
            }

            if(candOfferDetailsData === null){
                callOfferDetailsCreateAPI(apiData)
            }
            else{
                var OD_ID = candOfferDetailsData?.id
                callOfferDetailsUpdateAPI(apiData, OD_ID)
            }
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting, handleChange, setFieldValue } = formik;

    return (
        <Page title="Candidates">
            <Container maxWidth="xl">
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                        <Card sx={{ mt: 2 }} variant="outlined">

                            <CardContent sx={{ mt: 2 }}>
                                <Stack spacing={3}>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            label="Current CTC (PA)"
                                            name="CurrCTC"
                                            type="number"
                                            required
                                            disabled

                                            {...getFieldProps('CurrCTC')}

                                            error={Boolean(touched.CurrCTC && errors.CurrCTC)}
                                            helperText={touched.CurrCTC && errors.CurrCTC}

                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="Offered CTC (PA)"
                                            name="OfferCTC"
                                            type="number"
                                            onInput={calculateOfferedAmt}
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('OfferCTC')}

                                            error={Boolean(touched.OfferCTC && errors.OfferCTC)}
                                            helperText={touched.OfferCTC && errors.OfferCTC}

                                        >
                                        </TextField>

                                        <TextField
                                            fullWidth
                                            label="Current CTC (PM)"
                                            name="CurrCTCPM"
                                            type="number"
                                            required
                                            disabled

                                            {...getFieldProps('CurrCTCPM')}

                                            error={Boolean(touched.CurrCTCPM && errors.CurrCTCPM)}
                                            helperText={touched.CurrCTCPM && errors.CurrCTCPM}

                                        >
                                        </TextField>

                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                        <TextField
                                            fullWidth
                                            label="Offered Fixed CTC (PM)"
                                            name="OfferCTC_PM"
                                            type="number"
                                            required
                                            disabled={disableValue}

                                            {...getFieldProps('OfferCTC_PM')}

                                            error={Boolean(touched.OfferCTC_PM && errors.OfferCTC_PM)}
                                            helperText={touched.OfferCTC_PM && errors.OfferCTC_PM}

                                        >
                                        </TextField>

                                        <IconButton onClick={handleCalendarClick}>
                                        <CalendarMonthIcon fontSize='medium'/>
                                        </IconButton>

                                        
                                        <TextField
                                            fullWidth
                                            name="Appraisal_Date"
                                            label="Last App. Date"
                                            InputLabelProps={{ shrink: true }}
                                            type={fieldType}
                                            disabled={disableValue}
                                            required
                                            

                                            {...getFieldProps('Appraisal_Date')}

                                            error={Boolean(touched.Appraisal_Date && errors.Appraisal_Date)}
                                            helperText={touched.Appraisal_Date && errors.Appraisal_Date}                                            
                                        >
                                        </TextField>
                                                                        
                                        <TextField
                                            fullWidth
                                            name="CTC_before_app"
                                            label="CTC Before App.(PM)"
                                            InputLabelProps={{ shrink: true }}
                                            type="string"
                                            disabled={disableValue}

                                            required                                          
                                            {...getFieldProps('CTC_before_app')}

                                            error={Boolean(touched.CTC_before_app && errors.CTC_before_app)}
                                            helperText={touched.CTC_before_app && errors.CTC_before_app}                                            
                                        >
                                        </TextField>

                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                    <TextField
                                            fullWidth
                                            name="Offered_Hike"
                                            label="Offered Hike"
                                            InputLabelProps={{ shrink: true }}
                                            type="number"
                                            disabled                                          
                                            {...getFieldProps('Offered_Hike')}

                                            error={Boolean(touched.Offered_Hike && errors.Offered_Hike)}
                                            helperText={touched.Offered_Hike && errors.Offered_Hike}                                            
                                        >
                                     </TextField>

                                     <TextField
                                            fullWidth
                                            name="Hike_Range"
                                            label="Hike Range"
                                            InputLabelProps={{ shrink: true }}
                                            type="string"

                                            disabled                                          
                                            {...getFieldProps('Hike_Range')}

                                            error={Boolean(touched.Hike_Range && errors.Hike_Range)}
                                            helperText={touched.Hike_Range && errors.Hike_Range}                                            
                                        >
                                     </TextField>

                                     <TextField
                                            fullWidth
                                            name="Exp_Range"
                                            label="Experience Range"
                                            InputLabelProps={{ shrink: true }}
                                            type="string"

                                            disabled                                          
                                            {...getFieldProps('Exp_Range')}

                                            error={Boolean(touched.Exp_Range && errors.Exp_Range)}
                                            helperText={touched.Exp_Range && errors.Exp_Range}                          
                                        >
                                     </TextField>

                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                                    <TextField
                                        fullWidth
                                        label="Revision"
                                        type="string"
                                        select
                                        disabled={disableValue}

                                        {...getFieldProps('Revision')}

                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.Revision && errors.Revision)}
                                        helperText={touched.Revision && errors.Revision}
                                        >

                                        <MenuItem key="NA" value="NA">
                                            NA
                                        </MenuItem>
                                        <MenuItem key="3 months" value="3 months">
                                        3 months
                                        </MenuItem>
                                        <MenuItem key="4 months" value="4 months">
                                        4 months
                                        </MenuItem>
                                        <MenuItem key="6 months" value="6 months">
                                        6 months
                                        </MenuItem>
                                        <MenuItem key="9 months" value="9 months">
                                        9 months
                                        </MenuItem>
                                        <MenuItem key="12 months" value="12 months">
                                        12 months
                                        </MenuItem>
                                    </TextField>

                                    <TextField
                                        fullWidth
                                        label="Service Agreement"
                                        type="string"
                                        select
                                        disabled={disableValue}

                                        {...getFieldProps('Service_Agreement')}

                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.Service_Agreement && errors.Service_Agreement)}
                                        helperText={touched.Service_Agreement && errors.Service_Agreement}
                                        >

                                        <MenuItem key="0" value="0">
                                            0
                                        </MenuItem>
                                        <MenuItem key="12" value="12">
                                        12
                                        </MenuItem>
                                        <MenuItem key="18" value="18">
                                        18
                                        </MenuItem>
                                        <MenuItem key="24" value="24">
                                        24
                                        </MenuItem>
                                        <MenuItem key="30" value="30">
                                        30
                                        </MenuItem>
                                    </TextField>

                                    <TextField
                                        fullWidth
                                        label="Probation Period"
                                        type="string"
                                        select
                                        disabled={disableValue}

                                        {...getFieldProps('Prob_Period')}

                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.Prob_Period && errors.Prob_Period)}
                                        helperText={touched.Prob_Period && errors.Prob_Period}
                                        >

                                        <MenuItem key="NA" value="NA">
                                            NA
                                        </MenuItem>
                                        <MenuItem key="3 months" value="3 months">
                                        3 months
                                        </MenuItem>
                                        <MenuItem key="6 months" value="6 months">
                                        6 months
                                        </MenuItem>
                                        <MenuItem key="9 months" value="9 months">
                                        9 months
                                        </MenuItem>
                                        <MenuItem key="12 months" value="12 months">
                                        12 months
                                        </MenuItem>
                                    </TextField>

                                        
                                    </Stack>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                    
                                    <TextField
                                        fullWidth
                                        label="PMS"
                                        type="string"
                                        select
                                        disabled={disableValue}

                                        {...getFieldProps('PMS')}

                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.PMS && errors.PMS)}
                                        helperText={touched.PMS && errors.PMS}
                                        >

                                        <MenuItem key="YES" value="YES">
                                        YES
                                        </MenuItem>
                                        <MenuItem key="NO" value="NO">
                                        NO
                                        </MenuItem>
                                        <MenuItem key="YES_W/O_BONUS" value="YES_W/O_BONUS">
                                        YES W/O BONUS
                                        </MenuItem>
                                    </TextField>

                                    <TextField
                                        fullWidth
                                        label="PF"
                                        type="PF"
                                        select
                                        disabled={disableValue}

                                        {...getFieldProps('PF')}

                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.PF && errors.PF)}
                                        helperText={touched.PF && errors.PF}
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
                                        label="ESIC"
                                        type="string"
                                        select
                                        disabled={disableValue}

                                        {...getFieldProps('ESIC')}

                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.ESIC && errors.ESIC)}
                                        helperText={touched.ESIC && errors.ESIC}
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
                                        label="Variable Type"
                                        type="string"
                                        select
                                        disabled={disableValue}

                                        {...getFieldProps('Var_Type')}

                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.Var_Type && errors.Var_Type)}
                                        helperText={touched.Var_Type && errors.Var_Type}
                                        >

                                        <MenuItem key="NA" value="NA">
                                        NA
                                        </MenuItem>
                                        <MenuItem key="FIXED" value="FIXED">
                                        FIXED
                                        </MenuItem>
                                        <MenuItem key="KRA BASED" value="KRA BASED">
                                        KRA BASED
                                        </MenuItem>
                                    </TextField>

                                    <TextField
                                        fullWidth
                                        label="Variable Amount"
                                        type="number"
                                        disabled={disableValue}

                                        {...getFieldProps('Var_Amt')}

                                        InputLabelProps={{ shrink: true }}

                                        error={Boolean(touched.Var_Amt && errors.Var_Amt)}
                                        helperText={touched.Var_Amt && errors.Var_Amt}
                                        >
                                    </TextField>

                                    <Autocomplete
                                        fullWidth
                                        id="Designation"
                                        type="string"
                                        options={desig_names}
                                        defaultValue={candOfferDetailsData?.designation}
                                        onChange={(event, value) => {
                                            setFieldValue("Designation", value);
                                          }}
                                        renderInput={(params) => <TextField {...params} 
                                        
                                        label="Designation" 
                                        disabled={disableValue}

                                        error={Boolean(touched.Designation && errors.Designation)}
                                        helperText={touched.Designation && errors.Designation}
                                        />}
                                    />

                                    </Stack>

                                </Stack>
                            </CardContent>
                        </Card>

                        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ my: 3}}>

                        <LoadingButton
                            halfWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            loading={isSubmitting}
                            sx={{width:"30%"}}
                            disabled={disableValue}
                        >
                            Save Offer Details
                        </LoadingButton>
                        </Stack>

                    </Form>
                </FormikProvider>
            </Container>
        </Page>
    )
}