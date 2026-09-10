import type { Item, PublicItem } from "@/lib/types";
import { DIAGNOSTIC_ITEMS } from "./diagnostic";
import { LESSON_ITEMS } from "./lesson-items";
import { PRACTICE_ITEMS } from "./practice";
import { CMS_DRAFT_ITEMS, REPAIR_ITEMS, RETRIEVAL_ITEMS } from "./repair-retrieval";

export const ITEM_BANK: Item[] = [
  ...DIAGNOSTIC_ITEMS,
  ...LESSON_ITEMS,
  ...PRACTICE_ITEMS,
  ...REPAIR_ITEMS,
  ...RETRIEVAL_ITEMS,
  ...CMS_DRAFT_ITEMS,
];

export const DIAGNOSTIC_ITEM_IDS = DIAGNOSTIC_ITEMS.map((i) => i.id);

export function getItem(id: string): Item | undefined {
  return ITEM_BANK.find((i) => i.id === id);
}

export function toPublicItem(item: Item): PublicItem {
  return {
    id: item.id,
    version: item.version,
    curriculumVersion: item.curriculumVersion,
    unitId: item.unitId,
    topicId: item.topicId,
    objectiveId: item.objectiveId,
    primaryConceptId: item.primaryConceptId,
    sciencePractice: item.sciencePractice,
    type: item.type,
    difficulty: item.difficulty,
    familyId: item.familyId,
    calculator: item.calculator,
    expectedTimeSec: item.expectedTimeSec,
    prompt: item.prompt,
    stimulus: item.stimulus,
    choices: item.choices?.map((c) => ({ id: c.id, text: c.text })),
    ranking: item.ranking
      ? { options: item.ranking.options }
      : undefined,
    explanationRubric: item.explanationRubric,
    hints: item.hints,
    exposurePool: item.exposurePool,
    accessibilityDescription: item.accessibilityDescription,
    publicationState: item.publicationState,
    allowNotYetLearned: item.allowNotYetLearned,
    numericalUnitHint: item.numerical ? "Include a unit such as m/s or m/s²." : undefined,
  };
}

export function itemsByPool(pool: Item["exposurePool"]): Item[] {
  return ITEM_BANK.filter((i) => i.exposurePool === pool);
}
