import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-4 text-center">
      <h1 className="text-5xl font-bold text-slate-800">404</h1>
      <p className="mt-3 text-slate-500">La página que buscas no existe.</p>
      <Link
        to="/login"
        className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700"
      >
        Volver al login
      </Link>
    </div>
  );
}

export default NotFoundPage;