import { React } from "react";
import Page from '../../Page';
import { Container, Typography } from '@mui/material';
import BookedInterviewList from '../booked-interview/BookedInterviewList'

export default function BookedInterviews() {
    return (
        <Page title="Booked Interview | ResumeX">
            <Container maxWidth="xl" align="center">
                {/* <Typography align="center" variant="h3" sx={{ mb:5 }}>
                    Booked Interviews
                </Typography> */}

                <h2 align="center" style={{fontSize: '25px', fontWeight: '800'}}>Booked Interviews</h2>

                <BookedInterviewList />

            </Container>
        </Page>
    )
}