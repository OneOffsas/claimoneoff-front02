// pages/dashboard.js
import { useEffect, useState } from "react"
import { apiCall } from "../utils/api"

export default function Dashboard() {
  const [tickets, setTickets] = useState([])

  useEffect(()=>{
    apiCall("getTickets", {})
      .then(r=>{ if(r.status==="success") setTickets(r.tickets) })
  },[])

  return (
    <div>
      <h1>Mes tickets</h1>
      {tickets.length===0
        ? <p>Aucun ticket</p>
        : <table className="table">
            <thead>
              <tr><th>ID</th><th>Ouvert</th><th>Statut</th><th>Objet</th></tr>
            </thead>
            <tbody>
              {tickets.map(t=>(
                <tr key={t.id_ticket}>
                  <td>{t.id_ticket}</td>
                  <td>{t.date_ouverture}</td>
                  <td>{t.statut}</td>
                  <td>{t.problematique}</td>
                </tr>
              ))}
            </tbody>
          </table>
      }
    </div>
  )
}
