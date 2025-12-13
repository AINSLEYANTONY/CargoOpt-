import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app">
      <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <h1>Packing AI & Stowage CP</h1>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link to="/packing">Container Packing</Link>
          <Link to="/stowage">Ship Stowage</Link>
        </nav>
      </header>
      <main style={{ padding: "1rem" }}>{children}</main>
    </div>
  );
}
