import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("fh_token");
      const cachedUser = localStorage.getItem("fh_user");

      if (token && cachedUser) {
        setUser(JSON.parse(cachedUser));
        try {
          const { user: freshUser } = await authService.getMe();
          setUser(freshUser);
          localStorage.setItem("fh_user", JSON.stringify(freshUser));
        } catch (err) {
          localStorage.removeItem("fh_token");
          localStorage.removeItem("fh_user");
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    localStorage.setItem("fh_token", data.token);
    localStorage.setItem("fh_user", JSON.stringify(data.user));
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.name.split(" ")[0]}!`);
    return data.user;
  };

  const signup = async (payload) => {
    const data = await authService.signup(payload);
    localStorage.setItem("fh_token", data.token);
    localStorage.setItem("fh_user", JSON.stringify(data.user));
    setUser(data.user);
    toast.success("Account created successfully!");
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("fh_token");
    localStorage.removeItem("fh_user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const updateUserInContext = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("fh_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, updateUserInContext }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export default AuthContext;
