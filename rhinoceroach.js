
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOUNCE_COST = exports.RHINO_COST = void 0;
exports.calculateRhinoDamage = calculateRhinoDamage;
exports.calculateWithBounce = calculateWithBounce;
exports.calculateOptimalPlay = calculateOptimalPlay;
exports.calculateMinCardsForLethal = calculateMinCardsForLethal;
exports.calculateWithEnhance = calculateWithEnhance;
exports.calculateDetailedOptimalPlay = calculateDetailedOptimalPlay;
exports.RHINO_COST = 1;
exports.BOUNCE_COST = 1;
function calculateRhinoDamage(playCount, rhinoCount) {
    if (rhinoCount <= 0 || rhinoCount > 3)
        return 0;
    let damage = 0;
    for (let i = 0; i < rhinoCount; i++) {
        damage += 1 + playCount + i; // 基本攻撃力1 + プレイ回数
    }
    return damage;
}
function calculateWithBounce(playCount, rhinoCount, bounceCount) {
    const initialDamage = calculateRhinoDamage(playCount, rhinoCount);
    const initialPP = rhinoCount * exports.RHINO_COST;
    let totalDamage = initialDamage;
    let totalPP = initialPP;
    let currentPlayCount = playCount + rhinoCount;
    const bouncedRhinos = [];
    for (let i = 0; i < bounceCount && i < rhinoCount; i++) {
        totalPP += exports.BOUNCE_COST + exports.RHINO_COST;
        const bounceDamage = 1 + currentPlayCount + 1; // 基本攻撃力1 + バウンス後のプレイ回数
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
function calculateOptimalPlay(maxPP, availableRhinos, currentPlayCount = 0, availableBounces = 0, zeroCards = 0) {
    const results = [];
    for (let rhinos = 1; rhinos <= Math.min(availableRhinos, 3); rhinos++) {
        for (let bounces = 0; bounces <= Math.min(availableBounces, rhinos); bounces++) {
            for (let zeros = 0; zeros <= zeroCards; zeros++) {
                const totalPlayCount = currentPlayCount + zeros;
                const ppNeeded = rhinos * exports.RHINO_COST + bounces * (exports.BOUNCE_COST + exports.RHINO_COST);
                if (ppNeeded <= maxPP) {
                    const calc = calculateWithBounce(totalPlayCount, rhinos, bounces);
                    const sequence = [];
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
    return results.reduce((best, current) => current.damage > best.damage ? current : best, { playCount: 0, rhinoCount: 0, damage: 0, ppUsed: 0, bounceCount: 0, sequence: [] });
}
function calculateMinCardsForLethal(targetDamage, maxPP, availableRhinos, currentPlayCount = 0, availableBounces = 0) {
    for (let zeroCards = 0; zeroCards <= 20; zeroCards++) {
        const optimal = calculateOptimalPlay(maxPP, availableRhinos, currentPlayCount, availableBounces, zeroCards);
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
function calculateWithEnhance(playCount, rhinoCount, hasEvolve = false) {
    const baseDamage = calculateRhinoDamage(playCount, rhinoCount);
    const enhanceDamage = hasEvolve ? 2 : 0;
    return {
        playCount,
        rhinoCount,
        damage: baseDamage + enhanceDamage,
        ppUsed: rhinoCount * exports.RHINO_COST + (hasEvolve ? 2 : 0)
    };
}
function calculateDetailedOptimalPlay(maxPP, cards, currentPlayCount = 0) {
    let bestPlay = {
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
        for (let zeroBounces = 0; zeroBounces <= Math.min(cards.zeroCostBounce, rhinos); zeroBounces++) {
            for (let oneBounces = 0; oneBounces <= Math.min(cards.oneCostBounce, rhinos - zeroBounces); oneBounces++) {
                for (let zeroCards = 0; zeroCards <= cards.zeroCostCards; zeroCards++) {
                    for (let oneCards = 0; oneCards <= cards.oneCostCards; oneCards++) {
                        for (let twoCards = 0; twoCards <= cards.twoCostCards; twoCards++) {
                            const totalBounces = zeroBounces + oneBounces;
                            // PP制約チェック
                            const ppNeeded = rhinos + totalBounces + oneCards + twoCards * 2;
                            if (ppNeeded > maxPP)
                                continue;
                            // バウンスできるリノセウスの数を制限
                            if (totalBounces > rhinos)
                                continue;
                            // 最適な順序を計算
                            const sequence = [];
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
                            // バウンス戦略：最大ダメージを得るため、バウンスは後で行う
                            // まず一部のリノセウスを使用
                            const rhinosToPlayFirst = rhinos - totalBounces;
                            for (let i = 0; i < rhinosToPlayFirst; i++) {
                                playCount++;
                                const rhinoDamage = 1 + playCount;
                                damage += rhinoDamage;
                                sequence.push(`リノセウス (${rhinoDamage}ダメージ)`);
                            }
                            // バウンス戦略を実行
                            let _remainingRhinos = totalBounces;
                            // 0コストバウンスを優先（PP効率が良い）
                            for (let i = 0; i < zeroBounces; i++) {
                                playCount++;
                                sequence.push("0コストバウンス");
                                playCount++;
                                const rhinoDamage = 1 + playCount;
                                damage += rhinoDamage;
                                sequence.push(`リノセウス (${rhinoDamage}ダメージ)`);
                                _remainingRhinos--;
                            }
                            // 1コストバウンス
                            for (let i = 0; i < oneBounces; i++) {
                                playCount++;
                                sequence.push("1コストバウンス");
                                playCount++;
                                const rhinoDamage = 1 + playCount;
                                damage += rhinoDamage;
                                sequence.push(`リノセウス (${rhinoDamage}ダメージ)`);
                                _remainingRhinos--;
                            }
                            if (damage > bestPlay.damage) {
                                bestPlay = {
                                    playCount: currentPlayCount,
                                    rhinoCount: rhinos + totalBounces,
                                    damage,
                                    ppUsed: ppNeeded,
                                    bounceCount: totalBounces,
                                    sequence,
                                    cardsUsed: {
                                        rhinoceroach: rhinos + totalBounces,
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
