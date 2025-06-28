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
      <div className="mt-3 rounded-lg bg-blue-50 p-6">
        <div>
          <p>ダメージ</p>
          <p>{damage}</p>
          {isLethal && <p className="mt-2 font-bold text-lg text-red-600">リーサル可能！</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
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
          {!isLethal && <p className="mt-4 text-center text-gray-600 text-sm">あと{opponentHp - damage}ダメージ必要</p>}
        </div>
      </div>
    </>
  );
};
