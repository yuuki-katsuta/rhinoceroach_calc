import { calculateOptimalPlay } from "@/app/(calculator)/_libs/calculate";
import type { CardCounts } from "@/app/(calculator)/_types/card";

describe("calculateOptimalPlay", () => {
  test("PP不足の場合", () => {
    const cards: CardCounts = {
      rhinoceroach: 3,
      zeroCostCard: 0,
      oneCostCard: 0,
      twoCostCard: 0,
      zeroCostBounce: 0,
      oneCostBounce: 0,
    };

    const result = calculateOptimalPlay(cards, 4, 0);

    // PP4では2体のリノセウスしかプレイできない
    expect(result.damage).toBe(1 + 2); // 3
    expect(result.ppUsed).toBe(4);
    expect(result.sequence.length).toBe(2);
  });

  test("バウンスカードのみでリノセウスがない場合", () => {
    const cards: CardCounts = {
      rhinoceroach: 0,
      zeroCostCard: 1,
      oneCostCard: 1,
      twoCostCard: 0,
      zeroCostBounce: 1,
      oneCostBounce: 1,
    };

    const result = calculateOptimalPlay(cards, 10, 0);

    // リノセウスがないのでダメージは0
    expect(result.damage).toBe(0);
    // ダメージが出せないため、カードを使う意味がない
    expect(result.ppUsed).toBe(0);
    expect(result.sequence.length).toBe(0);
  });

  test("複雑なケース: 全種類のカードを使用", () => {
    const cards: CardCounts = {
      rhinoceroach: 2,
      zeroCostCard: 2,
      oneCostCard: 1,
      twoCostCard: 1,
      zeroCostBounce: 1,
      oneCostBounce: 1,
    };

    const result = calculateOptimalPlay(cards, 10, 0);

    // 最適なプレイを見つける
    expect(result.damage).toBeGreaterThan(0);
    expect(result.ppUsed).toBeLessThanOrEqual(10);
  });

  test("初期プレイ回数が設定されている場合", () => {
    const cards: CardCounts = {
      rhinoceroach: 1,
      zeroCostCard: 0,
      oneCostCard: 0,
      twoCostCard: 0,
      zeroCostBounce: 0,
      oneCostBounce: 0,
    };

    const result = calculateOptimalPlay(cards, 2, 5);

    // 初期プレイ回数5 + リノセウス自身で6回目
    // ダメージ = 1 + 5 = 6
    expect(result.damage).toBe(6);
  });

  test("例: PP7、リノセウス3枚、0コスト1枚、1コストバウンス1枚", () => {
    const cards: CardCounts = {
      rhinoceroach: 3,
      zeroCostCard: 1,
      oneCostCard: 0,
      twoCostCard: 0,
      zeroCostBounce: 0,
      oneCostBounce: 1,
    };

    const result = calculateOptimalPlay(cards, 7, 0);

    // 最適解（0コストカードをバウンス利用）:
    // 1. 0コストカード (プレイ回数1)
    // 2. 1コストバウンス → 0コストカード (プレイ回数2)
    // 3. 0コストカード (プレイ回数3)
    // 4. リノセウス (ダメージ4) - PP2消費
    // 5. リノセウス (ダメージ5) - PP2消費
    // 6. リノセウス (ダメージ6) - PP2消費
    // 合計PP: 0 + 1 + 0 + 2 + 2 + 2 = 7
    // 合計ダメージ: 4 + 5 + 6 = 15

    expect(result.damage).toBe(15);
    expect(result.ppUsed).toBe(7);
    expect(result.sequence.length).toBe(6);
    expect(result.cardsUsed.rhinoceroach).toBe(3);
  });

  test("例: PP8、リノセウス3枚、0コストカード2枚、1コストバウンス2枚", () => {
    const cards: CardCounts = {
      rhinoceroach: 3,
      zeroCostCard: 2,
      oneCostCard: 0,
      twoCostCard: 0,
      zeroCostBounce: 0,
      oneCostBounce: 2,
    };

    const result = calculateOptimalPlay(cards, 8, 0);

    // 最適解:
    // 1. 0コストカード (プレイ回数1)
    // 2. 0コストカード (プレイ回数2)
    // 3. 1コストバウンス → 0コストカード (プレイ回数3)
    // 4. 1コストバウンス → 0コストカード (プレイ回数4)
    // 5. 0コストカード (プレイ回数5)
    // 6. 0コストカード (プレイ回数6)
    // 7. リノセウス (1 + 6 = 7ダメージ) (プレイ回数7)
    // 8. リノセウス (1 + 7 = 8ダメージ) (プレイ回数8)
    // 9. リノセウス (1 + 8 = 9ダメージ) (プレイ回数9)
    // 合計ダメージ: 7 + 8 + 9 = 24
    // 合計PP: 0 + 0 + 1 + 1 + 0 + 0 + 2 + 2 + 2 = 8

    expect(result.damage).toBe(24);
    expect(result.ppUsed).toBe(8);
    expect(result.sequence.length).toBe(9);
  });

  test("例: PP5、リノセウス2枚、0コストカード2枚、1コストバウンス1枚", () => {
    const cards: CardCounts = {
      rhinoceroach: 2,
      zeroCostCard: 2,
      oneCostCard: 0,
      twoCostCard: 0,
      zeroCostBounce: 0,
      oneCostBounce: 1,
    };

    const result = calculateOptimalPlay(cards, 5, 0);

    // 最適解:
    // 1. 0コストカード (プレイ回数1)
    // 2. 0コストカード (プレイ回数2)
    // 3. 1コストバウンス → 0コストカード (プレイ回数3)
    // 4. 0コストカード (プレイ回数4)
    // 5. リノセウス (1 + 5 = 5ダメージ) (プレイ回数5)
    // 6. リノセウス (1 + 6 = 6ダメージ) (プレイ回数6)
    // 合計ダメージ: 5 + 6 = 11
    // 合計PP: 0 + 0 + 1 + 0 + 2 + 2 = 5

    expect(result.damage).toBe(11);
    expect(result.ppUsed).toBe(5);
    expect(result.sequence.length).toBe(6);
  });
});
