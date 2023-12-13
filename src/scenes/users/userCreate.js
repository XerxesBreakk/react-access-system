import { Box, Paper, Button, useTheme } from "@mui/material";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { tokens } from "../../theme";
import TextField from "@mui/material/TextField";

import Header from "../../components/Header";
import axios from "../../api/axios";

import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

const CREATE_USER_URL = "/auth/users/";

const UserCreate = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //Navigate config
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/users";

  //SnackBar hook
  /* const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => {
          navigate(from, { replace: true });
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  ); */

  //Error Server-side
  const [errMsg, setErrMsg] = useState({
    errors: false,
    type: "warning",
    data: {},
  });

  //Formik Validation
  const formik = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      username: "",
      password: "",
      re_password: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          CREATE_USER_URL,
          JSON.stringify(values),
          {
            headers: { "Content-type": "application/json" },
            withCredentials: true,
          }
        );
        //setOpen(true);
      } catch (error) {
        const newErrMsg = { ...errMsg };
        if (!error.response) {
          setErrMsg("Servidor fuera de linea.");
        } else if (
          error.response?.status === 400 ||
          error.response?.status === 401
        ) {
          newErrMsg.data = error.response.data;
          newErrMsg.errors = true;
          newErrMsg.type = "error";
          setErrMsg(newErrMsg);
        } else {
        }
      }
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Correo invalido."),
      first_name: Yup.string().required("Obligatorio"),
      username: Yup.string()
        .min(5, "Debe tener mas de 5 caracteres.")
        .max(20, "Debe tener menos de 20 caracteres.")
        .required("Obligatorio"),
      password: Yup.string()
        .min(8, "Debe tener mas de 8 caracteres.")
        .max(20, "Debe tener menos de 20 caracteres.")
        .required("Obligatorio"),
      re_password: Yup.string().oneOf(
        [Yup.ref("password"), null],
        "Las claves no coinciden."
      ),
    }),
  });

  return (
    <Box display="flex" justifyContent="center" m="20px">
      <Paper
        elevation={3}
        style={{
          backgroundColor: colors.primary[400],
          padding: "10px",
        }}
      >
        <Header title="Nuevo usuario" subtitle="Nuevo usuario solicitante" />
        {errMsg.errors ? (
          <Alert severity={errMsg.type}>
            {Object.entries(errMsg.data).map(([key, value]) => (
              <div key={key}>
                <strong>{key}</strong>: {value}
              </div>
            ))}
          </Alert>
        ) : null}
        <Stack
          component="form"
          spacing={2}
          onSubmit={formik.handleSubmit}
          style={{ padding: "5px" }}
          autoComplete="off"
        >
          <TextField
            onChange={formik.handleChange}
            helperText={formik.touched.email && formik.errors.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            onBlur={formik.handleBlur}
            id="email"
            name="email"
            label="Correo electrónico"
            variant="standard"
          />
          <TextField
            onChange={formik.handleChange}
            helperText={formik.touched.first_name && formik.errors.first_name}
            error={
              formik.touched.first_name && Boolean(formik.errors.first_name)
            }
            onBlur={formik.handleBlur}
            id="first_name"
            name="first_name"
            label="Nombre"
            variant="standard"
          />

          <TextField
            onChange={formik.handleChange}
            helperText={formik.touched.username && formik.errors.username}
            error={formik.touched.username && Boolean(formik.errors.username)}
            onBlur={formik.handleBlur}
            id="username"
            name="username"
            label="Usuario"
            variant="standard"
          />
          <TextField
            error={formik.touched.password && Boolean(formik.errors.password)}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={formik.touched.password && formik.errors.password}
            id="password"
            name="password"
            type="password"
            label="Contraseña"
            variant="standard"
          />
          <TextField
            error={
              formik.touched.re_password && Boolean(formik.errors.re_password)
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={formik.touched.re_password && formik.errors.re_password}
            id="re_password"
            name="re_password"
            type="password"
            label="Confirmar contraseña"
            variant="standard"
          />
          <Button
            variant="contained"
            type="submit"
            sx={{ background: colors.blueAccent[400] }}
          >
            Registrar
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default UserCreate;
/* 
<Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Note archived"
        action={action}
      /> */