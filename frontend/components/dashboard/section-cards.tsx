import {
  DailyReportView,
  fixDailyReportViewArray,
} from "@/lib/backend-requests/reports";
import { reduceReport } from "@/utils/reports";
import ComparingCards from "./comparing-cards";

export function SectionCards({
  dailyReport,
  sixMonthReport,
}: {
  dailyReport: DailyReportView;
  sixMonthReport: DailyReportView[];
}) {
  dailyReport = fixDailyReportViewArray([dailyReport])[0];
  const day = reduceReport([dailyReport]);
  sixMonthReport = fixDailyReportViewArray(sixMonthReport);
  const reportCopy = Array.from(sixMonthReport);
  const lastMonth = reportCopy.splice(reportCopy.length - 30, 30);
  const month = reduceReport(lastMonth);
  const fiveMonth = reduceReport(reportCopy);
  const sixMonth = reduceReport(sixMonthReport);

  return (
    <div className="flex flex-col gap-6">
      <ComparingCards
        shortTerm={month}
        longTerm={fiveMonth}
        joinedTerm={sixMonth}
        shortTermLabel="ostatnich 30 dni"
        longTermLabel="ostatniego pół roku"
        displayAverage
      />
      <ComparingCards
        shortTerm={day}
        longTerm={month}
        shortTermLabel="dziś"
        longTermLabel="ostatnich 30 dni"
      />
    </div>
  );
}
