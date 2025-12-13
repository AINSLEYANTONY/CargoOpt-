import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { PackingPage } from "./routes/PackingPage";
import { StowagePage } from "./routes/StowagePage";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/packing" />} />
          <Route path="/packing" element={<PackingPage />} />
          <Route path="/stowage" element={<StowagePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
