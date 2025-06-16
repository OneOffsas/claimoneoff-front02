// pages/dashboard.js
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { Card, Spinner } from 'react-bootstrap';

export default function Dashboard({ user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tickets')
      .then(res => res.json())
      .then(data => {
        setTickets(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Layout user={user}><Spinner animation="border" /></Layout>;

  const total = tickets.length;
  const enAttente = tickets.filter(t => t.status === 'En attente').length;
  const resolus = tickets.filter(t => t.status === 'Résolu').length;

  const dataStatut = [
    { name: 'En attente', value: enAttente },
    { name: 'Résolu', value: resolus },
  ];

  const dataTypes = tickets.reduce((acc, ticket) => {
    acc[ticket.type] = acc[ticket.type] ? acc[ticket.type] + 1 : 1;
    return acc;
  }, {});

  const dataGraph = Object.entries(dataTypes).map(([type, count]) => ({
    name: type,
    count,
  }));

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00c49f'];

  return (
    <Layout user={user}>
      <div className="container py-4">
        <h2 className="mb-4">📊 Tableau de bord</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <Card className="shadow p-3 text-center">
              <h4>Total Tickets</h4>
              <p className="fs-2 fw-bold">{total}</p>
            </Card>
          </div>
          <div className="col-md-4">
            <Card className="shadow p-3 text-center">
              <h4>En attente</h4>
              <p className="fs-2 text-warning fw-bold">{enAttente}</p>
            </Card>
          </div>
          <div className="col-md-4">
            <Card className="shadow
