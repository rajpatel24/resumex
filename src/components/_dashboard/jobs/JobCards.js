import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Card, Grid, CardContent} from '@mui/material';
import { Button } from 'react-bootstrap';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

JobCards.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number
};

const StyledButton = styled(Button)(({ theme, color = 'primary' }) => ({
    justifyContent: 'left',
    ':hover': {
        justifyContent: "flex-start",
      color: 'white !important',
      backgroundColor: '#f31c31',
    },
  }));

export default function JobCards({ post, index, jobsData }) {
    const navigate = useNavigate();

    // get objects from jobsData by filtering technology
    const jobsPositionsData = jobsData.filter(item => {
        return item.jobTechStackName === post
    })

    // use above objects to get positions of a job
    const positionData = jobsPositionsData.map((data) => (data.jobPositions))

    // sum of all positions
    const positions =  positionData?.reduce((result,number)=> result+number, 0);

    const onButtonClick = (name) => {
        let techStackJobs = jobsData.filter(item => {
            return item.jobTechStackName === name
        })

        navigate("/dashboard/jobs/openings/job-details", {state:{
            jobTechnology: post,
            jobsData: techStackJobs
        }})
  }

  return (
    <Grid
      item
      xs={5}
    >
        <Card minHeight="580" alignContent="left">
            <StyledButton variant="contained" color="secondary" onClick={() => onButtonClick(post)} style={{width: '100%', fontSize: '20px', fontWeight: 'bold', textAlign: 'left'}}>
                <CardContent>
                    <div style={{width: "100%"}}>
                        <div style={{width: "75%", display:"inline-block"}}>
                           {post}
                        </div>
                        <div style={{width: "20%", display:"inline-block", fontWeight: 'normal', fontSize: '16px'}}>
                            {positions} Positions
                        </div>                        
                        <div style={{width: "5%", display:"inline-block"}}>                                                
                            <DoubleArrowIcon />
                        </div>
                    </div>
                </CardContent>
            </StyledButton>
        </Card>
    </Grid>
  );
}
