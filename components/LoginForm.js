import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Connexion en cours...");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.status === "success") {
      setMsg("Connexion réussie !");
    } else {
      setMsg("Erreur : " + (data.error || JSON.stringify(data)));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        placeholder="Mot de passe"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Se connecter</button>
      <div style={{ marginTop: 10, color: "red" }}>{msg}</div>
    </form>
  );
}
