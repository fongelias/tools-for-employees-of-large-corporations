import React from 'react';
import { validateNumString } from 'utils/validateNumString';
import { numStringToNum } from 'utils/numStringToNum';
import { FlexBox } from 'components/presentational/FlexBox/FlexBox';
import { Input } from 'components/presentational/Input/Input';

import styles from './OptionsGrantRow.module.scss';

const DECIMAL_PLACES = 2;

const NUM_SHARES_DESCRIPTION = "The number of shares you plan to exercise";
const STRIKE_PRICE_DESCRIPTION = "Price your option allows you to buy shares at"
const EXERCISE_PRICE_DESCRIPTION = "Price you exercise your options at. You can assume this is equal to market price, unless you hold your shares"
const COST_TO_EXERCISE_DESCRIPTION = "The amount you need to pay to buy shares: No. of Shares x Strike Price";
const TAXES_DESCRIPTION = "Capital Gains Tax + Income Tax";
const AFTER_TAX_RETURN_DESCRIPTION = "Profits - Taxes";

export interface OptionsGrant {
  // UserInputs
  numShares: number;
  strikePrice: number;
  exercisePrice: number;
  // Calculator Outputs
  costToExercise: number;
  taxes: number;
  afterTaxReturn: number;
}

interface OptionsGrantRowProps {
  optionsGrant: OptionsGrant;
  setNumShares: (newVal: number) => void;
  setStrikePrice: (newVal: number) => void;
  setExercisePrice: (newVal: number) => void;
}

export const OptionsGrantRow = ({
  optionsGrant: {
    numShares,
    strikePrice,
    exercisePrice,
    costToExercise,
    taxes,
    afterTaxReturn,
  },
  setNumShares,
  setStrikePrice,
  setExercisePrice,
}: OptionsGrantRowProps) => (
  <FlexBox
    className={styles.optionsGrantRow}
    justify={'center'}>
    <FlexBox
      direction="column"
      className={styles.optionsGrantProperty}>
      <label>No. of Shares</label>
      <Input
        value={numShares}
        setValue={setNumShares}
        validateValue={validateNumString}
        convertFromString={numStringToNum}
        description={NUM_SHARES_DESCRIPTION}/>
    </FlexBox>
    <FlexBox
      direction="column"
      className={styles.optionsGrantProperty}>
      <label>Strike Price</label>
      <Input
        value={strikePrice}
        setValue={setStrikePrice}
        validateValue={validateNumString}
        convertFromString={numStringToNum}
        description={STRIKE_PRICE_DESCRIPTION}/>
    </FlexBox>
    <FlexBox
      direction="column"
      className={styles.optionsGrantProperty}>
      <label>Exercise Price</label>
      <Input
        value={exercisePrice}
        setValue={setExercisePrice}
        validateValue={validateNumString}
        convertFromString={numStringToNum}
        description={EXERCISE_PRICE_DESCRIPTION}/>
    </FlexBox>
    <FlexBox
      direction="column"
      className={styles.optionsGrantProperty}>
      <label>Cost To Exercise</label>
      <data
        className={styles.computedValue}
        title={COST_TO_EXERCISE_DESCRIPTION}>
        {costToExercise.toFixed(DECIMAL_PLACES)}
      </data>
    </FlexBox>
    <FlexBox
      direction="column"
      className={styles.optionsGrantProperty}>
      <label>Taxes</label>
      <data
        className={styles.computedValue}
        title={TAXES_DESCRIPTION}>
        {taxes.toFixed(DECIMAL_PLACES)}
      </data>
    </FlexBox>
    <FlexBox
      direction="column"
      className={styles.optionsGrantProperty}>
      <label>After Tax Return</label>
      <data
        className={styles.computedValue}
        title={AFTER_TAX_RETURN_DESCRIPTION}>
        {afterTaxReturn.toFixed(DECIMAL_PLACES)}
      </data>
    </FlexBox>
  </FlexBox>
);
