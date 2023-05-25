import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { Dialog, DialogContent, Card, Checkbox, Grid, Avatar, 
    Table, TableContainer, TableRow, TableHead, TextField, TableBody, TableCell, Tooltip, Typography, CardContent, Rating } from '@mui/material';
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';

import GradingIcon from '@mui/icons-material/Grading';
import EmergencyRecordingIcon from '@mui/icons-material/EmergencyRecording';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 1 / 4)'
});

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginTop: theme.spacing(3),
//   color: 'success',
//   backgroundColor
}));

const CoverImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

PreviousRoundsDetailCards.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number
};

export default function PreviousRoundsDetailCards({ post, index }) {

  // Dialog open/close state
  const [openDialog, setOpenDialog] = useState(false);

  let intstatus = localStorage.getItem("candIsInterviewed") === 'true'

  const latestPostLarge = index === -1;
  const latestPost = index === -1 || index === -2;

  return (
    <Grid
      item
      xs={3}
    >
      <Card sx={{ position: "relative" }}>
        <CardMediaStyle>
          <CoverImgStyle
            alt={post.interview_round.round_name}
            src='/static/g-meet-resumex.png'
          />

        </CardMediaStyle>

        <CardContent
        align="center"
          sx={{
            minWidth: 80,
            align: 'center',
            pt: 1,
            ...((latestPostLarge || latestPost) && {
              bottom: 0,
              width: "100%",
              position: "absolute",
            }),
          }}
        >

        <h2 style={{fontSize: '16px', fontWeight: '600', marginBottom: '30px'}}>
            {post.interview_round.round_name.toLowerCase().split('_')
            .map(word => {
                return word.charAt(0).toUpperCase() + word.slice(1);
                }).join(' ')}
        </h2>

          <InfoStyle>
            <Tooltip title="View Feedback">
                <Button variant="outlined" onClick={() => setOpenDialog(true)} disabled={intstatus}>
                    <GradingIcon sx={{color: "#00AB55"}}/>
                </Button>
            </Tooltip>

            <Tooltip title="View Recording">
                <Button variant="outlined" disabled={intstatus} href={post.interview_recording_link} target="blank">
                    <EmergencyRecordingIcon sx={{color: "#00AB55"}}/>
                </Button>
            </Tooltip>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <h2 
                style={{
                    fontSize: '16px', fontWeight: '600', marginBottom: '5px', marginTop: '10px'
                }}
                align="center">
                    Interview Feedback | {post.interview_round.round_name.toLowerCase().split('_')
                    .map(word => {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                    }).join(' ')}
                </h2>
                <DialogContent>
                <TableContainer>
                        <Table>
                            <TableHead>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableHead>
                            <TableBody>
                                <StyledTableRow>
                                    <TableCell><b>Candidate's Strong Areas:</b></TableCell>
                                    <TableCell>{post.candidate_strong_areas}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Candidate's Weak Areas:</b></TableCell>
                                    <TableCell>{post.candidate_weak_areas}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Skills Rating:</b></TableCell>
                                    <TableCell>
                                        {post.skills_rating.map(item => 
                                        <TableRow>
                                            <TableCell padding="none">{item.skill}:</TableCell>
                                            <TableCell>
                                            <Rating
                                                name="hover-feedback"
                                                value={item.rating}
                                                readOnly
                                            />
                                            </TableCell>
                                        </TableRow>
                                        )}
                                    </TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Training Areas:</b></TableCell>
                                    <TableCell>
                                        {post.training_areas.map(item => 
                                        <TableRow>
                                            <TableCell padding="none">{item.skill}:</TableCell>
                                            <TableCell>{item.duration}</TableCell>
                                        </TableRow>
                                        )}
                                    </TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Fit for BU:</b></TableCell>
                                    <TableCell>{post.fit_bu}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Fit for Project:</b></TableCell>
                                    <TableCell>{post.fit_project}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Fit for Level:</b></TableCell>
                                    <TableCell>{post.fit_level}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Interview Feedback:</b></TableCell>
                                    <TableCell>{post.interview_feedback}</TableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <TableCell><b>Is candidate selected?:</b></TableCell>
                                    <TableCell>
                                    <Checkbox checked={post.candidate_eligibility} readOnly/>
                                    </TableCell>
                                </StyledTableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
          </InfoStyle>
        </CardContent>
      </Card>
    </Grid>
  );
}