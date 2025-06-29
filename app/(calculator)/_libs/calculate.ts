import { CARD_COSTS, MAX_BOUNCE_PER_CARD, MAX_PLAY_COUNT } from "@/app/(calculator)/_libs/constants";
import type { CardCounts } from "@/app/(calculator)/_types/card";
import type { Action, GameState, OptimalResult } from "@/app/(calculator)/_types/game";

const cloneState = (state: GameState): GameState => {
  return {
    ...state,
    hand: { ...state.hand },
    playedCards: { ...state.playedCards },
    sequence: [...state.sequence],
    bounceCount: new Map(state.bounceCount),
  };
};

const getAvailableActions = (state: GameState): Action[] => {
  const actions: Action[] = [];

  // プレイ可能なカードを列挙
  const playableCards: (keyof CardCounts)[] = ["zeroCostCard", "oneCostCard", "twoCostCard", "rhinoceroach"];

  for (const card of playableCards) {
    if (state.hand[card] > 0 && state.pp >= CARD_COSTS[card]) {
      actions.push({
        type: "play",
        card,
        description: getCardName(card),
      });
    }
  }

  // バウンス可能な場合（場にカードがある場合）
  const bounceableCards: (keyof CardCounts)[] = ["rhinoceroach", "zeroCostCard", "oneCostCard", "twoCostCard"];

  const hasPlayedCards = bounceableCards.some((card) => state.playedCards[card] > 0);

  if (hasPlayedCards) {
    // 各バウンスカードについて、各バウンス対象との組み合わせを生成
    if (state.hand.zeroCostBounce > 0 && state.pp >= 0) {
      for (const targetCard of bounceableCards) {
        if (state.playedCards[targetCard] > 0) {
          // バウンス回数制限をチェック
          const bounceKey = `${targetCard}`;
          const currentBounceCount = state.bounceCount.get(bounceKey) || 0;
          if (currentBounceCount < MAX_BOUNCE_PER_CARD) {
            actions.push({
              type: "bounce",
              card: "zeroCostBounce",
              targetCard,
              description: `0コストバウンス → ${getCardName(targetCard)}`,
            });
          }
        }
      }
    }
    if (state.hand.oneCostBounce > 0 && state.pp >= 1) {
      for (const targetCard of bounceableCards) {
        if (state.playedCards[targetCard] > 0) {
          // バウンス回数制限をチェック
          const bounceKey = `${targetCard}`;
          const currentBounceCount = state.bounceCount.get(bounceKey) || 0;
          if (currentBounceCount < MAX_BOUNCE_PER_CARD) {
            actions.push({
              type: "bounce",
              card: "oneCostBounce",
              targetCard,
              description: `1コストバウンス → ${getCardName(targetCard)}`,
            });
          }
        }
      }
    }
  }

  return actions;
};

const getCardName = (card: keyof CardCounts): string => {
  const names: Record<keyof CardCounts, string> = {
    rhinoceroach: "リノセウス",
    zeroCostCard: "0コストカード",
    oneCostCard: "1コストカード",
    twoCostCard: "2コストカード",
    zeroCostBounce: "0コストバウンス",
    oneCostBounce: "1コストバウンス",
  };
  return names[card];
};

const applyAction = (state: GameState, action: Action): GameState => {
  const newState = cloneState(state);
  const cost = CARD_COSTS[action.card];

  newState.pp -= cost;
  newState.playCount++;

  if (action.type === "play") {
    newState.hand[action.card]--;
    newState.playedCards[action.card]++;

    if (action.card === "rhinoceroach") {
      // リノセウスのダメージ計算: 1 + (このカードを含めずにプレイした枚数)
      const damage = 1 + (newState.playCount - 1);
      newState.damage += damage;
      newState.sequence.push({
        ...action,
        damage,
        description: `${action.description} (${damage}ダメージ)`,
      });
    } else {
      newState.sequence.push(action);
    }
  } else if (action.type === "bounce") {
    const targetCard = action.targetCard;
    if (!targetCard) {
      throw new Error("Bounce action must have a target card");
    }
    newState.hand[action.card]--;
    newState.playedCards[targetCard]--;
    newState.hand[targetCard]++;

    // バウンス回数を更新
    const bounceKey = `${targetCard}`;
    const currentCount = newState.bounceCount.get(bounceKey) || 0;
    newState.bounceCount.set(bounceKey, currentCount + 1);

    newState.sequence.push(action);
  }

  return newState;
};

// メモ化キー生成関数
const generateMemoKey = (state: GameState): string => {
  // 数値の配列として表現
  const values = [
    state.pp,
    state.playCount,
    // hand
    state.hand.rhinoceroach,
    state.hand.zeroCostCard,
    state.hand.oneCostCard,
    state.hand.twoCostCard,
    state.hand.zeroCostBounce,
    state.hand.oneCostBounce,
    // playedCards
    state.playedCards.rhinoceroach,
    state.playedCards.zeroCostCard,
    state.playedCards.oneCostCard,
    state.playedCards.twoCostCard,
    state.playedCards.zeroCostBounce,
    state.playedCards.oneCostBounce,
  ];

  // バウンス回数も含める（ソートして順序を固定）
  const bounceEntries = Array.from(state.bounceCount.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .flat();

  return `${values.join(",")}|${bounceEntries.join(",")}`;
};

const search = (state: GameState, memo: Map<string, number>, depth = 0): GameState => {
  // 深さ制限（無限ループ防止）
  if (depth > 20) {
    return state;
  }

  // プレイ回数制限
  if (state.playCount >= MAX_PLAY_COUNT) {
    return state;
  }

  // メモ化のキーを生成（現在のゲーム状態）
  const key = generateMemoKey(state);

  // このゲーム状態での最大ダメージが既に計算されているか確認
  if (memo.has(key)) {
    const memoizedDamage = memo.get(key);
    if (memoizedDamage !== undefined) {
      // 現在の経路で得られるダメージが既知の最大ダメージ以下なら探索を打ち切り
      if (state.damage + memoizedDamage <= state.damage) {
        return state;
      }
    }
  }

  let bestState = state;
  let maxAdditionalDamage = 0;
  const actions = getAvailableActions(state);

  // アクションがない場合は現在の状態を返す
  if (actions.length === 0) {
    memo.set(key, 0);
    return state;
  }

  for (const action of actions) {
    const nextState = applyAction(state, action);
    const resultState = search(nextState, memo, depth + 1);

    if (resultState.damage > bestState.damage) {
      bestState = resultState;
      maxAdditionalDamage = resultState.damage - state.damage;
    }
  }

  // この状態から得られる最大追加ダメージを記録
  memo.set(key, maxAdditionalDamage);
  return bestState;
};

export const calculateOptimalPlay = (cards: CardCounts, maxPP: number, currentPlayCount = 0): OptimalResult => {
  const initialState: GameState = {
    pp: maxPP,
    playCount: currentPlayCount,
    hand: { ...cards },
    playedCards: {
      rhinoceroach: 0,
      zeroCostCard: 0,
      oneCostCard: 0,
      twoCostCard: 0,
      zeroCostBounce: 0,
      oneCostBounce: 0,
    },
    sequence: [],
    damage: 0,
    bounceCount: new Map(),
  };

  const memo = new Map<string, number>();
  const optimalState = search(initialState, memo, 0);

  // 使用したカードを計算
  const cardsUsed: CardCounts = {
    rhinoceroach: 0,
    zeroCostCard: 0,
    oneCostCard: 0,
    twoCostCard: 0,
    zeroCostBounce: 0,
    oneCostBounce: 0,
  };

  for (const action of optimalState.sequence) {
    if (action.type === "play") {
      cardsUsed[action.card]++;
    } else if (action.type === "bounce") {
      cardsUsed[action.card]++;
    }
  }

  return {
    damage: optimalState.damage,
    ppUsed: maxPP - optimalState.pp,
    sequence: optimalState.sequence,
    cardsUsed,
  };
};
