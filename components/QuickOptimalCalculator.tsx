"use client";

import {
  type CardCounts,
  calculateDetailedOptimalPlay,
} from "@/lib/rhinoceroach";
import { useState } from "react";
import CardManager from "./CardManager";

export default function QuickOptimalCalculator() {
  const [currentPP, setCurrentPP] = useState(10);
  const [currentPlayCount, setCurrentPlayCount] = useState(0);
  const [opponentHp, setOpponentHp] = useState(20);
  const [cards, setCards] = useState<CardCounts>({
    rhinoceroach: 0,
    zeroCostCards: 0,
    oneCostCards: 0,
    twoCostCards: 0,
    zeroCostBounce: 0,
    oneCostBounce: 0,
  });

  const optimal = calculateDetailedOptimalPlay(
    currentPP,
    cards,
    currentPlayCount,
  );
  const isLethal = optimal.damage >= opponentHp;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 font-bold text-2xl text-gray-800">
          クイック最適解計算
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CardManager cards={cards} onChange={setCards} />
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="pp"
                className="mb-2 block font-medium text-gray-700 text-sm"
              >
                現在のPP
              </label>
              <input
                id="pp"
                type="number"
                min="1"
                max="10"
                value={currentPP}
                onChange={(e) =>
                  setCurrentPP(
                    Math.max(1, Number.parseInt(e.target.value) || 1),
                  )
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="play-count"
                className="mb-2 block font-medium text-gray-700 text-sm"
              >
                現在のプレイ回数
              </label>
              <input
                id="play-count"
                type="number"
                min="0"
                max="20"
                value={currentPlayCount}
                onChange={(e) =>
                  setCurrentPlayCount(
                    Math.max(0, Number.parseInt(e.target.value) || 0),
                  )
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="hp"
                className="mb-2 block font-medium text-gray-700 text-sm"
              >
                相手のHP
              </label>
              <input
                id="hp"
                type="number"
                min="1"
                max="40"
                value={opponentHp}
                onChange={(e) =>
                  setOpponentHp(
                    Math.max(1, Number.parseInt(e.target.value) || 1),
                  )
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 font-bold text-gray-800 text-xl">
              最大ダメージ計算結果
            </h3>

            <div
              className={`rounded-lg p-6 ${
                isLethal ? "border-2 border-red-300 bg-red-50" : "bg-blue-50"
              }`}
            >
              <div className="mb-4 text-center">
                <p className="font-bold text-5xl text-red-600">
                  {optimal.damage}
                </p>
                <p className="mt-1 text-gray-600 text-sm">ダメージ</p>
                {isLethal && (
                  <p className="mt-2 font-bold text-lg text-red-600">
                    リーサル可能！
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-gray-700">消費PP</p>
                  <p className="text-blue-600 text-xl">
                    {optimal.ppUsed} / {currentPP}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-700">相手HP</p>
                  <p className="text-gray-600 text-xl">{opponentHp}</p>
                </div>
              </div>

              {!isLethal && (
                <p className="mt-4 text-center text-gray-600 text-sm">
                  あと{opponentHp - optimal.damage}ダメージ必要
                </p>
              )}
            </div>

            <div className="mt-4">
              <h4 className="mb-2 font-semibold text-gray-700">
                使用カード内訳
              </h4>
              <div className="space-y-1 text-sm">
                {optimal.cardsUsed.rhinoceroach > 0 && (
                  <div className="flex justify-between">
                    <span>リノセウス:</span>
                    <span className="font-medium">
                      {optimal.cardsUsed.rhinoceroach}枚
                    </span>
                  </div>
                )}
                {optimal.cardsUsed.zeroCostCards > 0 && (
                  <div className="flex justify-between">
                    <span>0コストカード:</span>
                    <span className="font-medium">
                      {optimal.cardsUsed.zeroCostCards}枚
                    </span>
                  </div>
                )}
                {optimal.cardsUsed.oneCostCards > 0 && (
                  <div className="flex justify-between">
                    <span>1コストカード:</span>
                    <span className="font-medium">
                      {optimal.cardsUsed.oneCostCards}枚
                    </span>
                  </div>
                )}
                {optimal.cardsUsed.twoCostCards > 0 && (
                  <div className="flex justify-between">
                    <span>2コストカード:</span>
                    <span className="font-medium">
                      {optimal.cardsUsed.twoCostCards}枚
                    </span>
                  </div>
                )}
                {optimal.cardsUsed.zeroCostBounce > 0 && (
                  <div className="flex justify-between">
                    <span>0コストバウンス:</span>
                    <span className="font-medium">
                      {optimal.cardsUsed.zeroCostBounce}枚
                    </span>
                  </div>
                )}
                {optimal.cardsUsed.oneCostBounce > 0 && (
                  <div className="flex justify-between">
                    <span>1コストバウンス:</span>
                    <span className="font-medium">
                      {optimal.cardsUsed.oneCostBounce}枚
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-gray-800 text-xl">プレイ順序</h3>

            {optimal.sequence.length > 0 ? (
              <div className="rounded-lg bg-gray-50 p-4">
                <ol className="space-y-2">
                  {optimal.sequence.map((step, index) => (
                    <li
                      key={`step-${index}-${step}`}
                      className="flex items-start"
                    >
                      <span className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 font-bold text-sm text-white">
                        {index + 1}
                      </span>
                      <span className="pt-1 text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">
                <p>有効なプレイがありません</p>
                <p className="mt-2 text-sm">
                  カードを追加するかPPを増やしてください
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm text-yellow-800">
          <strong>💡 戦略のヒント:</strong>{" "}
          0コストカードと0コストバウンスはPPを消費せずにプレイ回数を増やせる最強カードです。
          バウンスカードはリノセウスを手札に戻して再度プレイできるため、ダメージ倍増に最適です。
        </p>
      </div>
    </div>
  );
}
