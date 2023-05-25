import React, { useEffect } from "react";
import axios from 'axios';
import PropTypes from 'prop-types';
import { useState } from 'react';
// material
import { Card, Typography, CardHeader, CardContent } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineConnector,
  TimelineSeparator,
  TimelineDot
} from '@mui/lab';
import * as constants from "src/utils/constants";


export default function AppOrderTimeline() {
  const [jobApplicationData, setJobApplicationData] = useState([])
  const getJobApplicationData = () => 
  {
    const id = localStorage.getItem('jobApplicationId')

    // This condition avoids unnecessary API call for new candidate or 
    // candidate with zero application.
    
    if (id !== "undefined" && id === '') 
    {
      axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + '/api/v1/job-application/' + id + '/', {headers: {"Authorization" : `Token ${localStorage.getItem('candidateToken')}`}})
      .then((response) => {
          setJobApplicationData(response.data.data)
      })
      .catch((e) => console.log('something went wrong :(', e));
    }
    
  }
    

  useEffect(() => {
    getJobApplicationData()
  }, [])

  function getRegistrationDateTime(){
    return localStorage.getItem('registrationDateTime')?.substring(0, 10) + " | " + localStorage.getItem('registrationDateTime')?.substring(11, 16)
  }

  const getHRInterviewDateTime = () => { 
    const HRDateTime = jobApplicationData?.interview_details?.filter(item => {
        return item.interview_round === 'SCREENING_ROUND'
    })
    return HRDateTime?.[0]?.modified.substring(0, 10).split('-').reverse().join('/') + " | " + HRDateTime?.[0]?.modified.substring(11, 16)
  }

  function getTechnicalInterviewDateTime(){
    const TechnicalDateTime = jobApplicationData?.interview_details?.filter(item => {
        return item.interview_round === 'TECHNICAL_ROUND_ONE'
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
      title: 'HR Round',
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
      title: 'Technical Round',
      time: getTechnicalInterviewDateTime() === "undefined | undefined" ? "None" : getTechnicalInterviewDateTime(),
      type: 'task4',
      color: getTechnicalInterviewDateTime() === "undefined | undefined" ? "error.main" : "success.main"
    },
    {
      title: 'End of Interview Process',
      time: getInterviewProcessResult() === "undefined | undefined" ? "No" : getInterviewProcessResult(),
      type: 'task5',
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
        <Timeline>
          {TIMELINES.map((item, index) => (
            <OrderItem key={item.title} item={item} color={item.color} isLast={index === TIMELINES.length - 1} />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}
