class RecursiveDebt {
  amount = 0;
  constructor(amount) {
    this.amount = amount;
  }
  setNext(setByMonth) {
    setByMonth(this.period(1));
  }
  period() {
    return new RecursiveDebt(this.amount);
  }
}

export default RecursiveDebt;
