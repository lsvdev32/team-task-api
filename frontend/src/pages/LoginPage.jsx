import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginRequest, registerRequest } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isRegister, setIsRegister] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setErrorMessage("");
    setForm({ name: "", email: "", password: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!form.email || !form.password) {
      setErrorMessage("Debes completar el correo y la contraseña.");
      return;
    }

    if (isRegister && !form.name) {
      setErrorMessage("Debes ingresar tu nombre.");
      return;
    }

    try {
      setIsLoading(true);

      if (isRegister) {
        await registerRequest({
          name: form.name,
          email: form.email,
          password: form.password,
        });

        // Auto-login tras registro exitoso
        const data = await loginRequest({
          email: form.email,
          password: form.password,
        });

        if (!data.token) {
          setErrorMessage("Registro exitoso, pero no se pudo iniciar sesión automáticamente.");
          return;
        }

        login(data.token);
        navigate("/tasks");
      } else {
        const data = await loginRequest({
          email: form.email,
          password: form.password,
        });

        if (!data.token) {
          setErrorMessage("Token no recibido del servidor.");
          return;
        }

        login(data.token);
        navigate("/tasks");
      }
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || (isRegister
          ? "No fue posible crear la cuenta."
          : "No fue posible iniciar sesión.");
      setErrorMessage(backendMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-2 text-3xl font-bold text-slate-800">
          {isRegister ? "Crear cuenta" : "Iniciar sesión"}
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          {isRegister
            ? "Regístrate para acceder a Team Task"
            : "Accede a la aplicación Team Task"}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegister && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
            />
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading
              ? isRegister ? "Creando cuenta..." : "Ingresando..."
              : isRegister ? "Crear cuenta" : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button
            type="button"
            onClick={switchMode}
            className="font-medium text-slate-800 underline hover:text-slate-600"
          >
            {isRegister ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;