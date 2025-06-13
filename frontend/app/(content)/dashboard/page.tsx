"use client";

import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { SectionCards } from "@/components/dashboard/section-cards";

import {
  DailyReportView,
  getDailyReport,
  getDailyReportsRange,
} from "@/lib/backend-requests/reports";
import { useAppDispatch } from "@/lib/store/hooks";
import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";

const emptyReport = (date?: Date): DailyReportView => ({
  day: date || new Date(),
  orders_count: 0,
  total_profit: new Prisma.Decimal(0),
  total_sales: new Prisma.Decimal(0),
});

export default function Page() {
  const [dailyReport, setDailyReport] = useState<DailyReportView>(
    emptyReport()
  );
  const [sixMonthReport, setSixMonthReport] = useState<DailyReportView[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const exec = async () => {
      const currentDate = new Date();
      const monthAgo = new Date();
      monthAgo.setMonth(currentDate.getMonth() - 1);
      const sixMonthAgo = new Date();
      sixMonthAgo.setMonth(currentDate.getMonth() - 6);

      setDailyReport((await getDailyReport(dispatch))[0]);
      const sixMonths = await getDailyReportsRange(
        { start: sixMonthAgo, end: currentDate },
        dispatch
      );

      setSixMonthReport(sixMonths);
    };
    exec();
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards
            dailyReport={dailyReport}
            sixMonthReport={sixMonthReport}
          />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
        </div>
      </div>
    </div>
  );
}
