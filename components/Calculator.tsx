"use client";

import { useState } from "react";

interface CardCounts {
  rhinoceroach: number;
  zeroCostCard: number;
  oneCostCard: number;
  twoCostCard: number;
  zeroCostBounce: number;
  oneCostBounce: number;
}

export const Calculator = () => {
  const [currentPP, setCurrentPP] = useState(10);
  const [currentPlayerCount, setCurrentPlayerCount] = useState(0);
  const [opponentHp, setOpponentHp] = useState(20);
  const [cards, setCards] = useState<CardCounts>({
    rhinoceroach: 0,
    zeroCostCard: 0,
    oneCostCard: 0,
    twoCostCard: 0,
    zeroCostBounce: 0,
    oneCostBounce: 0,
  });

  const isLethal = false;

  return (
    <div className="mx-auto mt-6 grid gap-5">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div>CardManager</div>
          </div>
          {/* <CardManager cards={cards} onChange={setCards} /> */}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="pp"
                className="mb-2 block font-medium text-gray-700 text-sm"
              >
                現在のPP
              </label>
              <input name="pp" type="number" min="1" max="10" />
            </div>

            <div>
              <label
                htmlFor="play-count"
                className="mb-2 block font-medium text-gray-700 text-sm"
              >
                現在のプレイ回数
              </label>
              <input name="play-count" type="number" min="1" max="10" />
            </div>

            <div>
              <label
                htmlFor="hp"
                className="mb-2 block font-medium text-gray-700 text-sm"
              >
                現在のプレイ回数
              </label>
              <input name="hp" type="number" min="1" max="10" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">最大ダメージ</h3>
            <div className="h-[300px] bg-blue-50" />

            <h4 className="mt-3 font-semibold text-gray-700">使用カード内訳</h4>
            <div>xxxxx:</div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 text-lg">プレイ順序</h3>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm text-yellow-800">
          <strong>xxxxx</strong>
        </p>
      </div>
    </div>
  );
};
