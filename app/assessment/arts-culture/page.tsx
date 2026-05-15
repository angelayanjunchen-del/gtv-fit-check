"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Wand2 } from "lucide-react";

import { AssessmentStepper } from "@/components/AssessmentStepper";
import { QuestionCard } from "@/components/QuestionCard";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEMO_ASSESSMENT,
  EMPTY_ASSESSMENT,
  runScoring,
} from "@/lib/scoring";
import type { ArtsAssessment } from "@/lib/types";

const STEPS = [
  { id: "profile", label: "Career profile" },
  { id: "recognition", label: "Recognition" },
  { id: "evidence", label: "Evidence" },
  { id: "uk-plan", label: "UK plan" },
];

const FREQ_OPTIONS = [
  { value: "none", label: "None" },
  { value: "few", label: "1–2" },
  { value: "several", label: "3–5" },
  { value: "many", label: "6+" },
];

const YN_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "Not yet" },
  { value: "unsure", label: "Unsure" },
];

export default function ArtsCultureAssessment() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<ArtsAssessment>(EMPTY_ASSESSMENT);

  const update = <K extends keyof ArtsAssessment>(
    key: K,
    value: ArtsAssessment[K]
  ) => setData((prev) => ({ ...prev, [key]: value }));

  const canAdvance = useMemo(
    () => isStepComplete(stepIndex, data),
    [stepIndex, data]
  );

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      submit(data);
    }
  };

  const goBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const submit = (payload: ArtsAssessment) => {
    const result = runScoring(payload);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "gtv-fit-check:last-result",
        JSON.stringify({ result, data: payload, at: Date.now() })
      );
    }
    router.push("/result");
  };

  const fillDemo = () => {
    setData(DEMO_ASSESSMENT);
  };

  return (
    <section className="container max-w-3xl py-12 sm:py-20">
      <Link
        href="/assessment"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Change route
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge variant="muted">
            <span className="text-[10px] uppercase tracking-wider">
              Arts & Culture
            </span>
          </Badge>
          <h1 className="editorial-heading mt-4 text-balance text-3xl sm:text-4xl">
            Tell us a little about your practice.
          </h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fillDemo}
          className="gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <Wand2 className="h-3.5 w-3.5" />
          Fill with demo answers
        </Button>
      </div>

      <div className="mt-8">
        <AssessmentStepper steps={STEPS} current={stepIndex} />
      </div>

      <Card className="mt-8 animate-fade-in">
        <CardContent className="p-7 sm:p-10">
          {stepIndex === 0 && <StepProfile data={data} update={update} />}
          {stepIndex === 1 && <StepRecognition data={data} update={update} />}
          {stepIndex === 2 && <StepEvidence data={data} update={update} />}
          {stepIndex === 3 && <StepUkPlan data={data} update={update} />}

          <div className="mt-10 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
            <Button
              variant="ghost"
              onClick={goBack}
              disabled={stepIndex === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={goNext}
              disabled={!canAdvance}
              className="gap-2"
              size="lg"
            >
              {stepIndex === STEPS.length - 1
                ? "See my result"
                : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <DisclaimerBox className="mt-8" />
    </section>
  );
}

function isStepComplete(step: number, d: ArtsAssessment) {
  if (step === 0)
    return (
      d.careerStage !== null &&
      d.creativeField !== null &&
      d.yearsOfExperience !== null
    );
  if (step === 1)
    return (
      d.internationalAwards !== null &&
      d.shortlistedAwards !== null &&
      d.soloExhibitions !== null &&
      d.groupExhibitions !== null &&
      d.publicPerformances !== null &&
      d.residencies !== null &&
      d.pressMediaCoverage !== null
    );
  if (step === 2)
    return (
      d.hasOfficialProof !== null &&
      d.hasPressLinks !== null &&
      d.hasRecommenderSources !== null &&
      d.recommendersAreSenior !== null &&
      d.evidenceFromMultipleCountries !== null
    );
  if (step === 3)
    return (
      d.hasUkCareerPlan !== null &&
      d.hasUkConnections !== null &&
      d.planToBuildInUk !== null
    );
  return false;
}

interface StepProps {
  data: ArtsAssessment;
  update: <K extends keyof ArtsAssessment>(
    key: K,
    value: ArtsAssessment[K]
  ) => void;
}

function StepHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="editorial-heading mt-2 text-2xl sm:text-3xl text-foreground">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function StepProfile({ data, update }: StepProps) {
  return (
    <div>
      <StepHeader
        eyebrow="A. Career profile"
        title="Where are you in your career?"
        description="Just three quick questions to set the scene."
      />

      <div className="space-y-8">
        <QuestionCard
          name="careerStage"
          label="Career stage"
          hint="Roughly — there&apos;s no single definition. Pick the closest."
          value={data.careerStage}
          onChange={(v) => update("careerStage", v as ArtsAssessment["careerStage"])}
          options={[
            {
              value: "emerging",
              label: "Emerging",
              description: "Building a body of work; gaining first recognition.",
            },
            {
              value: "mid-career",
              label: "Mid-career",
              description: "Established practice; multiple shows, residencies or features.",
            },
            {
              value: "established",
              label: "Established",
              description: "Recognised internationally as a leader in your field.",
            },
          ]}
        />

        <QuestionCard
          name="creativeField"
          label="Main creative field"
          value={data.creativeField}
          onChange={(v) =>
            update("creativeField", v as ArtsAssessment["creativeField"])
          }
          layout="grid"
          options={[
            { value: "visual-arts", label: "Visual arts" },
            { value: "fashion", label: "Fashion" },
            { value: "music", label: "Music" },
            { value: "film", label: "Film" },
            { value: "theatre", label: "Theatre" },
            { value: "literature", label: "Literature" },
            { value: "other", label: "Other" },
          ]}
        />

        <div>
          <Label htmlFor="years" className="text-base">
            Years of professional experience
          </Label>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Counting from when you began working professionally.
          </p>
          <Input
            id="years"
            type="number"
            min={0}
            max={70}
            inputMode="numeric"
            placeholder="e.g. 7"
            value={data.yearsOfExperience ?? ""}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") return update("yearsOfExperience", null);
              const n = Number(raw);
              if (!Number.isFinite(n)) return;
              update("yearsOfExperience", Math.max(0, Math.min(70, n)));
            }}
            className="mt-3 max-w-[200px]"
          />
        </div>
      </div>
    </div>
  );
}

function StepRecognition({ data, update }: StepProps) {
  return (
    <div>
      <StepHeader
        eyebrow="B. Recognition"
        title="What has your work received?"
        description="Approximate counts over the last 5 years. Choose the closest range."
      />

      <div className="space-y-8">
        <QuestionCard
          name="internationalAwards"
          label="International awards won"
          hint="Recognised, peer-judged awards outside your home country."
          value={data.internationalAwards}
          onChange={(v) => update("internationalAwards", v as any)}
          options={FREQ_OPTIONS}
          layout="grid"
        />
        <QuestionCard
          name="shortlistedAwards"
          label="Shortlisted or nominated awards"
          value={data.shortlistedAwards}
          onChange={(v) => update("shortlistedAwards", v as any)}
          options={FREQ_OPTIONS}
          layout="grid"
        />
        <QuestionCard
          name="soloExhibitions"
          label="Solo exhibitions"
          hint="Solo shows, performances or curated solo presentations."
          value={data.soloExhibitions}
          onChange={(v) => update("soloExhibitions", v as any)}
          options={FREQ_OPTIONS}
          layout="grid"
        />
        <QuestionCard
          name="groupExhibitions"
          label="Group exhibitions"
          value={data.groupExhibitions}
          onChange={(v) => update("groupExhibitions", v as any)}
          options={FREQ_OPTIONS}
          layout="grid"
        />
        <QuestionCard
          name="publicPerformances"
          label="Public performances or screenings"
          hint="Festival screenings, public premieres, performances at recognised venues."
          value={data.publicPerformances}
          onChange={(v) => update("publicPerformances", v as any)}
          options={FREQ_OPTIONS}
          layout="grid"
        />
        <QuestionCard
          name="residencies"
          label="Residencies or fellowships"
          value={data.residencies}
          onChange={(v) => update("residencies", v as any)}
          options={FREQ_OPTIONS}
          layout="grid"
        />
        <QuestionCard
          name="pressMediaCoverage"
          label="Press or media coverage"
          hint="Independent press, reviews, interviews or features in respected publications."
          value={data.pressMediaCoverage}
          onChange={(v) => update("pressMediaCoverage", v as any)}
          options={FREQ_OPTIONS}
          layout="grid"
        />
      </div>
    </div>
  );
}

function StepEvidence({ data, update }: StepProps) {
  return (
    <div>
      <StepHeader
        eyebrow="C. Evidence strength"
        title="How well can you back it up?"
        description="Strong applications stand or fall on documentation. Be honest — gaps are normal."
      />

      <div className="space-y-8">
        <QuestionCard
          name="hasOfficialProof"
          label="Do you have official proof for your achievements?"
          hint="Certificates, contracts, programmes, official listings."
          value={data.hasOfficialProof}
          onChange={(v) => update("hasOfficialProof", v as any)}
          options={YN_OPTIONS}
          layout="grid"
        />
        <QuestionCard
          name="hasPressLinks"
          label="Do you have press links or PDFs you can include?"
          value={data.hasPressLinks}
          onChange={(v) => update("hasPressLinks", v as any)}
          options={YN_OPTIONS}
          layout="grid"
        />
        <QuestionCard
          name="hasRecommenderSources"
          label="Do you have potential sources for recommendation letters?"
          hint="People who know your work first-hand and could write a detailed letter."
          value={data.hasRecommenderSources}
          onChange={(v) => update("hasRecommenderSources", v as any)}
          options={YN_OPTIONS}
          layout="grid"
        />
        <QuestionCard
          name="recommendersAreSenior"
          label="Are your recommenders senior or internationally recognised?"
          hint="Directors, curators, professors, festival heads, established peers."
          value={data.recommendersAreSenior}
          onChange={(v) => update("recommendersAreSenior", v as any)}
          options={YN_OPTIONS}
          layout="grid"
        />
        <QuestionCard
          name="evidenceFromMultipleCountries"
          label="Do you have evidence from more than one country?"
          value={data.evidenceFromMultipleCountries}
          onChange={(v) => update("evidenceFromMultipleCountries", v as any)}
          options={YN_OPTIONS}
          layout="grid"
        />
      </div>
    </div>
  );
}

function StepUkPlan({ data, update }: StepProps) {
  return (
    <div>
      <StepHeader
        eyebrow="D. UK career plan"
        title="What does your UK chapter look like?"
        description="A clear plan signals genuine intent and adds weight to your application."
      />

      <div className="space-y-8">
        <QuestionCard
          name="hasUkCareerPlan"
          label="Do you have a clear UK-based career plan?"
          hint="A written plan, even informal, of what you want to do in the UK."
          value={data.hasUkCareerPlan}
          onChange={(v) => update("hasUkCareerPlan", v as any)}
          options={YN_OPTIONS}
          layout="grid"
        />
        <QuestionCard
          name="hasUkConnections"
          label="Do you have UK exhibitions, projects, collaborators, clients or institutions?"
          value={data.hasUkConnections}
          onChange={(v) => update("hasUkConnections", v as any)}
          options={YN_OPTIONS}
          layout="grid"
        />
        <QuestionCard
          name="planToBuildInUk"
          label="Do you plan to develop your career in the UK arts and culture sector?"
          value={data.planToBuildInUk}
          onChange={(v) => update("planToBuildInUk", v as any)}
          options={YN_OPTIONS}
          layout="grid"
        />
      </div>
    </div>
  );
}
