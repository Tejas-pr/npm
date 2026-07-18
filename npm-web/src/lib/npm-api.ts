export interface NpmSearchPackage {
  package: {
    name: string;
    scope: string;
    version: string;
    description: string;
    keywords?: string[];
    date: string;
    links: {
      npm: string;
      homepage?: string;
      repository?: string;
      bugs?: string;
    };
    author?: {
      name: string;
      email?: string;
      url?: string;
    };
    publisher: {
      username: string;
      email: string;
    };
    maintainers: Array<{
      username: string;
      email: string;
    }>;
  };
}

export interface NpmSearchResponse {
  objects: NpmSearchPackage[];
  total: number;
  time: string;
}

export interface NpmPackageDetails {
  _id: string;
  name: string;
  description: string;
  "dist-tags": Record<string, string>;
  versions: Record<string, {
    license?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  }>;
  readme?: string;
  maintainers: Array<{ name: string; email: string }>;
  time: Record<string, string>;
  author?: { name: string; email?: string; url?: string };
  repository?: { type: string; url: string };
  license?: string;
  homepage?: string;
  keywords?: string[];
}

export async function fetchUserPackages(username: string): Promise<NpmSearchResponse> {
  const url = `https://registry.npmjs.org/-/v1/search?text=maintainer:${username}&size=250`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch packages for ${username}`);
  }
  return response.json();
}

export async function fetchPackageDetails(packageName: string): Promise<NpmPackageDetails> {
  const url = `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch details for ${packageName}`);
  }
  return response.json();
}

export async function fetchPackageDownloads(packageName: string): Promise<number> {
  try {
    const url = `https://api.npmjs.org/downloads/point/last-month/${encodeURIComponent(packageName)}`;
    const response = await fetch(url);
    if (!response.ok) return 0;
    const data = await response.json();
    return data.downloads || 0;
  } catch {
    return 0;
  }
}
