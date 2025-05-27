import { compactFormat } from "@/lib/format-number";
import { getDashboardUsers, getDashboardBuyOrders, getDashboardSellOrders } from "@/lib/routes/fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export async function OverviewCardsGroup() {
  // Fetch all dashboard data in parallel
  const [usersData, buyOrdersData, sellOrdersData] = await Promise.all([
    getDashboardUsers(),
    getDashboardBuyOrders(),
    getDashboardSellOrders()
  ]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Registrations Today"
        data={{
          value: compactFormat(usersData?.today_users || 0),
          change: usersData?.percent_increase || 0,
          description: `vs yesterday (${usersData?.yesterday_users || 0})`
        }}
        Icon={icons.Users}
      />

      <OverviewCard
        label="Total Registered Users"
        data={{
          value: compactFormat(usersData?.total_users || 0),
          change: usersData?.percent_today || 0,
          description: `Today (${usersData?.today_users || 0})`
        }}
        Icon={icons.Users}
      />

      <OverviewCard
        label="Total Buy Orders"
        data={{
          value: compactFormat(buyOrdersData?.total_orders || 0),
          change: buyOrdersData?.percent_change || 0,
          description: `Today (${buyOrdersData?.today_orders || 0})`
        }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="Total Sell Orders"
        data={{
          value: compactFormat(sellOrdersData?.total_orders || 0),
          change: sellOrdersData?.percent_change || 0,
          description: `Today (${sellOrdersData?.today_orders || 0})`
        }}
        Icon={icons.Profit}
      />
    </div>
  );
}
