import React, { useRef } from "react";

export interface Document {
  title: string;
  description: string;
  link: string;
}

export interface WelcomeProps {
  /** Logged‑in user name; if null/undefined the authenticated view is hidden */
  userName?: string | null;
  /** CSRF token field name (e.g. "_csrf") */
  csrfTokenName: string;
  /** CSRF token value */
  csrfTokenValue: string;
  /** List of documents to display */
  docsList: Document[];
  /** Application context path (e.g. "/myapp") – used for the logout URL */
  contextPath: string;
}

/**
 * React migration of `welcome.jsp`.
 * Preserves:
 *   • Navbar with brand, user name and logout form (POST with CSRF)
 *   • Conditional rendering based on authentication
 *   • Document table with download links
 *   • “No document to display” fallback
 *   • Original CSS classes (Bootstrap) plus modern design‑system wrappers
 */
const Welcome: React.FC<WelcomeProps> = ({
  userName,
  csrfTokenName,
  csrfTokenValue,
  docsList,
  contextPath,
}) => {
  const logoutFormRef = useRef<HTMLFormElement>(null);

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    logoutFormRef.current?.submit();
  };

  return (
    <div className="modern-container">
      {/* Header / Navbar */}
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark default-color-dark fixed-top">
          <a className="navbar-brand" href="/">
            App Name
          </a>

          {userName && (
            <>
              {/* Hidden logout form with CSRF */}
              <form
                ref={logoutFormRef}
                method="POST"
                action={`${contextPath}/logout`}
              >
                <input
                  type="hidden"
                  name={csrfTokenName}
                  value={csrfTokenValue}
                />
              </form>

              <div className="collapse navbar-collapse">
                <ul className="nav navbar-nav navbar-right">
                  <li className="nav-item">
                    <a style={{ color: "#FFFFFF" }} href="#">
                      {userName}
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#" onClick={handleLogout}>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </>
          )}
        </nav>
      </header>

      {/* Main content – only visible for authenticated users */}
      {userName && (
        <div className="modern-card">
          <div className="row col-md-9 col-md-offset-2 custyle">
            <h3>Document List</h3>
          </div>

          <div className="row col-md-6 col-md-offset-2 custyle">
            {docsList && docsList.length > 0 ? (
              <div className="modern-table-wrapper">
                <table className="table table-striped custab">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docsList.map((doc, idx) => (
                      <tr key={idx}>
                        <td>{doc.title}</td>
                        <td>{doc.description}</td>
                        <td className="text-center">
                          <a
                            className="btn btn-info btn-xs"
                            href={doc.link}
                            download
                          >
                            <span className="glyphicon glyphicon-download"></span>{" "}
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <h5>No document to display</h5>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;