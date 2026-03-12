import Sidebar from "./Sidebar";

function AppLayout({ title, actions, children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:flex-row">
        <Sidebar />

        <main className="min-w-0 flex-1 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <header className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                {title}
              </h1>
            </div>

            {actions && <div className="flex shrink-0">{actions}</div>}
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;