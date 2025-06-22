import type { CardCounts } from "@/app/(calculator)/_types/card";

export const INITIAL_CARD_COUNTS = {
  rhinoceroach: 0,
  zeroCostCard: 0,
  oneCostCard: 0,
  twoCostCard: 0,
  zeroCostBounce: 0,
  oneCostBounce: 0,
} as const satisfies CardCounts;
