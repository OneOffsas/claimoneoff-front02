import { Card } from "react-bootstrap";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const colors = ["#6842d9","#f69a22","#28c86c","#ff3b6b","#3b328a"];

export default function StatsCards({ stats }) {
  // stats = { total, ouverts, resolus, enCours, parTransporteur: { ... } }
  return (
    <div className="row g-4 mb-4">
      <div className="col-md-3">
        <div className="card text-center p-4">
          <h6>Total tickets</h6>
          <div className="display-6">{stats.total || 0}</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card text-center p-4">
          <h6>Tickets ouverts</h6>
          <div className="display-6 text-warning">{stats.ouverts || 0}</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card text-center p-4">
          <h6>Tickets résolus</h6>
          <div className="display-6 text-success">{stats.resolus || 0}</div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card text-center p-4">
          <h6>Tickets en cours</h6>
          <div className="display-6 text-info">{stats.enCours || 0}</div>
        </div>
      </div>
      <div className="col-md-12">
        <div className="card p-3">
          <h6 className="mb-2">Répartition par transporteur</h6>
          <div style={{width:"100%",height:220}}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={stats.parTransporteur || []} dataKey="value" nameKey="name" outerRadius={80}>
                  {(stats.parTransporteur || []).map((entry, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
