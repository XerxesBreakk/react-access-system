import { Box, IconButton, useTheme } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { useContext, useEffect, useState } from "react";

import { ColorModeContext, tokens } from "../../theme";
import useAxiosPrivate from "../../hooks/useAxiosPrivate"; 
import useAuth from "../../hooks/useAuth";

/* 
*/

const GET_USER_URL = "/auth/users/me/";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { state, user_loaded_success, login_fail } = useAuth();

  //Axios Private
  const axiosPrivate = useAxiosPrivate();

  //Load user
  useEffect(() => {
    const load_user = async () => {
      const response = await axiosPrivate.get(GET_USER_URL);
      console.log(response.data);
      user_loaded_success(response.data);
    };
    if (state.is_authenticated && !state.user) {
      try {
        load_user();
      } catch (error) {
        login_fail();
      }
    }
  }, [state,axiosPrivate,user_loaded_success,login_fail]);

  //User Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseLogout = () => {
    setAnchorEl(null);
    login_fail();
  };

  return (
    <Box display="flex" sx={{backgroundColor: colors.primary[400]}}  justifyContent="space-between" p={2}>
      {/* LOGO */}
      <Box display="flex" alignContent={"center"} borderRadius="3px">
        <IconButton
          size="small"
          aria-label="logo"
        >
          <LockPersonIcon />
         Sistema de acceso
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        {state.is_authenticated ? (
          <>
            <IconButton
              aria-controls={open ? "user-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <PersonOutlinedIcon />
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "user-button",
              }}
            >
              <MenuItem onClick={handleClose}>Perfil</MenuItem>
              <MenuItem onClick={handleCloseLogout}>Cerrar sesion</MenuItem>
            </Menu>
          </>
        ) : null}
      </Box>
    </Box>
  );
};

export default Topbar;
