// pages/login.js
import { useState } from "react"
import { useRouter } from "next/router"
import { apiCall } from "../utils/api"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg("Connexion en cours…")
    try {
      const data = await apiCall("login", { email, password })
      if (data.status === "success") {
        // stockez l’ID utilisateur / token si besoin
        // localStorage.setItem("user", JSON.stringify(data))
        router.push("/dashboard")
      } else {
        setMsg(data.message)
      }
    } catch (err) {
      setMsg("Erreur réseau, réessayez.")
    }
  }

  return (
    <div className="container mt-5">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Mot de passe</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary">Se connecter</button>
      </form>
      {msg && <div className="mt-3 alert alert-info">{msg}</div>}
    </div>
  )
}

