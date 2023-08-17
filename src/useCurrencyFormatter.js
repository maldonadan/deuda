export function useCurrencyFormatter() {
  return {
    formatCurrency: (amount, currency = "USD") => {
      if (currency === "USD") {
        const idiomaUSD = "en-EU";
        const optionsUSD = {
          style: "currency",
          currency: "USD",
          currencyDisplay: "symbol",
        };
        const formatterUSD = new Intl.NumberFormat(idiomaUSD, optionsUSD);

        return formatterUSD.format(amount);
      }
      const idioma = "es-AR";
      const options = {
        style: "currency",
        currency: "ARS",
        currencyDisplay: "symbol",
      };
      const formatter = new Intl.NumberFormat(idioma, options);
      return formatter.format(amount);
    },
  };
}
