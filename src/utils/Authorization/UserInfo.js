import React, { useEffect, useState } from 'react'
import { useAuth } from '../auth'
import PERMISSIONS from './Permissions'

const UserInfo = () =>  {
    const auth_user = useAuth()
    const local_user = JSON.parse(localStorage.getItem("user"))
    const local_key = localStorage.getItem("authToken")
    const [user_data, set_user_data] = useState({})

    useEffect(() => {
      if (Object.keys(auth_user.user).length === 0)
      {
        if (local_key && local_user){
          var pk = local_user.pk
          var user_name = local_user.username
          var f_name = local_user.first_name
          var m_name = local_user.middle_name
          var l_name = local_user.last_name
          var u_email = local_user.email
          var u_mobile = local_user.mobile
          var u_master_role = local_user.master_role.master_role
          var u_role = local_user.role.role_name
          var u_perm = local_user.permissions
          var join_date = local_user.joined_date
          var modify_date = local_user.update_date
          var is_active = local_user.is_active
          var is_staff = local_user.is_staff

          set_user_data({ pk: pk, username: user_name, first_name: f_name, 
            middle_name: m_name, last_name: l_name, master_role: u_master_role, 
            role:u_role, permissions: u_perm, email: u_email, mobile: u_mobile, joining_data: join_date,
            profile_update_date: modify_date, is_active: is_active,
            is_staff: is_staff  
          })
        
        }    
      }
    else{
        set_user_data(auth_user.user)
    }      
    },[])
  
    return user_data

}
export default UserInfo