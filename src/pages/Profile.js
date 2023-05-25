import { Box, Grid, Container, Typography } from '@mui/material';

// components
import Page from '../components/Page';

import {
  ProfileInfo
} from '../components/_dashboard/user/profile/';

// ----------------------------------------------------------------------

export default function Profile() {
  return (
    <Page title="User | Profile">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Profile</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <ProfileInfo />
          </Grid>
          
        </Grid>
      </Container>
    </Page>
  );
}
