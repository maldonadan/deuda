import { useEffect, useState } from "react";
import "./App.css";
import Debt from "./Debt";
import RecursiveDebt from "./RecursiveDebt";

const amounts = [
  {
    amount: 2736.66,
    installments: [12, 12],
  },
  {
    amount: 18540.78,
    installments: [11, 12],
  },
  {
    amount: 751.6,
    installments: [11, 12],
  },
  {
    amount: 5274.91,
    installments: [7, 12],
  },
  {
    amount: 5459.83,
    installments: [6, 6],
  },
  {
    amount: 21033.43,
    installments: [5, 12],
  },
  {
    amount: 4260,
    installments: [5, 6],
  },
  {
    amount: 35263.5,
    installments: [3, 6],
  },
  {
    amount: 4194.66,
    installments: [3, 3],
  },
  {
    amount: 9727,
    installments: [3, 3],
  },
  {
    amount: 23333.33,
    installments: [2, 3],
  },
  {
    amount: 13366.66,
    installments: [2, 3],
  },
  {
    amount: 3757,
  },
  {
    amount: 1716.44,
  },
  {
    amount: 5937.5,
  },
  {
    amount: 2576.57,
  },
  {
    amount: 6471.46,
  },
  {
    amount: 1589.5,
  },
  {
    amount: 4654.76,
  },
  {
    amount: 10448.75,
  },
  {
    amount: 69547.53,
    recursive: true,
  },
  {
    amount: 69547.53,
  },
  {
    amount: 700.0,
  },
  {
    amount: 603.2,
  },
  {
    amount: 69.54,
  },
  {
    amount: 51.72,
  },
  {
    amount: 29.53,
  },
  {
    amount: 730.19,
  },
  {
    amount: 543.06,
  },
  {
    amount: 310.15,
  },
  {
    amount: 3393.03,
  },
];

const idioma = "es-AR";

const options = {
  style: "currency",
  currency: "ARS",
  currencyDisplay: "symbol",
};
const idiomaUSD = "en-EU";

const optionsUSD = {
  style: "currency",
  currency: "USD",
  currencyDisplay: "symbol",
};

const formatter = new Intl.NumberFormat(idioma, options);
const formatterUSD = new Intl.NumberFormat(idiomaUSD, optionsUSD);

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
  return (
    <div style={{ padding: 10, width: 100 }}>
      <div
        style={{
          fontSize: 16,
        }}
      >
        {formatter.format(debt.amount)}
      </div>
      <Installments
        currentInstallment={debt.currentInstallment}
        totalInstallment={debt.totalInstallment}
      />
    </div>
  );
};

const august = [new Debt(1234)];
const september = [new Debt(5666), new Debt(15666), new Debt(8048.63)];
const debts = amounts.map(({ amount, installments, recursive }) => {
  // return recursive ? new RecursiveDebt(amount) : new Debt(amount, installments);
  return new Debt(amount, installments);
});

const debtsByMonths = {
  "Julio 2023": debts.map((debt) => {
    debt.periodName = "Julio 2023";
    return debt;
  }),
  "Agosto 2023": august.map((debt) => {
    debt.periodName = "Agosto 2023";
    return debt;
  }),
  "Septiembre 2023": september.map((debt) => {
    debt.periodName = "Septiembre 2023";
    return debt;
  }),
};

const setByMonth = (debt) => {
  if (!debtsByMonths[debt.periodName]) {
    debtsByMonths[debt.periodName] = [];
  }
  debtsByMonths[debt.periodName].push(debt);
};
const getByMonth = (monthLabel) => {
  if (debtsByMonths[monthLabel]) {
    return debtsByMonths[monthLabel];
  }
  return [];
};

function App() {
  console.log("App render");
  const [state, setState] = useState();
  useEffect(() => {
    fetch("https://api.bluelytics.com.ar/v2/latest")
      .then((res) => res.json())
      .then(setState);
  }, []);

  const asUSD = (amount, success, empty) => {
    if (state?.blue?.value_avg) {
      return success(amount / state?.blue?.value_avg);
    } else {
    }
    return empty(amount);
  };
  const months = [
    "Julio 2023",
    "Agosto 2023",
    "Septiembre 2023",
    "Octubre 2023",
    "Noviembre 2023",
    "Diciembre 2023",
    "Enero 2024",
    "Febrero 2024",
    "Marzo 2024",
    "Abril 2024",
    "Mayo 2024",
    "Junio 2024",
  ];
  return (
    <div className="App">
      <header className="App-header">
        {months.map((month) => {
          let totalByMonth = 0;
          const rows2 = getByMonth(month).map((debt) => {
            totalByMonth += debt.amount;
            debt.setNext(setByMonth);
            return debt.amount > 0 ? <DebtCard debt={debt} /> : null;
          });
          return (
            <div>
              <h2>{month}</h2>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {rows2}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div>Pesos: {formatter.format(totalByMonth)}</div>
                <div>
                  {asUSD(
                    totalByMonth,
                    (amount) => `USD: ${formatterUSD.format(amount)}`,
                    () => ""
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </header>
    </div>
  );
}

export default App;
