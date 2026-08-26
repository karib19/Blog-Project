import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;