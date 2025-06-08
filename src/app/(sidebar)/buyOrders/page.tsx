
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { BuyOrdersTableSkeleton } from "@/components/Tables/BuyOrdersTable/skeleton";
import { BuyOrdersTable } from "@/components/Tables/BuyOrdersTable";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Buy Orders",
};

const BuyOrdersPage = () => {
  return (
    <>
    <ProtectedRoute>
      <Breadcrumb pageName="Buy Orders" />

      <div className="space-y-10">
        <Suspense fallback={<BuyOrdersTableSkeleton />}>
          <BuyOrdersTable />
        </Suspense>
      </div>
    </ProtectedRoute>
    </>
  );
};

export default BuyOrdersPage;
