export const Footer = () => {
  return (
    <footer className="mt-12 border-gray-200 border-t bg-gray-50 px-4 py-8">
      <div className="mx-auto ">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-800">免責事項</h3>
          <div className="space-y-2 text-gray-600 text-sm">
            <p>
              <strong>非公式ツール：</strong>
              このツールは非公式のファンメイドツールです。
            </p>
            <p>
              <strong>非営利目的：</strong>
              このツールは営利目的ではなく、プレイヤーコミュニティへの貢献を目的として開発されています。
            </p>
            <p>
              <strong>免責：</strong>
              計算結果の正確性は保証いたしません。実際のゲームプレイでは必ずご自身で確認してください。
            </p>
          </div>
          <div className="mt-6 border-gray-100 border-t pt-4 text-center text-gray-500 text-xs">
            <p>
              <span>Made for Shadowverse community</span>
              <span> | </span>
              <span className="font-mono">Fan-made calculator tool</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
