"use client";

import QuickOptimalCalculator from "@/components/QuickOptimalCalculator";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="mb-2 font-bold text-4xl text-gray-800">
            リノセウス最適解計算機
          </h1>
          <p className="text-gray-600">
            シャドウバース リノセウスの最大ダメージ計算ツール
          </p>
        </header>

        <QuickOptimalCalculator />
      </div>
    </div>
  );
}
