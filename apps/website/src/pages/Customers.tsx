import { useEffect, useMemo, useState } from "react";
import type { Customer } from "@teddy/core";
import {
  createCustomer,
  deleteCustomer,
  listCustomers,
  updateCustomer,
} from "../api/client.js";
import { useLocation, useNavigate } from "react-router-dom";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const location = useLocation();
  const navigate = useNavigate();

  const userName = location.state?.name;

  useEffect(() => {
    (async () => {
      try {
        const data = await listCustomers();
        setCustomers(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onCreate() {
    const payload = {
      name: form.name.trim(),
      email: form.email || undefined,
      phone: form.phone || undefined,
    };
    if (!payload.name) return;
    const created = await createCustomer(payload);
    setCustomers((prev) => [created, ...prev]);
    setForm({ name: "", email: "", phone: "" });
  }

  async function onUpdate(c: Customer) {
    const name = prompt("Novo nome", c.name) || c.name;
    const updated = await updateCustomer(c.id, { name });
    setCustomers((prev) => prev.map((x) => (x.id === c.id ? updated : x)));
  }

  async function onDelete(c: Customer) {
    if (!confirm(`Excluir ${c.name}?`)) return;
    await deleteCustomer(c.id);
    setCustomers((prev) => prev.filter((x) => x.id !== c.id));
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      copy.delete(c.id);
      return copy;
    });
  }

  const selected = useMemo(
    () => customers.filter((c) => selectedIds.has(c.id)),
    [customers, selectedIds]
  );

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Clientes {userName ? `(Olá, ${userName})` : null}</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Telefone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button onClick={onCreate} disabled={!form.name.trim()}>
          Cadastrar
        </button>
        <button
          onClick={() => navigate("/selected", { state: { selected } })}
          disabled={selected.length === 0}
        >
          Ver selecionados ({selected.length})
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th></th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.has(c.id)}
                  onChange={(e) => {
                    setSelectedIds((prev) => {
                      const copy = new Set(prev);
                      if (e.target.checked) copy.add(c.id);
                      else copy.delete(c.id);
                      return copy;
                    });
                  }}
                />
              </td>
              <td>{c.name}</td>
              <td>{c.email || "-"}</td>
              <td>{c.phone || "-"}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <button onClick={() => onUpdate(c)}>Editar</button>
                <button onClick={() => onDelete(c)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
