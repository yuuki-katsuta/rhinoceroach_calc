import { Calculator } from "@/components/Calculator";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center">
          <h1 className="mb-4 font-bold text-3xl">リノ算</h1>
          <p className="text-gray-600">最大ダメージ計算ツール</p>
        </header>

        <Calculator />
      </div>
      <Footer />
    </div>
  );
}
