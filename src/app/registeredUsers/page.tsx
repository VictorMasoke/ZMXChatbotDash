import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { RegisteredUsersTableSkeleton } from "@/components/Tables/RegisteredUsersTable.tsx/skeleton";
import { RegisteredUsersTable } from "@/components/Tables/RegisteredUsersTable.tsx";

import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Registered Users",
};

const RegisteredUsersPage = () => {
  return (
    <>
      <Breadcrumb pageName="Registered Users" />

      <div className="space-y-10">
        <Suspense fallback={<RegisteredUsersTableSkeleton />}>
          <RegisteredUsersTable />
        </Suspense>
      </div>
    </>
  );
};

export default RegisteredUsersPage;

