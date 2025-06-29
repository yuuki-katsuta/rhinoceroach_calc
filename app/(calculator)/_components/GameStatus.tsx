interface Props {
  currentPP: number;
  currentPlayCount: number;
  opponentHp: number;
  onChangeCurrentHp: (value: number) => void;
  onChangePlayCount: (value: number) => void;
  onChangeOpponentHp: (value: number) => void;
}

export const GameStatus = ({
  currentPP,
  currentPlayCount,
  opponentHp,
  onChangeCurrentHp,
  onChangePlayCount,
  onChangeOpponentHp,
}: Props) => {
  return (
    <>
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
            onChangeCurrentHp(Number.parseInt(e.target.value, 10));
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
            onChangePlayCount(Number.parseInt(e.target.value, 10));
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
          max="20"
          value={opponentHp}
          onChange={(e) => {
            onChangeOpponentHp(Number.parseInt(e.target.value, 10));
          }}
          className="w-full rounded-md border border-gray-300 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </>
  );
};
