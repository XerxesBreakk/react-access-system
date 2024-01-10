import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Box, Button, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";

import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { tokens } from "../../theme";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

const GET_WO_LIST_URL = "/work-order/";
const PUT_WO_APPROVE_URL = "/work-order/approve/";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const WorkOrderApprove = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //Navigate config
  const navigate = useNavigate();

  //OTs para aprobar
  const [ots, setOts] = useState([]);

  const axiosPrivate = useAxiosPrivate();

  //Load OTs
  useEffect(() => {
    const load_ots = async () => {
      try {
        const res = await axiosPrivate.get(
          GET_WO_LIST_URL + "?is_active=False"
        );
        console.log(res);
        setOts(res.data);
      } catch (err) {}
    };
    load_ots();
  }, [axiosPrivate]);

  // Handle Approve OTs
  const handleApprove = async (id) => {
    try {
      const res = await axiosPrivate.put(`${PUT_WO_APPROVE_URL}${id}/`);
      console.log(res);
      navigate("/work-order");
    } catch (error) {
      console.error(error);
      // TODO Handle errors here
    }
  };

  return (
    <Box sx={{ flexGrow: 1, m: "10px" }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xxs={12} xs={10}>
          <Item sx={{ backgroundColor: colors.primary[400] }}>
            <Header
              title="Ordenes por aprobar"
              subtitle="Apruebe las ordenes segun corresponda"
            />
            {ots.length > 0 ? (
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Solicitante</TableCell>
                    <TableCell align="right">Fecha</TableCell>
                    <TableCell align="right">Compañia</TableCell>
                    <TableCell align="right">Duracion</TableCell>
                    <TableCell align="right">Actividad</TableCell>
                    <TableCell align="right">Aprobar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ots.map((ot) => (
                    <TableRow
                      key={ot.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {ot.applicant_username}
                      </TableCell>
                      <TableCell align="right">{ot.date}</TableCell>
                      <TableCell align="right">{ot.company}</TableCell>
                      <TableCell align="right">{ot.duration}</TableCell>
                      <TableCell align="right">{ot.activity}</TableCell>
                      <TableCell align="right">
                        <Button
                          sx={{ backgroundColor: colors.greenAccent[600] }}
                          onClick={() => handleApprove(ot.id)}
                        >
                          Aprobar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <span>No hay ordenes por aprobar</span>
            )}
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WorkOrderApprove;
