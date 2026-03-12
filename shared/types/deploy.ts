/**
 * Shared deployment target configuration type
 * Used across all packages in the monorepo
 */

export type AppDeployment = "gcp" | "netlify" | "cloudflare-pages" | "other";

/**
 * Deploy configuration object stored inside .embark.jsonc
 */
export interface DeployConfig {
  /** Which platform to deploy to */
  appDeployment: AppDeployment;
  /** Whether to use Cloudflare for custom domain/DNS */
  cloudflareUse: boolean;
  /** Whether to auto-generate a GitHub Actions workflow */
  workflowGen: boolean;
}

/**
 * Required fields for a complete Embark configuration
 */
export interface EmbarkConfig {
  /** Deploy configuration */
  deploy: DeployConfig;
  /** Package name (e.g. "showcase") */
  name: string;
  /** Human-readable title (e.g. "Embark Showcase") */
  title: string;
  /**
   * Subdomain for deployment (e.g. "showcase" -> showcase.embark.dev).
   * Not required when rootDomain is true.
   */
  subdomain?: string;
  /** Package description */
  description: string;
  /**
   * Deploy to the root domain (domain.com) instead of a subdomain.
   * Only ONE package in the monorepo can have this set to true.
   * Any attempt to set a second package as root domain will require
   * explicit confirmation and will unset the previous one.
   */
  rootDomain?: boolean;
  /**
   * Whether the package uses Git submodules.
   * When true, the generated workflow will include `submodules: recursive` in the checkout step.
   */
  useSubmodule?: boolean;
}

/**
 * Required fields that must be present in .embark.jsonc
 */
export const REQUIRED_EMBARK_FIELDS: (keyof EmbarkConfig)[] = [
  "deploy",
  "name",
  "title",
  "description",
  "subdomain",
];
