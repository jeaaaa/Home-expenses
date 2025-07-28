// 贷款计算相关的工具函数

export interface LoanData {
  loanAmount: number;
  monthlyRate: number;
  years: number;
}

export interface Calculations {
  equalPrincipal: {
    firstPayment: number;
    totalInterest: number;
  };
  equalPayment: {
    monthlyPayment: number;
    totalInterest: number;
  };
}

export interface YearsAnalysisData {
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

export interface EarlyPaymentAnalysis {
  years: number;
  earlyPaymentAmount: number;
  actualPayoffTime: number;
  totalInterestSaved: number;
  totalCost: number;
  costEfficiency: number;
}

export interface ScheduleItem {
  month: number;
  monthlyPayment: number;
  principalPayment: number;
  interestPayment: number;
  remainingPrincipal: number;
}

// 计算等额本息和等额本金的基本数据
export function calculateLoanPayments(
  loanData: LoanData,
  selectedYears: number
): Calculations {
  const months = selectedYears * 12;

  // 计算等额本金
  const monthlyPrincipal = loanData.loanAmount / months;
  const firstPayment =
    monthlyPrincipal + loanData.loanAmount * loanData.monthlyRate;

  // 等额本金总利息的准确计算：每月利息递减，求和
  let totalInterestEqualPrincipal = 0;
  let remainingPrincipal = loanData.loanAmount;
  for (let i = 0; i < months; i++) {
    totalInterestEqualPrincipal += remainingPrincipal * loanData.monthlyRate;
    remainingPrincipal -= monthlyPrincipal;
  }

  // 计算等额本息
  const monthlyPayment =
    (loanData.loanAmount *
      loanData.monthlyRate *
      Math.pow(1 + loanData.monthlyRate, months)) /
    (Math.pow(1 + loanData.monthlyRate, months) - 1);
  const totalInterestEqualPayment =
    monthlyPayment * months - loanData.loanAmount;

  return {
    equalPrincipal: {
      firstPayment,
      totalInterest: totalInterestEqualPrincipal,
    },
    equalPayment: {
      monthlyPayment,
      totalInterest: totalInterestEqualPayment,
    },
  };
}

// 生成等额本息还款计划表数据
export function generateEqualPaymentSchedule(
  loanData: LoanData,
  selectedYears: number,
  monthlyPayment: number
): ScheduleItem[] {
  const months = selectedYears * 12;
  const schedule: ScheduleItem[] = [];
  let remainingPrincipal = loanData.loanAmount;

  for (let month = 1; month <= months; month++) {
    const interestPayment = remainingPrincipal * loanData.monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingPrincipal -= principalPayment;

    schedule.push({
      month,
      monthlyPayment,
      principalPayment,
      interestPayment,
      remainingPrincipal: Math.max(0, remainingPrincipal),
    });
  }
  return schedule;
}

// 生成等额本金还款计划表数据
export function generateEqualPrincipalSchedule(
  loanData: LoanData,
  selectedYears: number
): ScheduleItem[] {
  const months = selectedYears * 12;
  const monthlyPrincipal = loanData.loanAmount / months;
  const schedule: ScheduleItem[] = [];
  let remainingPrincipal = loanData.loanAmount;

  for (let month = 1; month <= months; month++) {
    const interestPayment = remainingPrincipal * loanData.monthlyRate;
    const monthlyPayment = monthlyPrincipal + interestPayment;
    remainingPrincipal -= monthlyPrincipal;

    schedule.push({
      month,
      monthlyPayment,
      principalPayment: monthlyPrincipal,
      interestPayment,
      remainingPrincipal: Math.max(0, remainingPrincipal),
    });
  }
  return schedule;
}

// 生成年限划算性分析数据
export function generateYearsAnalysis(loanData: LoanData): YearsAnalysisData[] {
  const analysisData: YearsAnalysisData[] = [];
  const yearOptions = [5, 10, 15, 20, 25, 30];

  yearOptions.forEach((years) => {
    const months = years * 12;

    // 等额本息计算
    const monthlyPayment =
      (loanData.loanAmount *
        loanData.monthlyRate *
        Math.pow(1 + loanData.monthlyRate, months)) /
      (Math.pow(1 + loanData.monthlyRate, months) - 1);
    const totalInterestEqualPayment =
      monthlyPayment * months - loanData.loanAmount;

    // 等额本金计算
    const monthlyPrincipal = loanData.loanAmount / months;
    let totalInterestEqualPrincipal = 0;
    let remainingPrincipal = loanData.loanAmount;
    for (let i = 0; i < months; i++) {
      totalInterestEqualPrincipal += remainingPrincipal * loanData.monthlyRate;
      remainingPrincipal -= monthlyPrincipal;
    }
    const firstPayment =
      monthlyPrincipal + loanData.loanAmount * loanData.monthlyRate;

    analysisData.push({
      years,
      equalPayment: {
        monthlyPayment,
        totalInterest: totalInterestEqualPayment,
        totalCost: loanData.loanAmount + totalInterestEqualPayment,
      },
      equalPrincipal: {
        firstPayment,
        totalInterest: totalInterestEqualPrincipal,
        totalCost: loanData.loanAmount + totalInterestEqualPrincipal,
      },
    });
  });

  return analysisData;
}

// 计算提前还款分析
export function generateEarlyPaymentAnalysis(
  loanData: LoanData
): EarlyPaymentAnalysis[] {
  const analysisData: EarlyPaymentAnalysis[] = [];
  const yearOptions = [20, 25, 30];
  const earlyPaymentOptions = [0, 50000, 100000]; // 0万、5万、10万提前还款

  yearOptions.forEach((years) => {
    earlyPaymentOptions.forEach((earlyPaymentAmount) => {
      const months = years * 12;

      // 计算等额本息的正常还款情况
      const monthlyPayment =
        (loanData.loanAmount *
          loanData.monthlyRate *
          Math.pow(1 + loanData.monthlyRate, months)) /
        (Math.pow(1 + loanData.monthlyRate, months) - 1);

      let remainingPrincipal = loanData.loanAmount;
      let totalInterest = 0;
      let totalEarlyPayment = 0;
      let actualMonths = 0;

      // 模拟逐月还款过程
      for (let month = 1; month <= months; month++) {
        if (remainingPrincipal <= 0) break;

        const interestPayment = remainingPrincipal * loanData.monthlyRate;
        const principalPayment = Math.min(
          monthlyPayment - interestPayment,
          remainingPrincipal
        );

        totalInterest += interestPayment;
        remainingPrincipal -= principalPayment;
        actualMonths = month;

        // 每12个月（年底）进行提前还款
        if (
          month % 12 === 0 &&
          earlyPaymentAmount > 0 &&
          remainingPrincipal > 0
        ) {
          const actualEarlyPayment = Math.min(
            earlyPaymentAmount,
            remainingPrincipal
          );
          remainingPrincipal -= actualEarlyPayment;
          totalEarlyPayment += actualEarlyPayment;
        }
      }

      // 计算无提前还款情况下的总利息（作为对比基准）
      const normalTotalInterest = monthlyPayment * months - loanData.loanAmount;
      const interestSaved = normalTotalInterest - totalInterest;

      // 计算成本效率：节省利息 / (提前还款总额 + 机会成本)
      // 假设资金的机会成本为年化4%
      const opportunityCost = totalEarlyPayment * 0.04 * (actualMonths / 12);
      const costEfficiency =
        totalEarlyPayment > 0
          ? (interestSaved / (totalEarlyPayment + opportunityCost)) * 100
          : 0;

      analysisData.push({
        years,
        earlyPaymentAmount,
        actualPayoffTime: actualMonths / 12,
        totalInterestSaved: interestSaved,
        totalCost: loanData.loanAmount + totalInterest + totalEarlyPayment,
        costEfficiency,
      });
    });
  });

  return analysisData;
}
