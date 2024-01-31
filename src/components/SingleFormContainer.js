import { Alert, Box, Paper, Stack, useTheme } from "@mui/material";

import Header from "./Header";
import { tokens } from "../theme";

const SingleFormContainer = ({
  title,
  subtitle,
  handleSubmit,
  errMsg,
  errMsgHandler,
  children,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box display="flex" justifyContent="center" m="20px">
      <Paper
        elevation={3}
        sx={{
          padding: "10px",
          background: colors.primary[400],
          width: { xs: "80%", sm: "70%", md: "40%" },
        }}
      >
        <Header title={title} subtitle={subtitle} />

        {errMsg.errors ? (<Alert severity={errMsg.type} sx={{ marginBottom: "10px" }} onClose={()=> errMsgHandler({
          errors: false,
          type: "warning",
          data: {},
        })}>
          {Object.entries(errMsg.data).map(([key, value]) => (
            <>
              <strong>{key}:</strong> {value}
            </>
          ))}
        </Alert>) : null}
        <Stack
          component="form"
          onSubmit={handleSubmit}
          autoComplete="off"
          gap={3}
        >
          {children}
        </Stack>
      </Paper>
    </Box>
  );
};

export default SingleFormContainer;