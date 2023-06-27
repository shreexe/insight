import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../contexts/user/user.provider'
import LogoutIcon from './atomic/logout-icon'

const Profile = () => {
  const {user, setUser} = useContext(UserContext)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  
  const logout = () => {
    localStorage.removeItem("authUser")
    setUser(null)
  }

  return (
    <div onClick={()=>setShowProfileMenu(!showProfileMenu)} className="h-full flex justify-center items-center">
        <span className=' text-sm text-gray-600 font-medium cursor-pointer hover:text-black'>
            {user.name.split(" ")[0]}
        </span>
        {
            showProfileMenu &&
            <div className="absolute top-full right-0 w-32 border border-solid border-gray-300 rounded-md bg-white">
                <div onClick={()=>{logout()}} className="w-full px-5 h-10 flex justify-start items-center text-sm text-gray-600 font-medium cursor-pointer hover:text-black">
                    <span>
                        <LogoutIcon/>
                    </span>
                    <span className='ml-1'>
                        Logout
                    </span>
                </div>
            </div>
        }
    </div>
  )
}

export default Profile