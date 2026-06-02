import dashboardMicrocopyRaw from "../../moj-vrt-content-quality-pack/data/dashboard_microcopy.json";

type DashboardMicrocopy = {
  copy_id: string;
  text: string;
};

const dashboardMicrocopy = dashboardMicrocopyRaw as DashboardMicrocopy[];

export function copyText(copyId: string, fallback: string): string {
  return dashboardMicrocopy.find((item) => item.copy_id === copyId)?.text ?? fallback;
}
