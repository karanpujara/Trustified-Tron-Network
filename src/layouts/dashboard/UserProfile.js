import * as Yup from "yup";
import { useState } from "react";
import { useFormik, Form, FormikProvider } from "formik";
import { useNavigate } from "react-router-dom";
// material
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Container,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { LoadingButton } from "@mui/lab";
import { border, borderRadius } from "@mui/system";
import "./Profile.css";
import Page from "src/components/Page";
import { ProfileView } from "src/components/userprofile/ProfileView";
import { ProfileDetails } from "src/components/userprofile/ProfileDetails";


// ----------------------------------------------------------------------

const Input = styled("input")({
  display: "none",
});

export default function UserProfile() { 

  const [uploadfile, setuploadFile] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

   

  
 

  return (
    <Page title="User Profile | TrustifiedNetwork">
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{ mb: 3 }}
            variant="h4"
          >
            User Profile
          </Typography>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={4}
              md={4}
              xs={12}
            >
                <ProfileView up={isUpdate} />
            </Grid>
            <Grid
              item
              lg={8}
              md={8}
              xs={12}
            >
              <ProfileDetails isUp={setIsUpdate} up={isUpdate} />
            </Grid>
          </Grid>
        </Container>
      </Box>  
    </Page>
  );
}