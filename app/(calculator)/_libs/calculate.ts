import type { CardCounts } from "@/app/(calculator)/_types/card";

interface OptimalPlay {
  playCount: number;
  rhinoCount: number;
  damage: number;
  ppUsed: number;
  bounceCount: number;
  sequence: string[];
}

interface DetailedOptimalPlay extends OptimalPlay {
  cardsUsed: {
    rhinoceroach: number;
    zeroCostCard: number;
    oneCostCard: number;
    twoCostCard: number;
    zeroCostBounce: number;
    oneCostBounce: number;
  };
}

export const calculateOptimalPlay = (cards: CardCounts, _maxPP: number, currentPlayCount = 0): DetailedOptimalPlay => {
  let bestPlay: DetailedOptimalPlay = {
    playCount: 0,
    rhinoCount: 0,
    damage: 0,
    ppUsed: 0,
    bounceCount: 0,
    sequence: [],
    cardsUsed: {
      rhinoceroach: 0,
      zeroCostCard: 0,
      oneCostCard: 0,
      twoCostCard: 0,
      zeroCostBounce: 0,
      oneCostBounce: 0,
    },
  };

  // すべての可能な組み合わせを試行
  const maxRhinos = Math.min(cards.rhinoceroach, 3);

  for (let rhinos = 1; rhinos <= maxRhinos; rhinos++) {
    for (let zeroBounces = 0; zeroBounces <= cards.zeroCostBounce; zeroBounces++) {
      for (let oneBounces = 0; oneBounces <= cards.oneCostBounce; oneBounces++) {
        for (let zeroCards = 0; zeroCards <= cards.zeroCostCard; zeroCards++) {
          for (let oneCards = 0; oneCards <= cards.oneCostCard; oneCards++) {
            for (let twoCards = 0; twoCards <= cards.twoCostCard; twoCards++) {
              const totalBounces = zeroBounces + oneBounces;

              const sequence: string[] = [];
              let playCount = currentPlayCount;
              let damage = 0;
              let ppNeeded = 0;

              // 最初にプレイ回数増加カードを全て使用
              for (let i = 0; i < zeroCards; i++) {
                playCount++;
                sequence.push("0コストカード");
              }

              for (let i = 0; i < oneCards; i++) {
                playCount++;
                ppNeeded += 1;
                sequence.push("1コストカード");
              }

              for (let i = 0; i < twoCards; i++) {
                playCount++;
                ppNeeded += 2;
                sequence.push("2コストカード");
              }

              // 総リノセウスプレイ回数 = 手札のリノセウス + バウンス回数
              const totalRhinoPlays = rhinos + totalBounces;

              // リノセウスとバウンスを交互に実行
              for (let i = 0; i < totalRhinoPlays; i++) {
                playCount++;
                ppNeeded += 2;
                // リノセウス特性：このカードを含めずにプレイした枚数分+1/+0
                const rhinoDamage = 1 + (playCount - 1);
                damage += rhinoDamage;
                sequence.push(`リノセウス (${rhinoDamage}ダメージ)`);

                // 最後のリノセウス以外で、バウンスがまだ残っている場合のみバウンスを実行
                if (i < totalRhinoPlays - 1 && i < totalBounces) {
                  playCount++;
                  if (i < zeroBounces) {
                    sequence.push("0コストバウンス");
                  } else {
                    ppNeeded += 1;
                    sequence.push("1コストバウンス");
                  }
                }
              }

              if (damage > bestPlay.damage) {
                bestPlay = {
                  playCount: currentPlayCount,
                  rhinoCount: totalRhinoPlays,
                  damage,
                  ppUsed: ppNeeded,
                  bounceCount: totalBounces,
                  sequence,
                  cardsUsed: {
                    rhinoceroach: totalRhinoPlays,
                    zeroCostCard: zeroCards,
                    oneCostCard: oneCards,
                    twoCostCard: twoCards,
                    zeroCostBounce: zeroBounces,
                    oneCostBounce: oneBounces,
                  },
                };
              }
            }
          }
        }
      }
    }
  }

  return bestPlay;
};
