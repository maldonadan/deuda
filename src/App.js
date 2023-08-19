import { useState } from "react";
import "./App.css";
import Debt from "./Debt";
import { useForm } from "react-hook-form";
import { useCurrencyConversion } from "./useCurrencyConversion";
import { useCurrencyFormatter } from "./useCurrencyFormatter";

const Installments = ({ currentInstallment, totalInstallment = 0 }) => {
  if (totalInstallment === 0) {
    return (
      <div
        style={{
          fontSize: 14,
        }}
      >
        Pago único
      </div>
    );
  }
  return (
    <div
      style={{
        fontSize: 14,
      }}
    >
      {currentInstallment}/{totalInstallment}
    </div>
  );
};

const DebtCard = ({ debt }) => {
  const { formatCurrency } = useCurrencyFormatter();
  if (debt.amount === 0) {
    return null;
  }
  return (
    <div style={{ width: 100 }}>
      <div
        style={{
          fontSize: 16,
        }}
      >
        {formatCurrency(debt.amount)}
      </div>
      <Installments
        currentInstallment={debt.currentInstallment}
        totalInstallment={debt.totalInstallment}
      />
    </div>
  );
};

function App() {
  const [debtFormValuesState, setDebtFormValuesState] = useState({
    showForm: false,
  });
  const [state, setState] = useState({
    "Julio 2023": [],
    "Agosto 2023": [
      {
        amount: 1000,
      },
    ],
    "Septiembre 2023": [],
  });
  const months = Object.keys(state);
  const { txUSD } = useCurrencyConversion();
  const addDebt = (
    month,
    amount,
    currentInstallment = 0,
    totalInstallment = 0
  ) => {
    setState((state) => {
      const debt = new Debt(
        parseFloat(amount),
        [parseInt(currentInstallment), parseInt(totalInstallment)],
        month
      );
      const myNewState = debt.next(state);
      return myNewState;
    });
  };
  const addDebtHandler = (debtFormValues) => {
    addDebt(
      debtFormValues.month,
      debtFormValues.amount,
      debtFormValues.currentInstallment,
      debtFormValues.totalInstallment
    );
  };
  const getDebtsByMonth = (month) => {
    return state[month] || [];
  };
  return (
    <div
      style={{
        padding: 10,
      }}
    >
      <header>
        <span>{`1 USD = ${txUSD}`}</span>
        <div>
          <DebtForm
            onSubmit={(data) => {
              addDebtHandler(data);
            }}
            debtFormValuesState={debtFormValuesState}
            setDebtFormValuesState={setDebtFormValuesState}
          />
        </div>
      </header>
      {months.map((month) => {
        const rows = getDebtsByMonth(month).map((debt, index) => (
          <DebtCard key={index} debt={debt} />
        ));
        return (
          <div key={month}>
            <h2>{month}</h2>
            <div style={{ padding: 10 }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {rows}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DebtForm({ debtFormValuesState, setDebtFormValuesState, onSubmit }) {
  const { register, handleSubmit } = useForm();
  const showDebtForm = () => {
    setDebtFormValuesState({
      showForm: true,
    });
  };
  const closeDebtForm = () => {
    setDebtFormValuesState({
      showForm: false,
    });
  };
  if (!debtFormValuesState.showForm) {
    return (
      <div>
        <button type="submit" onClick={showDebtForm}>
          Add
        </button>
      </div>
    );
  }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("amount")} name="amount" />
        <input {...register("month")} name="month" />
        <input {...register("currentInstallment")} name="currentInstallment" />
        <input {...register("totalInstallment")} name="totalInstallment" />
        <button type="submit">Submit</button>
      </form>
      <button type="button" onClick={closeDebtForm}>
        Close
      </button>
    </div>
  );
}

export default App;
