import { Button, useTheme } from "@mui/material";
import Alert from "@mui/material/Alert";

import { tokens } from "../../theme";
import TextField from "@mui/material/TextField";

import axios from "../../api/axios";

import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import SingleFormContainer from "../../components/SingleFormContainer";

const CREATE_USER_URL = "/auth/users/";

const UserCreate = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //Navigate config
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/users";


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
        navigate("/users");
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
    <SingleFormContainer
      title={"Nuevo usuario"}
      subtitle={"Ingrese los datos del nuevo usuario"}
      handleSubmit={formik.handleSubmit}
    >
      {errMsg.errors ? (
        <Alert severity={errMsg.type}>
          {Object.entries(errMsg.data).map(([key, value]) => (
            <>
              <strong>{key}</strong>: {value}
            </>

          ))}
        </Alert>
      ) : null}
      <TextField
        onChange={formik.handleChange}
        helperText={formik.touched.email && formik.errors.email}
        error={formik.touched.email && Boolean(formik.errors.email)}
        onBlur={formik.handleBlur}
        id="email"
        name="email"
        label="Correo electrónico"
        variant="standard"
        fullWidth
      />
      <TextField
        onChange={formik.handleChange}
        helperText={formik.touched.first_name && formik.errors.first_name}
        error={formik.touched.first_name && Boolean(formik.errors.first_name)}
        onBlur={formik.handleBlur}
        id="first_name"
        name="first_name"
        label="Nombre"
        variant="standard"
        fullWidth
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
        fullWidth
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
        fullWidth
      />
      <TextField
        error={formik.touched.re_password && Boolean(formik.errors.re_password)}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        helperText={formik.touched.re_password && formik.errors.re_password}
        id="re_password"
        name="re_password"
        type="password"
        label="Confirmar contraseña"
        variant="standard"
        fullWidth
      />
      <Button
        variant="contained"
        type="submit"
        size="medium"
        sx={{ background: colors.blueAccent[400] }}
      >
        Registrar
      </Button>
      <Button
        variant="contained"
        onClick={()=>{ navigate(from, { replace: true });}}
        size="medium"
        sx={{ background: colors.redAccent[500] }}
      >
        Cancelar
      </Button>
    </SingleFormContainer>
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
