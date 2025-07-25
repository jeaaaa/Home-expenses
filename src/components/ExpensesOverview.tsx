import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface ExpensesOverviewProps {
  area?: number;
  price?: number;
  downPayment?: number;
  loanRate?: number;
}

// 可重用的费用项组件
interface FeeItemProps {
  id: string;
  label: string;
  checked: boolean;
  amount: number;
  onToggle: () => void;
  hasRate?: boolean;
  rate?: number;
  showRateInput?: boolean;
  onRateToggle?: () => void;
  onRateChange?: (value: number) => void;
}

const FeeItem = ({
  id,
  label,
  checked,
  amount,
  onToggle,
  hasRate = false,
  rate = 0,
  showRateInput = false,
  onRateToggle,
  onRateChange,
}: FeeItemProps) => (
  <>
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Checkbox id={id} checked={checked} onCheckedChange={onToggle} />
        <div className="flex items-center">
          <label htmlFor={id} className="text-sm mr-2">
            {label}
          </label>
          {hasRate && (
            <button
              onClick={onRateToggle}
              className="text-xs underline text-blue-500"
            >
              ({(rate * 100).toFixed(1)}%)
            </button>
          )}
        </div>
      </div>
      <span>{amount.toFixed(0)}元</span>
    </div>

    {hasRate && showRateInput && (
      <div className="flex items-center ml-6 space-x-2">
        <Input
          type="number"
          value={(rate * 100).toString()}
          min="0"
          max="100"
          step="0.1"
          className="w-20 h-6 text-xs"
          onChange={(e) => onRateChange?.(parseFloat(e.target.value) / 100)}
        />
        <span className="text-xs">%</span>
      </div>
    )}
  </>
);

export default function ExpensesOverview({
  area = 114,
  price = 85,
  downPayment = 40,
  loanRate = 2.6,
}: ExpensesOverviewProps) {
  // 使用state管理内部数据，初始值使用props
  const [areaState, setAreaState] = useState(area);
  const [priceState, setPriceState] = useState(price);
  const [downPaymentState, setDownPaymentState] = useState(downPayment);
  const [loanRateState, setLoanRateState] = useState(loanRate);
  // 添加税率自定义状态
  const [taxRates, setTaxRates] = useState({
    personal: 0.01, // 默认1%
    deed: 0.01, // 默认1%
    agency: 0.005, // 默认0.5%
  });

  // 是否显示税率输入框
  const [showTaxRateInputs, setShowTaxRateInputs] = useState({
    personal: false,
    deed: false,
    agency: false,
  });

  // 各种费用的勾选状态
  const [feesEnabled, setFeesEnabled] = useState({
    personalTax: true,
    deedTax: true,
    providentFund: true,
    warrant: true,
    agency: true,
  });

  // 从localStorage加载设置
  useEffect(() => {
    // 加载税率设置
    const storedTaxRates = {
      personal: parseFloat(localStorage.getItem("personalTaxRate") || "0.01"),
      deed: parseFloat(localStorage.getItem("deedTaxRate") || "0.01"),
      agency: parseFloat(localStorage.getItem("agencyFeeRate") || "0.005"),
    };
    setTaxRates(storedTaxRates);

    // 加载基本信息的值
    const savedValues = {
      area: localStorage.getItem("houseArea"),
      price: localStorage.getItem("housePrice"),
      downPayment: localStorage.getItem("houseDownPayment"),
      loanRate: localStorage.getItem("houseLoanRate"),
    };

    if (savedValues.area) setAreaState(parseFloat(savedValues.area));
    if (savedValues.price) setPriceState(parseFloat(savedValues.price));
    if (savedValues.downPayment)
      setDownPaymentState(parseFloat(savedValues.downPayment));
    if (savedValues.loanRate)
      setLoanRateState(parseFloat(savedValues.loanRate));
  }, []);

  // 当props更改时更新state
  useEffect(() => {
    setAreaState(area);
    setPriceState(price);
    setDownPaymentState(downPayment);
    setLoanRateState(loanRate);
  }, [area, price, downPayment, loanRate]);

  // 监听来自父组件的更新事件
  useEffect(() => {
    function handleExpensesUpdate(event: CustomEvent) {
      const { area, price, downPayment, loanRate } = event.detail;
      setAreaState(area);
      setPriceState(price);
      setDownPaymentState(downPayment);
      setLoanRateState(loanRate);
    }

    // 类型断言以处理CustomEvent
    document.addEventListener(
      "expenses-update",
      handleExpensesUpdate as EventListener
    );

    // 通知父组件ExpensesOverview组件已准备好
    const readyEvent = new CustomEvent("expenses-overview-ready");
    document.dispatchEvent(readyEvent);

    return () => {
      document.removeEventListener(
        "expenses-update",
        handleExpensesUpdate as EventListener
      );
    };
  }, []);

  // 通用的税率保存函数
  const updateTaxRate = (type: keyof typeof taxRates, value: number) => {
    const newTaxRates = { ...taxRates, [type]: value };
    setTaxRates(newTaxRates);

    // 保存到localStorage
    const storageKeys = {
      personal: "personalTaxRate",
      deed: "deedTaxRate",
      agency: "agencyFeeRate",
    };
    localStorage.setItem(storageKeys[type], value.toString());
  };

  // 通用的输入框显示切换函数
  const toggleTaxRateInput = (type: keyof typeof showTaxRateInputs) => {
    setShowTaxRateInputs((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // 通用的费用启用切换函数
  const toggleFee = (type: keyof typeof feesEnabled) => {
    setFeesEnabled((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // 计算各项费用
  const calculations = {
    pricePerSquareMeter: (priceState * 10000) / areaState,
    loanAmount: priceState - downPaymentState,
    loanInYuan: (priceState - downPaymentState) * 10000,
    personalTax: feesEnabled.personalTax
      ? priceState * taxRates.personal * 10000
      : 0,
    deedTax: feesEnabled.deedTax ? priceState * taxRates.deed * 10000 : 0,
    providentFundServiceFee: feesEnabled.providentFund ? 2000 : 0,
    warrant: feesEnabled.warrant ? 2000 : 0,
    agencyFee: feesEnabled.agency ? priceState * taxRates.agency * 10000 : 0,
    registrationFee: 80,
  };

  // 计算总成本
  const totalCost =
    priceState * 10000 +
    calculations.personalTax +
    calculations.deedTax +
    calculations.providentFundServiceFee +
    calculations.warrant +
    calculations.agencyFee +
    calculations.registrationFee;

  // 向父组件发送贷款信息
  useEffect(() => {
    const annualRate = loanRateState / 100;
    const monthlyRate = annualRate / 12;

    const loanUpdateEvent = new CustomEvent("loan-data", {
      detail: {
        loanAmount: calculations.loanInYuan,
        monthlyRate,
      },
    });
    document.dispatchEvent(loanUpdateEvent);
  }, [calculations.loanInYuan, loanRateState]);

  return (
    <Card className="dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <CardTitle>购房支出概览</CardTitle>
        <CardDescription className="dark:text-gray-400">
          基于您输入的信息计算的购房总支出
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>每平米单价:</span>
            <span>{calculations.pricePerSquareMeter.toFixed(0)}元/㎡</span>
          </div>
          <div className="flex justify-between">
            <span>贷款金额:</span>
            <span>{calculations.loanAmount}万元</span>
          </div>

          <FeeItem
            id="personalTaxCheck"
            label="个税"
            checked={feesEnabled.personalTax}
            amount={calculations.personalTax}
            onToggle={() => toggleFee("personalTax")}
            hasRate={true}
            rate={taxRates.personal}
            showRateInput={showTaxRateInputs.personal}
            onRateToggle={() => toggleTaxRateInput("personal")}
            onRateChange={(value) => updateTaxRate("personal", value)}
          />

          <FeeItem
            id="deedTaxCheck"
            label="契税"
            checked={feesEnabled.deedTax}
            amount={calculations.deedTax}
            onToggle={() => toggleFee("deedTax")}
            hasRate={true}
            rate={taxRates.deed}
            showRateInput={showTaxRateInputs.deed}
            onRateToggle={() => toggleTaxRateInput("deed")}
            onRateChange={(value) => updateTaxRate("deed", value)}
          />

          <FeeItem
            id="providentFundCheck"
            label="公积金贷款服务费:"
            checked={feesEnabled.providentFund}
            amount={calculations.providentFundServiceFee}
            onToggle={() => toggleFee("providentFund")}
          />

          <FeeItem
            id="warrantCheck"
            label="权证:"
            checked={feesEnabled.warrant}
            amount={calculations.warrant}
            onToggle={() => toggleFee("warrant")}
          />

          <FeeItem
            id="agencyCheck"
            label="中介费"
            checked={feesEnabled.agency}
            amount={calculations.agencyFee}
            onToggle={() => toggleFee("agency")}
            hasRate={true}
            rate={taxRates.agency}
            showRateInput={showTaxRateInputs.agency}
            onRateToggle={() => toggleTaxRateInput("agency")}
            onRateChange={(value) => updateTaxRate("agency", value)}
          />

          <div className="flex justify-between">
            <span>不动产交易中心工本费:</span>
            <span>80元</span>
          </div>
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
          <div className="flex justify-between font-bold">
            <span>购房总支出:</span>
            <span>{totalCost.toFixed(0)}元</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
