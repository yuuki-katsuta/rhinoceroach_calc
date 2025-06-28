"use client";

import { CardManager } from "@/app/(calculator)/_components/CardManager";
import { calculateOptimalPlay } from "@/app/(calculator)/_libs/calculate";
import { INITIAL_CARD_COUNTS } from "@/app/(calculator)/_libs/constants";
import type { CardCounts } from "@/app/(calculator)/_types/card";
import { useState } from "react";

export const Calculator = () => {
  const [currentPP, setCurrentPP] = useState(10);
  const [currentPlayerCount, setCurrentPlayerCount] = useState(0);
  const [opponentHp, setOpponentHp] = useState(20);
  const [cards, setCards] = useState<CardCounts>(INITIAL_CARD_COUNTS);

  const _optimal = calculateOptimalPlay();
  const _isLethal = false;

  const handleChangeCard = (card: CardCounts) => {
    setCards(card);
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
              <label
                htmlFor="pp"
                className="mb-1 block font-medium text-gray-700 text-sm"
              >
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
              <label
                htmlFor="play-count"
                className="mb-1 block font-medium text-gray-700 text-sm"
              >
                現在のプレイ回数
              </label>
              <input
                name="play-count"
                type="number"
                min="1"
                max="10"
                value={currentPlayerCount}
                onChange={(e) => {
                  setCurrentPlayerCount(Number.parseInt(e.target.value, 10));
                }}
                className="w-full rounded-md border border-gray-300 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="hp"
                className="mb-1 block font-medium text-gray-700 text-sm"
              >
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
            <div className="h-[300px] bg-blue-50" />

            <h4 className="mt-3 font-semibold text-gray-700">使用カード内訳</h4>
            <div>xxxxx:</div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 text-lg">プレイ順序</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
