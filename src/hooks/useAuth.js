import { useContext, useDebugValue } from "react";
import {AuthContext} from "../context/AuthProvider";

const useAuth = () => {
    const { state } = useContext(AuthContext);
    useDebugValue(state, state => state?.user ? "Logged In" : "Logged Out")
    return useContext(AuthContext);
}

export default useAuth;