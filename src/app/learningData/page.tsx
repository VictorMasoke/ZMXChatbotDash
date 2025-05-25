import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AILearningTable from "@/components/Tables/learningData";

export const metadata: Metadata = {
  title: "AI Learning Data",
  description: "Manage AI learning data entries",
};

export default async function AILearningPage() {
  return (
    <>
      <Breadcrumb pageName="AI Learning Data" />

      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">

          {/* Data Table */}
          <AILearningTable />
        </div>
      </div>
    </>
  );
}
