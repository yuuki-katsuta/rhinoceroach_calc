"use client";

import type { CardCounts } from "@/lib/rhinoceroach";

interface CardManagerProps {
  cards: CardCounts;
  onChange: (cards: CardCounts) => void;
}

const cardInfo = [
  {
    key: "rhinoceroach",
    name: "リノセウス",
    max: 3,
    cost: 1,
  },
  {
    key: "zeroCostCards",
    name: "0コストカード",
    max: 20,
    cost: 0,
  },
  {
    key: "oneCostCards",
    name: "1コストカード",
    max: 20,
    cost: 1,
  },
  {
    key: "twoCostCards",
    name: "2コストカード",
    max: 20,
    cost: 2,
  },
  {
    key: "zeroCostBounce",
    name: "0コストバウンス",
    max: 10,
    cost: 0,
  },
  {
    key: "oneCostBounce",
    name: "1コストバウンス",
    max: 10,
    cost: 1,
  },
] as const;

export default function CardManager({ cards, onChange }: CardManagerProps) {
  const updateCard = (key: keyof CardCounts, value: number) => {
    const info = cardInfo.find((c) => c.key === key);
    const maxValue = info?.max || 3;
    const newValue = Math.max(0, Math.min(maxValue, value));
    onChange({ ...cards, [key]: newValue });
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800 text-lg">手札カード管理</h3>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {cardInfo.map((card) => (
          <div key={card.key} className="rounded-lg bg-gray-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{card.name}</p>
                <p className="text-gray-500 text-xs">{card.cost}コスト</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => updateCard(card.key, cards[card.key] - 1)}
                  className="h-8 w-8 rounded-md bg-red-500 font-bold text-lg text-white transition-colors hover:bg-red-600"
                  disabled={cards[card.key] === 0}
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-gray-800">
                  {cards[card.key]}
                </span>
                <button
                  type="button"
                  onClick={() => updateCard(card.key, cards[card.key] + 1)}
                  className="h-8 w-8 rounded-md bg-green-500 font-bold text-lg text-white transition-colors hover:bg-green-600"
                  disabled={cards[card.key] === card.max}
                >
                  +
                </button>
              </div>
            </div>

            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-500 transition-all"
                style={{ width: `${(cards[card.key] / card.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 text-gray-600 text-sm">
        <p>
          💡 ヒント:
          0コストカードと0コストバウンスはPPを消費せずプレイ回数を増やせます
        </p>
      </div>
    </div>
  );
}
