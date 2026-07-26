import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Ban, ShieldCheck, Trash2 } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import Loader from "../components/Loader";
import Avatar from "../components/Avatar";
import adminService from "../services/adminService";
import useDebounce from "../hooks/useDebounce";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllUsers({ search: debouncedSearch, role: roleFilter });
      setUsers(data.users);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, roleFilter]);

  const handleToggleBlock = async (id) => {
    try {
      const data = await adminService.toggleBlockUser(id);
      setUsers((prev) => prev.map((u) => (u._id === id ? data.user : u)));
      toast.success(data.user.isBlocked ? "User blocked" : "User unblocked");
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this user account?")) return;
    try {
      await adminService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-bold text-ink mb-6">Manage Users</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mocha/60" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="input-field !pl-11"
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input-field !w-auto">
          <option value="">All Roles</option>
          <option value="client">Clients</option>
          <option value="freelancer">Freelancers</option>
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-nude/20 text-left">
              <tr>
                <th className="p-4 font-heading font-semibold text-ink">User</th>
                <th className="p-4 font-heading font-semibold text-ink">Role</th>
                <th className="p-4 font-heading font-semibold text-ink">Status</th>
                <th className="p-4 font-heading font-semibold text-ink">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-mocha/10">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={u.profileImage} name={u.name} size="xs" />
                      <div>
                        <p className="font-heading font-medium text-ink">{u.name}</p>
                        <p className="text-xs text-ink/50">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 capitalize text-ink/70">{u.role}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        u.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleBlock(u._id)}
                        className="btn-secondary !py-1.5 !px-2.5"
                        title={u.isBlocked ? "Unblock" : "Block"}
                      >
                        {u.isBlocked ? <ShieldCheck size={14} /> : <Ban size={14} />}
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="btn-secondary !py-1.5 !px-2.5 !text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageUsersPage;
