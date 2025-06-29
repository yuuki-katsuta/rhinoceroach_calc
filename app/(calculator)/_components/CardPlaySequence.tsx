import type { Action } from "@/app/(calculator)/_types/game";

interface Props {
  sequence: Action[];
}

export const CardPlaySequence = ({ sequence }: Props) => {
  return (
    <div>
      <h3 className="mb-4 font-bold text-gray-800 text-lg">プレイ順序</h3>

      {sequence.length > 0 ? (
        <div className="rounded-lg bg-gray-50 p-4">
          <ol className="space-y-2">
            {sequence.map((step, index) => (
              <li key={`step-${index}-${step.description}`} className="flex items-start">
                <span className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 font-bold text-sm text-white">
                  {index + 1}
                </span>
                <span className="pt-1 text-gray-700">{step.description}</span>
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
  );
};
