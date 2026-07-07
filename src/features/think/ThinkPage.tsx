import { useState } from "react";
import { Segmented } from "../../components/ui";
import { RcaBuilder } from "./RcaBuilder";
import { DecisionMatrix } from "./DecisionMatrix";
import { AssumptionChecker } from "./AssumptionChecker";
import { RiskScanner } from "./RiskScanner";
import { FiveWhys } from "./FiveWhys";

type ThinkTool = "rca" | "fivewhys" | "matrix" | "assumptions" | "risks";

export function ThinkPage() {
  const [tool, setTool] = useState<ThinkTool>("rca");

  return (
    <div>
      <h1 className="page-title">Thinking Gym</h1>
      <p className="page-subtitle">
        Structured tools for engineering judgement. Everything stays on this device.
      </p>
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
