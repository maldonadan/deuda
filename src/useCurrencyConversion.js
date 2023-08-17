import { useEffect, useState } from "react";

export function useCurrencyConversion() {
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

  return {
    asUSD,
    txUSD: state?.blue?.value_avg || 0,
  };
}
