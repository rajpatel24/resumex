import React, { useEffect, useState } from "react";
import axios from 'axios';
// material
import { Box, Button, Dialog, DialogContent, DialogActions, DialogTitle,   Grid, Container, Typography } from '@mui/material';
// components
import Page from '../../Page';
import InterviewScheduleCount from '../app/InterviewScheduleCount';
import ReviewScheduleCount from '../app/ReviewScheduleCount';
import InterviewCompleted from '../app/InterviewCompleted';
import ReviewCompleted from '../app/ReviewCompleted';
import InterviewListDialog from '../pages/InterviewListDialog';
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates,
} from '../app';
import * as constants from "src/utils/constants";

// ----------------------------------------------------------------------

const headerStyle = {
  color: "white",
  textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
  textAlign: "center",
  fontSize: "40px",
  paddingTop: "40px"
}

export default function EmployeeDashboardApp() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  // get and save employee data
  const [employeeData, setEmployeeData] = useState([])
  const employeeDataLoad = () => {
      axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT +'/api/v1/employee-data/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
      .then((response) => {
          setEmployeeData(response.data.data)
          setOpen(true)
      })
      .catch((e) => console.log('something went wrong :(', e));
  }

  useEffect(() => {
      employeeDataLoad()
    }, [])

    const InterviewData = []

    if (employeeData.booked_interviews)
        employeeData.booked_interviews.forEach(data => (data.interview_status=='CONFIRMED' && data.interview_feedback==null) ? 
        InterviewData.push({
            id: data.id,
            jobApplicationId: data.job_application_id,
            rrfNumber: data.rrf_number,
            candidateName: data.candidate_name,
            candidateEmail: data.candidate_email,
            candidatePhoneNumber: data.candidate_number,
            interviewRound: data.interview_round,
            start: data.start_date, 
            end: data.end_date, 
            status: data.interview_status, 
            link: data.interview_moderator_link
        }) : "Not Available") 

        const InterviewCompletedData = []

        if (employeeData.booked_interviews)
            employeeData.booked_interviews.forEach(data => (data.interview_status=='COMPLETED') ? 
            InterviewCompletedData.push({
                id: data.id,
                jobApplicationId: data.job_application_id,
                rrfNumber: data.rrf_number,
                candidateName: data.candidate_name,
                candidateEmail: data.candidate_email,
                candidatePhoneNumber: data.candidate_number,
                interviewRound: data.interview_round,
                start: data.start_date, 
                end: data.end_date, 
                status: data.interview_status, 
                link: data.interview_moderator_link
            }) : "Not Available")         

      
  return (
    <Page title="Employee Dashboard | Minimal-UI">
      <Container maxWidth="xl">
        <Box sx={{ pb: 4 }}>
          <Typography variant="h4">Hi {employeeData?.user?.first_name}, Welcome back</Typography>
        </Box>
        {/* <Box component="img" src="/static/people-banner.jpg" /> */}

        <div style={{background: 'url("/static/people-banner.jpg")', backgroundSize: "cover", minHeight: "580px", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <h1 style={{fontSize: "2.75em",color: "#fff", textShadow: "2px 2px #000", alignItems: "center", justifyContent: "center",
        fontWeight: "bold", position: "relative", zIndex: "10"}}>
          <span style={{color: "#f05e0a", marginLeft: "20%"}}>Real People. Real Stories.</span>
          <br></br>
          It’s an Exciting Journey… We are Gatewayites!</h1>
        </div>

        {/* <h1 style={headerStyle}>ENGINEERING THE DIGITAL INNOVATION</h1>
        <h1 style={{textAlign: 'center', fontWeight: 'bold', fontSize: "30px"}}>DECIDE. COMMIT. SUCCEED.</h1>

        <p style={{fontSize: "20px", padding: "40px", textAlign: "center"}}>
          Our growth strategies are built around our culture of Integrity, Ethics and Commitment, and the Brilliance of our Team.
        </p> */}

        <Grid container spacing={3} sx={{mt: 3}}>
        <Grid item xs={12} sm={6} md={3}>
            <InterviewScheduleCount countData={InterviewData?.filter(data => data.interviewRound !== 'REVIEW_CANDIDATE').length}/>
          </Grid> 
          <Grid item xs={12} sm={6} md={3}>
            <ReviewScheduleCount countData={InterviewData?.filter(data => data.interviewRound === 'REVIEW_CANDIDATE').length}/>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InterviewCompleted countData={InterviewCompletedData?.filter(data => data.interviewRound !== 'REVIEW_CANDIDATE').length} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ReviewCompleted countData={InterviewCompletedData?.filter(data => data.interviewRound === 'REVIEW_CANDIDATE').length} />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppTasks />
          </Grid> */}
        </Grid>

        <Dialog
          maxWidth='lg'
          open={open}
          keepMounted
          onClose={handleClose}
        >
        {/* ------------ Dialog Box ---------------- */}
        
        <DialogTitle>{"Interview List"}</DialogTitle>
        <DialogContent>
          <InterviewListDialog data={InterviewData}/>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>CLOSE</Button>
        </DialogActions>
        </Dialog>
      </Container>
    </Page>
  );
}
