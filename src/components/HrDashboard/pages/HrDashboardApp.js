import React, { useEffect, useState } from "react";
// material
import { Box, Grid, Container, Typography, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// components
import Page from '../../Page';
import AppJobListed from '../app/AppJobListed';
import AppJobApplications from '../app/AppJobApplications';
import AppCandidatesInterviewed from '../app/AppCandidatesInterviewed';
import AppCandidatesSelected from '../app/AppCandidatesSelected';
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

import JoineesList from '../joinees/JoineesList'

// axios
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { apiInstance } from "src/utils/apiAuth";
import UserInfo from "src/utils/Authorization/UserInfo";


// ----------------------------------------------------------------------

export default function HrDashboardApp() {
  const { enqueueSnackbar } = useSnackbar();
  const hrToken = localStorage.getItem("authToken");
  const [open, setOpen] = useState(false);
  const [joineesData, setJoineesData] = useState([]);
  const userInfo = UserInfo();
  const userRole = userInfo?.role


  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  const getJoineesList = () => {
    apiInstance({
        method: "get",
        url: "candidate-viewset/joinees_list/",
        headers: {
            Authorization: "token " + hrToken,
        }
    })
        .then(function (response) {
            const joineesList = getJoineesArray(response.data.data)
            setJoineesData(joineesList)
            setOpen(true)
        })
        .catch(function (error) {
          console.log('Something went wrong. Please try after sometime.')
        });
  }

  const getJoineesArray = (Data) =>
        Data.map((JObj) => ({
            pk: JObj.id,
            Name: JObj.user.first_name + " " + JObj.user.last_name,
            Email: JObj.user.email,
            Mobile: JObj.user.mobile,
            Doj: JObj.onboard_details.join_date,
            Status: JObj.status.status
        }));

  useEffect(() => {
    getJoineesList()
   }, [])   

  return (
    <Page title="Hr Dashboard | Minimal-UI">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>

        <div style={{background: 'url("/static/campus-intern_2021.jpg")', backgroundSize: "cover", minHeight: "380px", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <h1 style={{fontSize: "2.75em",color: "#fff", textShadow: "2px 2px #000", alignItems: "center", justifyContent: "center",
        fontWeight: "bold", position: "relative", zIndex: "10"}}>
          <span style={{color: "#f05e0a", alignItems: "center", justifyContent: "center"}}>Connecting People</span>
          <p style={{alignItems: "center", justifyContent: "center"}}>Together with Opportunity & Resilience</p></h1>
        </div>

        <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
            <AppJobListed />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppJobApplications />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppCandidatesInterviewed />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppCandidatesSelected />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid> */}

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppTasks />
          </Grid> */}
        </Grid>

        {/* <h1 style={headerStyle}>Connecting People</h1>
        <h1 style={{textAlign: 'center', fontWeight: 'bold', fontSize: "40px", paddingBottom: "40px"}}>Together with Opportunity & Resilience</h1> */}

        <Grid container spacing={3} sx={{mt: 5}}>
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
            <AppTrafficBySite />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppTasks />
          </Grid> */}
        </Grid>

        {/* ------------ Joinees List Dialog Box ---------------- */}

        {userRole === 'FSD_Admin' || userRole === 'FSD_HOD' || userRole === 'OnBoarding_HR' ? 

          <Dialog
            maxWidth='lg'
            open={open}
            keepMounted
            onClose={handleClose}
          >         
          <DialogTitle 
                style={{textAlign: "center", 
                        marginTop:"30px"
                      }}
          >
              Joinees List
          </DialogTitle>
          <DialogContent>
            <JoineesList data={joineesData}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>CLOSE</Button>
          </DialogActions>
          </Dialog>

      : null}
      </Container>
    </Page>
  );
}
