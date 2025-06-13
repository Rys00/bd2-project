import { formatDate, makeBackendRequest } from "@/utils/misc";
import { Prisma, Product, ProductCategory, ProductStock } from "@prisma/client";
import { AppDispatch } from "../store/store";

export type DailyReportView = {
  day: Date;
  orders_count: number;
  total_sales: Prisma.Decimal;
  total_profit: Prisma.Decimal;
};

export type DailyCategoryReportView = {
  day: Date;
  category_id: ProductCategory["category_id"];
  category_name: ProductCategory["name"];
  total_sold: number;
  total_value: Prisma.Decimal;
  total_profit: Prisma.Decimal;
};

export type DailyProductSnapshotView = {
  snapshot_date: Date;
  product_id: Product["product_id"];
  product_name: Product["name"];
  price: Product["price"];
  cost: Product["cost"];
  stock_amount: ProductStock["amount"];
};

export async function getDailyReport(dispatch?: AppDispatch) {
  return await makeBackendRequest<DailyReportView[]>(
    `today`,
    "GET",
    {},
    dispatch
  );
}

export async function getDailyReportsRange(
  { start, end }: { start?: Date; end?: Date },
  dispatch?: AppDispatch
) {
  const start_date = start || new Date();
  const end_date = end || start_date;
  const options: Intl.DateTimeFormatOptions[] = [
    { year: "numeric" },
    { month: "2-digit" },
    { day: "2-digit" },
  ];
  return await makeBackendRequest<DailyReportView[]>(
    `daily-reports/by-dates?start_date=${
      //
      formatDate(start_date, options, "-")
    }&end_date=${
      //
      formatDate(end_date, options, "-")
    }`,
    "GET",
    {},
    dispatch
  );
}

export function fixDailyReportViewArray(array: DailyReportView[]) {
  return array.map((r) => ({
    day: new Date(r.day),
    orders_count: r.orders_count,
    total_sales: new Prisma.Decimal(r.total_sales || 0),
    total_profit: new Prisma.Decimal(r.total_profit || 0),
  }));
}

export async function getDailyCategoryReport(
  categoryId?: number,
  dispatch?: AppDispatch
) {
  return await makeBackendRequest<DailyCategoryReportView[]>(
    `today/by-categories?${
      categoryId ? "?category_id=" + categoryId.toString() : ""
    }`,
    "GET",
    {},
    dispatch
  );
}

export async function getDailyCategoryReportsRange(
  { start, end, categoryId }: { start?: Date; end?: Date; categoryId?: number },
  dispatch?: AppDispatch
) {
  const start_date = start || new Date();
  const end_date = end || start_date;
  const options: Intl.DateTimeFormatOptions[] = [
    { year: "numeric" },
    { month: "2-digit" },
    { day: "2-digit" },
  ];
  return await makeBackendRequest<DailyCategoryReportView[]>(
    `category-daily-reports/by-dates?start_date=${
      //
      formatDate(start_date, options, "-")
    }&end_date=${
      //
      formatDate(end_date, options, "-")
    }${categoryId ? "&category_id=" + categoryId.toString() : ""}`,
    "GET",
    {},
    dispatch
  );
}

export function fixDailyCategoryReportViewArray(
  array: DailyCategoryReportView[]
) {
  return array.map((r) => ({
    day: new Date(r.day),
    category_id: r.category_id,
    category_name: r.category_name,
    total_sold: r.total_sold,
    total_value: new Prisma.Decimal(r.total_value),
    total_profit: new Prisma.Decimal(r.total_profit),
  }));
}

export async function getDailyProductSnapshotsRange(
  { start, end, productId }: { start?: Date; end?: Date; productId: number },
  dispatch?: AppDispatch
) {
  const start_date = start || new Date();
  const end_date = end || start_date;
  const options: Intl.DateTimeFormatOptions[] = [
    { year: "numeric" },
    { month: "2-digit" },
    { day: "2-digit" },
  ];
  return await makeBackendRequest<DailyProductSnapshotView[]>(
    `stock-snapshots?product_id=${productId}&start_date=${
      //
      formatDate(start_date, options, "-")
    }&end_date=${
      //
      formatDate(end_date, options, "-")
    }`,
    "GET",
    {},
    dispatch
  );
}

export function fixDailyProductSnapshotViewArray(
  array: DailyProductSnapshotView[]
) {
  return array.map((r) => ({
    snapshot_date: new Date(r.snapshot_date),
    product_id: r.product_id,
    product_name: r.product_name,
    price: new Prisma.Decimal(r.price),
    cost: new Prisma.Decimal(r.cost),
    stock_amount: r.stock_amount,
  }));
}
