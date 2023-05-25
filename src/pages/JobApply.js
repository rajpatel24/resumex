import { Link as RouterLink } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
import { Box, Card, Link, Container, Typography, CardContent } from "@mui/material";
// layouts
import AuthLayout from "../layouts/AuthLayout";
// components
import Page from "../components/Page";
import { MHidden } from "../components/@material-extend";
import { RegisterForm } from "../components/authentication/register";
import JobApplyForm from "../components/_dashboard/jobs/JobApplyForm";


// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  maxWidth: "80%",
  flexDirection: "column",
  padding: theme.spacing(5, 0),
}));
// ----------------------------------------------------------------------

export default function JobApply() {
  return (
            <RootStyle title="Job Apply | ResumeX">
            <Link to="/dashboard/jobs/openings/" color="green" underline="hover" component={RouterLink} fontSize="20px"> Back </Link>
            <Container maxWidth="xl">
              <ContentStyle>
              <Card sx={{ mt: 2 }} variant="outlined">
                <CardContent>
                  <JobApplyForm />
                </CardContent>
                </Card>
                </ContentStyle>
            </Container>
          </RootStyle>
  );
}
