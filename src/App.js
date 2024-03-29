import { Routes, Route } from "react-router-dom";

//material ui imports
import { CssBaseline, ThemeProvider } from "@mui/material";

import { ColorModeContext, useMode } from "./theme";
import Topbar from "./scenes/global/Topbar";
import Login from "./scenes/login/index";
import RequireAuth from "./components/RequireAuth";
import UserCreate from "./scenes/users/userCreate";
import Users from "./scenes/users";
import WorkOrderCreate from "./scenes/workOrders/WorkOrderCreate";
import WorkOrder from "./scenes/workOrders";
import WorkOrderApprove from "./scenes/workOrders/WorkOrderApprove";
import UserActivate from "./scenes/users/UserActivate";
import UserEdit from "./scenes/users/UserEdit";
import WorkOrderDetail from "./scenes/workOrders/WorkOrderDetail";

/* 
import Dashboard from "./scenes/dashboard";
*/

function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/activate" element={<UserActivate />} />
              <Route element={<RequireAuth />}>
                <Route path="/users" element={<Users />} />
                <Route path="/users/create" element={<UserCreate />} />
                <Route path="/users/me" element={<UserEdit />} />
                <Route path="/work-order" element={<WorkOrder />} />
                <Route path="/work-order/detail" element={<WorkOrderDetail />} />
                <Route
                  path="/work-order/create"
                  element={<WorkOrderCreate />}
                />
                <Route
                  path="/work-order/approve"
                  element={<WorkOrderApprove />}
                />
                {/* 
                <Route path="/dash" element={<Dashboard />} />
              */}
              </Route>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
