import type { CardCounts } from "@/app/(calculator)/_types/card";

interface Props {
  cardsUsed: CardCounts;
}

export const CardBreakdown = ({ cardsUsed }: Props) => {
  return (
    <>
      <h4 className="mt-3 font-semibold text-gray-700">使用カード内訳</h4>
      <div className="space-y-1 text-sm">
        {cardsUsed.rhinoceroach > 0 && (
          <div className="flex justify-between">
            <span>リノセウス:</span>
            <span className="font-medium">{cardsUsed.rhinoceroach}枚</span>
          </div>
        )}
        {cardsUsed.zeroCostCard > 0 && (
          <div className="flex justify-between">
            <span>0コストカード:</span>
            <span className="font-medium">{cardsUsed.zeroCostCard}枚</span>
          </div>
        )}
        {cardsUsed.oneCostCard > 0 && (
          <div className="flex justify-between">
            <span>1コストカード:</span>
            <span className="font-medium">{cardsUsed.oneCostCard}枚</span>
          </div>
        )}
        {cardsUsed.twoCostCard > 0 && (
          <div className="flex justify-between">
            <span>2コストカード:</span>
            <span className="font-medium">{cardsUsed.twoCostCard}枚</span>
          </div>
        )}
        {cardsUsed.zeroCostBounce > 0 && (
          <div className="flex justify-between">
            <span>0コストバウンス:</span>
            <span className="font-medium">{cardsUsed.zeroCostBounce}枚</span>
          </div>
        )}
        {cardsUsed.oneCostBounce > 0 && (
          <div className="flex justify-between">
            <span>1コストバウンス:</span>
            <span className="font-medium">{cardsUsed.oneCostBounce}枚</span>
          </div>
        )}
      </div>
    </>
  );
};
