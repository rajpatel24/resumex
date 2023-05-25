import { useState, useEffect } from 'react';
import Page from '../../Page';
import {
    Button, Card, CardContent, Container,
    Link, Stack, TextField, Typography,
    InputAdornment, InputLabel, MenuItem
}
    from '@mui/material';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider, ErrorMessage, Field } from 'formik';

import * as Yup from 'yup';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import * as React from 'react';
import CandRequiredDetails from './StepperForms/RequiredDetails';
import CandOfferDetails from './StepperForms/OfferDetails';
import CandOnboardingDetails from './StepperForms/OnboardingDetails';



const steps = ['Required Details', 'Offer Details', 'Onboarding Details'];

export default function InterviewStepper(candData) {
    const [activeStep, setActiveStep] = useState(0);

    const isStepOptional = (step) => {
        return step === 1;
    };

    const handleNext = () => {       
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);

    };

    const handleReset = () => {
        setActiveStep(0);
    }; 

    const handleBtnClick = () => {
        if(activeStep === steps.length - 1){
            handleReset()
        }
        else{
            handleNext()
        }
    }
       
    const CalculateAge = () => {
        let today = new Date()
        let birthdate = new Date(candData?.candidateData?.dob)           
        let curr_year = today.getFullYear()
        let born_year = birthdate.getFullYear()
        let age = curr_year - born_year

        return age
    }

    function renderStepContent(step) {
        switch (step) {
          case 1:
            let result = CalculateAge()            
            return  <CandRequiredDetails candData={candData} candAge={result}/>;

          case 2:
            return <CandOfferDetails candData={candData} />;

          case 3:
            return <CandOnboardingDetails candData={candData} />;
           
          default:
            return <div>Not Found</div>;
        }
      }

  
    return (
        <Page title="Candidates">
            <Container maxWidth="xl">
            <Box sx={{ width: '100%', mt:3}}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};

                        return (
                            <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                        })}

                    </Stepper>

                    <React.Fragment>
                        {renderStepContent(activeStep+1)}
                            
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                            <Button
                            size="large"
                            variant="outlined"
                            color="secondary"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr:1, font:50 }}
                            >
                            Back
                            </Button>
                       
                            <Button 
                            size="large"
                            variant="outlined"
                            color="secondary"                            
                            onClick={handleBtnClick}
                             >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </Box>
                    </React.Fragment>
                </Box>           
          
            </Container>
        </Page>
    )
}