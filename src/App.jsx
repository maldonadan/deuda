import { useEffect, useState } from "react";
import "./App.css";
import { useCurrencyFormatter } from "./useCurrencyFormatter";
import { useCurrencyConversion } from "./useCurrencyConversion";

const FIRST_DAY_OF_SEPTEMBER = "2023-09-01T00:00:00Z";
const FIRST_DAY_OF_OCTOBER = "2023-10-01T00:00:00Z";
const FIRST_DAY_OF_NOVEMBER = "2023-11-01T00:00:00Z";
const FIRST_DAY_OF_DECEMBER = "2023-12-01T00:00:00Z";
const FIRST_DAY_OF_JANUARY = "2024-01-01T00:00:00Z";
// const AMOUNT_PER_HOUR = 5000;
const AMOUNT_PER_HOUR = 8000;

const Installments = ({ currentInstallment = 0, totalInstallment = 0 }) => {
  return (
    <div
      style={{
        fontSize: 14,
      }}
    >
      {Number.isFinite(currentInstallment) &&
        Number.isFinite(totalInstallment) &&
        `${currentInstallment}/${totalInstallment}`}
    </div>
  );
};

const hola = "sdasda";

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

const getMinutesSince = (start) =>
  fetch(
    `https://api.clockify.me/api/v1/workspaces/60b8f0c0223953517d9a003c/user/64411f974d88e14c258cf7d4/time-entries?start=${start}`,
    {
      headers: {
        "X-API-KEY": "NzhlZTdiMzctOTg5Yi00YmI3LThiN2UtNjI2YjUxZDZjNjk1",
      },
    }
  )
    .then((response) => response.json())
    .then((response) => ({
      minutes: response
        .map((item) => durationToMinutes(item.timeInterval.duration))
        .reduce((acc, minutes) => acc + minutes, 0),
      rows: response.map((item) => ({
        description: item.description,
        startDate: item.timeInterval.start,
      })),
    }));

function App() {
  const { txUSD } = useCurrencyConversion();
  const [response, setResponse] = useState({});
  console.log(response);
  const minutes = response.minutes;
  const rows = response.rows;
  const MONTH = "Octubre";
  useEffect(() => {
    // getMinutesSince(FIRST_DAY_OF_SEPTEMBER).then(setResponse);
    // getMinutesSince(FIRST_DAY_OF_OCTOBER).then(setResponse);
    // getMinutesSince(FIRST_DAY_OF_NOVEMBER).then(setResponse);
    // getMinutesSince(FIRST_DAY_OF_DECEMBER).then(setResponse);
    getMinutesSince(FIRST_DAY_OF_JANUARY).then(setResponse);
  }, []);

  if (!minutes) {
    return <div className="content">loading...</div>;
  }

  return (
    <div className="content">
      {MONTH}
      <section className="montos">
        <article className="cell">
          <div className="icon">⌛</div>
          <div>{minutesToHourAndMinutes(minutes)}</div>
        </article>
        <article className="cell">
          <div className="icon">💵</div>
          <div>{formatPrice(txUSD)}</div>
        </article>
        <article className="cell">
          <div className="currency-symbol icon">$AR</div>
          <div>{formatPrice(Math.floor(minutes * (AMOUNT_PER_HOUR / 60)))}</div>
        </article>
        <article className="cell">
          <div className="currency-symbol icon">U$D</div>
          <div>
            {formatPrice(
              Math.floor((minutes * (AMOUNT_PER_HOUR / 60)) / txUSD)
            )}
          </div>
        </article>
      </section>
      <section>
        {rows.map((row) => (
          <Descripcion row={row} />
        ))}
      </section>
    </div>
  );
}

function Descripcion({ row }) {
  return (
    <div
      style={{
        fontSize: 24,
        display: "flex",
        alignItems: "baseline",
        gap: 20,
        padding: 10,
      }}
    >
      <div>{row.description}</div>
      <div style={{ fontSize: 14 }}>{row.startDate}</div>
    </div>
  );
}

function durationToMinutes(duration) {
  if (!duration) {
    return 0;
  }
  let minutes = 0;

  // Buscar el patrón "XH" para obtener las horas
  const hoursMatch = duration.match(/(\d+)H/);
  if (hoursMatch) {
    const hours = parseInt(hoursMatch[1], 10);
    minutes += hours * 60;
  }

  // Buscar el patrón "XM" para obtener los minutos
  const minutesMatch = duration.match(/(\d+)M/);
  if (minutesMatch) {
    const mins = parseInt(minutesMatch[1], 10);
    minutes += mins;
  }

  return minutes;
}

function minutesToHourAndMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}:${remainingMinutes < 10 ? "0" : ""}${remainingMinutes}`;
}

function formatPrice(amount) {
  // Crea un objeto Intl.NumberFormat con el formato deseado
  const formatter = new Intl.NumberFormat("es-ES", {
    style: "decimal", // Usa 'decimal' para separar miles con un punto
    minimumFractionDigits: 0, // Sin decimales
    maximumFractionDigits: 0, // Sin decimales
  });

  // Formatea el número y devuelve la cadena resultante
  return formatter.format(amount);
}

export default App;
