import { ReducedReport } from "@/utils/reports";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

const ComparingCards = ({
  shortTerm,
  longTerm,
  joinedTerm,
  shortTermLabel,
  longTermLabel,
  displayAverage,
}: {
  shortTerm: ReducedReport;
  longTerm: ReducedReport;
  joinedTerm?: ReducedReport;
  shortTermLabel?: string;
  longTermLabel?: string;
  displayAverage?: boolean;
}) => {
  const profitChange = shortTerm.averageDailyProfit
    .dividedBy(longTerm.averageDailyProfit)
    .mul(100)
    .round()
    .minus(100)
    .clamp(-100, 999);

  const ordersChange = Math.min(
    Math.round(
      (shortTerm.averageOrdersCount / longTerm.averageOrdersCount) * 100
    ) - 100,
    999
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center px-4 lg:px-6">
        <Separator className="absolute" />
        <span className="bg-background z-10 px-10 text-2xl text-primary">
          Statystyki {shortTermLabel}
        </span>
      </div>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>
              Całkowity{" "}
              <span className="font-medium">
                zysk <span className="opacity-50">(przychód)</span>
              </span>{" "}
              {shortTermLabel}
            </CardDescription>
            <div className="flex gap-3">
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {shortTerm.totalDailyProfit.toString()} zł
              </CardTitle>
              <CardTitle className="opacity-50 text-xl tabular-nums @[250px]/card:text-xl">
                ({shortTerm.totalDailySales.toString()} zł)
              </CardTitle>
            </div>
            <CardAction>
              <Badge variant="outline">
                {profitChange.comparedTo(0) > 0 ? (
                  <IconTrendingUp />
                ) : (
                  <IconTrendingDown />
                )}
                {profitChange.comparedTo(0) > 0 ? "+" : "-"}
                {profitChange.abs().toString()}%
              </Badge>
            </CardAction>
            {displayAverage && (
              <CardDescription>
                Średnio: {shortTerm.averageDailyProfit.toString()} zł / dzień
              </CardDescription>
            )}
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Tendencja{" "}
              {profitChange.comparedTo(0) > 0 ? "wzrostowa" : "spadkowa"} zysku
              {profitChange.comparedTo(0) > 0 ? (
                <IconTrendingUp className="size-4" />
              ) : (
                <IconTrendingDown className="size-4" />
              )}
            </div>
            <div className="text-muted-foreground">
              Względem {longTermLabel}
              {joinedTerm && (
                <span>
                  {" "}
                  (Łącznie -{" "}
                  <span className="font-medium">
                    {joinedTerm.totalDailyProfit.toString()} zł
                  </span>
                  )
                </span>
              )}
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>
              <span className="font-medium">Zmówienia</span> {shortTermLabel}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {shortTerm.totalOrdersCount.toString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {ordersChange > 0 ? <IconTrendingUp /> : <IconTrendingDown />}
                {ordersChange > 0 ? "+" : "-"}
                {Math.abs(ordersChange).toString()}%
              </Badge>
            </CardAction>
            {displayAverage && (
              <CardDescription>
                Średnio: {shortTerm.averageOrdersCount.toString()} / dzień
              </CardDescription>
            )}
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Tendencja {ordersChange > 0 ? "wzrostowa" : "spadkowa"} zamówień
              {ordersChange > 0 ? (
                <IconTrendingUp className="size-4" />
              ) : (
                <IconTrendingDown className="size-4" />
              )}
            </div>
            <div className="text-muted-foreground">
              Względem {longTermLabel}
              {joinedTerm && (
                <span>
                  {" "}
                  (Łącznie -{" "}
                  <span className="font-medium">
                    {joinedTerm.totalOrdersCount.toString()}
                  </span>
                  )
                </span>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ComparingCards;
