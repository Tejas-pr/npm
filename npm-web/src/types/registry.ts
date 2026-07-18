export interface Author {
  name: string;
  email?: string;
  url?: string;
}

export interface PackageVersion {
  version: string;
  publishedAt: string;
}

export interface AgentSubskill {
  name: string;
  description: string;
}

export interface NpmPackage {
  id: string;
  name: string;
  description: string;
  version: string;
  author: Author;
  license: string;
  tags: string[];
  repository: string;
  homepage?: string;
  downloads: number;
  stars: number;
  readme: string;
  versions: PackageVersion[];
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  installCommand: string;
  createdAt: string;
  updatedAt: string;
  subskills?: AgentSubskill[];
}
