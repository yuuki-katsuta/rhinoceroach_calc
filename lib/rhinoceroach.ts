export interface RhinoCalculation {
  playCount: number;
  rhinoCount: number;
  damage: number;
  ppUsed: number;
}

export interface BounceCalculation extends RhinoCalculation {
  bounceCount: number;
  bouncedRhinos: number[];
}

export interface OptimalPlay {
  playCount: number;
  rhinoCount: number;
  damage: number;
  ppUsed: number;
  bounceCount: number;
  sequence: string[];
}

export interface CardCounts {
  rhinoceroach: number;
  zeroCostCards: number;
  oneCostCards: number;
  twoCostCards: number;
  zeroCostBounce: number;
  oneCostBounce: number;
}

export interface DetailedOptimalPlay extends OptimalPlay {
  cardsUsed: {
    rhinoceroach: number;
    zeroCostCards: number;
    oneCostCards: number;
    twoCostCards: number;
    zeroCostBounce: number;
    oneCostBounce: number;
  };
}

export const RHINO_COST = 1;
export const BOUNCE_COST = 1;

export function calculateRhinoDamage(playCount: number, rhinoCount: number): number {
  if (rhinoCount <= 0 || rhinoCount > 3) return 0;
  
  let damage = 0;
  for (let i = 0; i < rhinoCount; i++) {
    // リノセウス特性：このターン中に（このカードを含めず）カードをプレイした枚数+1/+0
    // つまり基本攻撃力1 + そのリノセウスがプレイされる時点での他のカードのプレイ回数
    damage += 1 + playCount + i; // playCount + i = そのリノセウスがプレイされる時点での他のカードの枚数
  }
  return damage;
}

export function calculateWithBounce(
  playCount: number,
  rhinoCount: number,
  bounceCount: number
): BounceCalculation {
  const initialDamage = calculateRhinoDamage(playCount, rhinoCount);
  const initialPP = rhinoCount * RHINO_COST;
  
  let totalDamage = initialDamage;
  let totalPP = initialPP;
  let currentPlayCount = playCount + rhinoCount;
  const bouncedRhinos: number[] = [];
  
  for (let i = 0; i < bounceCount && i < rhinoCount; i++) {
    totalPP += BOUNCE_COST + RHINO_COST;
    // バウンス後のリノセウス：バウンス(1) + リノセウス(1) = 2カード追加
    // つまりcurrentPlayCount + 1がバウンス後リノセウスがプレイされる時点での他のカード数
    const bounceDamage = 1 + (currentPlayCount + 1); // 基本攻撃力1 + そのリノセウス以外のカード数
    bouncedRhinos.push(bounceDamage);
    totalDamage += bounceDamage;
    currentPlayCount += 2;
  }
  
  return {
    playCount,
    rhinoCount,
    damage: totalDamage,
    ppUsed: totalPP,
    bounceCount,
    bouncedRhinos
  };
}

export function calculateOptimalPlay(
  maxPP: number,
  availableRhinos: number,
  currentPlayCount = 0,
  availableBounces = 0,
  zeroCards = 0
): OptimalPlay {
  const results: OptimalPlay[] = [];
  
  for (let rhinos = 1; rhinos <= Math.min(availableRhinos, 3); rhinos++) {
    for (let bounces = 0; bounces <= Math.min(availableBounces, rhinos); bounces++) {
      for (let zeros = 0; zeros <= zeroCards; zeros++) {
        const totalPlayCount = currentPlayCount + zeros;
        const ppNeeded = rhinos * RHINO_COST + bounces * (BOUNCE_COST + RHINO_COST);
        
        if (ppNeeded <= maxPP) {
          const calc = calculateWithBounce(totalPlayCount, rhinos, bounces);
          const sequence: string[] = [];
          
          for (let i = 0; i < zeros; i++) {
            sequence.push("0コストスペル");
          }
          
          for (let i = 0; i < rhinos; i++) {
            sequence.push(`リノセウス${i + 1}枚目 (${totalPlayCount + i}ダメージ)`);
          }
          
          for (let i = 0; i < bounces; i++) {
            sequence.push(`バウンス → リノセウス (${calc.bouncedRhinos[i]}ダメージ)`);
          }
          
          results.push({
            playCount: totalPlayCount,
            rhinoCount: rhinos,
            damage: calc.damage,
            ppUsed: calc.ppUsed,
            bounceCount: bounces,
            sequence
          });
        }
      }
    }
  }
  
  return results.reduce((best, current) => 
    current.damage > best.damage ? current : best,
    { playCount: 0, rhinoCount: 0, damage: 0, ppUsed: 0, bounceCount: 0, sequence: [] }
  );
}

export function calculateMinCardsForLethal(
  targetDamage: number,
  maxPP: number,
  availableRhinos: number,
  currentPlayCount = 0,
  availableBounces = 0
): { found: boolean; zeroCards: number; optimal: OptimalPlay } {
  for (let zeroCards = 0; zeroCards <= 20; zeroCards++) {
    const optimal = calculateOptimalPlay(
      maxPP,
      availableRhinos,
      currentPlayCount,
      availableBounces,
      zeroCards
    );
    
    if (optimal.damage >= targetDamage) {
      return { found: true, zeroCards, optimal };
    }
  }
  
  return { 
    found: false, 
    zeroCards: -1, 
    optimal: { playCount: 0, rhinoCount: 0, damage: 0, ppUsed: 0, bounceCount: 0, sequence: [] }
  };
}

export function calculateWithEnhance(
  playCount: number,
  rhinoCount: number,
  hasEvolve = false
): RhinoCalculation {
  const baseDamage = calculateRhinoDamage(playCount, rhinoCount);
  const enhanceDamage = hasEvolve ? 2 : 0;
  
  return {
    playCount,
    rhinoCount,
    damage: baseDamage + enhanceDamage,
    ppUsed: rhinoCount * RHINO_COST + (hasEvolve ? 2 : 0)
  };
}

export function calculateDetailedOptimalPlay(
  maxPP: number,
  cards: CardCounts,
  currentPlayCount = 0
): DetailedOptimalPlay {
  let bestPlay: DetailedOptimalPlay = {
    playCount: 0,
    rhinoCount: 0,
    damage: 0,
    ppUsed: 0,
    bounceCount: 0,
    sequence: [],
    cardsUsed: {
      rhinoceroach: 0,
      zeroCostCards: 0,
      oneCostCards: 0,
      twoCostCards: 0,
      zeroCostBounce: 0,
      oneCostBounce: 0
    }
  };

  // すべての可能な組み合わせを試行
  const maxRhinos = Math.min(cards.rhinoceroach, 3);
  
  for (let rhinos = 1; rhinos <= maxRhinos; rhinos++) {
    for (let zeroBounces = 0; zeroBounces <= cards.zeroCostBounce; zeroBounces++) {
      for (let oneBounces = 0; oneBounces <= cards.oneCostBounce; oneBounces++) {
        for (let zeroCards = 0; zeroCards <= cards.zeroCostCards; zeroCards++) {
          for (let oneCards = 0; oneCards <= cards.oneCostCards; oneCards++) {
            for (let twoCards = 0; twoCards <= cards.twoCostCards; twoCards++) {
              const totalBounces = zeroBounces + oneBounces;
              
              // PP制約チェック
              const ppNeeded = rhinos + totalBounces + oneCards + twoCards * 2;
              if (ppNeeded > maxPP) continue;
              
              // バウンス回数がリノセウス初期枚数を超えてもOK（同じリノセウスを何度でもバウンス可能）
              
              // 最適な順序を計算
              const sequence: string[] = [];
              let playCount = currentPlayCount;
              let damage = 0;
              
              // 最初にプレイ回数増加カードを全て使用
              for (let i = 0; i < zeroCards; i++) {
                playCount++;
                sequence.push("0コストカード");
              }
              
              for (let i = 0; i < oneCards; i++) {
                playCount++;
                sequence.push("1コストカード");
              }
              
              for (let i = 0; i < twoCards; i++) {
                playCount++;
                sequence.push("2コストカード");
              }
              
              // 最適戦略：プレイ回数を最大化してからリノセウスとバウンス
              // 総リノセウスプレイ回数 = 手札のリノセウス + バウンス回数
              const totalRhinoPlays = rhinos + totalBounces;
              
              // リノセウスとバウンスを交互に実行
              for (let i = 0; i < totalRhinoPlays; i++) {
                playCount++;
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
                    zeroCostCards: zeroCards,
                    oneCostCards: oneCards,
                    twoCostCards: twoCards,
                    zeroCostBounce: zeroBounces,
                    oneCostBounce: oneBounces
                  }
                };
              }
            }
          }
        }
      }
    }
  }
  
  return bestPlay;
}