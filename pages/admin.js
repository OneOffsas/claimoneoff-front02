// pages/admin.js
import { useEffect, useState } from "react"
import { apiCall } from "../utils/api"       // ← camelCase correct
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts"

export default function AdminDashboard() {
  const [stats, setStats] = useState([])

  useEffect(() => {
    apiCall("getTickets", {}).then(r => {
      if (r.status === "success") {
        const count = {}
        r.tickets.forEach(t => {
          count[t.statut] = (count[t.statut] || 0) + 1
        })
        setStats(Object.entries(count).map(([name, value]) => ({ name, value })))
      }
    })
  }, [])

  return (
    <div>
      <h1 className="mb-4">Dashboard Admin</h1>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={stats}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#0d6efd" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

