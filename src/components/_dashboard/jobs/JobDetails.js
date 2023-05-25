import Page from'../../Page';
import {JobsPostCard} from "../jobs";
import React from 'react';
import { Grid, Container, Typography, Link } from "@mui/material";
import {Link as RouterLink,  useLocation} from 'react-router-dom';

import ShareIcon from '@mui/icons-material/Share';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TwitterIcon from '@mui/icons-material/Twitter';

export default function JobDetails() {
    const location = useLocation()

    return(
        <Page>
            <Container maxWidth="xl">
                {/* <Link to="/dashboard/jobs/openings" color="green" underline="hover" component={RouterLink} fontSize="20px"> Back
                </Link>

                <Typography variant="h4" sx={{ mb: 6 }} align="center">
                    Job Details
                </Typography> */}

                <div style={{background: 'url("/static/office_interior_dark.jpg")', backgroundSize: "cover", minHeight: "650px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <h1 style={{fontSize: "2.75em",color: "#fff", textShadow: "2px 2px #000", alignItems: "center", justifyContent: "center",
                    fontWeight: "bold", position: "relative", zIndex: "50"}}>
                        <span style={{color: "#f05e0a", alignItems: "center", justifyContent: "center"}}>Door is Open for</span> Big Thinkers
                        
                        <p style={{fontSize: "25px", marginTop: "130px", textAlign: "center"}}>
                            {location.state.jobTechnology} Technology | Gateway Group
                        </p>

                        <p style={{fontSize: "25px", marginTop: "50px", textAlign: "center"}}>
                            <ShareIcon /> &ensp;
                            <LinkedInIcon /> &ensp;
                            <InstagramIcon /> &ensp;
                            <FacebookIcon /> &ensp;
                            <WhatsAppIcon /> &ensp;
                            <TwitterIcon /> &ensp;
                        </p>
                    </h1>
                </div>

                <div style={{display: "flex", width: "50%", marginLeft: "34%", marginTop: "5%", textAlign: "center"}}>
                    <h2 style={{fontSize: '40px', fontWeight: '1000'}}>We offer careers, not jobs</h2>
                </div>

                <Grid container spacing={3} alignContent="center" justifyContent="center" sx={{mt: 5}} >
                {location.state.jobsData && location.state.jobsData.map((job, index) => (
                    <JobsPostCard key={job.id} post={job} index={index} />
                    ))}
                </Grid>
            </Container>
        </Page>
    )
}