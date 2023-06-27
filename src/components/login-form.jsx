import React, { useContext, useEffect, useState } from 'react'
import toast from "react-hot-toast";
import { UserContext } from '../contexts/user/user.provider';
import router from 'next/router';
import Link from 'next/link';
import { DEPLOY_LOGIN_URL, OAUTH_CONTINUE_URL, OAUTH_INIT_URL } from '../helpers/constants';

/*
  LOGIN FLOW:
    INIT:
      Step 1: Use "/oauth/google/init" (which requires redirect_uri) endpoint to get authUrl. 
              This endpoint is responsible for sending the user off to a Google webpage to authenticate. Once complete, the user will be redirected to where this request was initiated.
      Step 2: Redirect to the authUrl, where user can select their google account and the user will be redirected to the "redirect_uri" (i.e., our login page), where "code" will be added to the URL as a parameter.
      Step 3: Save the "code" from the URL in the localStorage and remove the "code" param from the URL.
    
    CONTINUE
      Step 4: Use "/oauth/google/continue" (which requires code and redirect_uri) endpoint to get User data in the format of {"token": string, "name": string, "email": string}. 
              This endpoint handles both login and signup depending on the state of the user account.
*/

const LoginForm = () => {
  const {user, setUser} = useContext(UserContext)

  const login = async () => {
    // TODO: use the authCode, if available, instead of initiating again
    var fetchURL = new URL(`${OAUTH_INIT_URL}`)
    fetchURL.searchParams.set('redirect_uri', `${DEPLOY_LOGIN_URL}`)
    fetchURL = fetchURL.toString()
    
    await fetch(fetchURL, {
      method: 'GET',
    })
    .then(res => res.json())
    .then((data)=>{
      router.push(data.authUrl)
      if(!data.success){
        toast.error("Authentication Failed");
        setUser(null);
      }
    })
  }

  const getUser = async () => {
    
    const token_localStorage = JSON.parse(localStorage.getItem('authCode'));
    var fetchURL = new URL(`${OAUTH_CONTINUE_URL}`)
    fetchURL.searchParams.set('code',`${token_localStorage}`)
    fetchURL.searchParams.set('redirect_uri',`${DEPLOY_LOGIN_URL}`)
    fetchURL = fetchURL.toString();
    
    await fetch(fetchURL, {
      method: 'GET',
    })
    .then(res => res.json())
    .then((data)=>{
      setUser(data)
      localStorage.setItem("authUser", JSON.stringify(data))
    })
  }  

  useEffect(() => {
    
      const queryParameters = new URLSearchParams(window.location.search)
      const code = queryParameters.get("code")
      if(code !== null){
        queryParameters.delete("code")
        localStorage.setItem('authCode', JSON.stringify(code))
        getUser();
        router.push("/");
      }
  }, [])

  return (
  
    <div className="w-11/12 md:w-4/5 h-[70%] min-w-300 max-w-md flex flex-col justify-evenly items-center rounded-lg border border-solid border-gray-400" >
        <div className="text-center text-21px font-bold text-4xl text-slate-600">
            Login
        </div>
        <div className='w-2/3 h-10 flex flex-col justify-center items-center pb-20'>
          <button onClick={login} className={`w-full px-3 py-2 rounded-md text-white font-semibold bg-blue-500 hover:bg-blue-700 hover:scale-110`}>Login with Google</button>
          <Link href={"/"} className="mt-4 text-xs text-blue-500 underline underline-offset-2 cursor-pointer hover:scale-125">
            Go to home page
          </Link>
        </div>
    </div>
    
  )
}

export default LoginForm