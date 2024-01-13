import { TextField, useTheme, Button } from "@mui/material";
import React, { useState } from "react";
import { tokens } from "../../theme";
import { useFormik } from "formik";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import SingleFormContainer from "../../components/SingleFormContainer";

const GET_USER_URL = "/auth/users/me/";

const UserEdit = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { state } = useAuth();

  //axios
  const axiosPrivate = useAxiosPrivate();

  //navigate config
  const navigate = useNavigate();

  //Error Server-side
  const [errMsg, setErrMsg] = useState({
    errors: false,
    type: "warning",
    data: {},
  });

  //Formik Configuration
  const formik = useFormik({
    initialValues: state.user,
    onSubmit: async (values) => {
      try {
        const response = axiosPrivate.patch(
          GET_USER_URL,
          JSON.stringify(values)
        );
        //TODO actualizar el state.user
        navigate("/users");
      } catch (error) {
        const newErrMsg = { ...errMsg };
        if (!error.response) {
          newErrMsg.data = { general: "Servidor fuera de linea" };
          newErrMsg.errors = true;
          setErrMsg(newErrMsg);
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
      email: Yup.string().email("Debe ser un correo valido."),
      first_name: Yup.string().required("Obligatorio"),
      username: Yup.string().required("Obligatorio"),
      last_name: Yup.string().required("Obligatorio"),
    }),
  });
  return (
    <SingleFormContainer
      title={"Editar mi usuario"}
      subtitle={"Actualizar perfil"}
      handleSubmit={formik.handleSubmit}
      errMsg={errMsg}
    >
      <TextField
        fullWidth
        {...formik.getFieldProps("username")}
        helperText={formik.touched.username && formik.errors.username}
        error={formik.touched.username && Boolean(formik.errors.username)}
        label="username"
        variant="standard"
        disabled
      />
      <TextField
        fullWidth
        {...formik.getFieldProps("email")}
        helperText={formik.touched.email && formik.errors.email}
        error={formik.touched.email && Boolean(formik.errors.email)}
        label="email"
        variant="standard"
        disabled
      />
      <TextField
        fullWidth
        {...formik.getFieldProps("first_name")}
        helperText={formik.touched.first_name && formik.errors.first_name}
        error={formik.touched.first_name && Boolean(formik.errors.first_name)}
        label="first_name"
        variant="standard"
      />
      <TextField
        fullWidth
        {...formik.getFieldProps("last_name")}
        helperText={formik.touched.last_name && formik.errors.last_name}
        error={formik.touched.last_name && Boolean(formik.errors.last_name)}
        label="last_name"
        variant="standard"
      />
      <Button
        variant="contained"
        type="submit"
        sx={{ background: colors.blueAccent[400] }}
      >
        Actualizar
      </Button>
    </SingleFormContainer>
  );
};

export default UserEdit;
