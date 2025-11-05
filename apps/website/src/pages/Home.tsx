import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useAppDispatch } from "../store";
import { setName as setUserName } from "../store/userSlice";

export default function Home() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="calc(100vh - 32px)"
    >
      <Box display="flex" flexDirection="column" gap={2} width={360}>
        <Typography
          fontFamily="Inter, sans-serif"
          fontWeight={400}
          fontSize="36px"
        >
          Olá, seja bem-vindo!
        </Typography>

        <TextField
          placeholder="Digite o seu nome:"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          fullWidth
        />

        <Button
          type="button"
          variant="contained"
          color="primary"
          disabled={!name.trim()}
          onClick={() => {
            dispatch(setUserName(name));
            navigate("/customers");
          }}
        >
          Confirmar
        </Button>
      </Box>
    </Box>
  );
}
