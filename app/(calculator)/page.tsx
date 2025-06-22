import { Calculator } from "@/app/(calculator)/_components/Calculator";
import { Hint } from "@/app/(calculator)/_components/Hint";

export default function Home() {
  return (
    <>
      <header className="text-center">
        <h1 className="mb-4 font-bold text-3xl">リノ算</h1>
        <p className="text-gray-600">最大ダメージ計算ツール</p>
      </header>
      <Calculator />
      <Hint />
    </>
  );
}
