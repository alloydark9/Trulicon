import Sidebar from "../Sidebar";
import Header from "../Header";

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <topbar><Header /></topbar>
      <aside><Sidebar /></aside>

      <main>
        {children}
      </main>
    </div>
  );
}   