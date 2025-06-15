import { useEffect, useState } from "react";

// Fake data pour démo visuelle (remplace par fetch API)
const DUMMY_STATS = {
  total: 67,
  urgents: 8,
  ouverts: 15,
  resolus: 48,
  sla: 92, // pourcentage SLA atteint
  parMois: [12, 8, 7, 11, 9, 10, 10], // fake
};
const COLORS = ["#6C47FF", "#3b82f6", "#ff0040", "#22c55e", "#eab308", "#212155"];

export default function Admin() {
  const [user, setUser] = useState(null);
  // ...mets ici ton fetch réel de tickets/stats par API

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) window.location.href = "/login";
    else {
      const userObj = JSON.parse(u);
      if (userObj.role !== "Admin") {
        window.location.href = "/dashboard";
        return;
      }
      setUser(userObj);
    }
  }, []);

  if (!user) return <div>Chargement...</div>;

  // Demo stat (remplace par vraies stats)
  const stats = DUMMY_STATS;

  return (
    <div style={{ maxWidth: 1360, margin: "0 auto", padding: "40px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
        <div>
          <h2 style={{ color: "#6C47FF", fontWeight: 800, fontSize: 32 }}>🟣 Tableau de bord Admin</h2>
          <div style={{ color: "#212155", marginTop: 8 }}>Bienvenue sur l'interface pilotage ClaimOneOff</div>
        </div>
        <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} style={{
          background: "#fff", color: "#6C47FF", border: "1px solid #eee", padding: "10px 26px", borderRadius: 12,
          fontWeight: 700, fontSize: 16, boxShadow: "0 2px 10px #e0e0f5", cursor: "pointer"
        }}>Déconnexion</button>
      </div>

      {/* KPIs haut */}
      <div style={{ display: "flex", gap: 36, marginBottom: 38, flexWrap: "wrap" }}>
        <Stat kpi={stats.total} label="Tickets total" color="#6C47FF" />
        <Stat kpi={stats.urgents} label="Urgents" color="#ff0040" />
        <Stat kpi={stats.ouverts} label="Ouverts" color="#3b82f6" />
        <Stat kpi={stats.resolus} label="Résolus" color="#22c55e" />
        <Stat kpi={`${stats.sla}%`} label="SLA" color="#212155" />
      </div>

      {/* Graphiques : tickets/mois et statut */}
      <div style={{ display: "flex", gap: 36, marginBottom: 36, flexWrap: "wrap" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px #eee", flex: 1, minWidth: 380 }}>
          <h4 style={{ margin: 0, color: "#6C47FF" }}>Tickets par mois</h4>
          <BarChart data={stats.parMois} />
        </div>
        <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px #eee", flex: 1, minWidth: 380 }}>
          <h4 style={{ margin: 0, color: "#3b82f6" }}>Répartition Statuts</h4>
          <DonutChart data={[stats.urgents, stats.ouverts, stats.resolus]} labels={["Urgents", "Ouverts", "Résolus"]} />
        </div>
      </div>

      {/* Tableau tickets (mets ici ton tableau dynamique, ou je t’en fais un sur-mesure) */}
      <div style={{ marginTop: 40 }}>
        <h3 style={{ color: "#212155", marginBottom: 20 }}>Tickets récents</h3>
        <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 8px #eee", padding: 18 }}>
          {/* Ici place ton tableau dynamique existant, tu peux demander une version ultra design/tableau avancé, je livre ! */}
          <div style={{ textAlign: "center", color: "#999", fontSize: 18 }}>➡️ Tableau interactif tickets (filtres, search, etc. ici)</div>
        </div>
      </div>
    </div>
  );
}

function Stat({ kpi, label, color }) {
  return (
    <div className="card" style={{
      minWidth: 180, textAlign: "center", borderBottom: `5px solid ${color}`,
      borderRadius: 20, boxShadow: "0 2px 10px #e0e0f5", background: "#fff"
    }}>
      <div style={{ fontSize: 38, fontWeight: 800, color }}>{kpi}</div>
      <div style={{ color, fontWeight: 700, fontSize: 18 }}>{label}</div>
    </div>
  );
}

function BarChart({ data }) {
  // Un mini graphique barres stylisé
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "end", height: 88, gap: 16, marginTop: 18 }}>
      {data.map((val, i) => (
        <div key={i} style={{
          width: 32, height: `${(val / max) * 80 + 8}px`,
          background: COLORS[i % COLORS.length], borderRadius: 8, textAlign: "center",
          transition: "height 0.3s"
        }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{val}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data, labels }) {
  // Graphique donut simplifié (remplace par une vraie lib graphique si tu veux)
  const total = data.reduce((a, b) => a + b, 0) || 1;
  const percents = data.map(x => Math.round((x / total) * 100));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 18 }}>
      <svg width="80" height="80" viewBox="0 0 42 42" style={{ transform: "rotate(-90deg)" }}>
        {data.map((val, i) => {
          const r = 16, c = 2 * Math.PI * r;
          const offset = data.slice(0, i).reduce((acc, v) => acc + (v / total) * c, 0);
          return (
            <circle
              key={i}
              r={r}
              cx={21}
              cy={21}
              fill="transparent"
              stroke={COLORS[i % COLORS.length]}
              strokeWidth="6"
              strokeDasharray={`${(val / total) * c} ${c}`}
              strokeDashoffset={-offset}
            />
          );
        })}
      </svg>
      <div>
        {labels.map((lab, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 16, height: 16, borderRadius: 8, background: COLORS[i % COLORS.length], display: "inline-block"
            }} />
            <span style={{ fontWeight: 700, color: COLORS[i % COLORS.length] }}>{lab}</span>
            <span style={{ color: "#999", marginLeft: 2 }}>{data[i]} ({percents[i]}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
