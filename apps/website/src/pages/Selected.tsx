import { useLocation, useNavigate } from 'react-router-dom';
import type { Customer } from '@teddy/core';

export default function Selected() {
  const location = useLocation();
  const navigate = useNavigate();
  const selected = (location.state as any)?.selected as Customer[] | undefined;

  if (!selected || selected.length === 0) {
    return (
      <div>
        <p>Nenhum cliente selecionado.</p>
        <button onClick={() => navigate('/customers')}>Voltar</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Clientes selecionados ({selected.length})</h2>
      <ul>
        {selected.map((c) => (
          <li key={c.id}>{c.name} {c.email ? `- ${c.email}` : ''}</li>
        ))}
      </ul>
      <button onClick={() => navigate('/customers')}>Voltar</button>
    </div>
  );
}
