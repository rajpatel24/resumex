import React, { useEffect, useState } from "react";
import LinearProgress from '@mui/material/LinearProgress';

// material
import { Grid, Button, Container, Stack, Typography } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';

// components
import Page from "../components/Page";
import { CandidateCalendar, SlotPicker } from "../components/_dashboard/interviews/";
import { JobApplications } from "../components/_dashboard/interviews/";

// axios
import axios from "axios";
import { useSnackbar } from "notistack";
import { apiInstance } from "src/utils/apiAuth";

export default function ScheduleInterview() { 
  const [open, setOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  const [eventInfo, setEventInfo] = React.useState({})
  const [eventsData, seteventsData] = useState([]);

  const [hasBooking, setHasBooking] = React.useState(null)
  const [interviewDetails, setInterviewDetails] = React.useState({})

  const [noApplications, setNoApplications] = React.useState(false)

  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    setConfirmOpen(false)
    window.location.reload(false);
  };

  function handleSlotBooking() {
    bookInterviewSlot()
  }

  // ---------- Call save slot API [Full calendar] ------------

  // const bookInterviewSlot = () => {

  //   let empID = eventInfo.event?.extendedProps?.employeeId
  //   let jAppId = eventInfo.event?.extendedProps?.jobApplicationId

  //   let startDt = eventInfo.event.start
  //   let newStartDt = (new Date(startDt).toISOString()).slice(0, 19) + 'Z'

  //   let endDt = eventInfo.event.end
  //   let newEndDt = (new Date(endDt).toISOString()).slice(0, 19) + 'Z'

  //   apiInstance({
  //     method: 'post',
  //     url: '/confirmed-interviews/',
  //     headers: {
  //       Authorization: "token " + localStorage.getItem("candidateToken"),
  //     },
  //     data: {
  //       "employee_id": empID,
  //       "job_application_id": jAppId,
  //       "start_date": newStartDt,
  //       "end_date": newEndDt,
  //       "interview_round_id": 5,
  //       "interview_status": "CONFIRMED"
  //     }
  //   }).then(function (response) {

  //     if (response.status === 200) {

  //       enqueueSnackbar(response.data.message, {
  //         anchorOrigin: {
  //           vertical: 'top',
  //           horizontal: 'right',
  //         },
  //         variant: 'success',
  //         autoHideDuration: 1500,

  //       });

  //       eventInfo.el.style.backgroundColor = "green";
  //       eventInfo.el.style.borderColor = "red";

  //       setConfirmOpen(true)
  //       setOpen(false)
  //     }

  //   })
  //     .catch(function (error) {
  //       enqueueSnackbar(error.response.data.detail, {
  //         anchorOrigin: {
  //           vertical: 'top',
  //           horizontal: 'right',
  //         },
  //         variant: 'error',
  //         autoHideDuration: 2000,
  //       });
  //     });
  // }

  //  ---------- Call save slot API [react datepicker calendar] ------------

  const bookInterviewSlot = () => {

    let candID = eventInfo[0]?.candidateId
    let title = eventInfo[0]?.title
    let empID = eventInfo[0]?.employeeId
    let jAppId = eventInfo[0]?.jobApplicationId
    let startDt = eventInfo[0]?.start
    let endDt = eventInfo[0]?.end

    apiInstance({
      method: 'post',
      url: '/confirmed-interviews/',
      headers: {
        Authorization: "token " + localStorage.getItem("candidateToken"),
      },
      data: {
        "candidate_id": candID,
        "employee_id": empID,
        "job_application_id": jAppId,
        "start_date": startDt,
        "end_date": endDt,
        "intv_round": title,
        "interview_status": "CONFIRMED"
      }
    }).then(function (response) {

      if (response.status === 200) {

        enqueueSnackbar(response.data.message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
          autoHideDuration: 1500,

        });

        setConfirmOpen(true)
        setOpen(false)
        localStorage.setItem("candIsInterviewed", true)
      }

    })
      .catch(function (error) {
        enqueueSnackbar("Something went wrong. Please try after sometime.", {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
          autoHideDuration: 2000,
        });
      });
  }

  // ---------- Get calendar events API -------------

  useEffect(() => {
    getCandidateConfirmIntvDetails();
  }, []);

  const getCandidateConfirmIntvDetails = () => {

    apiInstance({
      method: "get",
      url: "candidate-interview/",
      headers: {
        Authorization: "token " + localStorage.getItem("candidateToken"),
      },
    })
      .then(function (response) {
        let intvObj = response.data.data;
        let intvStatus = response.data?.data?.interview_status;
        if (intvStatus === "CONFIRMED") {
          setInterviewDetails(intvObj);
          setHasBooking(true);
          setNoApplications(false);
          setIsLoading(false);
          // getEventsAPIData();
        } else {
          setHasBooking(false);
        }
      })
      .catch(function (error) {
        if (error.response.status === 404) {

          enqueueSnackbar("You don't have any job applications yet !", {
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            variant: "error",
            autoHideDuration: 2000,
          });

          setNoApplications(true);

        }
        else {
          // enqueueSnackbar("Something went wrong. Please try after sometime.", {
          //   anchorOrigin: {
          //     vertical: "top",
          //     horizontal: "right",
          //   },
          //   variant: "error",
          //   autoHideDuration: 2000,
          // });

          getEventsAPIData();
          setHasBooking(false);
          // setNoApplications(false);
        }
      });
  };

  const getEventsAPIData = () => {
    apiInstance({
      method: "get",
      url: "candidate-events/",
      headers: {
        Authorization: "token " + localStorage.getItem("candidateToken"),
      },
    })
      .then(function (response) {
        const eData = getEventsDataArray(response.data.data);
        seteventsData(eData);
      })
      .catch(function (error) {
        enqueueSnackbar("You have not booked your slots yet!", {
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          variant: "warning",
          autoHideDuration: 2000,
        });
      });
  };
  const getEventsDataArray = (eData) =>
    eData.map((eObj) => ({
      title: eObj.title,
      start: eObj.start,
      end: eObj.end,
      candidateId: eObj.extendedProps?.candidate_id,
      employeeId: eObj.extendedProps?.employee_id,
      jobApplicationId: eObj.extendedProps?.job_app_id,
      startRecur: eObj?.startRecur,
      endRecur: eObj?.endRecur,
      startTime: eObj?.startTime,
      endTime: eObj?.endTime,
      startTz: eObj?.startTz,
      endTz: eObj?.endTz
    }));

    const[color,setColor]=useState(true)
    const onStartTimeSelect=(e)=>{
    if(window.confirm('Date Selected')){
        setColor(true)
        // e.resetDate(new Date())
        //   e.resetSelectedTimeState()
    } 
}
  // Linear progress bar state
  const [isLoading, setIsLoading] = useState(true)

  if (hasBooking !== null && !hasBooking) {
  return (
    <Page title="Interview Slots | ResumeX">
       {/* {isLoading ? (
                    <Typography variant="h4" sx={{ mt: 0 }} align="center">
                        <LinearProgress />
                    </Typography>
                    ) : ( */}
      <Container>
        <Stack alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Let's Book Your Interview !
          </Typography>
        </Stack>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title">

          <DialogTitle id="responsive-dialog-title">
            {eventInfo[0]?.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <div>
                <b> Start Date - </b> {new Date(eventInfo[0]?.start).getDate()}- {new Date(eventInfo[0]?.start).getMonth() + 1}- {new Date(eventInfo[0]?.start).getFullYear()} &nbsp; &nbsp;
                <b> Start Time - </b> {new Date(eventInfo[0]?.start).getHours()}:{new Date(eventInfo[0]?.start).getMinutes()}:{new Date(eventInfo[0]?.start).getSeconds()}
              </div>
              <div>
                <b> End Date - </b> {new Date(eventInfo[0]?.end).getDate()}- {new Date(eventInfo[0]?.end).getMonth() + 1}- {new Date(eventInfo[0]?.end).getFullYear()} &nbsp; &nbsp;
                <b> End Time - </b> {new Date(eventInfo[0]?.end).getHours()}:{new Date(eventInfo[0]?.end).getMinutes()}:{new Date(eventInfo[0]?.end).getSeconds()}
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleSlotBooking}>
              Book Slot
            </Button>
            <Button autoFocus onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>


        <Dialog fullScreen={fullScreen} open={confirmOpen} onClose={handleClose} aria-labelledby="responsive-dialog-title">
          <DialogTitle id="responsive-dialog-title">
            Slot Booking Confirmation
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Congratulations, your interview slot has been booked !
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              OK
            </Button>
          </DialogActions>
        </Dialog>


        <SlotPicker eventsData={eventsData} setOpen={setOpen} setEventInfo={setEventInfo} />
      </Container>
      {/* )} */}
    </Page>
  );
  }
  else {
    return (
      <JobApplications interviewObj={interviewDetails} noApplications={noApplications} />
    )
  }
}
