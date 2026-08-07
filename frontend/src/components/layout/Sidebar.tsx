import { NavLink } from "react-router";

const navigationItems = [
  { path: "dashboard", label: "Dashboard", marker: "D" },
  { path: "projects", label: "Projects", marker: "P" },
];

type SidebarProps = {
  basePath?: string;
  footerText?: string;
};

function Sidebar({
  basePath = "",
  footerText = "Project workspace",
}: SidebarProps) {
  const dashboardPath = `${basePath}/dashboard`;

  return (
    <aside className="sidebar">
      <NavLink
        className="brand"
        to={dashboardPath}
        aria-label="BuildFlow home"
      >
        <span className="brand__mark" aria-hidden="true">
          BF
        </span>
        <span className="brand__name">BuildFlow</span>
      </NavLink>

      <nav className="sidebar__nav" aria-label="Primary navigation">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={`${basePath}/${item.path}`}
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

      <p className="sidebar__footer">{footerText}</p>
    </aside>
  );
}

export default Sidebar;
