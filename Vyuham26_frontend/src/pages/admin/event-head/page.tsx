import AdminApp from "@/components/admin/AdminApp";

/** Keep the established event-head URL, but open the live Hackathon operations panel. */
export default function EventHeadPortalPage() {
  return <AdminApp initialSection="Hackathon" />;
}
