import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LoanDetailsProps {
  title: string;
  id: string;
  isActive?: boolean;
  loanAmount: number; // 贷款金额（元）
  monthlyRate: number; // 月利率
  years: number; // 贷款年限
}

export function LoanDetails({
  title,
  id,
  isActive = false,
  loanAmount,
  monthlyRate,
  years,
}: LoanDetailsProps) {
  const [loanData, setLoanData] = useState({
    loanAmount,
    monthlyRate,
    years,
  });

  const [calculations, setCalculations] = useState({
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

    // 添加自定义事件监听器
    document.addEventListener("loan-update", handleLoanUpdate as EventListener);

    // 清理函数
    return () => {
      document.removeEventListener(
        "loan-update",
        handleLoanUpdate as EventListener
      );
    };
  }, []);

  // 当贷款数据变化时重新计算
  useEffect(() => {
    const months = loanData.years * 12;

    // 计算等额本金
    const monthlyPrincipal = loanData.loanAmount / months;
    const firstPayment =
      monthlyPrincipal + loanData.loanAmount * loanData.monthlyRate;
    const firstMonthInterest = loanData.loanAmount * loanData.monthlyRate;
    const lastMonthInterest = monthlyPrincipal * loanData.monthlyRate;
    const totalInterest =
      ((firstMonthInterest + lastMonthInterest) * months) / 2;

    // 计算等额本息
    const monthlyPayment =
      (loanData.loanAmount *
        loanData.monthlyRate *
        Math.pow(1 + loanData.monthlyRate, months)) /
      (Math.pow(1 + loanData.monthlyRate, months) - 1);
    const totalInterestEP = monthlyPayment * months - loanData.loanAmount;

    setCalculations({
      equalPrincipal: {
        firstPayment,
        totalInterest,
      },
      equalPayment: {
        monthlyPayment,
        totalInterest: totalInterestEP,
      },
    });
  }, [loanData.loanAmount, loanData.monthlyRate, loanData.years]);

  return (
    <div
      id={id}
      className={`transition-opacity duration-200 ease-in-out ${
        isActive ? "block" : "hidden"
      }`}
    >
      <Card className="dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">等额本金</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>首月月供:</span>
                  <span>
                    {calculations.equalPrincipal.firstPayment.toFixed(0)}元
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>总利息:</span>
                  <span>
                    {(
                      calculations.equalPrincipal.totalInterest / 10000
                    ).toFixed(2)}
                    万元
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">等额本息</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>月供:</span>
                  <span>
                    {calculations.equalPayment.monthlyPayment.toFixed(0)}元
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>总利息:</span>
                  <span>
                    {(calculations.equalPayment.totalInterest / 10000).toFixed(
                      2
                    )}
                    万元
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoanDetails;
