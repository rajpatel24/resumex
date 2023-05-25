import PropTypes from 'prop-types';
// import { Icon } from '@iconify/react';
// import eyeFill from '@iconify/icons-eva/eye-fill';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Link, Card, Grid, Avatar, Typography, CardContent } from '@mui/material';
//
import SvgIconStyle from '../../SvgIconStyle';
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';

// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)'
});

const TitleStyle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical'
});

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2)
}));

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled
}));

const CoverImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

JobsPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number
};

export default function JobsPostCard({ post, index }) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  let intstatus = localStorage.getItem("candIsInterviewed") === 'true'

  const handleClose = () => {
    setShow(false);
  };
  
  const handleApply = () => {
    localStorage.setItem("SelectedJobName", post.jobName);
    localStorage.setItem("SelectedJobID", post.pk);
    navigate('/dashboard/jobs/openings/job-details/apply-job', {replace: true});
  };

  const handleShow = () => setShow(true);

  const { cover, title, author, createdAt } = post;
  const latestPostLarge = index === -1;
  const latestPost = index === -1 || index === -2;

  const primary_tech = [];
  const other_tech = [];
  const locs = [];

  post.jobPrimaryTechnology.forEach((ele, index) => {
    primary_tech.push((index ? ', ': '') + ele.technology_name)
  });

  post.jobTechnology.forEach((ele, index) => {
    other_tech.push((index ? ', ': '') + ele.technology_name)
  });

  post.jobLocation.forEach((lc, index) => {
    locs.push((index ? ', ': '') + lc.office_location);
  });

  return (
    <Grid
      item
      xs={3}
    >
      <Card sx={{ position: "relative" }}>
        <CardMediaStyle
          sx={{
            ...((latestPostLarge || latestPost) && {
              pt: "calc(100% * 4 / 3)",
              "&:after": {
                top: 0,
                content: "''",
                width: "100%",
                height: "100%",
                position: "absolute",
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
              },
            }),
            ...(latestPostLarge && {
              pt: {
                xs: "calc(100% * 4 / 3)",
                sm: "calc(100% * 3 / 4.66)",
              },
            }),
          }}
        >
          <SvgIconStyle
            color="paper"
            src="/static/mock-images/jobs/hiringImg.jpg"
            sx={{
              width: 80,
              height: 36,
              zIndex: 9,
              bottom: -15,
              position: "absolute",
              ...((latestPostLarge || latestPost) && { display: "none" }),
            }}
          />
          <AvatarStyle
            alt='loading'
            src='/static/mock-images/jobs/gateway_logo.jpeg'
            sx={{
              ...((latestPostLarge || latestPost) && {
                zIndex: 9,
                top: 24,
                left: 24,
                width: 40,
                height: 40,
              }),
            }}
          />

          <CoverImgStyle
            alt={post.jobName}
            src='/static/mock-images/jobs/we-are-hiring.jpg'
          />

        </CardMediaStyle>

        <CardContent
          sx={{backgroundColor: "#edece8",
            minWidth: 80,
            pt: 4,
            ...((latestPostLarge || latestPost) && {
              bottom: 0,
              width: "100%",
              position: "absolute",
            }),
          }}
        >
          <Typography
            gutterBottom
            variant="caption"
            sx={{ color: "text.disabled", display: "block" }}
          >
            {post.jobCategory.job_category_name}
          </Typography>

          <Typography
            gutterBottom
            variant="h5"
            sx={{ display: "block", minHeight: 60, }}
          >
            {post.jobName}
          </Typography>

          {/* <TitleStyle
            to="#"
            color="inherit"
            variant="subtitle2"
            underline="hover"
            component={RouterLink}
            sx={{minHeight: 50,
              ...(latestPostLarge && { typography: "h5", height: 60 }),
              ...((latestPostLarge || latestPost) && {
                color: "common.white",
              }),
            }}
          >
            <h5 style={{fontWeight: 'bold'}}>{post.jobName}</h5>
          </TitleStyle> */}

          <InfoStyle>
            <Button variant="success" onClick={handleShow} disabled={intstatus}>
              View Details
            </Button>
            <Modal
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              scrollable={true}
              backdrop='static'
              centered
              show={show}
              onHide={handleClose}
              style={{
                left: "680px",
                top: "80px",
                height: "90%",
                width: "40%",
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>{post.jobName}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              {post.jobExperience? ( <p><h6> Required Experience: </h6> <p> <pre  style={{whiteSpace: "pre-line",fontSize: "smaller",fontFamily: "inherit" }}> {post.jobExperience} </pre> </p></p>) : null}

              {post.jobDescription? ( <p><h6> Description: </h6> <p> <pre style={{ whiteSpace: "pre-line",fontSize: "smaller",fontFamily: "inherit"}}> {post.jobDescription} </pre> </p></p>) : null}
                
              {post.jobSkills? (<p><h6> Skills: </h6> <p> <pre style={{ whiteSpace: "pre-line",fontSize: "smaller",fontFamily: "inherit" }}> {post.jobSkills} </pre> </p></p>) : null}
                
              {post.jobResponsibility? ( <p> <h6> Responsibilities: </h6> <p> <pre style={{ whiteSpace: "pre-line",fontSize: "smaller",fontFamily: "inherit" }}> {post.jobResponsibility} </pre> </p></p>) : null}

              {primary_tech? ( <p><h6> Must have technologies: </h6> <p> <pre style={{whiteSpace: "pre-line",fontSize: "smaller",fontFamily: "inherit" }}> {primary_tech}  </pre> </p></p>) : null}

              {other_tech? ( <p><h6> Good to have technologies: </h6> <p> <pre style={{whiteSpace: "pre-line",fontSize: "smaller",fontFamily: "inherit" }}> {other_tech}  </pre> </p></p>) : null}
                
              {locs? ( <p><h6> Locations: </h6> <p> <pre style={{whiteSpace: "pre-line",fontSize: "smaller",fontFamily: "inherit" }}> {locs} </pre> </p></p>) : null}
              
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="success" onClick={handleApply}>
                  Apply
                </Button>
              </Modal.Footer>
            </Modal>
          </InfoStyle>
        </CardContent>
      </Card>
    </Grid>
  );
}