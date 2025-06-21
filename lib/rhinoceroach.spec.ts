import { describe, expect } from "vitest";
import {
  type CardCounts,
  calculateDetailedOptimalPlay,
  calculateMinCardsForLethal,
  calculateOptimalPlay,
  calculateRhinoDamage,
  calculateWithBounce,
  calculateWithEnhance,
} from "./rhinoceroach";

describe("calculateRhinoDamage", () => {
  test("should calculate damage for single rhino", () => {
    expect(calculateRhinoDamage(0, 1)).toBe(1); // 基本攻撃力1 + プレイ回数0 = 1
    expect(calculateRhinoDamage(5, 1)).toBe(6); // 基本攻撃力1 + プレイ回数5 = 6
    expect(calculateRhinoDamage(10, 1)).toBe(11); // 基本攻撃力1 + プレイ回数10 = 11
  });

  test("should calculate damage for multiple rhinos", () => {
    expect(calculateRhinoDamage(0, 2)).toBe(3); // (1+0) + (1+1) = 1 + 2 = 3
    expect(calculateRhinoDamage(0, 3)).toBe(6); // (1+0) + (1+1) + (1+2) = 1 + 2 + 3 = 6
    expect(calculateRhinoDamage(5, 2)).toBe(13); // (1+5) + (1+6) = 6 + 7 = 13
    expect(calculateRhinoDamage(5, 3)).toBe(21); // (1+5) + (1+6) + (1+7) = 6 + 7 + 8 = 21
  });

  test("should return 0 for invalid rhino count", () => {
    expect(calculateRhinoDamage(5, 0)).toBe(0);
    expect(calculateRhinoDamage(5, 4)).toBe(0);
    expect(calculateRhinoDamage(5, -1)).toBe(0);
  });
});

describe("calculateWithBounce", () => {
  test("should calculate damage without bounce", () => {
    const result = calculateWithBounce(5, 2, 0);
    expect(result.damage).toBe(13); // (1+5) + (1+6) = 6 + 7 = 13
    expect(result.ppUsed).toBe(2);
    expect(result.bouncedRhinos).toEqual([]);
  });

  test("should calculate damage with single bounce", () => {
    const result = calculateWithBounce(5, 2, 1);
    expect(result.damage).toBe(22); // (1+5) + (1+6) + (1+8) = 6 + 7 + 9 = 22
    expect(result.ppUsed).toBe(4);
    expect(result.bouncedRhinos).toEqual([9]); // 1 + 8 = 9
  });

  test("should calculate damage with multiple bounces", () => {
    const result = calculateWithBounce(5, 3, 2);
    expect(result.damage).toBe(43); // (1+5) + (1+6) + (1+7) + (1+9) + (1+11) = 6 + 7 + 8 + 10 + 12 = 43
    expect(result.ppUsed).toBe(7);
    expect(result.bouncedRhinos).toEqual([10, 12]); // 1+9=10, 1+11=12
  });

  test("should limit bounces to rhino count", () => {
    const result = calculateWithBounce(5, 2, 3);
    expect(result.bounceCount).toBe(3);
    expect(result.bouncedRhinos.length).toBe(2);
  });
});

describe("calculateOptimalPlay", () => {
  test("should find optimal play with limited PP", () => {
    const result = calculateOptimalPlay(3, 3, 0, 2, 5);
    expect(result.ppUsed).toBeLessThanOrEqual(3);
    expect(result.damage).toBeGreaterThan(0);
  });

  test("should prefer more damage when PP allows", () => {
    const result1 = calculateOptimalPlay(5, 3, 0, 2, 5);
    const result2 = calculateOptimalPlay(10, 3, 0, 2, 5);
    expect(result2.damage).toBeGreaterThanOrEqual(result1.damage);
  });

  test("should include zero cost cards in calculation", () => {
    const result1 = calculateOptimalPlay(7, 3, 0, 2, 0);
    const result2 = calculateOptimalPlay(7, 3, 0, 2, 5);
    expect(result2.damage).toBeGreaterThan(result1.damage);
  });

  test("should return empty result when no valid play exists", () => {
    const result = calculateOptimalPlay(0, 3, 0, 2, 0);
    expect(result.damage).toBe(0);
    expect(result.sequence).toEqual([]);
  });
});

describe("calculateMinCardsForLethal", () => {
  test("should find minimum cards for achievable lethal", () => {
    const result = calculateMinCardsForLethal(20, 7, 3, 0, 2);
    if (result.found) {
      expect(result.optimal.damage).toBeGreaterThanOrEqual(20);
      expect(result.zeroCards).toBeGreaterThanOrEqual(0);
    }
  });

  test("should return not found for impossible lethal", () => {
    const result = calculateMinCardsForLethal(100, 3, 1, 0, 0);
    expect(result.found).toBe(false);
    expect(result.zeroCards).toBe(-1);
  });

  test("should use minimum zero cards needed", () => {
    const result = calculateMinCardsForLethal(10, 7, 3, 5, 0);
    if (result.found) {
      expect(result.zeroCards).toBeLessThanOrEqual(5);
    }
  });
});

describe("calculateWithEnhance", () => {
  test("should calculate damage without evolve", () => {
    const result = calculateWithEnhance(5, 2, false);
    expect(result.damage).toBe(13); // (1+5) + (1+6) = 6 + 7 = 13
    expect(result.ppUsed).toBe(2);
  });

  test("should add evolve damage", () => {
    const result = calculateWithEnhance(5, 2, true);
    expect(result.damage).toBe(15); // 13 + 2 = 15
    expect(result.ppUsed).toBe(4);
  });

  test("should calculate correctly with single rhino and evolve", () => {
    const result = calculateWithEnhance(0, 1, true);
    expect(result.damage).toBe(3); // (1+0) + 2 = 1 + 2 = 3
    expect(result.ppUsed).toBe(3);
  });
});

describe("calculateDetailedOptimalPlay", () => {
  test("should calculate optimal play with basic cards", () => {
    const cards: CardCounts = {
      rhinoceroach: 2,
      zeroCostCards: 2,
      oneCostCards: 1,
      twoCostCards: 0,
      zeroCostBounce: 1,
      oneCostBounce: 0,
    };
    const result = calculateDetailedOptimalPlay(7, cards, 0);
    expect(result.damage).toBeGreaterThan(0);
    expect(result.ppUsed).toBeLessThanOrEqual(7);
    expect(result.sequence.length).toBeGreaterThan(0);
  });

  test("should handle zero cost cards correctly", () => {
    const cards: CardCounts = {
      rhinoceroach: 2,
      zeroCostCards: 5,
      oneCostCards: 0,
      twoCostCards: 0,
      zeroCostBounce: 0,
      oneCostBounce: 0,
    };
    const result = calculateDetailedOptimalPlay(7, cards, 0);
    expect(result.cardsUsed.zeroCostCards).toBeGreaterThan(0);
    expect(result.damage).toBeGreaterThan(0);
  });

  test("should optimize with zero cost bounce", () => {
    const cards: CardCounts = {
      rhinoceroach: 3,
      zeroCostCards: 2,
      oneCostCards: 0,
      twoCostCards: 0,
      zeroCostBounce: 2,
      oneCostBounce: 0,
    };
    const result = calculateDetailedOptimalPlay(10, cards, 5);
    expect(result.cardsUsed.zeroCostBounce).toBeGreaterThan(0);
    expect(result.bounceCount).toBeGreaterThan(0);
  });

  test("should return zero damage when no cards available", () => {
    const cards: CardCounts = {
      rhinoceroach: 0,
      zeroCostCards: 0,
      oneCostCards: 0,
      twoCostCards: 0,
      zeroCostBounce: 0,
      oneCostBounce: 0,
    };
    const result = calculateDetailedOptimalPlay(10, cards, 0);
    expect(result.damage).toBe(0);
    expect(result.sequence).toEqual([]);
  });

  test("should calculate your example correctly: 2 rhinos, 1 zero, 1 one, 1 zero bounce", () => {
    const cards: CardCounts = {
      rhinoceroach: 2,
      zeroCostCards: 1,
      oneCostCards: 1,
      twoCostCards: 0,
      zeroCostBounce: 1,
      oneCostBounce: 0,
    };
    const result = calculateDetailedOptimalPlay(4, cards, 0);
    expect(result.damage).toBe(14); // 期待値：3 + 5 + 6 = 14
    expect(result.ppUsed).toBe(4); // 1コス1枚 + リノ3枚 = 4PP
    expect(result.cardsUsed.rhinoceroach).toBe(3); // リノセウス3回プレイ
    expect(result.cardsUsed.zeroCostBounce).toBe(1); // 0コストバウンス1回
  });

  test("should handle multiple bounces with single rhino: 1 rhino, 2 zero cards, 2 zero bounces", () => {
    const cards: CardCounts = {
      rhinoceroach: 1,
      zeroCostCards: 2,
      oneCostCards: 0,
      twoCostCards: 0,
      zeroCostBounce: 2,
      oneCostBounce: 0,
    };
    const result = calculateDetailedOptimalPlay(3, cards, 0);
    expect(result.damage).toBe(15); // 期待値：3 + 5 + 7 = 15
    expect(result.ppUsed).toBe(3); // リノ3回プレイ = 3PP（0コストカードとバウンスはPP消費なし）
    expect(result.cardsUsed.rhinoceroach).toBe(3); // リノセウス3回プレイ（1枚を2回バウンス）
    expect(result.cardsUsed.zeroCostBounce).toBe(2); // 0コストバウンス2回
  });

  // 境界条件テスト
  test("should handle zero cards correctly", () => {
    const cards: CardCounts = {
      rhinoceroach: 1,
      zeroCostCards: 0,
      oneCostCards: 0,
      twoCostCards: 0,
      zeroCostBounce: 0,
      oneCostBounce: 0,
    };
    const result = calculateDetailedOptimalPlay(1, cards, 0);
    expect(result.damage).toBe(1); // リノセウス1枚のみ: 1 + 0 = 1
    expect(result.ppUsed).toBe(1);
    expect(result.cardsUsed.rhinoceroach).toBe(1);
  });

  test("should handle maximum rhinos without bounce", () => {
    const cards: CardCounts = {
      rhinoceroach: 3,
      zeroCostCards: 0,
      oneCostCards: 0,
      twoCostCards: 0,
      zeroCostBounce: 0,
      oneCostBounce: 0,
    };
    const result = calculateDetailedOptimalPlay(3, cards, 0);
    expect(result.damage).toBe(6); // 1 + 2 + 3 = 6
    expect(result.ppUsed).toBe(3);
    expect(result.cardsUsed.rhinoceroach).toBe(3);
  });

  // PP制約テスト
  test("should respect PP constraints", () => {
    const cards: CardCounts = {
      rhinoceroach: 1,
      zeroCostCards: 0,
      oneCostCards: 0,
      twoCostCards: 0,
      zeroCostBounce: 5,
      oneCostBounce: 0,
    };
    const result = calculateDetailedOptimalPlay(3, cards, 0);
    expect(result.damage).toBe(9); // PP制限でリノ3回まで: 1 + 3 + 5 = 9
    expect(result.ppUsed).toBe(3);
    expect(result.cardsUsed.rhinoceroach).toBe(3);
    expect(result.cardsUsed.zeroCostBounce).toBe(2); // PP制限でバウンス2回まで
  });

  test("should handle insufficient PP", () => {
    const cards: CardCounts = {
      rhinoceroach: 1,
      zeroCostCards: 0,
      oneCostCards: 3,
      twoCostCards: 0,
      zeroCostBounce: 0,
      oneCostBounce: 0,
    };
    const result = calculateDetailedOptimalPlay(2, cards, 0);
    expect(result.damage).toBe(2); // PP2で1コス1枚 + リノ1枚: プレイ回数2でリノダメージ = 1 + 1 = 2
    expect(result.ppUsed).toBe(2);
  });

  // 混合バウンステスト
  test("should prioritize zero cost bounces over one cost bounces", () => {
    const cards: CardCounts = {
      rhinoceroach: 1,
      zeroCostCards: 0,
      oneCostCards: 0,
      twoCostCards: 0,
      zeroCostBounce: 1,
      oneCostBounce: 1,
    };
    const result = calculateDetailedOptimalPlay(3, cards, 0);
    expect(result.damage).toBe(9); // 1 + 3 + 5 = 9
    expect(result.ppUsed).toBe(3);
    expect(result.cardsUsed.zeroCostBounce).toBe(1);
    expect(result.cardsUsed.oneCostBounce).toBe(1);
  });

  // 複雑なシナリオテスト
  test("should handle complex mixed card scenario", () => {
    const cards: CardCounts = {
      rhinoceroach: 2,
      zeroCostCards: 1,
      oneCostCards: 1,
      twoCostCards: 1,
      zeroCostBounce: 1,
      oneCostBounce: 1,
    };
    const result = calculateDetailedOptimalPlay(8, cards, 0);
    expect(result.damage).toBeGreaterThan(0);
    expect(result.ppUsed).toBeLessThanOrEqual(8);
    expect(result.cardsUsed.rhinoceroach).toBe(4); // リノ2枚 + バウンス2回 = 4回プレイ
  });

  // 2コストカードテスト
  test("should handle two cost cards correctly", () => {
    const cards: CardCounts = {
      rhinoceroach: 1,
      zeroCostCards: 0,
      oneCostCards: 0,
      twoCostCards: 2,
      zeroCostBounce: 0,
      oneCostBounce: 0,
    };
    const result = calculateDetailedOptimalPlay(5, cards, 0);
    expect(result.damage).toBe(3); // 2コス2枚 + リノ1枚: プレイ回数3でリノダメージ = 1 + 2 = 3
    expect(result.ppUsed).toBe(5); // 2コス2枚(4PP) + リノ1枚(1PP) = 5PP
  });
});
