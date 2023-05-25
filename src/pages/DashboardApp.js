// material
import { Box, Grid, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as constants from "src/utils/constants";
// components
import Page from '../components/Page';
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
  AppConversionRates
} from '../components/_dashboard/app';

// ----------------------------------------------------------------------
const headerStyle = {
  color: "white",
  textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
  textAlign: "center",
  fontSize: "40px",
  paddingTop: "40px"
}
export default function DashboardApp() {

  const [firstNameData, setFirstNameData]  = useState([]);
  const getFirstName = () => {
    const apiInstance = axios.get(constants.HTTP_METHOD+constants.HTTP_URL+constants.HTTP_PORT+'/api/v1/candidate/', {headers: {"Authorization" : `Token ${localStorage.getItem('candidateToken')}`}})
    .then((response) => {
      setFirstNameData(response.data.data.user.first_name)
      console.log("working!")
    })
    .catch((e) => console.log('something went wrong :(', e));
  };
  console.log(firstNameData)

  useEffect(() => {
    getFirstName()
  }, [])
  return (
    <Page title="Dashboard | Minimal-UI">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome {firstNameData}  </Typography>
        </Box>
        
        <div style={{background: 'url("/static/campus-intern_2021.jpg")', backgroundSize: "cover", minHeight: "580px", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <h1 style={{fontSize: "2.75em",color: "#fff", textShadow: "2px 2px #000", alignItems: "center", justifyContent: "center",
        fontWeight: "bold", position: "relative", zIndex: "10"}}>
          <span style={{color: "#f05e0a"}}>Together, </span>
          Let’s Connect. Innovate. Transform.</h1>
        </div>

        <Grid container spacing={3} sx={{ mt: 3 }}>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
