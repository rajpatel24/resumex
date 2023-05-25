import { Button, Card, CardContent, Container, Stack, TextField, Typography } from '@mui/material';
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Page from '../../Page';

export default function EMPUsers() {
    const EmployeeTechDetailSchema = Yup.object().shape({
        employee: Yup.string()
        .required("Event Name is required"),
        technology: Yup.string()
        .required("Technology is required"),
    });

    const formik = useFormik({
        initialValues: {
            employee: '',
            technology: ''
          },
          validationSchema: EmployeeTechDetailSchema,
          onSubmit: (formValues) => {
          }
        });

    const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setSubmitting } = formik;

    return (
        <Page title="Employees | ResumeX">
            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Employees
                </Typography>
                <Card variant="outlined" >
                    <CardContent>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Select employee and his/her technology to conduct the interview !
                        </Typography>
                    </CardContent>
                    <CardContent>
                        <FormikProvider value={formik}>
                        <Form autoComplete="off" onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <TextField
                                fullWidth
                                select
                                label="Employee"
                                {...getFieldProps("employee")}
                                error={Boolean(touched.employee && errors.employee)}
                                helperText={touched.employee && errors.employee}
                                >
                                {/* {categoryData.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>{category.job_category_name}</MenuItem>
                                ))} */}

                                </TextField>
                            </Stack>

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <TextField
                                fullWidth
                                select
                                label="Technology"
                                {...getFieldProps("technology")}
                                error={Boolean(touched.technology && errors.technology)}
                                helperText={touched.technology && errors.technology}
                                >
                                {/* {categoryData.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>{category.job_category_name}</MenuItem>
                                ))} */}
                                </TextField>
                            </Stack>

                            <Button variant="contained" size="large" type="submit">Submit</Button>
                        </Stack>
                        </Form>
                        </FormikProvider>
                    </CardContent>
                </Card>
                <Card variant="outlined" sx={{ mt: 10 }}>
                    <CardContent>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            FSD portal features integration!
                        </Typography>
                    </CardContent>
                    <CardContent>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            In Progress...
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </Page>
    );
}
