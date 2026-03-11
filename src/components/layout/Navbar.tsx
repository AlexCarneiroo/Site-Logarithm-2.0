export default function Navbar() {
  return (
    <nav className="main-nav">
      <div className="nav-container">
        {/* Logo Section */}
        <div className="nav-logo">
          <div className="logo-icon">
            {/* Simple representation of the tech logo in the image */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="14" y="2" width="8" height="8" rx="2" />
              <rect x="2" y="14" width="8" height="8" rx="2" />
              <path d="M6 14V6a2 2 0 0 1 2-2h6" />
              <path d="M18 10v8a2 2 0 0 1-2 2h-6" />
            </svg>
          </div>
          <span>Logarithm</span>
        </div>

        {/* Links Section */}
        <div className="nav-links">
          <a href="#" className="active">Início</a>
          <a href="#">Quem Somos</a>
          <a href="#">Serviços</a>
          <a href="#">Softwares</a>
          <a href="#">Resultados</a>
          <a href="#">Admin</a>
          <a href="#">Área do Cliente</a>
        </div>

        {/* CTA Button */}
        <div className="nav-cta">
          <button className="btn-nav">Contato</button>
        </div>
      </div>
    </nav>
  );
}
