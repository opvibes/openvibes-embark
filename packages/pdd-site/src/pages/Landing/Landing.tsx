import Hero from "./Hero";
import ProblemFraming from "./ProblemFraming";
import LegacyVsNew from "./LegacyVsNew";
import Principles from "./Principles";
import ConfidenceTiers from "./ConfidenceTiers";
import CoverageClose from "./CoverageClose";
import PipelineSection from "./Pipeline/PipelineSection";
import BootstrapStage from "./Pipeline/stages/BootstrapStage";
import NewStage from "./Pipeline/stages/NewStage";
import InvestigateStage from "./Pipeline/stages/InvestigateStage";
import ResolveStage from "./Pipeline/stages/ResolveStage";
import CompareStage from "./Pipeline/stages/CompareStage";
import QaLocalStage from "./Pipeline/stages/QaLocalStage";
import PrStage from "./Pipeline/stages/PrStage";
import QaEnvStage from "./Pipeline/stages/QaEnvStage";
import MergeStage from "./Pipeline/stages/MergeStage";

export default function Landing() {
  return (
    <>
      <Hero />
      <ProblemFraming />
      <LegacyVsNew />
      <Principles />
      <div id="pipeline">
        <PipelineSection>
          <BootstrapStage key="bootstrap" />
          <NewStage key="new" />
          <InvestigateStage key="investigate" />
          <ResolveStage key="resolve" />
          <CompareStage key="compare" />
          <QaLocalStage key="qa-local" />
          <PrStage key="pr" />
          <QaEnvStage key="qa-env" />
          <MergeStage key="merge" />
        </PipelineSection>
      </div>
      <ConfidenceTiers />
      <CoverageClose />
    </>
  );
}
