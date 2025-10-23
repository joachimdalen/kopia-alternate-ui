import "@mantine/core/styles.layer.css";
import "mantine-datatable/styles.layer.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import BaseLayout from "./BaseLayout.tsx";
import "./index.css";
import SnapshotDirectory from "./snapshot-directory/SnapshotDirectory.tsx";
import SnapshotHistory from "./snapshot-history/SnapshotHistory.tsx";
import SnapshotsPage from "./snapshots/SnapshotsPage.tsx";
import TasksPage from "./tasks/TasksPage.tsx";

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
          <Route path="/snapshots/dir/:oid" element={<SnapshotDirectory />} />
          <Route path="/tasks" element={<TasksPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
