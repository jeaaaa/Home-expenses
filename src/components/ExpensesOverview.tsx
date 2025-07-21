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
  const [personalTaxChecked, setPersonalTaxChecked] = useState(true);
  const [deedTaxChecked, setDeedTaxChecked] = useState(true);
  const [providentFundChecked, setProvidentFundChecked] = useState(true);
  const [warrantChecked, setWarrantChecked] = useState(true);
  const [agencyChecked, setAgencyChecked] = useState(true);

  // 添加税率自定义状态
  const [personalTaxRate, setPersonalTaxRate] = useState(0.01); // 默认1%
  const [deedTaxRate, setDeedTaxRate] = useState(0.01); // 默认1%
  const [agencyFeeRate, setAgencyFeeRate] = useState(0.005); // 默认0.5%

  // 是否显示税率输入框
  const [showPersonalTaxRateInput, setShowPersonalTaxRateInput] =
    useState(false);
  const [showDeedTaxRateInput, setShowDeedTaxRateInput] = useState(false);
  const [showAgencyFeeRateInput, setShowAgencyFeeRateInput] = useState(false);

  // 从localStorage加载税率设置
  useEffect(() => {
    const storedPersonalTaxRate = localStorage.getItem("personalTaxRate");
    const storedDeedTaxRate = localStorage.getItem("deedTaxRate");
    const storedAgencyFeeRate = localStorage.getItem("agencyFeeRate");

    if (storedPersonalTaxRate)
      setPersonalTaxRate(parseFloat(storedPersonalTaxRate));
    if (storedDeedTaxRate) setDeedTaxRate(parseFloat(storedDeedTaxRate));
    if (storedAgencyFeeRate) setAgencyFeeRate(parseFloat(storedAgencyFeeRate));

    // 从localStorage加载基本信息的值
    const savedArea = localStorage.getItem("houseArea");
    const savedPrice = localStorage.getItem("housePrice");
    const savedDownPayment = localStorage.getItem("houseDownPayment");
    const savedLoanRate = localStorage.getItem("houseLoanRate");

    if (savedArea) setAreaState(parseFloat(savedArea));
    if (savedPrice) setPriceState(parseFloat(savedPrice));
    if (savedDownPayment) setDownPaymentState(parseFloat(savedDownPayment));
    if (savedLoanRate) setLoanRateState(parseFloat(savedLoanRate));
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
      const { area, price, downPayment } = event.detail;
      setAreaState(area);
      setPriceState(price);
      setDownPaymentState(downPayment);
    }

    // 类型断言以处理CustomEvent
    document.addEventListener(
      "expenses-update",
      handleExpensesUpdate as EventListener
    );

    return () => {
      document.removeEventListener(
        "expenses-update",
        handleExpensesUpdate as EventListener
      );
    };
  }, []);

  // 保存税率到localStorage
  const savePersonalTaxRate = (value: number) => {
    setPersonalTaxRate(value);
    localStorage.setItem("personalTaxRate", value.toString());
  };

  const saveDeedTaxRate = (value: number) => {
    setDeedTaxRate(value);
    localStorage.setItem("deedTaxRate", value.toString());
  };

  const saveAgencyFeeRate = (value: number) => {
    setAgencyFeeRate(value);
    localStorage.setItem("agencyFeeRate", value.toString());
  };

  // 计算数据
  const pricePerSquareMeter = (priceState * 10000) / areaState;
  const loanAmount = priceState - downPaymentState;
  const loanInYuan = loanAmount * 10000;
  const personalTax = personalTaxChecked
    ? priceState * personalTaxRate * 10000
    : 0;
  const deedTax = deedTaxChecked ? priceState * deedTaxRate * 10000 : 0;
  const providentFundServiceFee = providentFundChecked ? 2000 : 0;
  const warrant = warrantChecked ? 2000 : 0;
  const agencyFee = agencyChecked ? priceState * agencyFeeRate * 10000 : 0;
  const registrationFee = 80;

  // 计算总成本
  const totalCost =
    priceState * 10000 +
    personalTax +
    deedTax +
    providentFundServiceFee +
    warrant +
    agencyFee +
    registrationFee;

  // 向父组件发送贷款信息
  useEffect(() => {
    const annualRate = loanRateState / 100;
    const monthlyRate = annualRate / 12;

    const loanUpdateEvent = new CustomEvent("loan-data", {
      detail: {
        loanAmount: loanInYuan,
        monthlyRate,
      },
    });
    document.dispatchEvent(loanUpdateEvent);
  }, [loanInYuan, loanRateState]);

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
            <span>{pricePerSquareMeter.toFixed(0)}元/㎡</span>
          </div>
          <div className="flex justify-between">
            <span>贷款金额:</span>
            <span>{loanAmount}万元</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="personalTaxCheck"
                checked={personalTaxChecked}
                onCheckedChange={(checked) =>
                  setPersonalTaxChecked(checked === true)
                }
              />
              <div className="flex items-center">
                <label htmlFor="personalTaxCheck" className="text-sm mr-2">
                  个税
                </label>
                <button
                  onClick={() =>
                    setShowPersonalTaxRateInput(!showPersonalTaxRateInput)
                  }
                  className="text-xs underline text-blue-500"
                >
                  ({(personalTaxRate * 100).toFixed(1)}%)
                </button>
              </div>
            </div>
            <span>{personalTax.toFixed(0)}元</span>
          </div>

          {showPersonalTaxRateInput && (
            <div className="flex items-center ml-6 space-x-2">
              <Input
                type="number"
                value={(personalTaxRate * 100).toString()}
                min="0"
                max="100"
                step="0.1"
                className="w-20 h-6 text-xs"
                onChange={(e) =>
                  savePersonalTaxRate(parseFloat(e.target.value) / 100)
                }
              />
              <span className="text-xs">%</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="deedTaxCheck"
                checked={deedTaxChecked}
                onCheckedChange={(checked) =>
                  setDeedTaxChecked(checked === true)
                }
              />
              <div className="flex items-center">
                <label htmlFor="deedTaxCheck" className="text-sm mr-2">
                  契税
                </label>
                <button
                  onClick={() => setShowDeedTaxRateInput(!showDeedTaxRateInput)}
                  className="text-xs underline text-blue-500"
                >
                  ({(deedTaxRate * 100).toFixed(1)}%)
                </button>
              </div>
            </div>
            <span>{deedTax.toFixed(0)}元</span>
          </div>

          {showDeedTaxRateInput && (
            <div className="flex items-center ml-6 space-x-2">
              <Input
                type="number"
                value={(deedTaxRate * 100).toString()}
                min="0"
                max="100"
                step="0.1"
                className="w-20 h-6 text-xs"
                onChange={(e) =>
                  saveDeedTaxRate(parseFloat(e.target.value) / 100)
                }
              />
              <span className="text-xs">%</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="providentFundCheck"
                checked={providentFundChecked}
                onCheckedChange={(checked) =>
                  setProvidentFundChecked(checked === true)
                }
              />
              <label htmlFor="providentFundCheck" className="text-sm">
                公积金贷款服务费:
              </label>
            </div>
            <span>2000元</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="warrantCheck"
                checked={warrantChecked}
                onCheckedChange={(checked) =>
                  setWarrantChecked(checked === true)
                }
              />
              <label htmlFor="warrantCheck" className="text-sm">
                权证:
              </label>
            </div>
            <span>2000元</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agencyCheck"
                checked={agencyChecked}
                onCheckedChange={(checked) =>
                  setAgencyChecked(checked === true)
                }
              />
              <div className="flex items-center">
                <label htmlFor="agencyCheck" className="text-sm mr-2">
                  中介费
                </label>
                <button
                  onClick={() =>
                    setShowAgencyFeeRateInput(!showAgencyFeeRateInput)
                  }
                  className="text-xs underline text-blue-500"
                >
                  ({(agencyFeeRate * 100).toFixed(1)}%)
                </button>
              </div>
            </div>
            <span>{agencyFee.toFixed(0)}元</span>
          </div>

          {showAgencyFeeRateInput && (
            <div className="flex items-center ml-6 space-x-2">
              <Input
                type="number"
                value={(agencyFeeRate * 100).toString()}
                min="0"
                max="100"
                step="0.1"
                className="w-20 h-6 text-xs"
                onChange={(e) =>
                  saveAgencyFeeRate(parseFloat(e.target.value) / 100)
                }
              />
              <span className="text-xs">%</span>
            </div>
          )}

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
