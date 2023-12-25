import { Box, Button, Grid, Stack, TextField, useTheme } from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useFormik } from "formik";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const ACTIVATION_URL = "/auth/users/activation/";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const UserActivate = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //Error Server-side
  const [errMsg, setErrMsg] = useState("");

  //Navigate config
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { uid: "", token: "" },
    onSubmit: async (values) => {
      try {
        const res = await axios.post(ACTIVATION_URL, values, {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        });
        console.log(res.data);
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    },
    validationSchema: Yup.object({
      uid: Yup.string().required("Campo requerido"),
      token: Yup.string().required("Campo requerido"),
    }),
  });
  return (
    <Box sx={{ flexGrow: 1, m: "10px" }}>
      <Grid container justifyContent="center">
        <Grid item xxs={12} xs={6}>
          <Item sx={{ backgroundColor: colors.primary[400] }}>
            <Header
              title="Activar"
              subtitle="Ingrese la informacion enviada a su correo."
            />
            <Stack component="form" onSubmit={formik.handleSubmit} autoComplete="off" gap={3}>
              <TextField
                fullWidth
                {...formik.getFieldProps("uid")}
                helperText={formik.touched.uid && formik.errors.uid}
                error={formik.touched.uid && Boolean(formik.errors.uid)}
                label="Uid"
                variant="standard"
              />
              <TextField
                fullWidth
                {...formik.getFieldProps("token")}
                helperText={formik.touched.token && formik.errors.token}
                error={formik.touched.token && Boolean(formik.errors.token)}
                label="Token"
                variant="standard"
              />
              <Button
                variant="contained"
                type="submit"
                sx={{ background: colors.blueAccent[400] }}
              >
                Activar
              </Button>
            </Stack>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserActivate;
