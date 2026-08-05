import { NavLink } from "react-router";

const navigationItems = [
  { to: "/dashboard", label: "Dashboard", marker: "D" },
  { to: "/projects", label: "Projects", marker: "P" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink className="brand" to="/dashboard" aria-label="BuildFlow home">
        <span className="brand__mark" aria-hidden="true">
          BF
        </span>
        <span className="brand__name">BuildFlow</span>
      </NavLink>

      <nav className="sidebar__nav" aria-label="Primary navigation">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar__link${isActive ? " sidebar__link--active" : ""}`
            }
          >
            <span className="sidebar__link-marker" aria-hidden="true">
              {item.marker}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <p className="sidebar__footer">Project workspace</p>
    </aside>
  );
}

export default Sidebar;
