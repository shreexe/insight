import { useContext } from "react"
import NavBar from "../components/navbar"
import { UserContext } from "../contexts/user/user.provider"

const Layout = ({children}) => {
  const {user} = useContext(UserContext)
  return (
    <div className="w-screen h-fit max-w-full overflow-hidden">
        <NavBar user={user}/>
        <div className="w-full h-fit px-5 md:px-10 box-border">
          {children}
        </div>
    </div>
  )
}

export default Layout