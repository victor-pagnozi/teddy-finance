import { Link as RouterLink, Outlet, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Link,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logoExtended from "./shared/images/logo_extended.png";
import { useAppSelector } from "./store";

export default function App() {
  const location = useLocation();
  const showNav = location.pathname !== "/";
  const isCustomers = location.pathname.startsWith("/customers");
  const isSelected = location.pathname.startsWith("/selected");
  const userName = useAppSelector((s) => s.user.name);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {showNav && (
        <AppBar
          position="static"
          elevation={0}
          color="inherit"
          sx={{
            borderBottom: "1px solid #e5e7eb",
            height: 80,
            display: "flex",
            justifyContent: "center",
            boxShadow: "0px 2px 2px 0px #0000001A",
          }}
        >
          <Toolbar
            sx={{
              gap: 2,
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <IconButton edge="start" aria-label="menu" size="small">
                <MenuIcon />
              </IconButton>

              <Box sx={{ width: 100, height: 40 }}>
                <img
                  src={logoExtended}
                  alt="logo"
                  style={{
                    width: "auto",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Link
                component={RouterLink}
                to="/customers"
                underline="none"
                sx={{
                  mr: 2,
                  color: isCustomers ? "primary.main" : "text.primary",
                  textDecoration: isCustomers ? "underline" : "none",
                  textUnderlineOffset: isCustomers ? "4px" : undefined,
                }}
              >
                Clientes
              </Link>
              <Link
                component={RouterLink}
                to="/selected"
                underline="none"
                sx={{
                  mr: 2,
                  color: isSelected ? "primary.main" : "text.primary",
                  textDecoration: isSelected ? "underline" : "none",
                  textUnderlineOffset: isSelected ? "4px" : undefined,
                }}
              >
                Clientes selecionados
              </Link>
              <Link
                component={RouterLink}
                to="/"
                underline="none"
                sx={{ mr: 4, color: "text.primary" }}
              >
                Sair
              </Link>
            </Box>

            <Typography variant="body2" sx={{ fontSize: 16 }}>
              Olá,{" "}
              <Typography component="span" fontWeight={700} sx={{ fontSize: 16 }}>
                {userName && userName.trim().length > 0 ? userName : "Usuário"}!
              </Typography>
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Box p={2}>
        <Outlet />
      </Box>
    </Box>
  );
}
