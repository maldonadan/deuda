function siguienteMes(input) {
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

  const partes = input.split(" ");
  const mesActual = partes[0];
  const añoActual = parseInt(partes[1]);

  let indiceMes = meses.indexOf(mesActual);
  if (indiceMes === -1) {
    return "Mes no válido";
  }

  if (indiceMes === 11) {
    indiceMes = 0;
    partes[1] = (añoActual + 1).toString();
  } else {
    indiceMes++;
  }

  partes[0] = meses[indiceMes];

  return partes.join(" ");
}

class Debt {
  amount = 0;
  constructor(amount, installments = [0, 0], month = "") {
    const [current, total] = installments;
    this.amount = amount;
    this.currentInstallment = current;
    this.totalInstallment = total;
    this.month = month;
  }
  populate(state, month, currentInstallment, totalInstallment) {
    if (currentInstallment <= totalInstallment) {
      return this.populate(
        {
          ...state,
          [month]: [
            ...(state[month] || []),
            {
              amount: this.amount,
            },
          ],
        },
        siguienteMes(month),
        currentInstallment + 1,
        totalInstallment
      );
    } else {
      return state;
    }
  }
  next(state) {
    const installments = this.populate(
      {},
      this.month,
      this.currentInstallment,
      this.totalInstallment
    );
    let newState = {
      ...state,
      [this.month]: [
        ...state[this.month],
        {
          amount: this.amount,
        },
      ],
    };
    Object.keys(installments).forEach((month) => {
      const elemento = installments[month];
      newState = {
        ...newState,
        [month]: [...(state[month] || []), ...elemento],
      };
    });
    return newState;
  }
}

export default Debt;
