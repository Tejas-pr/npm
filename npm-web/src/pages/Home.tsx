import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Copy, Check } from "lucide-react";
import { usePackages } from "../hooks/use-npm";
import { toast } from "sonner";
import { siteConfig } from "../config";
import { Skeleton } from "../components/ui/skeleton";

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: packages, isLoading, error } = usePackages(siteConfig.npmUsername);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"All Time" | "Trending (24h)" | "Hot" | "Skills">("All Time");
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCount(20);
  }, [searchQuery, activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300) {
        setVisibleCount((prev) => prev + 20);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  let filteredPackages = (packages || []).filter((pkg) =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (activeTab === "Skills") {
    filteredPackages = filteredPackages.filter(pkg => pkg.name.toLowerCase().includes("skills"));
  } else if (activeTab === "All Time") {
    filteredPackages = filteredPackages.sort((a, b) => b.downloads - a.downloads);
  } else if (activeTab === "Trending (24h)") {
    filteredPackages = filteredPackages.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } else if (activeTab === "Hot") {
    filteredPackages = filteredPackages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const copyInstall = () => {
    navigator.clipboard.writeText("npm install <package-name>");
    setCopied(true);
    toast.success("Command copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      <main className="container max-w-screen-xl mx-auto px-4 md:px-8 py-10 md:py-16">
        
        {/* Hero & Try it Now Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16 md:mb-24 mt-4">
          
          {/* Left Column */}
          <div className="flex flex-col justify-between h-full">
            <div className="mb-12 lg:mb-0">
              <h1 
                className="text-7xl sm:text-[90px] md:text-[110px] font-black uppercase tracking-tighter mb-4 leading-none text-foreground" 
                style={{ 
                  fontFamily: "monospace", 
                  textShadow: "3px 3px 0 #555, 6px 6px 0 #222",
                  WebkitTextStroke: "1px #555",
                  letterSpacing: "-0.05em"
                }}
              >
                PACKAGES
              </h1>
              <div className="text-[10px] sm:text-xs font-mono tracking-widest text-muted-foreground uppercase break-words">
                THE OPEN PACKAGE ECOSYSTEM
              </div>
            </div>

            <div className="mt-8 lg:mt-auto">
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">TRY IT NOW</h3>
              <div className="flex items-center justify-between p-4 bg-secondary/30 border border-border rounded-md group hover:border-foreground/20 transition-colors w-full max-w-sm">
                <div className="flex items-center space-x-3 font-mono text-xs sm:text-sm overflow-hidden">
                  <span className="text-muted-foreground shrink-0">$</span>
                  <span className="truncate">npm install &lt;package&gt;</span>
                </div>
                <button onClick={copyInstall} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col justify-between h-full lg:pt-4">
            <div className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 lg:mb-0">
              Packages are reusable components, utilities, and skills for your projects. Install them with a single command to enhance your apps and agents.
            </div>

            <div className="mt-8 lg:mt-auto">
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">AVAILABLE FOR THESE FRAMEWORKS & AGENTS</h3>
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                 <div className="flex items-center justify-center opacity-60 hover:opacity-100 hover:text-foreground transition-all cursor-default">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="w-7 h-7"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                 </div>
                 <div className="flex items-center justify-center opacity-60 hover:opacity-100 hover:text-foreground transition-all cursor-default">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM12 6v12M6 12h12M7.75 7.75l8.5 8.5M16.25 7.75l-8.5 8.5"/></svg>
                 </div>
                 <div className="flex items-center justify-center opacity-60 hover:opacity-100 hover:text-foreground transition-all cursor-default">
                   <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="10" r="1.5"/><circle cx="15" cy="10" r="1.5"/><path d="M9 15 Q12 18 15 15" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
                 </div>
                 <div className="flex items-center justify-center opacity-60 hover:opacity-100 hover:text-foreground transition-all cursor-default">
                   <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M2 4l4.5 15 4.5-9 4.5 9 4.5-15h-2.5l-2.5 9.5-3.5-7-4.5 9-2.5-9.5H2z"/></svg>
                 </div>
                 <div className="flex items-center justify-center opacity-60 hover:opacity-100 hover:text-foreground transition-all cursor-default">
                   <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M12 2l2.4 7.6 7.6 2.4-7.6 2.4-2.4 7.6-2.4-7.6-7.6-2.4 7.6-2.4z"/></svg>
                 </div>
                 <div className="flex items-center justify-center opacity-60 hover:opacity-100 hover:text-foreground transition-all cursor-default">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-7 h-7"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M12 10V4M8 4h8"/><circle cx="9" cy="15" r="1" fill="currentColor"/><circle cx="15" cy="15" r="1" fill="currentColor"/></svg>
                 </div>
                 <div className="flex items-center justify-center opacity-60 hover:opacity-100 hover:text-foreground transition-all cursor-default">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="w-7 h-7"><path d="M4 8l8-4 8 4v8l-8 4-8-4V8z"/><path d="M12 12l8-4M12 12v8M12 12L4 8"/></svg>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-foreground mb-6">PACKAGES LEADERBOARD</h2>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 mb-4 gap-4">
            <div className="relative flex items-center w-full md:max-w-sm">
              <Search className="absolute left-0 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search packages..."
                className="w-full bg-transparent border-none focus:ring-0 pl-8 text-sm font-mono placeholder:text-muted-foreground/50 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-0 text-xs text-muted-foreground font-mono bg-secondary px-1.5 py-0.5 rounded border border-border">/</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm font-mono mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none">
            <button 
              onClick={() => setActiveTab("All Time")}
              className={`pb-1 transition-colors ${activeTab === "All Time" ? "text-foreground border-b border-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              All Time ({filteredPackages.length})
            </button>
            <button 
              onClick={() => setActiveTab("Trending (24h)")}
              className={`pb-1 transition-colors ${activeTab === "Trending (24h)" ? "text-foreground border-b border-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              Trending (24h)
            </button>
            <button 
              onClick={() => setActiveTab("Hot")}
              className={`pb-1 transition-colors ${activeTab === "Hot" ? "text-foreground border-b border-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              Hot
            </button>
            <button 
              onClick={() => setActiveTab("Skills")}
              className={`pb-1 transition-colors flex items-center space-x-1 ${activeTab === "Skills" ? "text-foreground border-b border-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <span>Skills</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </button>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm font-mono">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="py-4 font-normal w-12">#</th>
                  <th className="py-4 font-normal">PACKAGE</th>
                  <th className="py-4 font-normal text-right hidden sm:table-cell">8W ACTIVITY</th>
                  <th className="py-4 font-normal text-right">INSTALLS</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-4"><Skeleton className="h-4 w-4" /></td>
                      <td className="py-4 flex items-center space-x-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48 hidden md:inline-block" />
                      </td>
                      <td className="py-4 hidden sm:table-cell align-middle"><Skeleton className="h-4 w-24 ml-auto" /></td>
                      <td className="py-4"><Skeleton className="h-4 w-12 ml-auto" /></td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-destructive">Error loading packages</td>
                  </tr>
                ) : filteredPackages.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground">No packages found</td>
                  </tr>
                ) : (
                  filteredPackages.slice(0, visibleCount).map((pkg, i) => (
                    <tr key={pkg.id} className="border-b border-border/50 hover:bg-secondary/10 transition-colors group">
                      <td className="py-4 text-muted-foreground">{i + 1}</td>
                      <td className="py-4">
                        <Link to={`/package/${pkg.id}`} className="font-semibold text-foreground group-hover:underline">
                          {pkg.name}
                        </Link>
                        <span className="text-muted-foreground ml-2 hidden md:inline-block">{siteConfig.githubOrg}/{pkg.name}</span>
                      </td>
                      <td className="py-4 text-right hidden sm:table-cell align-middle">
                         <div className="w-24 h-4 ml-auto flex items-end justify-between opacity-50 group-hover:opacity-100 transition-opacity gap-[2px]">
                            <div className="w-full bg-border h-[20%]" />
                            <div className="w-full bg-border h-[40%]" />
                            <div className="w-full bg-border h-[30%]" />
                            <div className="w-full bg-border h-[60%]" />
                            <div className="w-full bg-border h-[80%]" />
                            <div className="w-full bg-border h-[50%]" />
                            <div className="w-full bg-foreground h-[90%]" />
                            <div className="w-full bg-foreground h-[100%]" />
                         </div>
                      </td>
                      <td className="py-4 text-right text-muted-foreground flex justify-end items-center space-x-1">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                        <span>{(pkg.downloads / 1000).toFixed(1)}K</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
