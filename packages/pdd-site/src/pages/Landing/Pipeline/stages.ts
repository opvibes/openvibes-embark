export type Tier = "tier-0" | "tier-1" | "tier-2" | "tier-3";
export type PanelMode = "overview" | "flow";

export interface PipelineStage {
  id: string;
  tag: string;
  command: string;
  tier: Tier;
  coverage: number;
  dots: number;
  status: string;
  panel: PanelMode;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: "bootstrap", tag: "00 · one-time setup", command: "/audit-bootstrap", tier: "tier-0", coverage: 0, dots: 0, status: "bootstrapped", panel: "overview" },
  { id: "new", tag: "01 · open a finding", command: "/audit-new 007", tier: "tier-0", coverage: 62, dots: 1, status: "open", panel: "overview" },
  { id: "investigate", tag: "02 · root cause", command: "/audit-investigate 007", tier: "tier-0", coverage: 62, dots: 2, status: "investigated", panel: "flow" },
  { id: "resolve", tag: "03 · fix it", command: "/audit-resolve 007", tier: "tier-1", coverage: 62, dots: 3, status: "resolved", panel: "flow" },
  { id: "compare", tag: "04 · objective proof", command: "/audit-compare 007", tier: "tier-2", coverage: 62, dots: 4, status: "compared", panel: "flow" },
  { id: "qa-local", tag: "05 · human gate #1", command: "/audit-qa 007 local", tier: "tier-2", coverage: 62, dots: 5, status: "qa-local ok", panel: "flow" },
  { id: "pr", tag: "06 · evidence dossier", command: "/audit-pr 007", tier: "tier-2", coverage: 62, dots: 6, status: "pr open", panel: "flow" },
  { id: "qa-env", tag: "07 · human gate #2", command: "/audit-qa 007 staging", tier: "tier-3", coverage: 62, dots: 7, status: "qa-staging ok", panel: "flow" },
  { id: "merge", tag: "08 · 100% human", command: "gh pr merge 007 --squash", tier: "tier-3", coverage: 68, dots: 8, status: "verified", panel: "flow" },
];
