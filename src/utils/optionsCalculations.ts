export const calcCostToExercise = (numShares: number, strikePrice: number) => numShares * strikePrice;

export const calcTaxes = (
  incomeTax: number,
  capitalGainsTax: number,
  numShares: number,
  strikePrice: number,
  exercisePrice: number,
  marketPrice: number,
) => {
  const totalIncomeTax = (incomeTax / 100) * (exercisePrice - strikePrice) * numShares;
  const totalCapitalGainsTax = (capitalGainsTax / 100) * (marketPrice - exercisePrice) * numShares;

  return totalIncomeTax + totalCapitalGainsTax;
}

export const calcAfterTaxReturn = (
  numShares: number,
  marketPrice: number,
  strikePrice: number,
  taxes: number,
) => {
  const totalSaleValue = numShares * marketPrice;
  return totalSaleValue - taxes - calcCostToExercise(numShares, strikePrice);
}
