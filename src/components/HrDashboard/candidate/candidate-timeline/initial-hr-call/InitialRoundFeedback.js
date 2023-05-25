import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Checkbox, Container, Dialog, DialogContent, DialogActions, Stack, Typography, TextField } from '@mui/material';

export default function InitialRoundFeedback() {

    // Initial call feedback dialog state
    const [initialRoundFeedbackDialog, setInitialRoundFeedbackDialog] = useState(false)

    // Is candidate elible for subsequent rounds state
    const [isCandidateElible, setIsCandidateElible] = React.useState("");
    
    const handleCandidateEliblilityCheckedChange = event =>{
        setIsCandidateElible(event.target.checked);
    };

    // Initial round feedback notes state
    const [initialRoundFeedbackNotes, setInitialRoundFeedbackNotes] = useState("")

    const handleInitialRoundResult = (event) => {

    }

    return(
        <Stack>
            <Button variant="contained" size="small" color="error" onClick={() => setInitialRoundFeedbackDialog(true)}>Initial Call Feedback</Button>

            <Dialog open={initialRoundFeedbackDialog} onClose={() => setInitialRoundFeedbackDialog(false)}>
                <Typography align="center" variant="h6" sx={{ mt: 2, mb:2, ml: 2, mr: 2}}>
                    Initial Round Feedback
                </Typography>

                <DialogContent align="center">
                    Is candidate eligible for the subsequent rounds ? :
                    <Checkbox checked={isCandidateElible} onChange={handleCandidateEliblilityCheckedChange} required/>
                </DialogContent>

                <DialogContent align="center">
                    <TextField
                        fullWidth
                        label="Feedback"
                        style={{ height: 500, width: 500 }}
                        multiline
                        rows={19}
                        defaultValue={initialRoundFeedbackNotes}
                        onChange={(event) => setInitialRoundFeedbackNotes(event.target.value)}
                    />
                    <Button 
                        variant="contained" 
                        size="medium" 
                        color="error"
                        onClick={handleInitialRoundResult}
                    >
                        Submit Feedback
                    </Button>
                </DialogContent>

            </Dialog>
        </Stack>
    )
}