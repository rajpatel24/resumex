import axios from 'axios';
import Page from '../../Page';
import React, { useEffect, useState } from "react";
import { Autocomplete, Button, Backdrop, Card, CardContent, CircularProgress, Container, Grid, TextField, Typography, Stack, Skeleton } from '@mui/material';

import ResumeCards from '../resume-parser/ResumeCards'
import SearchIcon from '@mui/icons-material/Search';
import * as constants from 'src/utils/constants';

export default function ResumeParser() {
    const [technologyData, setTechnologyData] = useState([])
    const getTechnology = () => {
        axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/technology/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
        .then((response) => {
        setTechnologyData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };

    const [selectedTechnology, setSelectedTechnology] = React.useState([]);

    const [resumeData, setResumeData] = React.useState([]);

    const handleButtonClick = () => {
        handleToggle()
        const headers = {
            'Authorization': `Token ${localStorage.getItem('authToken')}`
        }

        const data = {
            technology: selectedTechnology.map((item) => (item.technology_name))
        }

        axios.post(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + "/api/v1/resume-parser/", data, {headers})
        .then((response) => {
            setResumeData(response.data.data)
            handleClose()
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }

    useEffect(() => {
        getTechnology()
    }, [])

    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen(!open);
    };

    return(
        <Page title="Resume Parser | ResumeX">
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }} align="center">
                    Resume Parser
                </Typography>

                <Card style={{ border: "none", boxShadow: "none" }}>
                    <CardContent>
                        <Stack spacing={3}>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <Autocomplete
                                multiple
                                sx={{width: "80%"}}
                                id="tags-standard"
                                options={technologyData}
                                getOptionLabel={(option) => option.technology_name}
                                onChange={(event, value) => setSelectedTechnology(value)}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    variant="standard"
                                    label="Technology"
                                    />
                                )}
                                >
                                </Autocomplete>

                                <Button
                                size="medium"
                                variant="outlined"
                                onClick={handleButtonClick}
                                >
                                    Search Resume &emsp; <SearchIcon />
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
                >
                    Let the magic happen... &emsp; 
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Grid container spacing={5} justifyContent="center" sx={{mt: 5}} >
                    {resumeData.map((resume, index) => (
                        <ResumeCards resume={resume} index={index}/>
                    ))}
                </Grid>
            </Container>
        </Page>
    )
}