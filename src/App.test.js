import Debt from "./Debt";
import RecursiveDebt from "./RecursiveDebt";

test("test 1", () => {
  const debt = new Debt(100);

  expect(debt.amount).toEqual(100);
});
test("test 2", () => {
  const debt = new Debt(100);

  const next = debt.next();

  expect(next.amount).toEqual(0);
});
test("test 3", () => {
  const debt = new Debt(100, [1, 6]);

  const next = debt.next();

  expect(next.amount).toEqual(100);
  expect(next.currentInstallment).toEqual(2);
});
test("test 4", () => {
  const debt = new Debt(100, [5, 6]);

  const next1 = debt.next();
  const next2 = next1.next();

  expect(next2.amount).toEqual(0);
  expect(next2.currentInstallment).toEqual(6);
});

test("test 5", () => {
  const debt = new Debt(100, [5, 6]);

  const next2 = debt.period(1);

  expect(next2.amount).toEqual(100);
  expect(next2.currentInstallment).toEqual(6);
});

test("test 6", () => {
  const debt = new Debt(100, [5, 6]);

  const next2 = debt.period(2);

  expect(next2.amount).toEqual(0);
  expect(next2.currentInstallment).toEqual(6);
});

test("test 6", () => {
  const debt = new RecursiveDebt(100);

  const next1 = debt.period(1);
  const next2 = debt.period(2);
  const next3 = debt.period(3);

  expect(next1.amount).toEqual(100);
  expect(next2.amount).toEqual(100);
  expect(next3.amount).toEqual(100);
});
