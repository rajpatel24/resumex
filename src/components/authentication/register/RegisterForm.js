import React, { useEffect } from "react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider, Field } from "formik";
import { useNavigate } from "react-router-dom";
// material
import { Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import axios from "axios";
import { useSnackbar } from "notistack";
import { apiInstance } from "src/utils/apiAuth";

// ----------------------------------------------------------------------

// const apiInstance = axios.create({
//   baseURL: "http://127.0.0.1:8000/api/v1",
//   timeout: 10000 
// });

export default function RegisterForm() {

  const { enqueueSnackbar } = useSnackbar();

  const candToken = localStorage.getItem("candidateToken");

  const candidateEmail = localStorage.getItem('candEmail')

  const navigate = useNavigate();

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("First name required"),
    lastName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Last name required"),
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    gender: Yup.string().required("Gener is required"),
    dob: Yup.string().required("Birth date is required"),
  });

  const callCandidateRegisterpApi = (candDetails) => {
    apiInstance({
      method: "put",
      url: "/candidate/",
      headers: {
        Authorization: "token " + candToken,
      },
      data: {
        first_name: candDetails.firstName,
        last_name: candDetails.lastName,
        email: candDetails.email,
        dob: candDetails.dob,
        gender: candDetails.gender,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          enqueueSnackbar("Information saved successfully !", {
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            variant: "success",
            autoHideDuration: 1500,
          });

          let userDetails = response.data.data;

          let fName = userDetails.user.first_name;
          let lName = userDetails.user.last_name;
          let usrEmail = candidateEmail

          localStorage.setItem("candidateFirstName", fName);
          localStorage.setItem("candidateLastName", lName);
          localStorage.setItem("candidateEmail", usrEmail);

          navigate("/dashboard/app", { replace: true });
          
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
  
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: candidateEmail,
      gender: "FEMALE",
      dob: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: (formValues) => {
      callCandidateRegisterpApi(formValues);
    },
  });

  const { errors, touched,  handleSubmit, isSubmitting,  getFieldProps, setSubmitting } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps("firstName")}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps("lastName")}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            disabled
            {...getFieldProps("email")}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            id="dob"
            label="Date of birth"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            {...getFieldProps("dob")}
            error={Boolean(touched.dob && errors.dob)}
            helperText={touched.dob && errors.dob}
          />

          <div role="group">
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <div id="gender-radio-group"> Gender </div>
              <label>
                <Field type="radio" name="gender" value="MALE" />
                &nbsp; Male
              </label>
              <label>
                <Field
                  type="radio"
                  name="gender"
                  value="FEMALE"
                  checked={true}
                />
                &nbsp; Female
              </label>
            </Stack>
          </div>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
