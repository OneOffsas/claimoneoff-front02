import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

export default function AdminCharts({ byStatut, byDay }) {
  const COLORS = ['#6457C6', '#0097A7', '#C62828', '#FFD600', '#6C757D'];

  return (
    <div className="row mb-4">
      <div className="col-md-6 mb-4">
        <div className="card p-3 shadow">
          <h6 className="mb-3">Répartition par statut</h6>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={byStatut}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {byStatut.map((entry, idx) => (
                  <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card p-3 shadow">
          <h6 className="mb-3">Evolution des tickets</h6>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Tickets" fill="#6457C6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
