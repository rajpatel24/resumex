import React from 'react'
// material
import { Grid, Button, Container, Stack, Typography } from "@mui/material";
import Page from '../../Page';
// card
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
export default function JobApplications(props) {
    if (!props.noApplications) {
        return (
            <Page title="Interview Slots | ResumeX">
                <Container>
                    <Stack alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" gutterBottom>
                            Interview Details
                        </Typography>
                        <Typography sx={{ color: "text.secondary" }}>
                            Here are your all details for job interview ! :)
                        </Typography>
                        <div style={{ margin: 40 }}>
                            <Card sx={{ maxWidth: 1000 }} variant="outlined">

                                <CardHeader
                                    title={props.interviewObj?.job_application?.job?.job_name}
                                    subheader={
                                        new Date(props.interviewObj?.job_application?.created).toLocaleDateString() + "\t" +
                                        new Date(props.interviewObj?.job_application?.created).toLocaleTimeString()
                                    }
                                />
                                <CardContent>
                                    <h6> Interview Round: </h6>
                                    <Typography variant="body1" color="error.main">
                                        <b>{props.interviewObj?.interview_round?.round_name}</b>
                                    </Typography>
                                </CardContent>
                                <CardContent>
                                    <h6> Job Description: </h6>
                                    <Typography variant="body1">
                                        {props.interviewObj?.job_application?.requisition?.job_description}
                                    </Typography>
                                </CardContent>
                                <CardContent>
                                    <h6> Responsibilities: </h6>
                                    <Typography paragraph>
                                        {props.interviewObj?.job_application?.requisition?.responsibilities}
                                    </Typography>
                                    <h6> Must have technologies: </h6>
                                    <Typography paragraph>
                                        {props.interviewObj?.job_application?.requisition?.primary_technology?.map((obj, index) => (index ? ', ': '') + obj.technology_name)}
                                    </Typography>
                                    <h6> Good to have technologies: </h6>
                                    <Typography paragraph>
                                        {props.interviewObj?.job_application?.requisition?.other_technology?.map((obj, index) => (index ? ', ': '') + obj.technology_name)}
                                    </Typography>
                                    <h6> Preferred Locations: </h6>
                                    <Typography paragraph>
                                        {props.interviewObj?.candidate?.preferred_location.map((obj, index) => (index? ', ': '')+ obj.office_location)}
                                    </Typography>
                                    <h6> Current Location: </h6>
                                    <Typography paragraph>
                                        {props.interviewObj?.candidate?.current_location} <br />
                                    </Typography>
                                    <h6> Notice Period: </h6>
                                    <Typography paragraph>
                                        {props.interviewObj?.candidate?.notice_period?.notice_period} Months
                                    </Typography>
                                    <h6> Interview Details: </h6>
                                    <Typography paragraph>
                                        Interview Date: <b style={{color: "red"}}>{new Date(props.interviewObj?.start_date).toLocaleDateString()}</b> <br />
                                        Interview Time: <b style={{color: "red"}}>{new Date(props.interviewObj?.start_date).toLocaleTimeString()}</b> to <b style={{color: "red"}}>{new Date(props.interviewObj?.end_date).toLocaleTimeString()}</b> <br />
                                        <br></br>
                                        Interview Link: <a href={props.interviewObj?.interview_attendee_link}>Click here to join the interview</a>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </div>
                    </Stack>
                </Container>
            </Page >
        );
    }
    else {
        return (
            <Page title="Interview Slots | ResumeX">
                <Container>
                    <Stack alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" gutterBottom>
                            No Details Found !! 
                        </Typography>
                        <Typography sx={{ color: "text.secondary" }}>
                            You have not applied for any job ! :(
                        </Typography>
                    </Stack>
                </Container>
            </Page >
        )
    }
}


