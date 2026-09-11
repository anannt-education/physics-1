import type { Concept, Misconception } from "@/lib/types";
import { UNIT_MCQ_WEIGHTS } from "@/content/exam-spec";

export interface Topic {
  id: string;
  name: string;
  unitId: string;
}

export interface Unit {
  id: string;
  number: number | "F";
  name: string;
  official: boolean;
  mcqWeight: string;
  proposedLessons: number;
  emphasis: string;
  inThisSlice: boolean;
}

export const UNITS: Unit[] = [
  {
    id: "foundation",
    number: "F",
    name: "Foundation bridge",
    official: false,
    mcqWeight: "Not an official unit",
    proposedLessons: UNIT_MCQ_WEIGHTS.foundation.proposedLessons,
    emphasis: "Repair mathematics, graph, and measurement gaps before Unit 1.",
    inThisSlice: true,
  },
  {
    id: "u1",
    number: 1,
    name: "Kinematics",
    official: true,
    mcqWeight: "10–15%",
    proposedLessons: 10,
    emphasis: "Describe motion consistently across representations.",
    inThisSlice: true,
  },
  {
    id: "u2",
    number: 2,
    name: "Force and Translational Dynamics",
    official: true,
    mcqWeight: "18–23%",
    proposedLessons: 18,
    emphasis: "Choose a system and explain changes in motion.",
    inThisSlice: false,
  },
  {
    id: "u3",
    number: 3,
    name: "Work, Energy, and Power",
    official: true,
    mcqWeight: "18–23%",
    proposedLessons: 14,
    emphasis: "Select useful energy models and system boundaries.",
    inThisSlice: false,
  },
  {
    id: "u4",
    number: 4,
    name: "Linear Momentum",
    official: true,
    mcqWeight: "10–15%",
    proposedLessons: 10,
    emphasis: "Analyse interactions and justify conservation.",
    inThisSlice: false,
  },
  {
    id: "u5",
    number: 5,
    name: "Torque and Rotational Dynamics",
    official: true,
    mcqWeight: "10–15%",
    proposedLessons: 14,
    emphasis: "Connect force location with rotational effects.",
    inThisSlice: false,
  },
  {
    id: "u6",
    number: 6,
    name: "Energy and Momentum of Rotating Systems",
    official: true,
    mcqWeight: "5–8%",
    proposedLessons: 12,
    emphasis: "Integrate rotational and translational reasoning.",
    inThisSlice: false,
  },
  {
    id: "u7",
    number: 7,
    name: "Oscillations",
    official: true,
    mcqWeight: "5–8%",
    proposedLessons: 8,
    emphasis: "Relate restoring interactions, graphs, and energy.",
    inThisSlice: false,
  },
  {
    id: "u8",
    number: 8,
    name: "Fluids",
    official: true,
    mcqWeight: "10–15%",
    proposedLessons: 10,
    emphasis: "Apply mechanics principles to fluids.",
    inThisSlice: false,
  },
];

export const TOPICS: Topic[] = [
  { id: "f-graphs", name: "Reading graphs and slope", unitId: "foundation" },
  { id: "f-algebra", name: "Rearranging equations and units", unitId: "foundation" },
  { id: "f-measure", name: "Measurement and variables", unitId: "foundation" },
  { id: "u1-vectors", name: "1D vectors; displacement, velocity, acceleration", unitId: "u1" },
  { id: "u1-graphs", name: "Motion graphs", unitId: "u1" },
  { id: "u1-frames", name: "Reference frames", unitId: "u1" },
  { id: "u1-2d", name: "Two-dimensional motion", unitId: "u1" },
];

export const CONCEPTS: Concept[] = [
  {
    id: "c-slope-as-rate",
    name: "Slope as a rate of change",
    outcome: "Read slope on a graph as Δ(dependent)/Δ(independent), with units.",
    unitId: "foundation",
    topicId: "f-graphs",
    objectiveId: "F.G.1",
    prerequisites: [],
    misconceptions: ["mc-height-as-slope"],
  },
  {
    id: "c-xt-velocity",
    name: "Velocity from a position-time graph",
    outcome:
      "Determine direction and how fast an object moves from the slope of an x-t graph, not from the height of the curve.",
    unitId: "u1",
    topicId: "u1-graphs",
    objectiveId: "1.K.2",
    prerequisites: ["c-slope-as-rate"],
    misconceptions: ["mc-height-as-slope"],
  },
  {
    id: "c-zero-v-nonzero-a",
    name: "Zero instantaneous velocity with nonzero acceleration",
    outcome:
      "Explain that an object can be instantaneously at rest while its velocity is still changing.",
    unitId: "u1",
    topicId: "u1-vectors",
    objectiveId: "1.K.4",
    prerequisites: ["c-xt-velocity"],
    misconceptions: ["mc-stop-means-a-zero"],
  },
  {
    id: "c-flattening-xt",
    name: "Flattening x-t graphs as decreasing speed",
    outcome:
      "Read a curve that gets flatter while still rising as slowing down in +x, not as a photograph of a hill.",
    unitId: "u1",
    topicId: "u1-graphs",
    objectiveId: "1.K.3",
    prerequisites: ["c-xt-velocity"],
    misconceptions: ["mc-graph-as-path"],
  },
];

export const MISCONCEPTIONS: Misconception[] = [
  {
    id: "mc-height-as-slope",
    name: "Graph height confused with slope",
    studentIdea: "A larger value on the vertical axis means a larger rate of change.",
    scientificIdea:
      "The rate of change is the slope (rise over run), not the instantaneous height of the graph.",
    repairPathId: "repair-graph-slope",
    critical: true,
  },
  {
    id: "mc-stop-means-a-zero",
    name: "Instantaneous velocity confused with rate of change",
    studentIdea: "If the object stops, acceleration must be zero because nothing is happening.",
    scientificIdea:
      "Acceleration is the rate of change of velocity. At a turning point velocity can be zero while acceleration remains nonzero.",
    repairPathId: "repair-turning-point",
    critical: true,
  },
  {
    id: "mc-graph-as-path",
    name: "Graph treated as a photograph of the path",
    studentIdea:
      "A flattening x-t curve looks like a hill, so the object must be going over a hill or rolling downhill.",
    scientificIdea:
      "An x-t graph is not a map of the track. Slope is velocity. A curve that gets flatter while still rising is slowing down in the positive direction.",
    repairPathId: "repair-graph-slope",
    critical: true,
  },
];

export function getConcept(id: string) {
  return CONCEPTS.find((c) => c.id === id);
}

export function getMisconception(id: string) {
  return MISCONCEPTIONS.find((m) => m.id === id);
}

export function getUnit(id: string) {
  return UNITS.find((u) => u.id === id);
}
