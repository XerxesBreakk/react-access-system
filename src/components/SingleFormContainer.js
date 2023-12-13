import { Box, Paper, useTheme } from "@mui/material";

import Header from "./Header";
import { tokens } from "../../theme";

const SingleFormContainer = ({ title, subtitle, handleSubmit, children }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box display="flex" justifyContent="center" m="20px">
      <Paper
        elevation={3}
        style={{ padding: "10px", background: colors.primary[400] }}
      >
        <Header title={title} subtitle={subtitle} />
        <Box
          component="form"
          onSubmit={handleSubmit}
          my={"10px"}
          autoComplete="off"
        >
          {children}
        </Box>
      </Paper>
    </Box>
  );
};

export default SingleFormContainer;
