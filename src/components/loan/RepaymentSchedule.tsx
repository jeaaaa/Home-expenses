import React from "react";

interface RepaymentScheduleProps {
  loanAmount: number;
  calculations: {
    equalPrincipal: {
      firstPayment: number;
      totalInterest: number;
    };
    equalPayment: {
      monthlyPayment: number;
      totalInterest: number;
    };
  };
  generateEqualPaymentSchedule: () => Array<{
    month: number;
    monthlyPayment: number;
    principalPayment: number;
    interestPayment: number;
    remainingPrincipal: number;
  }>;
  generateEqualPrincipalSchedule: () => Array<{
    month: number;
    monthlyPayment: number;
    principalPayment: number;
    interestPayment: number;
    remainingPrincipal: number;
  }>;
  selectedYears: number;
}

export function RepaymentSchedule({
  loanAmount,
  calculations,
  generateEqualPaymentSchedule,
  generateEqualPrincipalSchedule,
  selectedYears,
}: RepaymentScheduleProps) {
  return (
    <>
      {/* 还款概览对比 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* 等额本息概览 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700/30">
          <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            等额本息概览
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {calculations.equalPayment.monthlyPayment.toFixed(2)}元
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                月供金额
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                {(loanAmount / 10000).toFixed(2)}万
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                本金总额
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                {(calculations.equalPayment.totalInterest / 10000).toFixed(2)}万
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                利息总额
              </div>
            </div>
          </div>
        </div>

        {/* 等额本金概览 */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700/30">
          <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            等额本金概览
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                {calculations.equalPrincipal.firstPayment.toFixed(2)}元
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                首月月供
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                {(loanAmount / 10000).toFixed(2)}万
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                本金总额
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                {(calculations.equalPrincipal.totalInterest / 10000).toFixed(2)}
                万
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                利息总额
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 两种还款计划表并排展示 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 等额本息还款计划表 */}
        <div className="border border-blue-200 dark:border-blue-700 rounded-lg overflow-hidden">
          <div className="bg-blue-50 dark:bg-blue-800 px-4 py-2 border-b border-blue-200 dark:border-blue-700">
            <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-300">
              等额本息还款明细（前24个月）
            </h4>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-50 dark:bg-blue-800 sticky top-0">
                <tr>
                  <th className="px-2 py-2 text-left font-medium text-gray-600 dark:text-gray-400">
                    期数
                  </th>
                  <th className="px-2 py-2 text-right font-medium text-gray-600 dark:text-gray-400">
                    月供
                  </th>
                  <th className="px-2 py-2 text-right font-medium text-gray-600 dark:text-gray-400">
                    本金
                  </th>
                  <th className="px-2 py-2 text-right font-medium text-gray-600 dark:text-gray-400">
                    利息
                  </th>
                </tr>
              </thead>
              <tbody>
                {generateEqualPaymentSchedule()
                  .slice(0, 24)
                  .map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-800/30"
                    >
                      <td className="px-2 py-2">{row.month}</td>
                      <td className="px-2 py-2 text-right font-medium">
                        {row.monthlyPayment.toFixed(2)}
                      </td>
                      <td className="px-2 py-2 text-right text-green-600 dark:text-green-400">
                        {row.principalPayment.toFixed(0)}
                      </td>
                      <td className="px-2 py-2 text-right text-red-600 dark:text-red-400">
                        {row.interestPayment.toFixed(0)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 等额本金还款计划表 */}
        <div className="border border-green-200 dark:border-green-700 rounded-lg overflow-hidden">
          <div className="bg-green-50 dark:bg-green-800 px-4 py-2 border-b border-green-200 dark:border-green-700">
            <h4 className="font-semibold text-sm text-green-800 dark:text-green-300">
              等额本金还款明细（前24个月）
            </h4>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-green-50 dark:bg-green-800 sticky top-0">
                <tr>
                  <th className="px-2 py-2 text-left font-medium text-gray-600 dark:text-gray-400">
                    期数
                  </th>
                  <th className="px-2 py-2 text-right font-medium text-gray-600 dark:text-gray-400">
                    月供
                  </th>
                  <th className="px-2 py-2 text-right font-medium text-gray-600 dark:text-gray-400">
                    本金
                  </th>
                  <th className="px-2 py-2 text-right font-medium text-gray-600 dark:text-gray-400">
                    利息
                  </th>
                </tr>
              </thead>
              <tbody>
                {generateEqualPrincipalSchedule()
                  .slice(0, 24)
                  .map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-800/30"
                    >
                      <td className="px-2 py-2">{row.month}</td>
                      <td className="px-2 py-2 text-right font-medium">
                        {row.monthlyPayment.toFixed(2)}
                      </td>
                      <td className="px-2 py-2 text-right text-green-600 dark:text-green-400">
                        {row.principalPayment.toFixed(0)}
                      </td>
                      <td className="px-2 py-2 text-right text-red-600 dark:text-red-400">
                        {row.interestPayment.toFixed(0)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 底部说明 */}
      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700/30">
        <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
          <div className="font-semibold text-amber-800 dark:text-amber-300 mb-1">
            💡 还款计划说明
          </div>
          <div className="space-y-1">
            <div>等额本息: 每月还款金额固定，前期利息多，后期本金多</div>
            <div>等额本金: 每月本金固定，月供递减，总利息更少</div>
            <div>仅显示前24期明细，完整计划表共{selectedYears * 12}期</div>
          </div>
        </div>
      </div>
    </>
  );
}
