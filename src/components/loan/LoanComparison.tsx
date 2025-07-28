import React from "react";

interface LoanComparisonProps {
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
}

export function LoanComparison({ calculations }: LoanComparisonProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-700/30">
          <h3 className="font-semibold mb-3 text-green-800 dark:text-green-300 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            等额本金
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>首月月供:</span>
              <span className="font-medium">
                {calculations.equalPrincipal.firstPayment.toFixed(2)}元
              </span>
            </div>
            <div className="flex justify-between">
              <span>总利息:</span>
              <span className="font-medium">
                {(calculations.equalPrincipal.totalInterest / 10000).toFixed(2)}
                万元
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>还款方式:</span>
              <span>月供递减</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700/30">
          <h3 className="font-semibold mb-3 text-blue-800 dark:text-blue-300 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            等额本息
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>月供:</span>
              <span className="font-medium">
                {calculations.equalPayment.monthlyPayment.toFixed(2)}元
              </span>
            </div>
            <div className="flex justify-between">
              <span>总利息:</span>
              <span className="font-medium">
                {(calculations.equalPayment.totalInterest / 10000).toFixed(2)}
                万元
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>还款方式:</span>
              <span>月供固定</span>
            </div>
          </div>
        </div>
      </div>

      {/* 对比总结 */}
      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700/30">
        <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2 text-sm">
          💡 对比分析
        </h4>
        <div className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
          <div>
            利息差额:{" "}
            {(
              Math.abs(
                calculations.equalPayment.totalInterest -
                  calculations.equalPrincipal.totalInterest
              ) / 10000
            ).toFixed(2)}
            万元
            {calculations.equalPayment.totalInterest >
            calculations.equalPrincipal.totalInterest
              ? " (等额本息多付)"
              : " (等额本金多付)"}
          </div>
          <div>等额本金适合: 收入较高且稳定，希望总利息更少的借款人</div>
          <div>等额本息适合: 收入相对固定，希望月供压力均衡的借款人</div>
        </div>
      </div>
    </>
  );
}
