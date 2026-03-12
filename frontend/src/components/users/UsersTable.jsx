function UsersTable({ users, onEdit, onDelete }) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
        No hay usuarios registrados.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full bg-white">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
              ID
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
              Nombre
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
              Email
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-slate-200">
              <td className="px-4 py-3 text-sm text-slate-600">{user.id}</td>
              <td className="px-4 py-3 text-sm text-slate-800">{user.name}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{user.email}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-amber-400"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => onDelete(user.id)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-500"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTable;