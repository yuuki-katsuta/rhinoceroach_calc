"use client";

import { CardManager } from "@/app/(calculator)/_components/CardManager";
import { calculateOptimalPlay } from "@/app/(calculator)/_libs/calculate";
import { INITIAL_CARD_COUNTS } from "@/app/(calculator)/_libs/constants";
import type { CardCounts } from "@/app/(calculator)/_types/card";
import { useState } from "react";

export const Calculator = () => {
  const [currentPP, setCurrentPP] = useState(10);
  const [currentPlayCount, setCurrentPlayCount] = useState(0);
  const [opponentHp, setOpponentHp] = useState(20);
  const [cards, setCards] = useState<CardCounts>(INITIAL_CARD_COUNTS);

  const optimal = calculateOptimalPlay(cards, currentPP, currentPlayCount);
  const isLethal = false;

  const handleChangeCard = (card: Partial<CardCounts>) => {
    setCards((prev) => ({ ...prev, ...card }));
  };

  return (
    <div className="mx-auto mt-6 grid gap-5">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CardManager cards={cards} onChange={handleChangeCard} />
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="pp" className="mb-1 block font-medium text-gray-700 text-sm">
                現在のPP
              </label>
              <input
                name="pp"
                type="number"
                min="1"
                max="10"
                value={currentPP}
                onChange={(e) => {
                  setCurrentPP(Number.parseInt(e.target.value, 10));
                }}
                className="w-full rounded-md border border-gray-300 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="play-count" className="mb-1 block font-medium text-gray-700 text-sm">
                現在のプレイ回数
              </label>
              <input
                name="play-count"
                type="number"
                min="1"
                max="10"
                value={currentPlayCount}
                onChange={(e) => {
                  setCurrentPlayCount(Number.parseInt(e.target.value, 10));
                }}
                className="w-full rounded-md border border-gray-300 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="hp" className="mb-1 block font-medium text-gray-700 text-sm">
                相手のHP
              </label>
              <input
                name="hp"
                type="number"
                min="1"
                max="10"
                value={opponentHp}
                onChange={(e) => {
                  setOpponentHp(Number.parseInt(e.target.value, 10));
                }}
                className="w-full rounded-md border border-gray-300 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">最大ダメージ</h3>
            <div className="mt-3 rounded-lg bg-blue-50 p-6">
              <div>
                <p>ダメージ</p>
                <p>{optimal.damage}</p>
                {isLethal && <p className="mt-2 font-bold text-lg text-red-600">リーサル可能！</p>}
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
                {!isLethal && (
                  <p className="mt-4 text-center text-gray-600 text-sm">
                    あと{opponentHp - optimal.damage}ダメージ必要
                  </p>
                )}
              </div>
            </div>

            <h4 className="mt-3 font-semibold text-gray-700">使用カード内訳</h4>
            <div className="space-y-1 text-sm">
              {optimal.cardsUsed.rhinoceroach > 0 && (
                <div className="flex justify-between">
                  <span>リノセウス:</span>
                  <span className="font-medium">{optimal.cardsUsed.rhinoceroach}枚</span>
                </div>
              )}
              {optimal.cardsUsed.zeroCostCard > 0 && (
                <div className="flex justify-between">
                  <span>0コストカード:</span>
                  <span className="font-medium">{optimal.cardsUsed.zeroCostCard}枚</span>
                </div>
              )}
              {optimal.cardsUsed.oneCostCard > 0 && (
                <div className="flex justify-between">
                  <span>1コストカード:</span>
                  <span className="font-medium">{optimal.cardsUsed.oneCostCard}枚</span>
                </div>
              )}
              {optimal.cardsUsed.twoCostCard > 0 && (
                <div className="flex justify-between">
                  <span>2コストカード:</span>
                  <span className="font-medium">{optimal.cardsUsed.twoCostCard}枚</span>
                </div>
              )}
              {optimal.cardsUsed.zeroCostBounce > 0 && (
                <div className="flex justify-between">
                  <span>0コストバウンス:</span>
                  <span className="font-medium">{optimal.cardsUsed.zeroCostBounce}枚</span>
                </div>
              )}
              {optimal.cardsUsed.oneCostBounce > 0 && (
                <div className="flex justify-between">
                  <span>1コストバウンス:</span>
                  <span className="font-medium">{optimal.cardsUsed.oneCostBounce}枚</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-gray-800 text-xl">プレイ順序</h3>

            {optimal.sequence.length > 0 ? (
              <div className="rounded-lg bg-gray-50 p-4">
                <ol className="space-y-2">
                  {optimal.sequence.map((step, index) => (
                    <li key={`step-${index}-${step}`} className="flex items-start">
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
                <p className="mt-2 text-sm">カードを追加するかPPを増やしてください</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
