// pages/register.js
import { useState } from "react"
import { useRouter } from "next/router"
import { apiCall } from "../utils/api"
import Link from "next/link"

export default function Register() {
  const [form, setForm] = useState({ societe:"", nom:"", prenom:"", email:"", password:"" })
  const [msg, setMsg] = useState("")
  const router = useRouter()

  async function submit(e) {
    e.preventDefault()
    setMsg("Inscription…")
    const data = await apiCall("register", form)
    if (data.status==="success") {
      setMsg("Compte créé ! Redirection…")
      setTimeout(()=>router.push("/login"),1000)
    } else {
      setMsg(data.message)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-gradient">
      <div className="card p-4 shadow w-100" style={{maxWidth: 400}}>
        <h2 className="mb-4 text-center">Créer un compte</h2>
        <form onSubmit={submit}>
          {["societe","nom","prenom","email","password"].map((k,i)=>(
            <div key={k} className="mb-3">
              <label className="form-label">{k.charAt(0).toUpperCase()+k.slice(1)}</label>
              <input
                type={k==="email"?"email":k==="password"?"password":"text"}
                className="form-control"
                value={form[k]}
                onChange={e=>setForm({...form,[k]:e.target.value})}
                required
              />
            </div>
          ))}
          <button className="btn btn-success w-100">Créer mon compte</button>
        </form>
        {msg && <div className="alert alert-info mt-3">{msg}</div>}
        <p className="text-center mt-2">
          <Link href="/login"><a>Déjà inscrit ?</a></Link>
        </p>
      </div>
    </div>
  )
}
