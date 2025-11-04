import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    navigate("/customers", { state: { name } });
  }

  return (
    <div>
      <h1>Bem-vindo</h1>
      <p>Insira seu nome para continuar:</p>
      <form onSubmit={onSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
        />
        <button type="submit" disabled={!name.trim()}>
          Entrar
        </button>
      </form>
    </div>
  );
}
