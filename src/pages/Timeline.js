import axios from 'axios';
import Page from '../components/Page';
import React, { useEffect, useState } from "react";
import { Autocomplete, Button, Card, CardContent, Container, TextField, Typography, Skeleton } from '@mui/material';

export default function Timeline() {
    return(
        <Page title="Timeline | ResumeX">
            <Container maxWidth="xl">
                <Typography variant="h3" sx={{mb: 5}} align="center">
                    Timeline
                </Typography>
            </Container>
        </Page>
    )
}