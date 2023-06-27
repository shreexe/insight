import LoginForm from "../components/login-form"

function Login() {
  return (
    <div className="w-screen h-screen bg-slate-300">
        <div className="w-full lg:w-7/12 max-w-5xl h-full float-right flex justify-center items-center bg-white">
            <LoginForm/>
        </div>
    </div>
  )
}

export default Login