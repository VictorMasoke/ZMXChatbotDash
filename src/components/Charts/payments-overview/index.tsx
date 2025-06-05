// OrdersOverview.tsx
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { getOrderTrends } from "@/lib/routes/fetch";
import { OrdersOverviewChart } from "./chart";

type PropsType = {
  className?: string;
};

interface TrendItem {
  type: 'buy' | 'sell';
  date: string;
  quantity: number;
}

export async function OrdersOverview({ className }: PropsType) {
  const trendsData: TrendItem[] = await getOrderTrends();

  // Transform the API data to match the chart component's expected format
  const chartData = {
    buy: trendsData
      .filter((item: TrendItem) => item.type === 'buy')
      .map((item: TrendItem) => ({
        x: item.date,
        y: item.quantity
      })),
    sell: trendsData
      .filter((item: TrendItem) => item.type === 'sell')
      .map((item: TrendItem) => ({
        x: item.date,
        y: item.quantity
      }))
  };

  // Calculate totals
  const totalBuy = chartData.buy.reduce((acc, { y }) => acc + y, 0);
  const totalSell = chartData.sell.reduce((acc, { y }) => acc + y, 0);

  return (
    <div
      className={cn(
        "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Orders Overview
        </h2>
      </div>

      <OrdersOverviewChart data={chartData} />

      <dl className="grid divide-stroke text-center dark:divide-dark-3 sm:grid-cols-2 sm:divide-x [&>div]:flex [&>div]:flex-col-reverse [&>div]:gap-1">
        <div className="dark:border-dark-3 max-sm:mb-3 max-sm:border-b max-sm:pb-3">
          <dt className="text-xl font-bold text-dark dark:text-white">
            {standardFormat(totalBuy)} Tones
          </dt>
          <dd className="font-medium dark:text-dark-6">Total Buy Orders</dd>
        </div>

        <div>
          <dt className="text-xl font-bold text-dark dark:text-white">
            {standardFormat(totalSell)} Tones
          </dt>
          <dd className="font-medium dark:text-dark-6">Total Sell Orders</dd>
        </div>
      </dl>
    </div>
  );
}





