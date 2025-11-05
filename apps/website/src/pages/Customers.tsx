import { useEffect, useState } from "react";
import type { Customer, Paginated } from "@teddy/core";
import { listCustomers, createCustomer } from "../api/client";
import { toast } from "react-toastify";
import { useAppSelector } from "../store";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Skeleton,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { formatBRL } from "../shared/functions/formatBRL";
import { formatCurrencyBRLInput } from "../shared/functions/formatCurrencyBRLInput";
import { parseCurrencyBRLToNumber } from "../shared/functions/parseCurrencyBRLToNumber";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    salary: "R$ 0,00",
    company: "R$ 0,00",
  });
  const userName = useAppSelector((s) => s.user.name);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data: Paginated<Customer> = await listCustomers(page, pageSize);
        setCustomers(data.items);
        setTotal(data.total);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Ocorreu um erro ao carregar os clientes");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [page, pageSize]);

  async function handleCreate() {
    if (creating) return;

    const name = form.name.trim();

    if (!name) return;

    const salary = parseCurrencyBRLToNumber(form.salary);
    const company = parseCurrencyBRLToNumber(form.company);

    setCreating(true);

    try {
      await createCustomer({
        name,
        salary: Number.isNaN(salary) ? 0 : salary,
        company: Number.isNaN(company) ? 0 : company,
      });
      setOpenCreate(false);
      setForm({ name: "", salary: "R$ 0,00", company: "R$ 0,00" });
      setPage(1);
      toast.success("Cliente criado com sucesso", {
        theme: "colored",
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Falha ao criar cliente";
      toast.error(message, {
        theme: "colored",
      });
    } finally {
      setCreating(false);
    }
  }

  if (loading)
    return (
      <Box p={2}>
        <Typography variant="h6" mb={2}>
          Clientes {userName ? `(Olá, ${userName})` : null}
        </Typography>

        <Grid container spacing={2}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Card
                elevation={1}
                sx={{ boxShadow: "0px 0px 4px 0px #0000001A" }}
              >
                <CardContent>
                  <Skeleton
                    variant="text"
                    height={28}
                    sx={{ mx: "auto", width: "60%" }}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ mx: "auto", mt: 1, width: "80%" }}
                  />
                  <Skeleton variant="text" sx={{ mx: "auto", width: "70%" }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Box p={2}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" mb={2}>
          <strong>{customers.length}</strong> clientes encontrados
        </Typography>

        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          mb={2}
          gap={2}
        >
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="page-size-label">Clientes por página</InputLabel>
            <Select
              labelId="page-size-label"
              label="Clientes por página"
              value={pageSize}
              onChange={(e) => {
                setPage(1);
                setPageSize(Number(e.target.value));
              }}
            >
              {[8, 12, 16, 24, 32].map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {customers.map((c) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={c.id}>
            <Card elevation={1} sx={{ boxShadow: "0px 0px 4px 0px #0000001A" }}>
              <CardContent>
                <Typography align="center" fontWeight={700}>
                  {c.name}
                </Typography>

                <Typography align="center" variant="body2" mt={1}>
                  Salário: {formatBRL(c.salary)}
                </Typography>

                <Typography align="center" variant="body2">
                  Empresa: {formatBRL(c.company)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          mt: 2,
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setOpenCreate(true)}
          fullWidth
          sx={{ border: 2, fontWeight: 700 }}
        >
          Criar cliente
        </Button>
      </Box>

      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          count={Math.max(1, Math.ceil(total / pageSize))}
          page={page}
          color="primary"
          onChange={(_, p) => setPage(p)}
        />
      </Box>

      <Dialog
        open={openCreate}
        onClose={() => !creating && setOpenCreate(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Criar cliente</DialogTitle>
        <DialogContent
          sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Nome"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            autoFocus
            required
          />
          <TextField
            label="Salário"
            type="text"
            inputMode="numeric"
            value={form.salary}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                salary: formatCurrencyBRLInput(e.target.value),
              }))
            }
          />
          <TextField
            label="Valor da empresa"
            type="text"
            inputMode="numeric"
            value={form.company}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                company: formatCurrencyBRLInput(e.target.value),
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)} disabled={creating}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            color="primary"
            disabled={creating || !form.name.trim()}
          >
            {creating ? "Criando..." : "Criar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
