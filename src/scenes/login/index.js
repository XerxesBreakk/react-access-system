import { Box, Button, Paper, useTheme } from "@mui/material";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";

const LOGIN_URL = "/auth/jwt/create";

const Index = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //Error Server-side
  const [errMsg, setErrMsg] = useState("");

  //Auth Context
  const { state, login_success, login_fail } = useAuth();

  //Navigate config
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/users";

  //Formik Validation
  const formik = useFormik({
    initialValues: { username: "", password: "" },
    onSubmit: async (values) => {
      try {
        const response = await axios.post(LOGIN_URL, values, {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        });
        login_success(response.data);
        navigate(from, { replace: true });
      } catch (error) {
        if (!error.response) {
          setErrMsg("Servidor fuera de linea.");
        } else if (
          error.response?.status === 400 ||
          error.response?.status === 401
        ) {
          setErrMsg(error.response.data.detail);
        } else {
          setErrMsg("Login Fallido.");
        }
        login_fail();
      }
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(5, "Debe tener mas de 5 caracteres.")
        .max(20, "Debe tener menos de 20 caracteres.")
        .required("Obligatorio"),
      password: Yup.string()
        .min(5, "Debe tener mas de 5 caracteres.")
        .max(20, "Debe tener menos de 20 caracteres.")
        .required("Obligatorio"),
    }),
  });

  return (
    <Box display="flex" justifyContent="center" m="20px">
      <Paper
        elevation={3}
        style={{ padding: "10px", background: colors.primary[400] }}
      >
        <Header title="Login" subtitle="Ingrese sus datos de acceso" />

        {errMsg ? <Alert severity="error"> {errMsg} </Alert> : null}
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          my={"10px"}
          autoComplete="off"
        >
          <TextField
            fullWidth
            onChange={formik.handleChange}
            helperText={formik.touched.username && formik.errors.username}
            error={formik.touched.username && Boolean(formik.errors.username)}
            onBlur={formik.handleBlur}
            sx={{ marginBottom: "15px" }}
            id="username"
            name="username"
            label="Usuario"
            variant="standard"
          />
          <TextField
            fullWidth
            error={formik.touched.password && Boolean(formik.errors.password)}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={formik.touched.password && formik.errors.password}
            sx={{ marginBottom: "20px" }}
            id="password"
            name="password"
            type="password"
            label="Contraseña"
            variant="standard"
          />
          <Button
            variant="contained"
            type="submit"
            sx={{ background: colors.blueAccent[400] }}
          >
            Iniciar sesion
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Index;
