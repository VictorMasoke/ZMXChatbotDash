

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SellOrdersTableSkeleton } from "@/components/Tables/SellOrdersTable/skeleton";
import { SellOrdersTable } from "@/components/Tables/SellOrdersTable";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sell Orders",
};

const SellOrdersPage = () => {
  return (
    <>
    <ProtectedRoute>
      <Breadcrumb pageName="Sell Orders" />
      <div className="space-y-10">
        <Suspense fallback={<SellOrdersTableSkeleton />}>
          <SellOrdersTable />
        </Suspense>
      </div>
    </ProtectedRoute>

    </>
  );
};

export default SellOrdersPage;
