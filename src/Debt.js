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
  constructor(amount, installments = [0, 0], periodName = "") {
    const [current, total] = installments;
    this.amount = amount;
    this.currentInstallment = current;
    this.totalInstallment = total;
    this.periodName = periodName;
  }
  setNext(setByMonth) {
    // console.log(this.period(1));
    if (this.period(1).amount > 0) {
      setByMonth(this.period(1));
    }
  }
  next() {
    if (this.currentInstallment < this.totalInstallment) {
      return new Debt(this.amount, [
        this.currentInstallment + 1,
        this.totalInstallment,
      ]);
    }
    return new Debt(0, [this.currentInstallment, this.totalInstallment]);
  }
  period(numberOfPeriods) {
    const debt = new Debt(
      this.amount,
      [this.currentInstallment + numberOfPeriods, this.totalInstallment],
      siguienteMes(this.periodName)
    );
    if (debt.currentInstallment <= debt.totalInstallment) {
      return debt;
    }
    return new Debt(
      0,
      [this.totalInstallment, this.totalInstallment],
      siguienteMes(this.periodName)
    );
  }
}

export default Debt;
