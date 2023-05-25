import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import Page from "../../../components/Page";
import { useFormik, Form, FormikProvider, ErrorMessage, } from "formik";
import { useNavigate } from "react-router-dom";
// material
import { Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField, MenuItem, InputLabel, Select, OutlinedInput, Container } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import axios from "axios";
import { useSnackbar } from "notistack";
import { apiInstance } from "src/utils/apiAuth";

// ----------------------------------------------------------------------

export default function JobApplyForm() {

  var techListData;

  const { enqueueSnackbar } = useSnackbar();

  //Get Technology List

  const [TechData, setTechData] = useState([]);

  const getTechArray = (technoData) =>
  technoData.map((technoObj) => ({
      pk: technoObj.id,
      technologyName: technoObj.technology_name
  }));

  const getTechList = () => {
    apiInstance({
        method: "get",
        url: "technology/",
        headers: {
          Authorization: "token " + localStorage.getItem('candidateToken'),
        }
    })
        .then(function (response) {
            techListData = getTechArray(response.data.data)
            setTechData(techListData)
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


  // dialog open/close state
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  const candToken = localStorage.getItem("candidateToken");

  const navigate = useNavigate();

  const expReg = /^[0-9]{1,2}$/;

  const months = [
    {
      value: '00',
      label: '0',
    },
    {
      value: '01',
      label: '1',
    },
    {
      value: '02',
      label: '2',
    },
    {
      value: '03',
      label: '3',
    },
    {
      value: '04',
      label: '4',
    },
    {
      value: '05',
      label: '5',
    },
    {
      value: '06',
      label: '6',
    },
    {
      value: '07',
      label: '7',
    },
    {
      value: '08',
      label: '8',
    },
    {
      value: '09',
      label: '9',
    },
    {
      value: '10',
      label: '10',
    },
    {
      value: '11',
      label: '11',
    },
  ];

  const [locData, setlocData] = useState([]);

  const [file, setFile] = useState(null);

  const [noticePeriodData, setNoticePeriodData] = useState([]);

  useEffect(() => {
    getLocationsList();
    getNoticePeriodList();
    getTechList();
  }, [])

  const handleFileUpload= (event) => {
    const resumeFile=event.target.files[0]
    formik.setFieldValue("resume", resumeFile);
    setFile(resumeFile)
  };

  const getLocationsList = () => {

    apiInstance({
      method: "get",
      url: "office-locations/",
      headers: {
        Authorization: "token " + localStorage.getItem('candidateToken'),
      }
    })
      .then(function (response) {
          const locData = getDataArray(response.data.data)
          setlocData(locData)          
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

  const getNoticePeriodList = () => {

    apiInstance({
        method: "get",
        url: "notice-period/",
        headers: {
            Authorization: "token " + localStorage.getItem('candidateToken'),
        }
    })
        .then(function (response) {
            const noticeData = getNoticePeriodArray(response.data.data)
            setNoticePeriodData(noticeData)
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

  const getDataArray = (locData) =>
  locData.map((locObj) => ({
      pk: locObj.id,
      office_loc: locObj.office_location,
      loc_status: locObj.is_active,
    }));

  
  const getNoticePeriodArray = (NPData) =>
    NPData.map((NPObj) => ({
        pk: NPObj.id,
        notice_period: NPObj.notice_period
    }));


  const JobApplyFormSchema = Yup.object().shape({
    TotalExp: Yup.string()
    .matches(/^[0-9]{1,2}[.][0-9]{1}$/, "Invalid Input")
    .required("Total Experience required"),
    noticePeriod: Yup.string()
                     .required("Notice period is required"),
    currentLoc: Yup.string()
                   .required("Current location is required"),
    resume: Yup.mixed()
               .required("Resume is required"),
    Technology: Yup.array()
              .min(1, "Technology is required"),
    preferLoc: Yup.array()
                  .min(1, "Prefer Location is required"),
    CurrentCtc: Yup.number()
                  .required("Current CTC Is required"),
    ExpectedCtc: Yup.number()
                  .required("Expected CTC Is required"),    
  });


  const callCandidateJobApplyAPI = async (candJobReq) => {
    var bodyFormData = new FormData();

    bodyFormData.append('resume_file', file);
    bodyFormData.append("job_id", localStorage.getItem("SelectedJobID"));
    bodyFormData.append("current_ctc", candJobReq.CurrentCtc);
    bodyFormData.append("expected_ctc", candJobReq.ExpectedCtc);
    bodyFormData.append("total_experience", candJobReq.TotalExp);
    bodyFormData.append("technology_id", candJobReq.Technology);
    bodyFormData.append("current_location", candJobReq.currentLoc);
    bodyFormData.append("preferred_location_id", candJobReq.preferLoc);
    bodyFormData.append("notice_period", candJobReq.noticePeriod);  
    
    await apiInstance({
      method: "post",
      url: "job-application/",
      headers: {
        Authorization: "token " + candToken,
        'Content-Type': "multipart/form-data"
      },
      data: bodyFormData,
    })
      .then(async function (response) {
        if (response.status === 200) {
          enqueueSnackbar("Details Sent Successfully !", {
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            variant: "success",
            autoHideDuration: 1500,
          });

          let JobAppDetails = response.data.data;
          localStorage.setItem("thisJobAppJobName", JobAppDetails?.requisition?.job_name)
          localStorage.setItem("thisJobAppSkills", JobAppDetails?.requisition?.tech_stack?.tech_stack_name)
          localStorage.setItem("thisJobAppExp", JobAppDetails?.requisition?.experience)
          localStorage.setItem("thisJobAppLoc", JobAppDetails?.requisition?.office_location)
          
          
          localStorage.setItem("candIsInterviewed", true)
          navigate("/dashboard/jobs/openings/", { replace: true });
          setConfirmOpen(true)
        }
      })
      .catch(function (error) {
        enqueueSnackbar("Something went wrong. Please try after sometime. ", {
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          variant: "error",
          autoHideDuration: 2000,
        });

        setSubmitting(false);
      });
  };

  const calculateExpHike = e => {   
    let present_ctc = values.CurrentCtc
    let demand_ctc = e.target.value

    let hike = ((demand_ctc*100)/present_ctc)- 100
    
    setFieldValue("Exp_Hike", Math.round(hike))
}
  
  const formik = useFormik({
    initialValues: {
      TotalExp: "",
      noticePeriod: "",
      currentLoc: "",
      Technology: [],
      resume: "",
      preferLoc: [],
      CurrentCtc: '',
      ExpectedCtc: '',
    },

    validationSchema: JobApplyFormSchema,

    onSubmit: (formValues) => {
      callCandidateJobApplyAPI(formValues);
    },

  });

  const { errors, touched, values, setFieldValue,  handleSubmit, isSubmitting,  getFieldProps,setSubmitting, handleChange } = formik;

  return (
    <Page>
      <Container>
      <Typography variant="h6" sx={{ mb: 3 }} align="center"> Job Apply Form: {localStorage.getItem("SelectedJobName")} </Typography>
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>
            Job Applied Successfully !
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Your application has been submitted.<br></br>
              Our HR team will verify and contact you for further discussion.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button size="large" autoFocus href="/dashboard/app">
              OK
            </Button>
          </DialogActions>
        </Dialog>
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={1.8}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              required
              label="Total Experience"
              placeholder="Ex: 1.6 - 1 year 6 months, 0.0 - Fresher"

              {...getFieldProps('TotalExp')}

              error={Boolean(touched.TotalExp && errors.TotalExp)}
              helperText={touched.TotalExp && errors.TotalExp}
            >
            </TextField>
            
            <TextField
                fullWidth
                required
                id="NoticePeriod"
                type="number"
                label="Notice Period"
                select

                {...getFieldProps("noticePeriod")}

                error={Boolean(touched.noticePeriod && errors.noticePeriod)}
                helperText={touched.noticePeriod && errors.noticePeriod}
              >
              {noticePeriodData.map((option) => (
                  <MenuItem key={option.pk} value={option.pk}>
                      {option.notice_period}
                  </MenuItem>
              ))}
              </TextField>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              required
              label="Current Location"
              {...getFieldProps("currentLoc")}
              error={Boolean(touched.currentLoc && errors.currentLoc)}
              helperText={touched.currentLoc && errors.currentLoc}
            />

            <TextField
              fullWidth
              required
              id="PreferLoc"
              label="Prefer Location"
              select

              SelectProps={{
                multiple: true,
                value: formik.values.preferLoc,
                onChange: (selectedOption) => handleChange("preferLoc")(selectedOption),

            }}
              {...getFieldProps("preferLoc")}
              error={Boolean(touched.preferLoc && errors.preferLoc)}
              helperText={touched.preferLoc && errors.preferLoc}
            >
              {locData.map((option) => (
                <MenuItem key={option.pk} value={option.pk}>
                  {option.office_loc}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              required
              label="Current CTC"
              placeholder="450000"
              type="number"

              {...getFieldProps('CurrentCtc')}

              error={Boolean(touched.CurrentCtc && errors.CurrentCtc)}
              helperText={touched.CurrentCtc && errors.CurrentCtc}
          >
          </TextField>

          <TextField
              fullWidth
              required
              label="Expected CTC"
              placeholder="550000"
              type="number"

              onInput={calculateExpHike}

              {...getFieldProps('ExpectedCtc')}

              error={Boolean(touched.ExpectedCtc && errors.ExpectedCtc)}
              helperText={touched.ExpectedCtc && errors.ExpectedCtc}
          >
          </TextField>

          {/* <TextField
              fullWidth
              label="Expected Hike (in %)"
              disabled
              InputLabelProps={{ shrink: true, }}

              {...getFieldProps('Exp_Hike')}

              error={Boolean(touched.Exp_Hike && errors.Exp_Hike)}
              helperText={touched.Exp_Hike && errors.Exp_Hike}
          >
          </TextField> */}
        </Stack>

          <TextField
            fullWidth
            required
            id="Technology"
            label="Technology"
            select

            SelectProps={{
                multiple: true,
                value: formik.values.Technology,
                onChange: (selectedOption) => handleChange("Technology")(selectedOption)
            }} 
            {...getFieldProps('Technology')}
            error={Boolean(touched.Technology && errors.Technology)}
            helperText={touched.Technology && errors.Technology}

        >
            {TechData.map((option) => (
                <MenuItem key={option.pk} value={option.pk}>
                    {option.technologyName}
                </MenuItem>
            ))}
        </TextField> 
        
        <InputLabel id="resume-upload-label"> Upload Resume </InputLabel>

          <input
            required
            id="resume"
            name="resume"
            type="file"
            className="form-control"
            accept=".pdf"
            onChange={handleFileUpload}
          />

          <ErrorMessage name="resume">
            {(msg) => <span style={{ color: "red" }}>{msg}</span>}
          </ErrorMessage>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}/>
          <LoadingButton
            fullWidth
            size="large" 
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Apply
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
    </Container>
    </Page>
  );
}
