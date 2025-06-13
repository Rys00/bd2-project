"use client";

import type React from "react";

import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuantityInputProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export function QuantityInput({
  value: initialValue = 1,
  min = 1,
  max = 99,
  step = 1,
  onChange,
  disabled = false,
  className = "",
}: QuantityInputProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max);
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min);
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number.parseInt(e.target.value, 10);

    if (isNaN(inputValue)) {
      setValue(min);
      onChange?.(min);
      return;
    }

    const newValue = Math.max(min, Math.min(inputValue, max));
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleBlur = () => {
    // Ensure the value is within bounds when the input loses focus
    const newValue = Math.max(min, Math.min(value, max));
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-r-none"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`${
          value > 0 ? "text-green-500 dark:text-green-400 font-bold" : ""
        } h-8 w-12 rounded-none border-x-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
        disabled={disabled}
        aria-label="Product quantity"
      />
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-l-none"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
