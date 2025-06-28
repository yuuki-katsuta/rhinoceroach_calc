import type { CardCounts } from "@/app/(calculator)/_types/card";

export interface GameState {
  pp: number;
  playCount: number;
  hand: CardCounts;
  playedCards: CardCounts; // 場にあるカード（バウンス可能）
  sequence: Action[];
  damage: number;
}

export type ActionType = "play" | "bounce";

export interface Action {
  type: ActionType;
  card: keyof CardCounts;
  targetCard?: keyof CardCounts; // バウンス対象（bounceアクションの場合）
  damage?: number;
  description: string;
}

export interface OptimalResult {
  damage: number;
  ppUsed: number;
  sequence: Action[];
  cardsUsed: CardCounts;
}
