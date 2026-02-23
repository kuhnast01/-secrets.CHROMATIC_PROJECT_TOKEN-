import { promises as fs } from "node:fs";
import path from "node:path";

type LinkIssueReason = "missing target file" | "missing local anchor" | "missing target anchor";

type LinkIssue = {
  filePath: string;
  link: string;
  reason: LinkIssueReason;
};

const backendRoot = process.cwd();
const repoRoot = path.resolve(backendRoot, "..");
const ignoredDirectoryNames = new Set(["node_modules", "coverage", "tmp", "dist", "build", ".git"]);
const targetSlugCache = new Map<string, Set<string>>();

function isExternalLink(link: string): boolean {
  return /^(https?:|mailto:|tel:|data:|javascript:)/i.test(link);
}

function normalizeMarkdownLink(rawTarget: string): string {
  const trimmed = rawTarget.trim();

  if (trimmed.startsWith("<") && trimmed.endsWith(">")) {
    return trimmed.slice(1, -1).trim();
  }

  const withNoTitle = trimmed.replace(/\s+(?:"[^"]*"|'[^']*')\s*$/, "");
  return withNoTitle.trim();
}

function slugifyHeading(headingText: string): string {
  const normalized = headingText
    .trim()
    .replace(/\s+#+\s*$/, "")
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^a-z0-9\s_-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized;
}

function extractHeadingSlugs(markdownContent: string): Set<string> {
  const slugs = new Set<string>();
  const slugCounts = new Map<string, number>();
  const headingRegex = /^#{1,6}\s+(.+)$/gm;
  let headingMatch = headingRegex.exec(markdownContent);

  while (headingMatch) {
    const baseSlug = slugifyHeading(headingMatch[1] ?? "");
    if (baseSlug.length > 0) {
      const duplicateCount = slugCounts.get(baseSlug) ?? 0;
      const resolvedSlug = duplicateCount === 0 ? baseSlug : `${baseSlug}-${duplicateCount}`;
      slugs.add(resolvedSlug);
      slugCounts.set(baseSlug, duplicateCount + 1);
    }
    headingMatch = headingRegex.exec(markdownContent);
  }

  return slugs;
}

async function getMarkdownTargetSlugs(targetFilePath: string): Promise<Set<string>> {
  const cached = targetSlugCache.get(targetFilePath);
  if (cached) {
    return cached;
  }

  const markdownContent = await fs.readFile(targetFilePath, "utf8");
  const slugs = extractHeadingSlugs(markdownContent);
  targetSlugCache.set(targetFilePath, slugs);
  return slugs;
}

function splitLinkTarget(linkTarget: string): { pathPart: string; anchorPart: string | null } {
  const hashIndex = linkTarget.indexOf("#");
  if (hashIndex === -1) {
    return { pathPart: linkTarget, anchorPart: null };
  }

  const pathPart = linkTarget.slice(0, hashIndex);
  const anchorPart = linkTarget.slice(hashIndex + 1);
  return { pathPart, anchorPart: anchorPart.length ? anchorPart : null };
}

async function collectMarkdownFiles(scanDirectory: string): Promise<string[]> {
  const entries = await fs.readdir(scanDirectory, { withFileTypes: true });
  const markdownFiles: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(scanDirectory, entry.name);

    if (entry.isDirectory()) {
      if (ignoredDirectoryNames.has(entry.name)) {
        continue;
      }
      markdownFiles.push(...(await collectMarkdownFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      markdownFiles.push(fullPath);
    }
  }

  return markdownFiles;
}

function resolveTargetPath(currentFilePath: string, linkPathPart: string): string {
  const decodedPath = decodeURIComponent(linkPathPart);

  if (decodedPath.startsWith("/")) {
    return path.resolve(repoRoot, decodedPath.slice(1));
  }

  return path.resolve(path.dirname(currentFilePath), decodedPath);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function run(): Promise<void> {
  const markdownFiles = await collectMarkdownFiles(backendRoot);
  const issues: LinkIssue[] = [];

  for (const filePath of markdownFiles) {
    const markdownContent = await fs.readFile(filePath, "utf8");
    const localSlugs = extractHeadingSlugs(markdownContent);
    const linkRegex = /!?\[[^\]]*\]\(([^)]+)\)/g;
    let linkMatch = linkRegex.exec(markdownContent);

    while (linkMatch) {
      const rawTarget = linkMatch[1] ?? "";
      const normalizedTarget = normalizeMarkdownLink(rawTarget);

      if (!normalizedTarget || isExternalLink(normalizedTarget)) {
        linkMatch = linkRegex.exec(markdownContent);
        continue;
      }

      const { pathPart, anchorPart } = splitLinkTarget(normalizedTarget);

      if (!pathPart) {
        if (anchorPart) {
          const decodedAnchor = decodeURIComponent(anchorPart).toLowerCase();
          if (!localSlugs.has(decodedAnchor)) {
            issues.push({ filePath, link: normalizedTarget, reason: "missing local anchor" });
          }
        }

        linkMatch = linkRegex.exec(markdownContent);
        continue;
      }

      const resolvedPath = resolveTargetPath(filePath, pathPart);
      const backendRelativeFallbackPath = path.resolve(backendRoot, decodeURIComponent(pathPart));
      const resolvedTargetPath = (await fileExists(resolvedPath))
        ? resolvedPath
        : (await fileExists(backendRelativeFallbackPath))
          ? backendRelativeFallbackPath
          : null;

      if (!resolvedTargetPath) {
        issues.push({ filePath, link: normalizedTarget, reason: "missing target file" });
        linkMatch = linkRegex.exec(markdownContent);
        continue;
      }

      if (anchorPart && path.extname(resolvedTargetPath).toLowerCase() === ".md") {
        const targetSlugs = await getMarkdownTargetSlugs(resolvedTargetPath);
        const decodedAnchor = decodeURIComponent(anchorPart).toLowerCase();
        if (!targetSlugs.has(decodedAnchor)) {
          issues.push({ filePath, link: normalizedTarget, reason: "missing target anchor" });
        }
      }

      linkMatch = linkRegex.exec(markdownContent);
    }
  }

  if (issues.length === 0) {
    console.log("Markdown link check passed.");
    return;
  }

  console.error(`Markdown link check failed with ${issues.length} issue(s):`);
  for (const issue of issues) {
    const relativeFilePath = path.relative(backendRoot, issue.filePath).replace(/\\/g, "/");
    console.error(`- ${relativeFilePath}: [${issue.reason}] ${issue.link}`);
  }

  process.exitCode = 1;
}

run().catch((error) => {
  console.error("Unexpected error while checking markdown links.");
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(String(error));
  }
  process.exitCode = 1;
});
