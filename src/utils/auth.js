import { createContext, useContext, useState } from "react";
import PERMISSIONS from "./Authorization/Permissions"


export const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState({});

    const login = user => {
        var user_id = user.pk
        var user_name = user.username
        var f_name = user.first_name
        var m_name = user.middle_name
        var l_name = user.last_name
        var u_email = user.email
        var u_mobile = user.mobile
        var u_master_role = user.master_role.master_role
        var u_role = user.role.role_name
        var u_perm = user.permissions
        var join_date = user.joined_date
        var modify_date = user.update_date
        var is_active = user.is_active
        var is_staff = user.is_staff

        setUser({ pk: user_id, username: user_name, first_name: f_name, 
            middle_name: m_name, last_name: l_name, master_role: u_master_role, role:u_role, permissions: u_perm, email: u_email, mobile: u_mobile, joining_data: join_date, profile_update_date: modify_date, is_active: is_active, is_staff: is_staff  
          })
      
    };

    // Logout updates the user data to default
    const logout = () => {
        setUser(null)
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext)
}
