export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <aside>Sidebar</aside>

      <main>
        {children}
      </main>
    </div>
  );
}   