import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { usePackage } from "../hooks/use-npm";
import { toast } from "sonner";
import { siteConfig } from "../config";

export function PackageDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: pkg, isLoading, error } = usePackage(id || "");
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"Command" | "Prompt">("Command");

  if (isLoading) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[60vh] py-20">
        <h1 className="text-xl font-mono mb-4 text-muted-foreground">Loading package...</h1>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[60vh] py-20">
        <h1 className="text-2xl font-bold mb-4">Package not found</h1>
        <Link to="/" className="text-sm font-mono text-muted-foreground hover:text-foreground underline">Go back home</Link>
      </div>
    );
  }

  const copyInstallCommand = () => {
    navigator.clipboard.writeText(pkg.installCommand);
    setCopied(true);
    toast.success("Install command copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      <main className="container max-w-screen-xl mx-auto px-4 md:px-8 py-8 md:py-10">
        {/* Breadcrumb */}
        <div className="text-xs font-mono text-muted-foreground mb-8 flex items-center space-x-3">
          <Link to="/" className="hover:text-foreground transition-colors">packages</Link>
          <span>/</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">{siteConfig.githubOrg}</span>
          <span>/</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">packages</span>
          <span>/</span>
          <span className="text-foreground font-semibold">{pkg.name}</span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 break-words">{pkg.name}</h1>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono border border-border px-2 py-0.5 rounded-full text-muted-foreground uppercase bg-secondary/50">Agent workflows</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-10">
            
            {/* Installation */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">INSTALLATION</h2>
                <div className="flex items-center text-xs font-mono border border-border rounded overflow-hidden">
                  <button onClick={() => setTab("Command")} className={`px-3 py-1 ${tab === "Command" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"} transition-colors`}>Command</button>
                  <button onClick={() => setTab("Prompt")} className={`px-3 py-1 ${tab === "Prompt" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"} transition-colors`}>Prompt</button>
                </div>
              </div>
              <div className="border border-border rounded-lg overflow-hidden bg-secondary/20">
                <div className="p-4 flex items-center justify-between group">
                  <div className="font-mono text-sm text-foreground flex items-center space-x-3">
                    <span className="text-muted-foreground">$</span>
                    <span>{tab === "Command" ? pkg.installCommand : `Use ${pkg.name} to enhance your agent`}</span>
                  </div>
                  <button onClick={copyInstallCommand} className="text-muted-foreground hover:text-foreground transition-colors p-1 border border-border rounded opacity-0 group-hover:opacity-100 bg-background">
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </section>

            {/* Summary */}
            <section>
              <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">SUMMARY</h2>
              <div className="border border-border rounded-lg p-6 bg-secondary/10">
                <p className="text-[15px] font-medium leading-relaxed mb-4">
                  Discover and install specialized agent skills from the open ecosystem when users need extended capabilities.
                </p>
                <ul className="space-y-3 text-[13px] text-muted-foreground list-none pl-0">
                  <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-muted-foreground before:rounded-full">
                    Helps identify relevant packages by domain and task when users ask "how do I do X"
                  </li>
                  <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-muted-foreground before:rounded-full">
                    Provides interactive commands to search and install from GitHub or other sources
                  </li>
                  <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-muted-foreground before:rounded-full">
                    Recommends packages based on install count (prefer 1K+), source reputation, and GitHub stars to ensure quality
                  </li>
                </ul>
              </div>
            </section>

            {/* Subskills */}
            {pkg.subskills && pkg.subskills.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">INCLUDED SUBSKILLS</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {pkg.subskills.map((skill, index) => (
                    <div key={index} className="p-4 border border-border rounded-md bg-secondary/10 hover:border-foreground/30 transition-colors">
                      <div className="font-mono text-sm font-semibold mb-2">{skill.name}</div>
                      <div className="text-sm text-muted-foreground">{skill.description}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Readme */}
            <section>
              <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">README.md</h2>
              <div className="prose prose-invert prose-p:text-muted-foreground prose-headings:text-foreground prose-a:text-foreground prose-code:text-foreground max-w-none prose-sm sm:prose-base">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {pkg.readme || "No README available."}
                </ReactMarkdown>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 lg:pl-4">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">INSTALLS</h3>
              <div className="text-4xl font-bold tracking-tight">{(pkg.downloads / 1000).toFixed(1)}M</div>
              <div className="w-full h-8 mt-2 flex items-end justify-between opacity-50 gap-[2px]">
                 <div className="w-full bg-border h-[20%]" />
                 <div className="w-full bg-border h-[40%]" />
                 <div className="w-full bg-border h-[30%]" />
                 <div className="w-full bg-border h-[60%]" />
                 <div className="w-full bg-border h-[80%]" />
                 <div className="w-full bg-border h-[50%]" />
                 <div className="w-full bg-foreground h-[90%]" />
                 <div className="w-full bg-foreground h-[100%]" />
              </div>
            </div>
            
            <div className="border-t border-border pt-8">
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 flex items-center">
                REPOSITORY 
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 ml-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              </h3>
              <a href="https://github.com/Tejas-pr/npm.git" target="_blank" rel="noreferrer" className="text-[13px] hover:underline text-muted-foreground break-all">
                https://github.com/Tejas-pr/npm.git
              </a>
            </div>
            
            <div className="border-t border-border pt-8">
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">GITHUB STARS</h3>
              <div className="flex items-center text-[13px] text-muted-foreground">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 mr-1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                {pkg.stars > 1000 ? (pkg.stars/1000).toFixed(1) + 'K' : pkg.stars}
              </div>
            </div>
            
            <div className="border-t border-border pt-8">
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">FIRST SEEN</h3>
              <div className="text-[13px] text-muted-foreground">
                {new Date(pkg.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
            
            <div className="border-t border-border pt-8">
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">SECURITY AUDITS</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-muted-foreground">Gen Agent Trust Hub</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded border border-[#00ff00]/30 text-[#00ff00] bg-[#00ff00]/5">PASS</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-muted-foreground">Socket</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded border border-[#00ff00]/30 text-[#00ff00] bg-[#00ff00]/5">PASS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
