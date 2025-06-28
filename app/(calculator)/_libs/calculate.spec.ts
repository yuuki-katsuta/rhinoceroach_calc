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

  describe("パラメータテスト", () => {
    describe("基本ケース: リノセウスのみ", () => {
      test.each`
        rhinos | maxPP | expectedDamage | description
        ${1}   | ${2}  | ${1}          | ${"リノセウス1枚、PP2"}
        ${2}   | ${4}  | ${3}          | ${"リノセウス2枚、PP4"}
        ${3}   | ${6}  | ${6}          | ${"リノセウス3枚、PP6"}
        ${3}   | ${4}  | ${3}          | ${"リノセウス3枚、PP不足(4)"}
        ${1}   | ${0}  | ${0}          | ${"PP0では何もできない"}
      `("$description", ({ rhinos, maxPP, expectedDamage }) => {
        const cards: CardCounts = {
          rhinoceroach: rhinos,
          zeroCostCard: 0,
          oneCostCard: 0,
          twoCostCard: 0,
          zeroCostBounce: 0,
          oneCostBounce: 0,
        };

        const result = calculateOptimalPlay(cards, maxPP, 0);
        expect(result.damage).toBe(expectedDamage);
      });
    });

    describe("0コストカードとリノセウスの組み合わせ", () => {
      test.each`
        rhinos | zeroCost | maxPP | expectedDamage | description
        ${1}   | ${1}     | ${2}  | ${2}          | ${"0コスト1枚 + リノセウス1枚"}
        ${2}   | ${1}     | ${4}  | ${5}          | ${"0コスト1枚 + リノセウス2枚"}
        ${3}   | ${2}     | ${6}  | ${12}         | ${"0コスト2枚 + リノセウス3枚"}
        ${1}   | ${3}     | ${2}  | ${4}          | ${"0コスト3枚 + リノセウス1枚"}
      `("$description", ({ rhinos, zeroCost, maxPP, expectedDamage }) => {
        const cards: CardCounts = {
          rhinoceroach: rhinos,
          zeroCostCard: zeroCost,
          oneCostCard: 0,
          twoCostCard: 0,
          zeroCostBounce: 0,
          oneCostBounce: 0,
        };

        const result = calculateOptimalPlay(cards, maxPP, 0);
        expect(result.damage).toBe(expectedDamage);
      });
    });

    describe("バウンスを含む複雑なケース", () => {
      test.each`
        rhinos | zeroCost | oneBounce | maxPP | expectedMinDamage | description
        ${1}   | ${1}     | ${1}     | ${3}  | ${3}             | ${"バウンス基本形"}
        ${2}   | ${1}     | ${1}     | ${5}  | ${8}             | ${"リノセウス2枚でバウンス"}
        ${3}   | ${2}     | ${2}     | ${8}  | ${24}            | ${"ユーザー例: 最大効率"}
        ${2}   | ${2}     | ${1}     | ${5}  | ${11}            | ${"PP制限あり"}
      `("$description", ({ rhinos, zeroCost, oneBounce, maxPP, expectedMinDamage }) => {
        const cards: CardCounts = {
          rhinoceroach: rhinos,
          zeroCostCard: zeroCost,
          oneCostCard: 0,
          twoCostCard: 0,
          zeroCostBounce: 0,
          oneCostBounce: oneBounce,
        };

        const result = calculateOptimalPlay(cards, maxPP, 0);
        expect(result.damage).toBeGreaterThanOrEqual(expectedMinDamage);
        expect(result.ppUsed).toBeLessThanOrEqual(maxPP);
      });
    });

    describe("エッジケース", () => {
      test.each`
        scenario                    | cards                                                                               | maxPP | currentPlayCount | expectedDamage
        ${"カードなし"}              | ${{ rhinoceroach: 0, zeroCostCard: 0, oneCostCard: 0, twoCostCard: 0, zeroCostBounce: 0, oneCostBounce: 0 }} | ${10} | ${0}            | ${0}
        ${"初期プレイ回数10"}        | ${{ rhinoceroach: 1, zeroCostCard: 0, oneCostCard: 0, twoCostCard: 0, zeroCostBounce: 0, oneCostBounce: 0 }} | ${2}  | ${10}           | ${11}
        ${"高コストカードのみ"}      | ${{ rhinoceroach: 0, zeroCostCard: 0, oneCostCard: 0, twoCostCard: 2, zeroCostBounce: 0, oneCostBounce: 0 }} | ${4}  | ${0}            | ${0}
        ${"バウンスのみ"}           | ${{ rhinoceroach: 0, zeroCostCard: 0, oneCostCard: 0, twoCostCard: 0, zeroCostBounce: 1, oneCostBounce: 1 }} | ${10} | ${0}            | ${0}
      `("$scenario", ({ cards, maxPP, currentPlayCount, expectedDamage }) => {
        const result = calculateOptimalPlay(cards, maxPP, currentPlayCount);
        expect(result.damage).toBe(expectedDamage);
      });
    });

    describe("PP効率テスト", () => {
      test.each`
        maxPP | description
        ${1}  | ${"PP1"}
        ${2}  | ${"PP2"}
        ${3}  | ${"PP3"}
        ${5}  | ${"PP5"}
        ${7}  | ${"PP7"}
        ${10} | ${"PP10"}
      `("様々なPP値での基本テスト: $description", ({ maxPP }) => {
        const cards: CardCounts = {
          rhinoceroach: 3,
          zeroCostCard: 2,
          oneCostCard: 1,
          twoCostCard: 1,
          zeroCostBounce: 1,
          oneCostBounce: 1,
        };

        const result = calculateOptimalPlay(cards, maxPP, 0);
        
        // 基本的な不変条件をチェック
        expect(result.damage).toBeGreaterThanOrEqual(0);
        expect(result.ppUsed).toBeLessThanOrEqual(maxPP);
        expect(result.ppUsed).toBeGreaterThanOrEqual(0);
        expect(result.sequence.length).toBeGreaterThanOrEqual(0);
        
        // PP使用量とシーケンス長の整合性
        if (result.damage > 0) {
          expect(result.sequence.length).toBeGreaterThan(0);
        }
      });
    });

    describe("スケーラビリティテスト", () => {
      test.each`
        cardCount | description
        ${1}      | ${"少量カード"}
        ${2}      | ${"標準的なカード数"}
        ${3}      | ${"多めのカード数"}
      `("$description", ({ cardCount }) => {
        const cards: CardCounts = {
          rhinoceroach: cardCount,
          zeroCostCard: cardCount,
          oneCostCard: 0, // 計算量削減のため0に
          twoCostCard: 0, // 計算量削減のため0に
          zeroCostBounce: 0, // 計算量削減のため0に
          oneCostBounce: Math.min(cardCount, 1), // 最大1枚に制限
        };

        const startTime = performance.now();
        const result = calculateOptimalPlay(cards, 6, 0); // PPも削減
        const endTime = performance.now();
        
        // パフォーマンス要件 (1秒以内)
        expect(endTime - startTime).toBeLessThan(1000);
        
        // 結果の妥当性
        expect(result.damage).toBeGreaterThanOrEqual(0);
        expect(result.ppUsed).toBeLessThanOrEqual(6);
      });
    });
  });
});
