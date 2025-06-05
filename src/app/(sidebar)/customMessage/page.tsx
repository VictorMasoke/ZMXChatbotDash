import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Metadata } from "next";
import SendCustomMessage from "@/components/Forms/SendCustomMessage";

export const metadata: Metadata = {
  title: "Buy Orders",
};

const CustomMessagePage = () => {
  return (
    <>
    <ProtectedRoute>
      <Breadcrumb pageName="Send Custom Message" />

      <div className="space-y-10">
        <SendCustomMessage/>
      </div>
    </ProtectedRoute>
    </>
  );
};

export default CustomMessagePage;
