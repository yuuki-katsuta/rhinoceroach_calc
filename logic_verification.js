// 現在の実装ロジックの詳細検証

console.log("=== 実装ロジック検証 ===");

// 基本的なリノセウス特性の確認
console.log("\n1. リノセウス基本特性");
console.log(
  "特性: このターン中に（このカードを含めず）カードをプレイした枚数と同じだけ+1/+0",
);
console.log("基本攻撃力: 1");
console.log("ダメージ計算: 1 + (そのリノセウス以外のプレイ済みカード数)");

// 計算順序の検証
console.log("\n2. 実装の計算順序");
console.log(
  "a) 0コストカード → 1コストカード → 2コストカード（プレイ回数増加）",
);
console.log("b) リノセウス＋バウンスの交互実行");
console.log("c) playCount変数でプレイ済み総数を追跡");
console.log("d) 各リノセウス: ダメージ = 1 + (playCount - 1)");

// PP制約の検証
console.log("\n3. PP制約");
console.log(
  "PP消費 = リノセウス回数 + バウンス回数 + 1コストカード + 2コストカード*2",
);
console.log("0コストカードと0コストバウンスはPP消費なし");

// バウンス戦略の検証
console.log("\n4. バウンス戦略");
console.log("- バウンス回数に上限なし（リノセウス枚数の制限削除済み）");
console.log("- 総リノセウスプレイ回数 = 手札のリノセウス + 総バウンス回数");
console.log("- 0コストバウンスを優先使用");

// 具体例での検証
console.log("\n=== 具体例検証 ===");

function verifyCalculation(cards, maxPP, description) {
  console.log(`\n--- ${description} ---`);
  console.log("カード構成:", cards);
  console.log("最大PP:", maxPP);

  const totalBounces = cards.zeroCostBounce + cards.oneCostBounce;
  const totalRhinoPlays = cards.rhinoceroach + totalBounces;
  const ppNeeded =
    cards.rhinoceroach +
    totalBounces +
    cards.oneCostCards +
    cards.twoCostCards * 2;

  console.log("総バウンス回数:", totalBounces);
  console.log("総リノセウスプレイ回数:", totalRhinoPlays);
  console.log("必要PP:", ppNeeded);

  if (ppNeeded > maxPP) {
    console.log("❌ PP不足でプレイ不可");
    return;
  }

  let playCount = 0;
  let damage = 0;
  const sequence = [];

  // プレイ回数増加カード
  for (let i = 0; i < cards.zeroCostCards; i++) {
    playCount++;
    sequence.push(`${playCount}. 0コストカード`);
  }

  for (let i = 0; i < cards.oneCostCards; i++) {
    playCount++;
    sequence.push(`${playCount}. 1コストカード`);
  }

  for (let i = 0; i < cards.twoCostCards; i++) {
    playCount++;
    sequence.push(`${playCount}. 2コストカード`);
  }

  // リノセウス+バウンスの交互実行
  for (let i = 0; i < totalRhinoPlays; i++) {
    playCount++;
    const rhinoDamage = 1 + (playCount - 1);
    damage += rhinoDamage;
    sequence.push(`${playCount}. リノセウス (${rhinoDamage}ダメージ)`);

    // 最後のリノセウス以外で、バウンスがまだ残っている場合のみバウンスを実行
    if (i < totalRhinoPlays - 1 && i < totalBounces) {
      playCount++;
      if (i < cards.zeroCostBounce) {
        sequence.push(`${playCount}. 0コストバウンス`);
      } else {
        sequence.push(`${playCount}. 1コストバウンス`);
      }
    }
  }

  console.log("プレイ順序:");

  for (const step of sequence) {
    console.log(`${step}`);
  }
  console.log(`✅ 合計ダメージ: ${damage}`);
  console.log(`✅ 実際PP消費: ${ppNeeded}`);

  return { damage, ppUsed: ppNeeded, sequence };
}

// テストケース
verifyCalculation(
  {
    rhinoceroach: 1,
    zeroCostCards: 2,
    oneCostCards: 0,
    twoCostCards: 0,
    zeroCostBounce: 2,
    oneCostBounce: 0,
  },
  3,
  "基本例: リノ1枚+0コス2枚+0バウンス2枚",
);

verifyCalculation(
  {
    rhinoceroach: 2,
    zeroCostCards: 1,
    oneCostCards: 1,
    twoCostCards: 0,
    zeroCostBounce: 1,
    oneCostBounce: 0,
  },
  4,
  "複合例: リノ2枚+0コス1枚+1コス1枚+0バウンス1枚",
);

verifyCalculation(
  {
    rhinoceroach: 1,
    zeroCostCards: 0,
    oneCostCards: 0,
    twoCostCards: 0,
    zeroCostBounce: 1,
    oneCostBounce: 1,
  },
  3,
  "混合バウンス例: リノ1枚+0バウンス1枚+1バウンス1枚",
);

verifyCalculation(
  {
    rhinoceroach: 3,
    zeroCostCards: 0,
    oneCostCards: 0,
    twoCostCards: 0,
    zeroCostBounce: 0,
    oneCostBounce: 0,
  },
  3,
  "バウンスなし例: リノ3枚のみ",
);

verifyCalculation(
  {
    rhinoceroach: 1,
    zeroCostCards: 0,
    oneCostCards: 0,
    twoCostCards: 0,
    zeroCostBounce: 5,
    oneCostBounce: 0,
  },
  3,
  "PP制限例: リノ1枚+0バウンス5枚（PP不足）",
);

console.log("\n=== ロジック検証完了 ===");
