import { Badge, Box, Button, Paper, useTheme } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from "@mui/x-data-grid";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import { tokens } from "../../theme";
import Header from "../../components/Header";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Get_USER_LIST_URL = "/auth/users/";

//Headers de la tabla
const columns = [
  { field: "username", headerName: "Usuario", width: 100 },
  {
    field: "first_name",
    headerName: "Nombre",
    width: 120,
    editable: false,
  },
  {
    field: "last_name",
    headerName: "Apellidos",
    width: 150,
    editable: false,
  },
  {
    field: "email",
    headerName: "correo electronico",
    type: "number",
    width: 180,
    editable: false,
  },
  {
    field: "is_active",
    headerName: "activo",
    width: 60,
    renderCell: (params) => (
      <Badge color={params.value ? 'success' : 'error'} badgeContent={params.value ? <CheckCircleIcon /> : <CancelIcon />}>
      </Badge>
    )
  },
  {
    field: "is_staff",
    headerName: "Admin",
    width: 60,
    renderCell: (params) => (
      <Badge color={params.value ? 'success' : 'error'} sx={{textAlign:"center"}} badgeContent={params.value ? <CheckCircleIcon /> : <CancelIcon />}>
      </Badge>
    )
  },
];

const Index = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //datos usuarios
  const [usuarios, setUsuarios] = useState([]);

  //axios
  const axiosPrivate = useAxiosPrivate();

  //Load users table
  useEffect(() => {
    const load_users = async () => {
      try {
        const response = await axiosPrivate.get(Get_USER_LIST_URL);
        console.log(response); //DELETE
        setUsuarios(response.data);
      } catch (error) {
        console.log(error); //DELETE
        setUsuarios([]);
      }
    };
    load_users();
  }, [axiosPrivate]);
  return (
    <Box display="flex" justifyContent="center" m="10px">
      <Paper
        elevation={4}
        style={{ padding: "10px", background: colors.primary[400] }}
        sx={{display:'flex',flexDirection:'column',gap:'10px'}}
      >
        <Header
          title={"Tabla de usuarios"}
          subtitle={"Interfaz de administracion de usuarios"}
        ></Header>
        <DataGrid
          rows={usuarios}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          getRowId={(row) => row.username}
          checkboxSelection
          disableRowSelectionOnClick
        />
        <Button
          variant="outlined"
          sx={{
            backgroundColor: colors.blueAccent[400],
            color: theme.palette.getContrastText(colors.blueAccent[400]),
            "&:hover": {
              backgroundColor: colors.blueAccent[700],
            },
          }}
          component={Link}
          to="/users/create"
          startIcon={<AddIcon />}
        >
          Nuevo usuario
        </Button>
      </Paper>
    </Box>
  );
};

export default Index;
