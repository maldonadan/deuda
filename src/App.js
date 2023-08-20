import { useState } from "react";
import "./App.css";
import Debt from "./Debt";
import { useForm } from "react-hook-form";
import { useCurrencyFormatter } from "./useCurrencyFormatter";
import { useCurrencyConversion } from "./useCurrencyConversion";

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
  const { asUSD } = useCurrencyConversion();
  const { formatCurrency } = useCurrencyFormatter();
  const [debtFormValuesState, setDebtFormValuesState] = useState({
    showForm: false,
  });
  const initialState = localStorage.getItem("debts")
    ? JSON.parse(localStorage.getItem("debts"))
    : {
        "Julio 2023": [],
        "Agosto 2023": [],
        "Septiembre 2023": [],
      };
  const [state, setState] = useState(initialState);

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  function compararFechasDescendente(a, b) {
    const fechaA = new Date(a.split(" ")[1], meses.indexOf(a.split(" ")[0]), 1);
    const fechaB = new Date(b.split(" ")[1], meses.indexOf(b.split(" ")[0]), 1);

    return fechaA - fechaB;
  }
  const months = Object.keys(state);

  const arrayOrdenado = months.sort(compararFechasDescendente);

  const addDebt = (month, amount, currentInstallment, totalInstallment) => {
    const debt = new Debt(month, amount, currentInstallment, totalInstallment);
    const myNewState = debt.next(state);
    localStorage.setItem("debts", JSON.stringify(myNewState));
    setState(myNewState);
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
      <DebtForm
        onSubmit={(data) => {
          addDebtHandler(data);
        }}
        debtFormValuesState={debtFormValuesState}
        setDebtFormValuesState={setDebtFormValuesState}
      />
      {arrayOrdenado.map((month) => {
        let totalByMonth = 0;
        const rows = getDebtsByMonth(month).map((debt, index) => {
          totalByMonth += debt.amount;
          return <DebtCard key={index} debt={debt} />;
        });
        return (
          <div key={month}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <h2>{month}</h2>
              <div>ARS: {formatCurrency(totalByMonth, "ARS")}</div>
              <div>
                {asUSD(
                  totalByMonth,
                  (amount) => `USD: ${formatCurrency(amount)}`,
                  () => ""
                )}
              </div>
            </div>
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
