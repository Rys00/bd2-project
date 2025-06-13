"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";

export function SimpleChart<
  T extends {
    [x: string]: number;
  }
>({
  data,
  config,
}: {
  data: {
    date: string;
    values: T;
  }[];
  config: {
    [Key in keyof T]: {
      label: string;
      color: string;
    };
  };
}) {
  const isMobile = useIsMobile();

  const filteredData = data.map((item) => ({
    ...item.values,
    date: item.date,
  }));

  return (
    <ChartContainer config={config}>
      <AreaChart data={filteredData}>
        <defs>
          {Object.keys(config).map((key, index) => (
            <linearGradient
              key={key}
              id={`fill-${key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={`var(--color-${key})`}
                stopOpacity={1.0 * 0.8 ** index}
              />
              <stop
                offset="95%"
                stopColor={`var(--color-${key})`}
                stopOpacity={0.1}
              />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("pl-PL", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <ChartTooltip
          cursor={false}
          defaultIndex={isMobile ? -1 : 10}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("pl-PL", {
                  month: "short",
                  day: "numeric",
                });
              }}
              indicator="dot"
            />
          }
        />
        {Object.keys(config).map((key) => (
          <Area
            key={key}
            dataKey={key}
            type="bump"
            fill={`url(#fill-${key})`}
            stroke={`var(--color-${key})`}
            stackId={key}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}
