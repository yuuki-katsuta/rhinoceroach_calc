interface Props {
  damage: number;
  ppUsed: number;
  isLethal: boolean;
  currentPP: number;
  opponentHp: number;
}

export const CalculationResult = ({ damage, ppUsed, isLethal, currentPP, opponentHp }: Props) => {
  return (
    <>
      <h3 className="font-bold text-gray-800 text-lg">最大ダメージ</h3>
      {isLethal && <p className="mt-2 font-bold text-md text-red-600">リーサル可能！</p>}

      <div className="mt-3 rounded-lg bg-blue-50 p-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <p className="font-semibold text-gray-700">ダメージ</p>
            <p className="text-gray-600 text-xl">{damage}</p>
          </div>

          <div className="text-center">
            <p className="font-semibold text-gray-700">消費PP</p>
            <p className="text-blue-600 text-xl">
              {ppUsed} / {currentPP}
            </p>
          </div>

          <div className="text-center">
            <p className="font-semibold text-gray-700">相手HP</p>
            <p className="text-gray-600 text-xl">{opponentHp}</p>
          </div>

          <div className="text-center">
            <p className="font-semibold text-gray-700">リーサルまで</p>
            <p className="text-gray-600 text-xl">{isLethal ? "-" : opponentHp - damage}</p>
          </div>
        </div>
      </div>
    </>
  );
};
