import { Box, IconButton, useTheme } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Tooltip from "@mui/material/Tooltip";

import { useContext, useEffect, useState } from "react";

import { ColorModeContext } from "../../theme";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

/*
 */

const GET_USER_URL = "/auth/users/me/";

const Topbar = () => {
  const theme = useTheme();

  //toggle dark mode
  const colorMode = useContext(ColorModeContext);

  const { state, user_loaded_success, login_fail } = useAuth();

  //Navigate config
  const navigate = useNavigate();

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
  }, [state, axiosPrivate, user_loaded_success, login_fail]);

  //User Management menu
  const [anchorUser, setAnchorUser] = useState(null);
  const openUser = Boolean(anchorUser);

  //OT Management menu
  const [anchorOT, setAnchorOT] = useState(null);
  const openOT = Boolean(anchorOT);

  //User Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event, setAnchor) => {
    setAnchor(event.currentTarget);
  }

  const handleCloseMenu = (setAnchor) => {
    setAnchor(null);
  }

  const handleCloseLogout = () => {
    setAnchorEl(null);
    login_fail();
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
    >
      {/* LOGO */}
      <Box display="flex" alignContent={"center"} borderRadius="3px">
        <IconButton size="small" aria-label="logo">
          <LockPersonIcon />
          Sistema de acceso
        </IconButton>
      </Box>
      {/* Nav */}
      {state.is_authenticated ? (
        <Box display="flex">
          {state.user?.is_staff ? (
            <>
              <Tooltip title="Administrador de usuarios">
                <IconButton
                  aria-controls={openUser ? "users-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openUser ? true : undefined}
                  onClick={(event) => handleMenuClick(event, setAnchorUser)}
                >
                  <ManageAccountsIcon />
                </IconButton>
              </Tooltip>
              <Menu
                id="users-menu"
                anchorEl={anchorUser}
                open={openUser}
                onClose={() => handleCloseMenu(setAnchorUser)}
                MenuListProps={{
                  "aria-labelledby": "users-button",
                }}
              >
                <MenuItem onClick={() => navigate("/users")}>Lista usuarios</MenuItem>
                <MenuItem onClick={() => navigate("/users/create")}>
                  Crear usuarios
                </MenuItem>
              </Menu>
            </>
          ) : null}
          <Tooltip title="Ordenes de trabajo">
            <IconButton
              aria-controls={openOT ? "ot-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openOT ? true : undefined}
              onClick={(event) => handleMenuClick(event, setAnchorOT)}
            >
              <CalendarMonthIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="ot-menu"
            anchorEl={anchorOT}
            open={openOT}
            onClose={() => handleCloseMenu(setAnchorOT)}
            MenuListProps={{
              "aria-labelledby": "ot-button",
            }}
          >
            <MenuItem onClick={() => navigate("/work-order")}>Ver orden de trabajo</MenuItem>
            <MenuItem onClick={() => navigate("/work-order/create")}>
              Crear orden de trabajo
            </MenuItem>
            <MenuItem onClick={() => navigate("/work-order/approve")}>
              Aprobar OTs
            </MenuItem>
          </Menu>
        </Box>
      ) : null}
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
              aria-expanded={open ? true : undefined}
              onClick={(event) => handleMenuClick(event, setAnchorEl)}
            >
              <PersonOutlinedIcon />
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={() => handleCloseMenu(setAnchorEl)}
              MenuListProps={{
                "aria-labelledby": "user-button",
              }}
            >
              <MenuItem onClick={() => navigate("/users/me")}>Perfil</MenuItem>
              <MenuItem onClick={handleCloseLogout}>Cerrar sesion</MenuItem>
            </Menu>
          </>
        ) : null}
      </Box>
    </Box>
  );
};

export default Topbar;
