import faker from 'faker';
import { useState } from 'react';
import PropTypes from 'prop-types';
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
// utils
import { fDateTime } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

const TIMELINES = [
  {
    title: 'Registration',
    time: "2022-02-15T14:28:00.291196+05:30",
    type: 'task1'
  },
  {
    title: 'Applied for the job',
    time: faker.date.past(),
    type: 'task2'
  },
  {
    title: 'Interview Round 1',
    time: faker.date.past(),
    type: 'task3'
  },
  {
    title: 'Interview Round 2',
    time: faker.date.past(),
    type: 'task4'
  },
  {
    title: 'Hr Round',
    time: faker.date.past(),
    type: 'task5'
  }
];

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  item: PropTypes.object,
  isLast: PropTypes.bool
};

function OrderItem({ item, isLast }) {
  const [taskOne, setTaskOne] = useState('success.main')
  const [taskTwo, setTaskTwo] = useState('success.main')
  const [taskThree, setTaskThree] = useState('success.main')
  const [taskFour, setTaskFour] = useState('grey.main')
  const [taskFive, setTaskFive] = useState('grey.main')
  const { type, title, time } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            bgcolor:
            (type === 'task1' && taskOne) ||
            (type === 'task2' && taskTwo) ||
            (type === 'task3' && taskThree) ||
            (type === 'task4' && taskFour) ||
            (type === 'task5' && taskFive) ||
              'error.main'
          }}
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fDateTime(time)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}

export default function AppOrderTimeline() {
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
            <OrderItem key={item.title} item={item} isLast={index === TIMELINES.length - 1} />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}
