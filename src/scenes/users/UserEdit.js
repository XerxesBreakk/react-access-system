import { useTheme } from "@mui/material";
import React from "react";
import { tokens } from "../../theme";
import { useFormik } from "formik";

const UserEdit = () => {
  const theme = useTheme;
  const colors = tokens(theme.palette.mode);


  //Formik Configuration
  const formik= useFormik({
    initialValues: {
        
    }
  })
  return <div>UserEdit</div>;
};

export default UserEdit;
