import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { ConfirmProvider } from "./components/layout/ConfirmDialog";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ConfirmProvider>
          <AppRoutes />

          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3500,
              style: {
                background: "var(--toast-bg, #1e293b)",
                color: "var(--toast-color, #fff)",
                borderRadius: "12px",
                padding: "14px 18px",
                fontSize: "14px",
                fontWeight: 500,
              },
              success: {
                iconTheme: {
                  primary: "#e11d48",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#dc2626",
                  secondary: "#fff",
                },
              },
            }}
          />
        </ConfirmProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;