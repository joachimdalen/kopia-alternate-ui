import "@mantine/core/styles.layer.css";
import "mantine-datatable/styles.layer.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import BaseLayout from "./BaseLayout.tsx";
import "./index.css";
import SnapshotHistory from "./snapshot-history/SnapshotHistory.tsx";
import SnapshotsPage from "./snapshots/SnapshotsPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/snapshots" element={<SnapshotsPage />} />
          <Route
            path="/snapshots/single-source"
            element={<SnapshotHistory />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
