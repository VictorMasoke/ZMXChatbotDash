'use client';

import { OrdersOverview } from "@/components/Charts/payments-overview";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSearchParams } from "next/navigation";

function HomeContent() {
  const searchParams = useSearchParams();
  const selected_time_frame = searchParams.get('selected_time_frame');
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame || undefined);

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-12 2xl:mt-9 2xl:gap-7.5">
        <OrdersOverview
          className="col-span-12 xl:col-span-12"
          key={extractTimeFrame("payments_overview")}
        />
      </div>
    </>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <HomeContent />
      </Suspense>
    </ProtectedRoute>
  );
}
