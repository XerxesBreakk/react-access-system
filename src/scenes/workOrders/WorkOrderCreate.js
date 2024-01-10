import { useTheme } from "@emotion/react";
import React from "react";
import { tokens } from "../../theme";
import SingleFormContainer from "../../components/SingleFormContainer";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Button, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";


const CREATE_WO_URL = "/work-order/";

const WorkOrderCreate = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //Axios Private
  const axiosPrivate = useAxiosPrivate();

  //Navigate config
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/work-order";

  const formik = useFormik({
    initialValues: {
      date: "",
      start_time: "",
      duration: "",
      activity: "",
      company: "",
      capacity: "",
    },
    onSubmit: async (values) => {
      try {
        // Combina la fecha y la hora de inicio en un campo datetime
        const dateTime = `${values.date}T${values.start_time}`;
        const { start_time,date,duration, ...dataWithoutDate } = values;
        const data = {
          ...dataWithoutDate,
          date: dateTime,
          duration:`${duration}:00`,
        };
        console.log(data);
        const response = await axiosPrivate.post(
          CREATE_WO_URL,
          JSON.stringify(data)
        );
        console.log(response);
        navigate(from,{replace:true});
      } catch (error) {
        console.log(error);
        //const newErrMsg = { ...errMsg };
        if (!error.response) {
          //setErrMsg("Servidor fuera de linea.");
        } else if (
          error.response?.status === 400 ||
          error.response?.status === 401
        ) {
          /* newErrMsg.data = error.response.data;
          newErrMsg.errors = true;
          newErrMsg.type = "error";
          setErrMsg(newErrMsg); */
        } else {
        }
      }
    },
    validationSchema: Yup.object({
      date: Yup.date().required("La fecha es requerida"),
      start_time: Yup.string()
        .matches(
          /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
          "Formato inválido. Usa hh:mm"
        )
        .required("Ingrese la hora de inicio de los trabajos"),
      duration: Yup.string()
        .matches(
          /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
          "Formato inválido. Usa hh:mm"
        )
        .required("La duración es requerida"),
      activity: Yup.string().required("La actividad es requerida"),
      company: Yup.string().required("La compañía es requerida"),
      capacity: Yup.number().required("La capacidad es requerida"),
    }),
  });

  return (
    <SingleFormContainer
      title={"Nueva orden de trabajo"}
      subtitle={"Ingrese la información sobre el trabajo a realizar"}
      handleSubmit={formik.handleSubmit}
    >
      <TextField
        fullWidth
        {...formik.getFieldProps("date")}
        helperText={formik.touched.date && formik.errors.date}
        error={formik.touched.date && Boolean(formik.errors.date)}
        label="Fecha"
        variant="standard"
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        fullWidth
        {...formik.getFieldProps("start_time")}
        helperText={formik.touched.start_time && formik.errors.start_time}
        error={formik.touched.start_time && Boolean(formik.errors.start_time)}
        label="Hora de inicio"
        variant="standard"
        type="time"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        fullWidth
        {...formik.getFieldProps("duration")}
        helperText={formik.touched.duration && formik.errors.duration}
        error={formik.touched.duration && Boolean(formik.errors.duration)}
        label="Duración"
        variant="standard"
        type="time"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        fullWidth
        {...formik.getFieldProps("activity")}
        helperText={formik.touched.activity && formik.errors.activity}
        error={formik.touched.activity && Boolean(formik.errors.activity)}
        label="Actividad"
        variant="standard"
      />
      <TextField
        fullWidth
        {...formik.getFieldProps("company")}
        helperText={formik.touched.company && formik.errors.company}
        error={formik.touched.company && Boolean(formik.errors.company)}
        label="Compañía"
        variant="standard"
      />
      <TextField
        fullWidth
        {...formik.getFieldProps("capacity")}
        helperText={formik.touched.capacity && formik.errors.capacity}
        error={formik.touched.capacity && Boolean(formik.errors.capacity)}
        label="Capacidad"
        variant="standard"
        type="number"
      />
      <Button
        variant="contained"
        type="submit"
        sx={{ background: colors.blueAccent[400] }}
      >
        Crear solicitud
      </Button>
    </SingleFormContainer>
  );
};

export default WorkOrderCreate;
