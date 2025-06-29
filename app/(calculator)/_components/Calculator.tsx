"use client";

import { CalculationResult } from "@/app/(calculator)/_components/CalculationResult";
import { CardBreakdown } from "@/app/(calculator)/_components/CardBreakdown";
import { CardManager } from "@/app/(calculator)/_components/CardManager";
import { CardPlaySequence } from "@/app/(calculator)/_components/CardPlaySequence";
import { GameStatus } from "@/app/(calculator)/_components/GameStatus";
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
  const isLethal = optimal.damage >= opponentHp;

  const handleChangeCurrentPP = (value: number) => {
    setCurrentPP(value);
  };

  const handleChangePlayCount = (value: number) => {
    setCurrentPlayCount(value);
  };

  const handleChangeOpponentHp = (value: number) => {
    setOpponentHp(value);
  };

  const handleChangeCard = (card: Partial<CardCounts>) => {
    setCards((prev) => ({ ...prev, ...card }));
  };

  return (
    <div className="mx-auto mt-6 grid gap-5">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* 手札カード管理 */}
            <CardManager cards={cards} onChange={handleChangeCard} />
          </div>

          <div className="space-y-4">
            {/* ゲーム情報 */}
            <GameStatus
              currentPP={currentPP}
              currentPlayCount={currentPlayCount}
              opponentHp={opponentHp}
              onChangeCurrentPP={handleChangeCurrentPP}
              onChangePlayCount={handleChangePlayCount}
              onChangeOpponentHp={handleChangeOpponentHp}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            {/* ダメージ計算結果 */}
            <CalculationResult
              damage={optimal.damage}
              ppUsed={optimal.ppUsed}
              isLethal={isLethal}
              currentPP={currentPP}
              opponentHp={opponentHp}
            />

            {/* 使用カード内訳 */}
            <CardBreakdown cardsUsed={optimal.cardsUsed} />
          </div>
          {/* プレイ順序 */}
          <CardPlaySequence sequence={optimal.sequence} />
        </div>
      </div>
    </div>
  );
};
