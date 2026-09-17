import { useEffect } from "react";
import { useState, useCallback } from "react";
import { RailOptXIntro } from "@/components/intro/RailOptXIntro";
import { AboutRailOptXPage } from "@/components/intro/AboutRailOptXPage";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { LiveOperationsMap } from "@/components/pages/LiveOperationsMap";
import { TrainSchedule } from "@/components/pages/TrainSchedule";
import { MaintenanceTasksPage } from "@/components/pages/MaintenanceTasksPage";
import { BlockPlanningPage } from "@/components/pages/BlockPlanningPage";
import { AssetHealthPage } from "@/components/pages/AssetHealthPage";
import { ConflictsAlertsPage } from "@/components/pages/ConflictsAlertsPage";
import { ReportsPage } from "@/components/pages/ReportsPage";
import { SettingsPage } from "@/components/pages/SettingsPage";
import { Toast } from "@/components/Toast";
import type { MaintenanceTask } from "@/data/mockData";

const pageMeta: Record<string, { title: string; breadcrumb: string }> = {
  dashboard: { title: "Command Dashboard", breadcrumb: "Monitor" },
  map: { title: "Live Corridor Map", breadcrumb: "Monitor" },
  schedule: { title: "Train Schedule", breadcrumb: "Monitor" },
  tasks: { title: "Maintenance Tasks", breadcrumb: "Plan" },
  planning: { title: "Block Planning", breadcrumb: "Plan" },
  assets: { title: "Asset Health", breadcrumb: "Plan" },
  alerts: { title: "Conflicts & Alerts", breadcrumb: "Control" },
  reports: { title: "Reports", breadcrumb: "Control" },
  settings: { title: "Settings", breadcrumb: "System" },
};

type StartupView = "intro" | "about" | "app";

function App() {
  const [startupView, setStartupView] = useState<StartupView>("intro");
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedTrainId, setSelectedTrainId] = useState<string | null>(null);
  const [extraTasks, setExtraTasks] = useState<MaintenanceTask[]>([]);
  const [toastShow, setToastShow] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVariant, setToastVariant] = useState<
    "success" | "info" | "warning" | "critical"
  >("success");
  const meta = pageMeta[activePage] ?? pageMeta.dashboard;

  const handleNavigate = (page: string, trainId?: string) => {
    setActivePage(page);
    if (trainId !== undefined) setSelectedTrainId(trainId);
  };
 useEffect(() => {
   fetch("http://localhost:5000/api/test")
     .then((response) => response.json())
     .then((data) => {
       console.log("BACKEND RESPONSE:", data);
     })
     .catch((error) => {
       console.error("BACKEND ERROR:", error);
     });
 }, []);

  const showToast = useCallback(
    (
      msg: string,
      variant: "success" | "info" | "warning" | "critical" = "success",
    ) => {
      setToastMsg(msg);
      setToastVariant(variant);
      setToastShow(true);
    },
    [],
  );

  const handleIngestDefect = useCallback(() => {
    const newTask: MaintenanceTask = {
      id: "TMS-2104",
      workType: "Rail Joint Wear",
      department: "Engineering",
      corridor: "Jalandhar Cantt–Phagwara",
      location: "KM 104",
      priority: "High",
      estimatedDuration: 75,
      overdueDays: 0,
      status: "Pending",
      compatibilityGroup: "RB-104",
      description:
        "Imported from TMS: Rail joint wear detected near Phagwara KM 104. Ultrasonic inspection and grinding recommended. Auto-ingested from Track Maintenance System.",
      assetId: "TMS-RJ-104-PWG",
      lastMaintenance: "01 Sep 2026",
      assignedTeam: "Unassigned",
    };
    setExtraTasks((prev) => [newTask, ...prev]);
    showToast(
      "Imported from TMS: TMS-2104 (Rail Joint Wear near Phagwara KM 104) — Added to Task Queue",
      "info",
    );
  }, [showToast]);

  if (startupView === "intro") {
    return <RailOptXIntro onEnter={() => setStartupView("about")} />;
  }

  if (startupView === "about") {
    return (
      <AboutRailOptXPage
        onBack={() => setStartupView("intro")}
        onContinue={() => setStartupView("app")}
      />
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#071522" }}>
      <Sidebar activePage={activePage} onNavigate={(p) => handleNavigate(p)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          pageTitle={meta.title}
          breadcrumb={meta.breadcrumb}
          onIngestDefect={handleIngestDefect}
        />
        <main className="flex-1 px-5 py-4 animate-fade-in">
          {activePage === "dashboard" && (
            <Dashboard onNavigate={handleNavigate} />
          )}
          {activePage === "map" && (
            <LiveOperationsMap
              selectedTrainId={selectedTrainId}
              onNavigate={handleNavigate}
            />
          )}
          {activePage === "schedule" && (
            <TrainSchedule onNavigate={handleNavigate} />
          )}
          {activePage === "tasks" && (
            <MaintenanceTasksPage extraTasks={extraTasks} />
          )}
          {activePage === "planning" && (
            <BlockPlanningPage onNavigate={handleNavigate} />
          )}
          {activePage === "assets" && <AssetHealthPage />}
          {activePage === "alerts" && (
            <ConflictsAlertsPage onNavigate={handleNavigate} />
          )}
          {activePage === "reports" && <ReportsPage />}
          {activePage === "settings" && <SettingsPage />}
        </main>
        <footer
          className="px-5 py-2.5"
          style={{
            borderTop: "1px solid rgba(59,157,255,0.08)",
            background: "rgba(8,27,45,0.60)",
          }}
        >
          <div className="text-center space-y-0.5">
            <p className="text-[10px] text-text-muted">
              Prototype using synthetic data • Human-in-the-loop approval
              required
            </p>
            <p className="text-[10px] text-text-disabled">
              Train locations and safety cross-checks are simulated for
              demonstration only.
            </p>
          </div>
        </footer>
      </div>
      <Toast
        message={toastMsg}
        show={toastShow}
        onClose={() => setToastShow(false)}
        variant={toastVariant}
      />
    </div>
  );
}

export default App;
