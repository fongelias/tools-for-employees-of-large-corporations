import React, { useState, useEffect, useCallback } from 'react';
import { FlexBox } from 'components/presentational/FlexBox/FlexBox';
import { Input } from 'components/presentational/Input/Input';
import { OptionsGrant, OptionsGrantRow } from 'components/presentational/OptionsGrantRow/OptionsGrantRow';
import { validateNumString } from 'utils/validateNumString';
import { numStringToNum } from 'utils/numStringToNum';
import { calcCostToExercise, calcTaxes, calcAfterTaxReturn, } from 'utils/optionsCalculations';

import styles from './OptionsCalculatorPage.module.scss';


const DEFAULT_MARKET_PRICE = 1;
const DEFAULT_INCOME_TAX = 24;
const DEFAULT_CAPITAL_GAINS_TAX = 15;

const MARKET_PRICE_DESCRIPTION ="Price you can sell the shares at the current time";
const INCOME_TAX_DESCRIPTION = "Based on your tax bracket";
const CAPITAL_GAINS_TAX_DESCRIPTION = "Based on your tax bracket and holding time. Currently this defaults to holding for a year";



const defaultOptionsGrant = (
  marketPrice: number = DEFAULT_MARKET_PRICE,
  incomeTax: number = DEFAULT_INCOME_TAX,
  capitalGainsTax: number = DEFAULT_CAPITAL_GAINS_TAX,
  numShares: number = 1,
  strikePrice: number = 1,
  exercisePrice: number = 1,
) => {
  const taxes = calcTaxes(
    incomeTax,
    capitalGainsTax,
    numShares,
    strikePrice,
    exercisePrice,
    marketPrice
  );

  return {
    numShares,
    strikePrice,
    exercisePrice,
    costToExercise: calcCostToExercise(numShares, strikePrice),
    taxes,
    afterTaxReturn: calcAfterTaxReturn(numShares, marketPrice, strikePrice, taxes),
  }
}

const OptionsCalculator = () => {
  // User Inputs
  // Input once for the entire page:
  const [marketPrice, setMarketPrice] = useState(DEFAULT_MARKET_PRICE);
  const [incomeTax, setIncomeTax] = useState(DEFAULT_INCOME_TAX);
  const [capitalGainsTax, setCapitalGainsTax] = useState(DEFAULT_CAPITAL_GAINS_TAX);
  // Input per option grant:
  const [optionsGrants, setOptionsGrants] = useState([defaultOptionsGrant()]);
  const addNewOptionsGrant = useCallback(() => {
    const newOptionsGrant = defaultOptionsGrant(marketPrice, incomeTax, capitalGainsTax);
    setOptionsGrants((initialState) => [...initialState, newOptionsGrant]);
  },[marketPrice, incomeTax, capitalGainsTax, setOptionsGrants]);
  const setOptionsGrantsAtIdx = (newOptionsGrant: OptionsGrant, idx: number) => {
    setOptionsGrants(initialState => [...initialState.slice(0,idx), newOptionsGrant, ...initialState.slice(idx + 1)]);
  };
  const calculatedValues = (
    incomeTax: number,
    capitalGainsTax: number,
    numShares: number,
    strikePrice: number,
    exercisePrice: number,
    marketPrice: number
  ): [number, number, number] => {
    const costToExercise = calcCostToExercise(numShares, strikePrice);
    const taxes = calcTaxes(
      incomeTax,
      capitalGainsTax,
      numShares,
      strikePrice,
      exercisePrice,
      marketPrice
    );
    const afterTaxReturn = calcAfterTaxReturn(numShares, marketPrice, strikePrice, taxes);
    return [costToExercise, taxes, afterTaxReturn];
  };
  const setNumSharesFactory = (idx: number) => {
    return (numShares: number) => {
      const {
        strikePrice,
        exercisePrice,
      } = optionsGrants[idx]
      const [costToExercise, taxes, afterTaxReturn] = calculatedValues(
        incomeTax,
        capitalGainsTax,
        numShares,
        strikePrice,
        exercisePrice,
        marketPrice
      );

      const newOptionsGrant: OptionsGrant = {
        strikePrice,
        exercisePrice,
        numShares: numShares,
        costToExercise,
        taxes,
        afterTaxReturn,
      }

      setOptionsGrantsAtIdx(newOptionsGrant, idx);
    }
  };
  const setStrikePriceFactory = (idx: number) => {
    return (strikePrice: number) => {
      const {
        numShares,
        exercisePrice,
      } = optionsGrants[idx]

      const [costToExercise, taxes, afterTaxReturn] = calculatedValues(
        incomeTax,
        capitalGainsTax,
        numShares,
        strikePrice,
        exercisePrice,
        marketPrice
      );

      const newOptionsGrant: OptionsGrant = {
        strikePrice,
        exercisePrice,
        numShares: numShares,
        costToExercise,
        taxes,
        afterTaxReturn,
      }

      setOptionsGrantsAtIdx(newOptionsGrant, idx);
    }
  };
  const setExercisePriceFactory = (idx: number) => {
    return (exercisePrice: number) => {
      const {
        numShares,
        strikePrice,
      } = optionsGrants[idx]

      const [costToExercise, taxes, afterTaxReturn] = calculatedValues(
        incomeTax,
        capitalGainsTax,
        numShares,
        strikePrice,
        exercisePrice,
        marketPrice
      );

      const newOptionsGrant: OptionsGrant = {
        strikePrice,
        exercisePrice,
        numShares: numShares,
        costToExercise,
        taxes,
        afterTaxReturn,
      }

      setOptionsGrantsAtIdx(newOptionsGrant, idx);
    }
  };
  const calculateReturnsFromOptionGrants = (grants: OptionsGrant[]) => grants.reduce((acc, grant) => acc + grant.afterTaxReturn, 0).toFixed(2);
  useEffect(() => {
    // update all rows when constants change
    setOptionsGrants((initialState) => {
      return initialState.map((optionsGrant) => {
        const [costToExercise, taxes, afterTaxReturn] = calculatedValues(
          incomeTax,
          capitalGainsTax,
          optionsGrant.numShares,
          optionsGrant.strikePrice,
          optionsGrant.exercisePrice,
          marketPrice
        );

        return {
          ...optionsGrant,
          costToExercise,
          taxes,
          afterTaxReturn,
        }
      });
    });
  }, [marketPrice, incomeTax, capitalGainsTax])

  return (
    <>
    <FlexBox
      className={styles.optionsCalculatorConstants}
      justify="center">
      <FlexBox
        direction="column"
        className={styles.optionsCalculatorConstant}>
        <label>Market Price</label>
        <Input
          value={marketPrice}
          setValue={setMarketPrice}
          validateValue={validateNumString}
          convertFromString={numStringToNum}
          description={MARKET_PRICE_DESCRIPTION}/>
      </FlexBox>
      <FlexBox
        direction="column"
        className={styles.optionsCalculatorConstant}>
        <label>Income Tax</label>
        <Input
          value={incomeTax}
          setValue={setIncomeTax}
          validateValue={validateNumString}
          convertFromString={numStringToNum}
          description={INCOME_TAX_DESCRIPTION}/>
      </FlexBox>
      <FlexBox
        direction="column"
        className={styles.optionsCalculatorConstant}>
        <label>Capital Gains Tax</label>
        <Input
          value={capitalGainsTax}
          setValue={setCapitalGainsTax}
          validateValue={validateNumString}
          convertFromString={numStringToNum}
          description={CAPITAL_GAINS_TAX_DESCRIPTION}/>
      </FlexBox>
      <div className={styles.spacer}/>
    </FlexBox>
    <FlexBox className={styles.optionsGrantContainer} direction='column'>
      {optionsGrants.map(((optionsGrant, idx) => (
        <OptionsGrantRow
          key={idx}
          optionsGrant={optionsGrant}
          setNumShares={setNumSharesFactory(idx)}
          setStrikePrice={setStrikePriceFactory(idx)}
          setExercisePrice={setExercisePriceFactory(idx)}/>
      )))}
      <FlexBox className={styles.buttonContainer} justify='center'>
        <button className={styles.addOptionsGrantButton} onClick={addNewOptionsGrant}>
          <span className={styles.line1}></span>
          <span className={styles.line2}></span>
        </button>
      </FlexBox>
    </FlexBox>
    <h2 className={styles.totalReturns}>
      Your Options are worth: {calculateReturnsFromOptionGrants(optionsGrants)}
    </h2>
    </>
  )
}

export const OptionsCalculatorPage = () => {
  return (
    <div>
      <header className={styles.optionsCalculatorHeader}>
        <h1>
          How much are my options worth?
        </h1>
      </header>
      <OptionsCalculator/>
    </div>
  )
}