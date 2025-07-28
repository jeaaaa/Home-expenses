import React from "react";

interface EarlyPaymentAnalysis {
  years: number;
  earlyPaymentAmount: number;
  actualPayoffTime: number;
  totalInterestSaved: number;
  totalCost: number;
  costEfficiency: number;
}

interface EarlyPaymentAnalysisProps {
  generateEarlyPaymentAnalysis: () => EarlyPaymentAnalysis[];
}

export function EarlyPaymentAnalysis({
  generateEarlyPaymentAnalysis,
}: EarlyPaymentAnalysisProps) {
  const getRecommendLevel = (
    efficiency: number,
    earlyPaymentAmount: number
  ) => {
    if (efficiency >= 80) {
      return {
        level: "⭐⭐⭐ 极佳",
        color: "text-yellow-600 dark:text-yellow-400",
      };
    } else if (efficiency >= 60) {
      return {
        level: "⭐⭐ 很好",
        color: "text-green-600 dark:text-green-400",
      };
    } else if (efficiency >= 40) {
      return { level: "⭐ 一般", color: "text-blue-600 dark:text-blue-400" };
    } else if (earlyPaymentAmount > 0) {
      return { level: "❌ 不推荐", color: "text-red-600 dark:text-red-400" };
    } else {
      return { level: "📊 基准", color: "text-gray-600 dark:text-gray-400" };
    }
  };

  const analyses = generateEarlyPaymentAnalysis();
  const strategiesWithEarlyPayment = analyses.filter(
    (d) => d.earlyPaymentAmount > 0
  );
  const optimalStrategy =
    strategiesWithEarlyPayment.length > 0
      ? strategiesWithEarlyPayment.reduce((best, current) =>
          current.costEfficiency > best.costEfficiency ? current : best
        )
      : null;

  return (
    <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700/30">
      <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-4 text-sm flex items-center">
        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
        💰 提前还款策略分析（等额本息）
      </h4>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-emerald-200 dark:border-emerald-700">
              <th className="text-left py-2 font-medium text-emerald-700 dark:text-emerald-300">
                贷款年限
              </th>
              <th className="text-center py-2 font-medium text-emerald-700 dark:text-emerald-300">
                提前还款
              </th>
              <th className="text-right py-2 font-medium text-emerald-700 dark:text-emerald-300">
                实际还清时间
              </th>
              <th className="text-right py-2 font-medium text-emerald-700 dark:text-emerald-300">
                节省利息
              </th>
              <th className="text-center py-2 font-medium text-emerald-700 dark:text-emerald-300">
                效率评分
              </th>
              <th className="text-center py-2 font-medium text-emerald-700 dark:text-emerald-300">
                推荐等级
              </th>
            </tr>
          </thead>
          <tbody>
            {analyses.map((data) => {
              const recommend = getRecommendLevel(
                data.costEfficiency,
                data.earlyPaymentAmount
              );
              const isOptimal =
                optimalStrategy &&
                data.costEfficiency > 0 &&
                data.costEfficiency === optimalStrategy.costEfficiency;

              return (
                <tr
                  key={`${data.years}-${data.earlyPaymentAmount}`}
                  className={`border-b border-emerald-100 dark:border-emerald-800 ${
                    isOptimal
                      ? "bg-yellow-50 dark:bg-yellow-900/20 font-medium"
                      : ""
                  }`}
                >
                  <td className="py-2 font-medium">{data.years}年</td>
                  <td className="text-center py-2">
                    {data.earlyPaymentAmount === 0
                      ? "无"
                      : `每年${(data.earlyPaymentAmount / 10000).toFixed(0)}万`}
                  </td>
                  <td className="text-right py-2">
                    {data.actualPayoffTime.toFixed(1)}年
                  </td>
                  <td className="text-right py-2 text-green-600 dark:text-green-400">
                    {data.earlyPaymentAmount > 0
                      ? `${(data.totalInterestSaved / 10000).toFixed(1)}万`
                      : "-"}
                  </td>
                  <td className="text-center py-2">
                    {data.earlyPaymentAmount > 0
                      ? `${data.costEfficiency.toFixed(0)}%`
                      : "-"}
                  </td>
                  <td className={`text-center py-2 ${recommend.color}`}>
                    {recommend.level}
                    {isOptimal && data.earlyPaymentAmount > 0 && (
                      <div className="text-xs text-yellow-600 dark:text-yellow-400">
                        最优策略
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 移动端卡片视图 */}
      <div className="md:hidden space-y-3">
        {analyses.map((data) => {
          const recommend = getRecommendLevel(
            data.costEfficiency,
            data.earlyPaymentAmount
          );
          const isOptimal =
            optimalStrategy &&
            data.costEfficiency > 0 &&
            data.costEfficiency === optimalStrategy.costEfficiency;

          return (
            <div
              key={`${data.years}-${data.earlyPaymentAmount}`}
              className={`p-3 rounded-lg border ${
                isOptimal
                  ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
                  : "bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-emerald-800 dark:text-emerald-300">
                  {data.years}年期贷款
                </div>
                <div className={`text-xs px-2 py-1 rounded ${recommend.color} bg-opacity-10`}>
                  {recommend.level}
                  {isOptimal && data.earlyPaymentAmount > 0 && (
                    <div className="text-yellow-600 dark:text-yellow-400">最优</div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">提前还款：</span>
                  <span className="font-medium">
                    {data.earlyPaymentAmount === 0
                      ? "无"
                      : `每年${(data.earlyPaymentAmount / 10000).toFixed(0)}万`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">还清时间：</span>
                  <span className="font-medium">{data.actualPayoffTime.toFixed(1)}年</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">节省利息：</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {data.earlyPaymentAmount > 0
                      ? `${(data.totalInterestSaved / 10000).toFixed(1)}万`
                      : "-"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">效率评分：</span>
                  <span className="font-medium">
                    {data.earlyPaymentAmount > 0
                      ? `${data.costEfficiency.toFixed(0)}%`
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 提前还款建议说明 */}
      {optimalStrategy && (
        <div className="mt-4 p-3 bg-emerald-100 dark:bg-emerald-800/30 rounded-lg">
          <div className="text-xs text-emerald-800 dark:text-emerald-200 space-y-2">
            <div className="font-medium text-sm mb-2">
              💡 提前还款策略建议：
            </div>

            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded text-yellow-800 dark:text-yellow-200">
              <span className="font-medium">🎯 最优策略：</span>
              选择{optimalStrategy.years}年期，每年提前还款
              {(optimalStrategy.earlyPaymentAmount / 10000).toFixed(0)}万元
              <br />
              <span className="text-xs">
                可在{optimalStrategy.actualPayoffTime.toFixed(1)}年内还清，
                节省利息
                {(optimalStrategy.totalInterestSaved / 10000).toFixed(1)}万元，
                效率评分{optimalStrategy.costEfficiency.toFixed(0)}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div>
                • <span className="font-medium">效率评分</span>
                ：考虑了资金机会成本的综合收益率
              </div>
              <div>
                • <span className="font-medium">最优选择</span>
                ：平衡还款压力与利息节省的最佳方案
              </div>
              <div>
                • <span className="font-medium">资金规划</span>
                ：确保有足够现金流支持提前还款
              </div>
              <div>
                • <span className="font-medium">投资对比</span>
                ：若投资收益率超过房贷利率，建议投资而非提前还款
              </div>
            </div>

            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded text-blue-800 dark:text-blue-200 text-xs">
              <span className="font-medium">⚠️ 注意事项：</span>
              提前还款需要综合考虑个人现金流状况、投资机会成本、通胀预期等因素。
              建议保留6-12个月的生活费作为应急资金后再考虑提前还款。
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
