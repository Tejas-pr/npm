import { Link } from "react-router-dom";
import { siteConfig } from "../../config";
import logo from "../../assets/logo.png";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container flex h-14 max-w-screen-xl mx-auto items-center px-4 md:px-8">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-3">
            <img src={logo} alt="Logo" className="h-6 w-auto object-contain rounded-sm" />
            <span className="font-semibold sm:inline-block tracking-wide">
              {siteConfig.title}
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
          <a href={siteConfig.links.portfolio} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">
            Portfolio
          </a>
          <a href={siteConfig.links.npmProfile} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">
            NPM
          </a>
          <a href={siteConfig.links.githubProfile} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
