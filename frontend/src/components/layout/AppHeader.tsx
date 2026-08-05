import type { CurrentUserResponse } from "../../types/auth";

type AppHeaderProps = {
  currentUser: CurrentUserResponse | null;
  onLogout: () => void;
};

function getInitial(username: string): string {
  return username.trim().charAt(0).toUpperCase() || "U";
}

function AppHeader({ currentUser, onLogout }: AppHeaderProps) {
  return (
    <header className="app-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="app-header__context">
        <span className="app-header__eyebrow">Workspace</span>
        <strong>Project overview</strong>
      </div>

      <div className="app-header__account">
        <span className="user-avatar" aria-hidden="true">
          {currentUser ? getInitial(currentUser.username) : "U"}
        </span>
        <div className="user-summary">
          <strong>{currentUser?.username ?? "BuildFlow user"}</strong>
          <span>{currentUser?.email ?? "Account details unavailable"}</span>
        </div>
        <button
          className="button button--secondary button--compact"
          type="button"
          onClick={onLogout}
        >
          Log out
        </button>
      </div>
    </header>
  );
}

export default AppHeader;
