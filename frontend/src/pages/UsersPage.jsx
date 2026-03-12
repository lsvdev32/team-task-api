import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import Modal from "../components/ui/Modal";
import UserForm from "../components/users/UserForm";
import UsersTable from "../components/users/UsersTable";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../services/userService";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      setErrorMessage("");
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "No fue posible cargar los usuarios.";
      setErrorMessage(backendMessage);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      if (selectedUser) {
        await updateUser(selectedUser.id, formData);
      } else {
        await createUser(formData);
      }

      handleCloseModal();
      await loadUsers();
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "No fue posible guardar el usuario.";
      setErrorMessage(backendMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Seguro que deseas eliminar este usuario?");
    if (!confirmed) return;

    try {
      setErrorMessage("");
      await deleteUser(id);
      await loadUsers();
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "No fue posible eliminar el usuario.";
      setErrorMessage(backendMessage);
    }
  };

  return (
    <>
      <AppLayout
        title="Gestión de usuarios"
        actions={
          <button
            onClick={handleOpenCreate}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 sm:w-auto"
          >
            Crear usuario
          </button>
        }
      >
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 sm:text-xl">
              Lista de usuarios
            </h2>
            <p className="text-sm text-slate-500">
              Gestiona los usuarios registrados en la aplicación.
            </p>
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {isLoadingUsers ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">
              Cargando usuarios...
            </div>
          ) : (
            <UsersTable
              users={users}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </section>
      </AppLayout>

      <Modal
        isOpen={isModalOpen}
        title={selectedUser ? "Editar usuario" : "Crear usuario"}
        onClose={handleCloseModal}
      >
        <UserForm
          onSubmit={handleCreateOrUpdate}
          initialValues={selectedUser}
          isEditing={!!selectedUser}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>
    </>
  );
}

export default UsersPage;