import { useState, useEffect } from 'react';
import Page from '../../Page';
import {
    Button, Card, CardContent, Container,
    Link, Stack, TextField, Typography,
    InputAdornment, InputLabel, MenuItem
}
    from '@mui/material';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider, ErrorMessage, Field } from 'formik';

import * as Yup from 'yup';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack'


export default function EditCandidateJobApplication(candidateData) {
    return (
        <Page title="Candidates">
            <Container>
                <Card sx={{ mt: 2 }} variant="outlined">
                    <CardContent>
                        <Typography variant="h6" color="#aaaa55" align="center" fontStyle="italic" gutterBottom>
                            Job Application
                        </Typography>
                    </CardContent>

                    {candidateData?.candidateData?.job_application?.map((data) =>
                        <CardContent>
                            <b style={{ color: data.is_candidate_selected ? "green" : "red" }}>
                                <Link key={data.id}  to={"/resumeX/job-application/edit/" + data.id} color="#207306" component={RouterLink}>
                                    {"/resumeX/job-application/edit/" + data.id}
                                </Link>
                            &nbsp;&nbsp;&nbsp;&nbsp; {data.is_candidate_selected ? ( "selected" ) : (
                                data.is_interviewed ? 'Rejected' : 'In Process'
                                )}<br></br>
                            </b>
                        </CardContent>
                    )}
                </Card>
            </Container>
        </Page>
    )
}