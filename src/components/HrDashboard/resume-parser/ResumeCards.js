import PropTypes from 'prop-types';
import { Button, Card, Grid, CardContent} from '@mui/material';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import * as constants from 'src/utils/constants';

ResumeCards.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number
};

export default function ResumeCards({ resume, index }) {
    const onButtonClick = (resume) => {
        window.open(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + `/${resume}`, "_blank")
  }

  return (
    <Grid
      item
      xs={4}
    >
        <Card minHeight="580" alignContent="left">
                <CardContent>
                    <div style={{width: "100%"}}>
                        <div style={{width: "90%", display:"inline-block"}}>
                           <TextSnippetIcon /> &nbsp; {resume.split('/')[2]}
                        </div>
                        <div style={{width: "10%", display:"inline-block"}}>
                            <Button variant="text" size="large" color="primary" onClick={() => onButtonClick(resume)}><OpenInNewIcon /></Button>
                        </div>
                    </div>
                </CardContent>
        </Card>
    </Grid>
  );
}
