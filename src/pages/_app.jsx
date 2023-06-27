import { Toaster } from "react-hot-toast"
import { UserProvider } from "../contexts/user/user.provider"
import "../styles/globals.css"

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Toaster position="bottom-center" reverseOrder={false} />         
      <Component {...pageProps} />
    </UserProvider>
  )
}