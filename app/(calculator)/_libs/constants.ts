import type { Card, CardCounts } from "@/app/(calculator)/_types/card";

export const INITIAL_CARD_COUNTS = {
  rhinoceroach: 0,
  zeroCostCard: 0,
  oneCostCard: 0,
  twoCostCard: 0,
  zeroCostBounce: 0,
  oneCostBounce: 0,
} as const satisfies CardCounts;

export const CARD_INFO = [
  {
    key: "rhinoceroach",
    name: "リノセウス",
    max: 10,
    cost: 1,
  },
  {
    key: "zeroCostCard",
    name: "0コストカード",
    max: 20,
    cost: 0,
  },
  {
    key: "oneCostCard",
    name: "1コストカード",
    max: 20,
    cost: 1,
  },
  {
    key: "twoCostCard",
    name: "2コストカード",
    max: 20,
    cost: 2,
  },
  {
    key: "zeroCostBounce",
    name: "0コストバウンス",
    max: 10,
    cost: 0,
  },
  {
    key: "oneCostBounce",
    name: "1コストバウンス",
    max: 10,
    cost: 1,
  },
] as const satisfies Card[];
