import React, { useState } from 'react';
import cx from 'classnames';
import styles from './Input.module.scss';


interface InputProps<T> {
  value: T;
  setValue: (newVal: T) => void;
  className?: string;
  placeholder?: string;
  validateValue?: (str: string) => boolean;
  convertFromString?: (str: string) => T;
  description?: string;
}

export const Input = <T extends unknown>({
  className,
  value,
  setValue,
  placeholder,
  validateValue = () => true,
  convertFromString,
  description,
}: InputProps<T>) => {
  // State
  const [errorState, setErrorState] = useState(false);
  const [internalValue, setInternalValue] = useState(`${value}`);

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const eventValue = event.currentTarget.value;
    const newErrorState = !validateValue(eventValue);

    setErrorState(newErrorState);
    setInternalValue(eventValue);

    if (!newErrorState) {
      setValue(convertFromString ? convertFromString(eventValue): eventValue as T);
    }
  }

  const handleBlur = () => {
    // reset state
    setInternalValue(`${value}`);
    setErrorState(false);
  }

  return (
    <input
      className={cx(className, styles.input, {
        [styles.error]: errorState,
      })}
      type="string"
      placeholder={placeholder}
      value={`${internalValue}`}
      onChange={handleChange}
      onBlur={handleBlur}
      title={description}/>
  )
}
