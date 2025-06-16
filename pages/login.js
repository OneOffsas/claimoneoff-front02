// pages/login.js
import { useState } from "react"
import { useRouter } from "next/router"
import { apiCall } from "../utils/api"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg("Connexion…")
    const data = await apiCall("login", { email, password })
    if (data.status === "success") {
      // ici vous pouvez stocker user dans cookie/localStorage
      router.push("/dashboard")
    } else {
      setMsg(data.message)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-gradient">
      <div className="card p-4 shadow w-100" style={{maxWidth: 400}}>
        <h2 className="mb-4 text-center">Se connecter</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email}
              onChange={e=>setEmail(e.target.value)} required/>
          </div>
          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input type="password" className="form-control" value={password}
              onChange={e=>setPassword(e.target.value)} required/>
          </div>
          <button className="btn btn-primary w-100">Connexion</button>
        </form>
        {msg && <div className="alert alert-warning mt-3">{msg}</div>}
        <div className="text-center mt-2">
          <Link href="/register"><a>Créer un compte</a></Link> • 
          <Link href="/forgot"><a>Mot de passe oublié</a></Link>
        </div>
      </div>
    </div>
  )
}

