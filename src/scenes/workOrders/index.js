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

const GET_WO_LIST_URL = "/work-order/";

//Headers de la tabla
const columns = [
  {
    field: "datetime", headerName: "Inicio trabajos", width: 140, valueFormatter: (params) => {
      // Formatea la fecha
      const date = new Date(params.value);
      return date.toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    field: "duration",
    headerName: "Duracion",
    width: 100,
    editable: false,
  },
  {
    field: "id",
    headerName: "id",
    width: 100,
    editable: false,
  },
  {
    field: "activity",
    headerName: "Actividad",
    width: 120,
    editable: false,
  },
  {
    field: "company",
    headerName: "Compañia",
    width: 100,
    editable: false,
  },
  {
    field: "capacity",
    headerName: "Aforo",
    type: "number",
    width: 50,
    editable: false,
  },
  {
    field: "applicant_username",
    headerName: "Solicitante",
    width: 90,
    editable: false,
  },
  {
    field: "pin",
    headerName: "PIN",
    width: 70,
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
  }
];

const Index = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //datos usuarios
  const [ordenes, setOrdenes] = useState([]);

  //axios
  const axiosPrivate = useAxiosPrivate();

  //Load users table
  useEffect(() => {
    const load_users = async () => {
      try {
        const response = await axiosPrivate.get(GET_WO_LIST_URL);
        setOrdenes(response.data);
      } catch (error) {
        setOrdenes([]);
      }
    };
    load_users();
  }, [axiosPrivate]);
  return (
    <Box display="flex" justifyContent="center" m="10px">
      <Paper
        elevation={4}
        style={{ padding: "10px", background: colors.primary[400] }}
        sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        <Header
          title={"Tabla de ordenes de trabajo"}
          subtitle={"Interfaz de administracion de usuarios"}
        ></Header>
        <DataGrid
          rows={ordenes}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          getRowId={(row) => row.id}
          /* checkboxSelection */
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
          to="/work-order/create"
          startIcon={<AddIcon />}
        >
          Nueva orden de trabajo
        </Button>
      </Paper>
    </Box>
  );
};

export default Index;
