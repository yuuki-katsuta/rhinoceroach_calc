export interface CardCounts {
  rhinoceroach: number;
  zeroCostCard: number;
  oneCostCard: number;
  twoCostCard: number;
  zeroCostBounce: number;
  oneCostBounce: number;
}

export interface Card {
  key: keyof CardCounts;
  name: string;
  max: number;
  cost: number;
}
