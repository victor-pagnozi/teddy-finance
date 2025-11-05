import { useEffect, useState } from "react";
import type { Customer } from "@teddy/core";
import { listCustomers } from "../api/client";
import { useAppSelector } from "../store";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Skeleton,
} from "@mui/material";
import { formatBRL } from "../shared/functions/formatBRL";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userName = useAppSelector((s) => s.user.name);

  useEffect(() => {
    (async () => {
      try {
        const data = await listCustomers();
        setCustomers(data);
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
  }, []);

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
      <Typography variant="h6" mb={2}>
        Clientes {userName ? `(Olá, ${userName})` : null}
      </Typography>
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
    </Box>
  );
}
