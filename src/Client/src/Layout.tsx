import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  styled,
  Container,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet, Link } from "react-router-dom";
import Home from "@mui/icons-material/Home";
import AdminPanelSettings from "@mui/icons-material/AdminPanelSettings";
import { Login as LoginLogoutArea } from "./LoginLogoutArea";
import { AuthGuard } from "./auth/AuthGuard";

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

export const Layout = () => (
  <>
    <AppBar position="fixed">
      <Toolbar
        sx={{
          marginLeft: "300px",
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{
            marginRight: 2,
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          ASP.NET Core + React BFF Proxy Sample
        </Typography>
        <LoginLogoutArea />
      </Toolbar>
    </AppBar>
    <Offset />
    <Drawer
      variant="persistent"
      open={true}
      PaperProps={{ sx: { width: "300px" } }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/test">
            <ListItemText>Test</ListItemText>
          </ListItemButton>
        </ListItem>
        <AuthGuard requiredRole="Admin">
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin">
              <ListItemIcon>
                <AdminPanelSettings />
              </ListItemIcon>
              <ListItemText>Admin</ListItemText>
            </ListItemButton>
          </ListItem>
        </AuthGuard>
      </List>
    </Drawer>
    <Box
      sx={{
        marginLeft: "300px",
      }}
    >
      <Container maxWidth="xl" disableGutters>
        <Box p={2}>
          <Outlet />
        </Box>
      </Container>
    </Box>
  </>
);
