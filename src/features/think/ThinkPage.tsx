import { useState } from "react";
import { Segmented, TintCard } from "../../components/ui";
import { BoltIcon } from "../../components/icons";
import { RcaBuilder } from "./RcaBuilder";
import { DecisionMatrix } from "./DecisionMatrix";
import { AssumptionChecker } from "./AssumptionChecker";
import { RiskScanner } from "./RiskScanner";
import { FiveWhys } from "./FiveWhys";
import { THINK_WARMUPS, dailyRotation } from "../../data/prompts";
import { todayKey } from "../../lib/date";

type ThinkTool = "rca" | "fivewhys" | "matrix" | "assumptions" | "risks";

export function ThinkPage() {
  const [tool, setTool] = useState<ThinkTool>("rca");
  const warmup = dailyRotation(THINK_WARMUPS, todayKey(), 4);

  return (
    <div>
      <h1 className="page-title">Thinking Gym</h1>
      <p className="page-subtitle">
        Structured tools for engineering judgement. Everything stays on this device.
      </p>

      {/* A fresh two-minute drill every day — never repeats until the
          whole pool has been used. */}
      <TintCard tint="var(--cat-ai)" icon={<BoltIcon />} title="Today’s Warm-up">
        <p className="card-muted" style={{ color: "var(--text)", fontSize: 15 }}>
          {warmup}
        </p>
      </TintCard>
      <Segmented<ThinkTool>
        value={tool}
        onChange={setTool}
        options={[
          { value: "rca", label: "RCA" },
          { value: "fivewhys", label: "5 Whys" },
          { value: "matrix", label: "Decision" },
          { value: "assumptions", label: "Assumptions" },
          { value: "risks", label: "Risks" },
        ]}
      />
      {tool === "rca" && <RcaBuilder />}
      {tool === "fivewhys" && <FiveWhys />}
      {tool === "matrix" && <DecisionMatrix />}
      {tool === "assumptions" && <AssumptionChecker />}
      {tool === "risks" && <RiskScanner />}
    </div>
  );
}
