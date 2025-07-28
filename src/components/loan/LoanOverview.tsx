import React from "react";

interface LoanOverviewProps {
  loanAmount: number;
  selectedYears: number;
  monthlyRate: number;
}

export function LoanOverview({
  loanAmount,
  selectedYears,
  monthlyRate,
}: LoanOverviewProps) {
  return (
    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <div className="flex justify-between items-center text-sm">
        <span>贷款金额: {(loanAmount / 10000).toFixed(2)}万元</span>
        <span>贷款期限: {selectedYears}年</span>
        <span>年利率: {(monthlyRate * 12 * 100).toFixed(2)}%</span>
      </div>
    </div>
  );
}
