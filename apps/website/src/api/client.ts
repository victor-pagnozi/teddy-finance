import type { Customer } from "@teddy/core";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function listCustomers(): Promise<Customer[]> {
  const res = await fetch(`${API_URL}/customers`);
  if (!res.ok) throw new Error("Falha ao carregar clientes");
  const data = await res.json();
  return data;
}

export async function createCustomer(
  input: Pick<Customer, "name" | "email" | "phone" | "salary" | "company">
) {
  const res = await fetch(`${API_URL}/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Falha ao criar cliente");
  return res.json();
}

export async function updateCustomer(
  id: string,
  input: Partial<
    Pick<Customer, "name" | "email" | "phone" | "salary" | "company">
  >
) {
  const res = await fetch(`${API_URL}/customers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Falha ao atualizar cliente");
  return res.json();
}

export async function deleteCustomer(id: string) {
  const res = await fetch(`${API_URL}/customers/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Falha ao remover cliente");
}
