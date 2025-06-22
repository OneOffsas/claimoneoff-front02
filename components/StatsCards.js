import React from "react";

export default function StatsCards({ stats }) {
  return (
    <div className="row mb-4">
      <div className="col">
        <div className="card text-center shadow">
          <div className="card-body">
            <h4 className="card-title">{stats.total}</h4>
            <p className="card-text">Tickets Total</p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card text-center shadow">
          <div className="card-body">
            <h4 className="card-title">{stats.ouvert}</h4>
            <p className="card-text">Ouverts</p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card text-center shadow">
          <div className="card-body">
            <h4 className="card-title">{stats.resolu}</h4>
            <p className="card-text">Résolus</p>
          </div>
        </div>
      </div>
      {/* Ajoute d'autres KPIs ici */}
    </div>
  );
}

