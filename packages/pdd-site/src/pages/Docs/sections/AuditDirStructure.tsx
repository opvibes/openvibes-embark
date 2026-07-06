import { useI18n } from "../../../i18n";
import CodeBlock from "../CodeBlock";

export default function AuditDirStructure() {
  const { t } = useI18n();

  return (
    <section id="audit-dir" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-semibold text-[#f2f8fc] mb-4">{t.docs.auditDirStructure.title}</h2>
      <p className="text-[#8fb3cc] text-[15px] leading-relaxed mb-4">{t.docs.auditDirStructure.intro}</p>
      <CodeBlock>
        {`.audit/\n├── BOOTSTRAP.md            reference/new adapters, preview mode, coverage baseline, thresholds\n├── board.md               tasks and cross-finding state\n├── coverage.md            the parity coverage map\n├── findings/NNN-<slug>/\n│   ├── README.md          finding frontmatter\n│   ├── investigation.md   root cause\n│   ├── resolution.md      fix + evidence block + PR URL\n│   └── refs/              parity diff, screenshots\n└── resolved/NNN-<slug>/   findings that shipped`}
      </CodeBlock>
    </section>
  );
}
