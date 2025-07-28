import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoanOverview } from "./loan/LoanOverview";
import { LoanComparison } from "./loan/LoanComparison";
import { RepaymentSchedule } from "./loan/RepaymentSchedule";
import { YearsAnalysis } from "./loan/YearsAnalysis";
import { EarlyPaymentAnalysis } from "./loan/EarlyPaymentAnalysis";
import {
  calculateLoanPayments,
  generateEqualPaymentSchedule,
  generateEqualPrincipalSchedule,
  generateYearsAnalysis,
  generateEarlyPaymentAnalysis,
  type LoanData,
  type Calculations,
} from "@/lib/loanCalculations";

interface LoanDetailsProps {
  title: string;
  id: string;
  loanAmount: number; // 贷款金额（元）
  monthlyRate: number; // 月利率
  years: number; // 贷款年限
}

export function LoanDetails({
  title,
  id,
  loanAmount,
  monthlyRate,
  years,
}: LoanDetailsProps) {
  const [loanData, setLoanData] = useState<LoanData>({
    loanAmount,
    monthlyRate,
    years: 30, // 默认30年
  });

  // 添加年限选择状态
  const [selectedYears, setSelectedYears] = useState(30);
  const [calculations, setCalculations] = useState<Calculations>({
    equalPrincipal: {
      firstPayment: 0,
      totalInterest: 0,
    },
    equalPayment: {
      monthlyPayment: 0,
      totalInterest: 0,
    },
  });

  // 监听主页面发送的更新事件
  useEffect(() => {
    const handleLoanUpdate = (event: CustomEvent) => {
      const { loanAmount, monthlyRate } = event.detail;
      setLoanData((prev) => ({
        ...prev,
        loanAmount,
        monthlyRate,
      }));
    };

    const handleYearsUpdate = (event: CustomEvent) => {
      const { years, sourceId } = event.detail;
      // 只有当事件不是来自当前组件时才更新
      if (sourceId !== id) {
        setSelectedYears(years);
      }
    };

    // 添加自定义事件监听器
    document.addEventListener("loan-update", handleLoanUpdate as EventListener);
    document.addEventListener(
      "years-update",
      handleYearsUpdate as EventListener
    );

    // 清理函数
    return () => {
      document.removeEventListener(
        "loan-update",
        handleLoanUpdate as EventListener
      );
      document.removeEventListener(
        "years-update",
        handleYearsUpdate as EventListener
      );
    };
  }, []);

  // 当贷款数据或选择的年限变化时重新计算
  useEffect(() => {
    const newCalculations = calculateLoanPayments(loanData, selectedYears);
    setCalculations(newCalculations);
  }, [loanData.loanAmount, loanData.monthlyRate, selectedYears]);

  // 处理年限选择变化
  const handleYearsChange = (newYears: number) => {
    setSelectedYears(newYears);

    // 派发年限更新事件，通知其他组件同步
    // 使用setTimeout确保状态更新完成后再派发事件
    setTimeout(() => {
      const yearsUpdateEvent = new CustomEvent("years-update", {
        detail: { years: newYears, sourceId: id },
      });
      document.dispatchEvent(yearsUpdateEvent);
    }, 0);
  };

  // 判断是否为还款计划页面
  const isRepaymentSchedule = id === "content-20years";

  // 生成年限选项
  const yearOptions = [];
  for (let i = 5; i <= 30; i += 1) {
    yearOptions.push(i);
  }

  return (
    <div id={id} className="transition-opacity duration-200 ease-in-out">
      <Card className="dark:border-gray-700 dark:bg-gray-800/80 bg-white/80 backdrop-blur-sm shadow-xl border-0 dark:shadow-2xl">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-base sm:text-lg">{title}</span>
            <div className="flex items-center space-x-2">
              <label
                htmlFor={`years-${id}`}
                className="text-sm font-normal text-gray-600 dark:text-gray-400 whitespace-nowrap"
              >
                贷款年限:
              </label>
              <select
                id={`years-${id}`}
                value={selectedYears}
                onChange={(e) => handleYearsChange(parseInt(e.target.value))}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[80px]"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}年
                  </option>
                ))}
              </select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoanOverview
            loanAmount={loanData.loanAmount}
            selectedYears={selectedYears}
            monthlyRate={loanData.monthlyRate}
          />

          {!isRepaymentSchedule ? (
            // 贷款方案对比页面
            <LoanComparison calculations={calculations} />
          ) : (
            // 还款计划表页面
            <>
              <RepaymentSchedule
                loanAmount={loanData.loanAmount}
                calculations={calculations}
                generateEqualPaymentSchedule={() =>
                  generateEqualPaymentSchedule(
                    loanData,
                    selectedYears,
                    calculations.equalPayment.monthlyPayment
                  )
                }
                generateEqualPrincipalSchedule={() =>
                  generateEqualPrincipalSchedule(loanData, selectedYears)
                }
                selectedYears={selectedYears}
              />

              <YearsAnalysis
                generateYearsAnalysis={() => generateYearsAnalysis(loanData)}
                selectedYears={selectedYears}
              />

              <EarlyPaymentAnalysis
                generateEarlyPaymentAnalysis={() =>
                  generateEarlyPaymentAnalysis(loanData)
                }
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default LoanDetails;
