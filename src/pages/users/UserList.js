import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import SearchBar from "../../components/Layout/SearchBar";
import { useFetchWithToken } from "../../hooks/useFetchWithToken";
import { useCrudUI } from "../../hooks/useCrudUI";
import { useAuth } from "../../context/AuthContext";

const UserList = () => {
  const { fetchWithToken } = useFetchWithToken();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { ui, close, openDelete } = useCrudUI();
  const [filter, setFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [sortedUsers, setSortedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { admin } = useAuth();
  const userInfo = admin;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/liste_user`,
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des utilisateurs.");
        }
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError("Impossible de charger les données : " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [fetchWithToken]);

  // Dette #03 : Suppression sécurisée authentifiée par Sanctum (sans paramètre user_id dans l'URL)
  const handleDelete = async () => {
    if (!ui.data) return;

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/delete_user/${ui.data.id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (result.status === "deleted") {
        alert("Utilisateur supprimé !");
        setUsers(users.filter((user) => user.id !== ui.data.id));
      } else {
        alert(result.error || "Échec de la suppression.");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la suppression.");
    } finally {
      close();
    }
  };

  const filteredUsers = sortedUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function formatRole(role) {
    if (!role) return "";
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const roleColors = {
    super_admin: "bg-success",
    staff: "bg-primary",
  };

  return (
    <Layout>
      <div className="container mt-2">
        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "80vh" }}
          >
            <Loader />
          </div>
        ) : (
          <>
            <SearchBar
              placeholder="Rechercher un utilisateur..."
              onSearch={(query) => setSearchQuery(query)}
              delay={300}
            />
            <HeaderWithFilter
              title="Utilisateurs"
              link="/admin-tdi/register"
              linkText="Ajouter"
              main={users.length || null}
              filter={filter}
              setFilter={setFilter}
              filterOptions={[
                { value: "", label: "Tous les rôles" },
                { value: "super_admin", label: "Super Admin" },
                { value: "caisse", label: "Caisse" },
                { value: "gardien", label: "Gardien" },
                { value: "secretaire", label: "Secrétaire" },
                { value: "chef_atelier", label: "Chef Atelier" },
              ]}
              sortOption={sortOption}
              setSortOption={setSortOption}
              dataList={users}
              setSortedList={setSortedUsers}
              alphaField="last_name"
              dateField="created_at"
            />
            <Table hover responsive className="centered-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Nom</th>
                  <th>Pseudo</th>
                  <th>Rôle</th>
                  <th>Opérations</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers
                    .filter((user) => !filter || user.role === filter)
                    .map((user, index) => (
                      <tr key={index + 1}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.pseudo}</td>
                        <td className="text-center text-uppercase">
                          <span
                            className={`badge ${
                              roleColors[user.role] || "bg-dark"
                            } text-white`}
                          >
                            {formatRole(user.role)}
                          </span>
                        </td>
                        <td className="table-operations d-flex justify-content-center">
                          <Link
                            to={`/admin-tdi/update/user/${user.id}`}
                            className="btn btn-warning btn-sm me-2"
                          >
                            Modifier
                          </Link>
                          {user.id !== userInfo?.id && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => openDelete(user)}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        )}
      </div>

      <ConfirmPopup
        show={ui.mode === "delete"}
        onClose={close}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        body={
          <p>
            Voulez-vous vraiment supprimer l'utilisateur{" "}
            <strong>{ui.data?.name || "Inconnu"}</strong> ?
          </p>
        }
      />
    </Layout>
  );
};

export default UserList;
