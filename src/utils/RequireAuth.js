import React, { Children, useContext,  useState } from 'react'
import UserInfo from './Authorization/UserInfo'

export const RequireAuth = ({allowedRoles, permissions, children}) => {  
    const userData = UserInfo()

    // var is_allowed = userData?.role?.some(allowed_role => allowedRoles?.includes(allowed_role))

    var is_allowed = allowedRoles?.includes(userData?.role)

    // var has_perm = permissions?.includes(userData?.permissions)
    var has_perm = permissions.some(perm => userData?.permissions?.includes(perm))

    if (is_allowed && has_perm){
      return(children)
    }
    else{
      return <h1> You do not have enough permissions ! </h1>
    }
  }

