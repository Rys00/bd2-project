import DashboardChartArea from "@/components/dashboard/dashboard-chart-area";
import { SectionCards } from "@/components/dashboard/section-cards";

import {
  getDailyReport,
  getDailyReportsRange,
} from "@/lib/backend-requests/reports";

export default async function Page() {
  const currentDate = new Date();
  const monthAgo = new Date();
  monthAgo.setMonth(currentDate.getMonth() - 1);
  const sixMonthAgo = new Date();
  sixMonthAgo.setMonth(currentDate.getMonth() - 6);

  const dailyReport = (await getDailyReport())[0];
  const sixMonthReport = await getDailyReportsRange({
    start: sixMonthAgo,
    end: currentDate,
  });
  sixMonthReport[sixMonthReport.length - 1] = dailyReport;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards
            dailyReport={dailyReport}
            sixMonthReport={sixMonthReport}
          />
          <div className="px-4 lg:px-6">
            <DashboardChartArea sixMonthsReport={sixMonthReport} />
          </div>
        </div>
      </div>
    </div>
  );
}
