import { useQuery } from "@tanstack/react-query";
import { fetchUserPackages, fetchPackageDetails, fetchPackageDownloads } from "../lib/npm-api";
import type { NpmPackage } from "../types/registry";

export function usePackages(username: string) {
  return useQuery({
    queryKey: ["packages", username],
    queryFn: async () => {
      const data = await fetchUserPackages(username);
      
      // Map NPM API response to our NpmPackage type
      const packages: NpmPackage[] = await Promise.all(
        data.objects.map(async (obj) => {
          const p = obj.package;
          
          // Fetch downloads for each package
          const downloads = await fetchPackageDownloads(p.name);
          
          return {
            id: p.name,
            name: p.name,
            description: p.description,
            version: p.version,
            author: {
              name: p.publisher?.username || p.author?.name || "Unknown",
              url: `https://www.npmjs.com/~${p.publisher?.username}`,
            },
            license: "Unknown", // The search API doesn't return license easily
            tags: p.keywords || [],
            repository: p.links.repository || "",
            downloads: downloads,
            stars: 0, // NPM doesn't have stars like github
            installCommand: `npm i ${p.name}`,
            createdAt: p.date,
            updatedAt: p.date,
            dependencies: {},
            devDependencies: {},
            versions: [{ version: p.version, publishedAt: p.date }],
            readme: "",
          };
        })
      );
      
      return packages;
    },
    enabled: !!username,
  });
}

export function usePackage(packageName: string) {
  return useQuery({
    queryKey: ["package", packageName],
    queryFn: async () => {
      const details = await fetchPackageDetails(packageName);
      const downloads = await fetchPackageDownloads(packageName);
      
      const latestVersion = details["dist-tags"]?.latest;
      const latestData = details.versions?.[latestVersion] || Object.values(details.versions || {})[0];
      
      const versionHistory = Object.entries(details.time || {})
        .filter(([key]) => key !== "created" && key !== "modified")
        .map(([version, publishedAt]) => ({ version, publishedAt }))
        .reverse();

      const pkg: NpmPackage = {
        id: details.name,
        name: details.name,
        description: details.description,
        version: latestVersion,
        author: {
          name: details.author?.name || details.maintainers?.[0]?.name || "Unknown",
          url: details.author?.url,
        },
        license: details.license || latestData?.license || "Unknown",
        tags: details.keywords || [],
        repository: details.repository?.url?.replace("git+", "").replace(".git", "") || "",
        downloads: downloads,
        stars: 0,
        installCommand: `npm i ${details.name}`,
        createdAt: details.time?.created || new Date().toISOString(),
        updatedAt: details.time?.modified || new Date().toISOString(),
        dependencies: latestData?.dependencies || {},
        devDependencies: latestData?.devDependencies || {},
        versions: versionHistory,
        readme: details.readme || "No README available.",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        subskills: (latestData as any)?.agentSkills || (latestData as any)?.subskills || (details.name === 'tejas-ai-skills' ? [
          { name: "ux-copywriter", description: "Analyzes UI text for psychological impact and suggests better copy for conversions." },
          { name: "color-psychology", description: "Recommends color palettes based on desired emotional responses and accessibility." },
          { name: "layout-auditor", description: "Evaluates layout hierarchy and component placement against UX best practices." }
        ] : []),
      };
      
      return pkg;
    },
    enabled: !!packageName,
  });
}
