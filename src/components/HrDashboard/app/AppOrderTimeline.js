import React, { useEffect } from "react";
import axios from 'axios';
import PropTypes from 'prop-types';
import { useState } from 'react';
// material
import { Autocomplete, Card, TextField, Typography, CardHeader, CardContent, Button, Link } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineConnector,
  TimelineSeparator,
  TimelineDot
} from '@mui/lab';
import * as constants from "src/utils/constants";
import {Link as RouterLink} from 'react-router-dom';

export default function AppOrderTimeline() {
  const [candidateData, setCandidateData] = useState([])
  const getCandidates = () => {
    axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/candidate-viewset/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
    .then((response) => {
      setCandidateData(response.data.data.sort((a, b) => b.id - a.id))
    })
    .catch((e) => console.log('something went wrong :(', e));
  };

  useEffect(() => {
    getCandidates()
  }, [])

  const [jobApplicationData, setJobApplicationData] = useState([])

  const [candidateID, setCandidateID] = useState([])
  const [enableCandidateViewButton, setEnableCandidateViewButton] = useState([])

  const onCandidateChange = (value) => {
    setCandidateID(value?.id)
    setEnableCandidateViewButton(true)

    const id = value?.job_application?.[0]?.id

    axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/job-application/' + id + '/', {headers: {"Authorization" : `Token ${localStorage.getItem('authToken')}`}})
    .then((response) => {
        setJobApplicationData(response.data.data)
    })
    .catch((e) => console.log('something went wrong :(', e));
  }

  function getRegistrationDateTime(){
    return jobApplicationData?.resume?.candidate?.user?.joined_date.substring(0, 10) + " | " + jobApplicationData?.resume?.candidate?.user?.joined_date.substring(11, 16)
  }

  const getHRInterviewDateTime = () => { 
    const HRDateTime = jobApplicationData?.interview_details?.filter(item => {
        return item.interview_round === 'SCREENING_ROUND'
    })
    return HRDateTime?.[0]?.modified.substring(0, 10).split('-').reverse().join('/') + " | " + HRDateTime?.[0]?.modified.substring(11, 16)
  }

  function getTechnicalInterviewOneDateTime(){
    const TechnicalDateTime = jobApplicationData?.interview_details?.filter(item => {
        return item.interview_round === 'TECHNICAL_ROUND_ONE'
    })
    return TechnicalDateTime?.[0]?.modified.substring(0, 10).split('-').reverse().join('/') + " | " + TechnicalDateTime?.[0]?.modified.substring(11, 16)
  }

  function getTechnicalInterviewTwoDateTime(){
    const TechnicalDateTime = jobApplicationData?.interview_details?.filter(item => {
        return item.interview_round === 'TECHNICAL_ROUND_Two'
    })
    return TechnicalDateTime?.[0]?.modified.substring(0, 10).split('-').reverse().join('/') + " | " + TechnicalDateTime?.[0]?.modified.substring(11, 16)
  }

  function getReviewCandidateDateTime(){
    const confirmedInterviewData = jobApplicationData?.interview_details?.filter(item => {
      return item.interview_round === 'REVIEW_CANDIDATE'
  })
  return confirmedInterviewData?.[0]?.modified.substring(0, 10).split('-').reverse().join('/') + " | " + confirmedInterviewData?.[0]?.modified.substring(11, 16)
  }

  function getInterviewProcessResult(){
    if (jobApplicationData?.is_candidate_selected){
      return jobApplicationData?.modified?.substring(0, 10).split('-').reverse().join('/') + " | " + jobApplicationData?.modified?.substring(11, 16)
    }
    else{
      return "undefined | undefined"
    }
  }

  function OrderItem({ item, color, isLast }) {
    const { type, title, time } = item;
    return (
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot
            sx={{
              bgcolor:
                (type === 'task1' && color) ||
                (type === 'task2' && color) ||
                (type === 'task3' && color) ||
                (type === 'task4' && color) ||
                (type === 'task5' && color) ||
                (type === 'task6' && color) ||
                'error.main'
            }}
          />
          {isLast ? null : <TimelineConnector />}
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="subtitle2">{title}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {time}
          </Typography>
        </TimelineContent>
      </TimelineItem>
    );
  }

  OrderItem.propTypes = {
    item: PropTypes.object,
    isLast: PropTypes.bool
  };

  const TIMELINES = [
    {
      title: 'Registration',
      time: getRegistrationDateTime() === "undefined | undefined" ? "None" : getRegistrationDateTime(),
      type: 'task1',
      color: getRegistrationDateTime() === "undefined | undefined" ? "error.main" : "success.main"
    },
    {
      title: 'Screening Round',
      time: getHRInterviewDateTime() === "undefined | undefined" ? "None" : getHRInterviewDateTime(),
      type: 'task3',
      color: getHRInterviewDateTime() === "undefined | undefined" ? "error.main" : "success.main"
    },
    {
      title: 'Review Candidate',
      time: getReviewCandidateDateTime() === "undefined | undefined" ? "None" : getReviewCandidateDateTime(),
      type: 'task2',
      color: getReviewCandidateDateTime() === "undefined | undefined" ? "error.main" : "success.main"
    },
    {
      title: 'Technical Round 1',
      time: getTechnicalInterviewOneDateTime() === "undefined | undefined" ? "None" : getTechnicalInterviewOneDateTime(),
      type: 'task4',
      color: getTechnicalInterviewOneDateTime() === "undefined | undefined" ? "error.main" : "success.main"
    },
    {
      title: 'Technical Round 2',
      time: getTechnicalInterviewTwoDateTime() === "undefined | undefined" ? "None" : getTechnicalInterviewTwoDateTime(),
      type: 'task5',
      color: getTechnicalInterviewTwoDateTime() === "undefined | undefined" ? "error.main" : "success.main"
    },
    {
      title: 'End of Interview Process',
      time: getInterviewProcessResult() === "undefined | undefined" ? "No" : getInterviewProcessResult(),
      type: 'task6',
      color: getInterviewProcessResult() === "undefined | undefined" ? "error.main" : "success.main"
    }
  ];

  return (
    <Card
      sx={{
        '& .MuiTimelineItem-missingOppositeContent:before': {
          display: 'none'
        }
      }}
    >
      <CardHeader title="Candidate Timeline" />
      <CardContent>
      <Autocomplete
        fullWidth
        disablePortal
        id="combo-box-demo"
        // sx={{mb: 1}}
        size="small"
        options={candidateData}
        getOptionLabel={(option) => option.user.first_name + " " + option.user.last_name + " | " + option.user.mobile}
        onChange={(event, value) => onCandidateChange(value)}
        renderInput={(params) => <TextField {...params} label="Candidate" />}
      />

        <Timeline>
          {TIMELINES.map((item, index) => (
            <OrderItem key={item.title} item={item} color={item.color} isLast={index === TIMELINES.length - 1} />
          ))}
        </Timeline>
      </CardContent>

      <CardContent sx={{mt: -13}} align="right">
          {enableCandidateViewButton === true ? (
          // <Link to={`/resumeX/candidates/edit/` + candidateID }
          //     color="green" 
          //     underline="hover" 
          //     component={RouterLink} 
          //     fontSize="20px"> 
          //       <Button variant="contained" size="small">View Candidate</Button>
          // </Link>
          <RouterLink 
              to={`/resumeX/candidates/edit/${candidateID}`}
              state={{fromPage: "app"}} 
              style={{textDecoration: 'none', 
                      color: '#00AB55', 
                      fontWeight: 'bold'}}> 
              <Button variant="contained" size="small">View Candidate</Button>
          </RouterLink>
          ) : ("")}
      </CardContent>
    </Card>
  );
}
