import Link from "next/link"
import Profile from "./profile"

const NavBar = ({user}) => {
  return (
    <div className="w-full h-[60px] fixed top-0 px-5 md:px-10 flex justify-between items-center z-50 bg-[hsla(0,0%,100%,0)] border-b border-solid border-b-gray-200 bg-slate-300">
        <div className="text-xl font-semibold text-gray-700 hover:scale-110">
           
            <Link href='/'>
             Insight
             </Link>
        </div>
        <div className="relative h-full">
          {
            (user !== null)?
            <Profile/>
            :
            <Link href={"/login"} className="h-full flex justify-center items-center text-sm text-gray-600 font-medium cursor-pointer hover:text-black hover:underline hover:scale-110">
              Login
            </Link>
          }
        </div>
    </div>
  )
}

export default NavBar