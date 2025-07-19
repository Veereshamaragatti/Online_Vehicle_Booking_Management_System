import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export const AdminAuthContext = createContext();

export const AdminAuthContextProvider = ({ children }) => {
    const [CurrentAdmin, setCurrentAdmin] = useState(JSON.parse(localStorage.getItem("admin")) || null)

    const AdminLogin = async (AdminInfo) => {
        const res = await axios.post("http://localhost:5000/AdminLogin", AdminInfo);
        setCurrentAdmin(res.data);
    }

    const AdminLogout = async () => {
        try {
            await axios.post("http://localhost:5000/AdminLogout", {});
            setCurrentAdmin(null);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                return <Navigate to="/AdminLogin" />;
              } else {
                console.log(error)
              }
        }
        
    }

    useEffect(() => {
        localStorage.setItem("admin", JSON.stringify(CurrentAdmin));
    }, [CurrentAdmin]);

    const ProtectedAdminRoute = ({ element }) => {
        if (!CurrentAdmin) {
            return <Navigate to="/AdminLogin" />;
        }
        return element;
    };

    return(
        <AdminAuthContext.Provider value={{ CurrentAdmin, AdminLogin, AdminLogout, ProtectedAdminRoute }}>{children}</AdminAuthContext.Provider>
    )
}
