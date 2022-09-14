import { useState } from "react";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Login } from "../../Store/authSlice";
import { useFormik } from "formik";
import * as yup from "yup";
import { FormControl } from "@mui/material";
import axios from "axios";

const theme = createTheme();

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const validationSchema = yup.object({
    email: yup.string("Enter your email"),
    /* .email("Enter a valid email")
      .required("Email is required"), */
    password: yup
      .string("Enter your password")
      .min(3, "Password should be of minimum 8 characters length")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      const res = await axios.post(
        `http://localhost:3000/auth/forgot-password`,
        values
      );
      if (res.status === 200) {
        setSuccess(true);
      } else {
        setError(true);
      }
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await axios.post(`http://localhost:3000/auth/forgot-password`, {
      email: formik.values.email,
    });
    if (res.status === 200) {
      setSuccess(true);
    } else {
      setError(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ width: "xs" }} component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Link to={"/"}>
            <img
              style={{
                width: "250px",
                margin: "0 0 20px 180px",
              }}
              alt="Remy Sharp"
              src="../assets/images/cui.png"
            />
          </Link>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Box onSubmit={handleSubmit} component="form" sx={{ mt: 1 }}>
            {error && (
              <Box sx={{ mb: 1, mt: 2 }}>
                <Typography
                  align="center"
                  sx={{ color: "red" }}
                  component="h4"
                  variant="h6"
                >
                  User does not exist!
                </Typography>
              </Box>
            )}
            {success && (
              <Box sx={{ mb: 1, mt: 2 }}>
                <Typography
                  align="center"
                  sx={{ color: "green" }}
                  component="h4"
                  variant="h6"
                >
                  Password reset link sent to your Email.
                </Typography>
              </Box>
            )}
            <FormControl sx={{ width: "400px" }}>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                name="email"
                label="Enter your email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Send E-mail
              </Button>
            </FormControl>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
