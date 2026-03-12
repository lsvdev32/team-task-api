function TaskFilters({ filters, users, onChange, onReset }) {
  return (
    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 xl:grid-cols-5">
      <div className="sm:col-span-2 xl:col-span-1">
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Buscar
        </label>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={onChange}
          placeholder="Buscar tarea..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Estado
        </label>
        <select
          name="status"
          value={filters.status}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
        >
          <option value="">Todos</option>
          <option value="pending">Pendiente</option>
          <option value="in_progress">En progreso</option>
          <option value="completed">Completada</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Prioridad
        </label>
        <select
          name="priority"
          value={filters.priority}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
        >
          <option value="">Todas</option>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Usuario
        </label>
        <select
          name="userId"
          value={filters.userId}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
        >
          <option value="">Todos</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2 xl:col-span-1 xl:flex xl:items-end">
        <button
          type="button"
          onClick={onReset}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}

export default TaskFilters;