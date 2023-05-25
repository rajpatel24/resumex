import { useState, useEffect } from 'react';
import Page from '../../Page';
import {Container, Link, Stack, Typography } from '@mui/material';
import {Link as RouterLink, useLocation, useParams} from 'react-router-dom';
import axios from 'axios';

import { Tabs, Tab, Row, Col, Form } from "react-bootstrap";
import EditCandidatePersonalDetails from './EditCandPerDetails';
import EditCandidateJobApplication from "./EditCandJobApp";
import EditCandidateHRAnalysis from "./EditCandHRAnalysis";
import EditCandidateDocuments from "./EditCandDocuments";
import InterviewStepper from "./EditCandInterview";
import OnboardEngagement from './OnboardEngagement'
import GenerateOfferLetter from './GenerateOfferLetter';
import * as constants from 'src/utils/constants';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import UserInfo from 'src/utils/Authorization/UserInfo';

export default function EditCandidate(props) {
    const { id } = useParams();
    const location = useLocation();
    const userInfo = UserInfo();

    const previousPage = location?.state?.fromPage
    const userRole = userInfo?.role

    const [candidateData, setCandidateData] = useState([])

    const getCandidateData = async () => {
        await axios.get(constants.HTTP_METHOD + constants.HTTP_URL + constants.HTTP_PORT + "/api/v1/candidate-viewset/" + id + "/", { headers: { "Authorization": `Token ${localStorage.getItem('authToken')}` } })
        .then((response) => {
            setCandidateData(response.data.data)
        })
        .catch((e) => console.log('something went wrong :(', e));
    };

    useEffect(() => {
        getCandidateData()
    }, [])

    return (
        <Page title="Candidates">
            <Container maxWidth="xl">
                <Stack direction={{ xs: "column", sm: "row" }} spacing={72} sx={{ mb: 6 }}>
                    <Link to={`/resumeX/${previousPage}` }
                        color="green" 
                        underline="hover" 
                        component={RouterLink} 
                        fontSize="20px"> 
                            <ArrowCircleLeftIcon fontSize="large" />
                    </Link>

                    {/* <Typography variant="h4" sx={{ mb: 5 }} align="center">
                        Edit Candidate
                    </Typography> */}

                    <h2 align="center" style={{fontSize: '25px', fontWeight: '800', marginBottom: '30px'}}>Edit Candidate</h2>
                </Stack>

                <Row>
                    <Col>
                        <Tabs defaultActiveKey="candidate_profile"
                            id="controlled-tab-example">
                            <Tab eventKey="candidate_profile" title="Candidate Profile">
                                <EditCandidatePersonalDetails candidateData={candidateData} />
                            </Tab>

                            { userRole !== 'OnBoarding_HR' ? 
                            <Tab eventKey="hr_analysis" title="HR Analysis">
                                <EditCandidateHRAnalysis candidateData={candidateData} />
                            </Tab> : null}

                            <Tab eventKey="documents" title="Documents">
                                <EditCandidateDocuments candidateData={candidateData} />
                            </Tab>

                            { userRole !== 'OnBoarding_HR' ? 
                            <Tab eventKey="job_application" title="Job Application">
                                <EditCandidateJobApplication candidateData={candidateData} />
                            </Tab> : null }

                            {candidateData?.status?.status === 'Offered' || 'Offer Accepted' ?
                                <Tab eventKey="candidate_interview" title="Interview">
                                    <InterviewStepper candidateData={candidateData}/>
                                </Tab>
                            : null }

                            {candidateData?.status?.status === 'Offered' || 'Offer Accepted' ?
                                <Tab eventKey="onboarding_engagement" title="Onboarding Engagement">
                                    <OnboardEngagement candidateData={candidateData}/>
                                </Tab>
                            : null }

                            {candidateData?.status?.status === 'Offered' || 'Offer Accepted' ?
                                <Tab eventKey="generate_offer_letter" title="Generate Offer Letter">
                                    <GenerateOfferLetter candidateData={candidateData}/>
                                </Tab>
                            : null }

                        </Tabs>
                    </Col>
                </Row>
            </Container>
        </Page>
    )
}