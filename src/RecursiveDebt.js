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

class RecursiveDebt {
  amount = 0;
  constructor(amount, periodName) {
    this.amount = amount;
    this.periodName = periodName;
  }
  setNext(setByMonth) {
    setByMonth(this.period());
  }
  period() {
    return new RecursiveDebt(this.amount, siguienteMes(this.periodName));
  }
}

export default RecursiveDebt;
