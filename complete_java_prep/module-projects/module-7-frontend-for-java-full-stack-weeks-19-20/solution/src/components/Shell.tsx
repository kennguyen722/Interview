import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export const Shell = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <header className="topbar">
        <div>
          <h1>Module 7 Frontend Console</h1>
          <p>Typed client for secure Java backend APIs</p>
        </div>
        <div className="user-box">
          <span>{user?.username}</span>
          <button type="button" onClick={logout}>Sign Out</button>
        </div>
      </header>

      <nav className="sidebar">
        <NavLink to="/">Overview</NavLink>
        <NavLink to="/orders/new">Create Order</NavLink>
        <NavLink to="/orders/lookup">Lookup Order</NavLink>
        <NavLink to="/reports/top-customers">Top Customers</NavLink>
      </nav>

      <main className="content">{children}</main>
    </div>
  );
};
