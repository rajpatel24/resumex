import { Icon } from '@iconify/react';
import * as Yup from "yup";
import baselineBeenhere from '@iconify/icons-ic/baseline-beenhere';
import { useFormik, Form, FormikProvider, Field } from "formik";
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Container, Stack, Typography, Link, TextField, FormControlLabel, Select,MenuItem, Checkbox } from '@mui/material';
// components
import Page from '../../Page';
import {
  ProductSort,
  ProductList,
  ProductCartWidget,
  ProductFilterSidebar
} from '../products';
//
import PRODUCTS from '../../../_mocks_/products';
import { LoadingButton } from "@mui/lab";

// ----------------------------------------------------------------------

export default function CreateJobForm() {
  const [openFilter, setOpenFilter] = useState(false);

  const CreateJobFormSchema = Yup.object().shape({
    id: Yup.string()
    .min(1, "Too Short!")
    .max(50, "Too Long!")
    .required("ID required"),
    name: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Name is required"),
    category: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Category is required"),
    technology: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Technology is required"),
    required_experience: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required Experience is required"),
    job_location: Yup.string().required("Job Location is required"),
    skills: Yup.string().required("Skills are required"),
    requirements: Yup.string().required("Requirements are required"),
    responsibilities: Yup.string().required("Responsibilities are required"),
    description: Yup.string().required("Description is required"),
    total_openings: Yup.string().required("Total Openings are required"),
  });

  const formik = useFormik({
    initialValues: {
      id: '',
      name: '',
      category: '',
      technology: '',
      required_experience: '',
      job_location: '',
      skills: '',
      requirements: '',
      responsibilities: '',
      description: '',
      total_openings: ''
    },
    validationSchema: CreateJobFormSchema,
    onSubmit: () => {
      setOpenFilter(false);
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setSubmitting } = formik;

  return (
    <Page title="Dashboard: Hr Products | Minimal-UI">
      <Container>  
        <Link to="/resumeX/create-jobs" color="green" underline="hover" component={RouterLink} fontSize="20px"> {"<"} Back
        </Link>

        <Typography variant="h4" sx={{ mb: 5 }} align="center">
          Create Job
        </Typography>

        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          {/* <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>

          </Stack> */}
        </Stack>

        {/* <ProductList products={PRODUCTS} /> */}
        {/* <ProductCartWidget /> */}

        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    {/* --------------------- ID --------------------- */}
                    <TextField
                    fullWidth
                    label="ID"
                    {...getFieldProps("id")}
                    error={Boolean(touched.id && errors.id)}
                    helperText={touched.id && errors.id}
                    />
                    
                    {/* --------------------- Name --------------------- */}
                    <TextField
                    fullWidth
                    label="Name"
                    {...getFieldProps("name")}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                    />

                    {/* --------------------- Category --------------------- */}
                    <TextField
                        //   value={value}
                        //   onChange={(e) => setValue(e.target.value)}
                        fullWidth
                        select // tell TextField to render select
                        label="Category"
                        {...getFieldProps("name")}
                        error={Boolean(touched.category && errors.category)}
                        helperText={touched.category && errors.category}
                        >
                        <MenuItem key={1} value="TECH">Tech</MenuItem>
                        <MenuItem key={2} value="NONTECH">Non Tech</MenuItem>
                    </TextField>
                </Stack>


                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    {/* --------------------- Technology (Multiselect) --------------------- */}
                    <TextField
                        //   value={value}
                        //   onChange={(e) => setValue(e.target.value)}
                        fullWidth
                        select // tell TextField to render select
                        label="Technology"
                        {...getFieldProps("name")}
                        error={Boolean(touched.technology && errors.technology)}
                        helperText={touched.technology && errors.technology}
                        >
                        <MenuItem key={1} value="TECH">Tech</MenuItem>
                        <MenuItem key={2} value="NONTECH">Non Tech</MenuItem>
                    </TextField>

                    {/* --------------------- Required Experience --------------------- */}
                    <TextField
                    fullWidth
                    label="Required Experience"
                    {...getFieldProps("required_experience")}
                    error={Boolean(touched.required_experience && errors.required_experience)}
                    helperText={touched.required_experience && errors.required_experience}
                    />

                    {/* --------------------- Job Location --------------------- */}
                    <TextField
                        //   value={value}
                        //   onChange={(e) => setValue(e.target.value)}
                        fullWidth
                        select // tell TextField to render select
                        label="Job Location"
                        {...getFieldProps("job_location")}
                        error={Boolean(touched.job_location && errors.job_location)}
                        helperText={touched.job_location && errors.job_location}
                        >
                        <MenuItem key={1} value="TECH">Tech</MenuItem>
                        <MenuItem key={2} value="NONTECH">Non Tech</MenuItem>
                    </TextField>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                        fullWidth
                        label="Skills"
                        multiline
                        rows={2}
                        maxRows={4}
                        {...getFieldProps("skills")}
                        error={Boolean(touched.skills && errors.skills)}
                        helperText={touched.skills && errors.skills}
                    />

                    <TextField
                        fullWidth
                        label="Requirements"
                        multiline
                        rows={2}
                        maxRows={4}
                        {...getFieldProps("requirements")}
                        error={Boolean(touched.requirements && errors.requirements)}
                        helperText={touched.requirements && errors.requirements}
                    />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                        fullWidth
                        label="Responsibilities"
                        multiline
                        rows={2}
                        maxRows={4}
                        {...getFieldProps("responsibilities")}
                        error={Boolean(touched.responsibilities && errors.responsibilities)}
                        helperText={touched.responsibilities && errors.responsibilities}
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={2}
                        maxRows={4}
                        {...getFieldProps("description")}
                        error={Boolean(touched.description && errors.description)}
                        helperText={touched.description && errors.description}
                    />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                        fullWidth
                        label="Total Openings"
                        {...getFieldProps("name")}
                        error={Boolean(touched.total_openings && errors.total_openings)}
                        helperText={touched.total_openings && errors.total_openings}
                    />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                    <FormControlLabel control={<Checkbox defaultChecked />} label="Active" />
                </Stack>

                <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                >
                    Create Job
                </LoadingButton>
                </Stack>
            </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
