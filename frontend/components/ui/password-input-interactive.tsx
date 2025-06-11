"use client";

import { cn } from "@/lib/utils";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import * as React from "react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";

const PasswordInputInteractive = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ id, className, ...props }, ref) => {
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "Co najmniej 8 znaków" },
      { regex: /[0-9]/, text: "Co najmniej 1 cyfrę" },
      { regex: /[a-z]/, text: "Co najmniej jedną małą literę" },
      { regex: /[A-Z]/, text: "Co najmniej jedną dużą literę" },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Wpisz hasło";
    if (score <= 2) return "Słabe password";
    if (score === 3) return "Średnie hasło";
    return "Mocne hasło";
  };

  return (
    <div>
      {/* Password input field with toggle visibility button */}
      <div className="*:not-first:mt-2">
        <div className="relative">
          <Input
            id={id}
            className={cn("hide-password-toggle pr-10", className)}
            ref={ref}
            type={isVisible ? "text" : "password"}
            aria-describedby={`${id}-description`}
            {...props}
            onChange={(e) => {
              if (props.onChange) props.onChange(e);
              setPassword(e.target.value);
            }}
          />
          <button
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            aria-controls="password"
          >
            {isVisible ? (
              <EyeOffIcon size={16} aria-hidden="true" />
            ) : (
              <EyeIcon size={16} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Password strength indicator */}
      <div
        className="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-label="Password strength"
      >
        <div
          className={`h-full ${getStrengthColor(
            strengthScore
          )} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 4) * 100}%` }}
        ></div>
      </div>

      {/* Password strength description */}
      <p
        id={`${id}-description`}
        className="text-foreground mb-2 text-sm font-medium"
      >
        {getStrengthText(strengthScore)}. Musi zawierać:
      </p>

      {/* Password requirements list */}
      <ul className="space-y-1.5" aria-label="Password requirements">
        {strength.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {req.met ? (
              <CheckIcon
                size={16}
                className="text-emerald-500"
                aria-hidden="true"
              />
            ) : (
              <XIcon
                size={16}
                className="text-muted-foreground/80"
                aria-hidden="true"
              />
            )}
            <span
              className={`text-xs ${
                req.met ? "text-emerald-600" : "text-muted-foreground"
              }`}
            >
              {req.text}
              <span className="sr-only">
                {req.met ? " - Requirement met" : " - Requirement not met"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
});
PasswordInputInteractive.displayName = "PasswordInputInteractive";

export { PasswordInputInteractive };
