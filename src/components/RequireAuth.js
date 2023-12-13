import React from 'react'
import useAuth from '../hooks/useAuth'
import { Outlet } from 'react-router-dom';
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = () => {
    const {state}= useAuth();
    const location=useLocation();
  return (
    state.is_authenticated
        ?<Outlet/>
        : <Navigate to='/login' state={{from:location}} replace />
  )
}

export default RequireAuth