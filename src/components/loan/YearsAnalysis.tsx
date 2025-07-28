import React from "react";

interface YearsAnalysisData {
  years: number;
  equalPayment: {
    monthlyPayment: number;
    totalInterest: number;
    totalCost: number;
  };
  equalPrincipal: {
    firstPayment: number;
    totalInterest: number;
    totalCost: number;
  };
}

interface YearsAnalysisProps {
  generateYearsAnalysis: () => YearsAnalysisData[];
  selectedYears: number;
}

export function YearsAnalysis({
  generateYearsAnalysis,
  selectedYears,
}: YearsAnalysisProps) {
  return (
    <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700/30">
      <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-4 text-sm flex items-center">
        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
        📊 不同年限还款划算性分析
      </h4>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-purple-200 dark:border-purple-700">
              <th className="text-left py-2 font-medium text-purple-700 dark:text-purple-300">
                年限
              </th>
              <th className="text-right py-2 font-medium text-purple-700 dark:text-purple-300">
                等额本息月供
              </th>
              <th className="text-right py-2 font-medium text-purple-700 dark:text-purple-300">
                等额本金首月
              </th>
              <th className="text-right py-2 font-medium text-purple-700 dark:text-purple-300">
                利息节省
              </th>
              <th className="text-center py-2 font-medium text-purple-700 dark:text-purple-300">
                推荐度
              </th>
            </tr>
          </thead>
          <tbody>
            {generateYearsAnalysis().map((data) => {
              const interestSaving =
                (data.equalPayment.totalInterest -
                  data.equalPrincipal.totalInterest) /
                10000;
              const isRecommended = data.years >= 20 && data.years <= 25;
              const isOptimal = data.years === 25;

              return (
                <tr
                  key={data.years}
                  className={`border-b border-purple-100 dark:border-purple-800 ${
                    data.years === selectedYears
                      ? "bg-purple-100 dark:bg-purple-800/30"
                      : ""
                  } ${isOptimal ? "bg-yellow-50 dark:bg-yellow-900/20" : ""}`}
                >
                  <td className="py-2 font-medium">
                    {data.years}年
                    {data.years === selectedYears && (
                      <span className="ml-1 text-purple-600 dark:text-purple-400">
                        ●
                      </span>
                    )}
                  </td>
                  <td className="text-right py-2">
                    {data.equalPayment.monthlyPayment.toFixed(0)}元
                  </td>
                  <td className="text-right py-2">
                    {data.equalPrincipal.firstPayment.toFixed(0)}元
                  </td>
                  <td className="text-right py-2 text-green-600 dark:text-green-400">
                    {interestSaving.toFixed(1)}万
                  </td>
                  <td className="text-center py-2">
                    {isOptimal ? (
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                        ⭐ 最优
                      </span>
                    ) : isRecommended ? (
                      <span className="text-green-600 dark:text-green-400">
                        👍 推荐
                      </span>
                    ) : data.years < 15 ? (
                      <span className="text-red-600 dark:text-red-400">
                        📈 压力大
                      </span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        💰 利息高
                      </span>
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
        {generateYearsAnalysis().map((data) => {
          const interestSaving =
            (data.equalPayment.totalInterest - data.equalPrincipal.totalInterest) / 10000;
          const isRecommended = data.years >= 20 && data.years <= 25;
          const isOptimal = data.years === 25;
          const isSelected = data.years === selectedYears;

          return (
            <div
              key={data.years}
              className={`p-3 rounded-lg border ${
                isSelected
                  ? "bg-purple-100 dark:bg-purple-800/30 border-purple-300 dark:border-purple-600"
                  : isOptimal
                  ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
                  : "bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-purple-800 dark:text-purple-300 flex items-center">
                  {data.years}年期
                  {isSelected && (
                    <span className="ml-1 text-purple-600 dark:text-purple-400">●</span>
                  )}
                </div>
                <div className="text-xs px-2 py-1 rounded">
                  {isOptimal ? (
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">⭐ 最优</span>
                  ) : isRecommended ? (
                    <span className="text-green-600 dark:text-green-400">👍 推荐</span>
                  ) : data.years < 15 ? (
                    <span className="text-red-600 dark:text-red-400">📈 压力大</span>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">💰 利息高</span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">等额本息月供：</span>
                  <span className="font-medium">{data.equalPayment.monthlyPayment.toFixed(0)}元</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">等额本金首月：</span>
                  <span className="font-medium">{data.equalPrincipal.firstPayment.toFixed(0)}元</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600 dark:text-gray-400">利息节省：</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {interestSaving.toFixed(1)}万（等额本金相比等额本息）
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-purple-700 dark:text-purple-300 space-y-1">
        <div className="font-medium">💡 选择建议：</div>
        <div>
          • <span className="font-medium">20-25年</span>
          ：平衡月供压力与利息成本的最佳选择
        </div>
        <div>
          • <span className="font-medium">25年</span>
          ：综合考虑通胀、投资收益等因素的最优年限
        </div>
        <div>
          • <span className="font-medium">15年以下</span>
          ：月供压力较大，适合收入稳定且较高的家庭
        </div>
        <div>
          • <span className="font-medium">30年</span>
          ：月供最低但总利息最高，适合现金流紧张的情况
        </div>
      </div>
    </div>
  );
}
