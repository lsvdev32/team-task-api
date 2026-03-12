const statusLabels = {
  pending: "Pendiente",
  in_progress: "En progreso",
  completed: "Completada",
};

const priorityLabels = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

const statusClasses = {
  pending: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
};

const priorityClasses = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-violet-100 text-violet-700",
  high: "bg-rose-100 text-rose-700",
};

function TasksTable({ tasks, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
        No hay tareas registradas.
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
              Título
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
              Estado
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
              Prioridad
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
              Usuario
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-t border-slate-200">
              <td className="px-4 py-3 text-sm text-slate-600">{task.id}</td>
              <td className="px-4 py-3 text-sm text-slate-800">
                <div className="font-medium">{task.title}</div>
                <div className="text-xs text-slate-500">
                  {task.description || "Sin descripción"}
                </div>
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    statusClasses[task.status] || "bg-slate-100 text-slate-700"
                  }`}
                >
                  {statusLabels[task.status] || task.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    priorityClasses[task.priority] ||
                    "bg-slate-100 text-slate-700"
                  }`}
                >
                  {priorityLabels[task.priority] || task.priority}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">
                {task.user ? task.user.name : "Sin usuario"}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onEdit(task)}
                    className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-amber-400"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => onDelete(task.id)}
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

export default TasksTable;