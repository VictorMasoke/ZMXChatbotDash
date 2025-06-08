"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import { useSession } from "@/context/SessionContext";

export default function Page() {

  const { user } = useSession();

  const [data, setData] = useState({
    name: user?.first_name + " " + user?.last_name,
    profilePhoto: "/images/user/user.png",
    coverPhoto: "/images/cover/cover-01.png",
    bio: user?.bio || "",
  });



  return (
    <ProtectedRoute>
      <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Profile" />

      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={data?.coverPhoto}
            alt="profile cover"
            className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            width={1165}
            height={420}
          />
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative drop-shadow-2">
              {data?.profilePhoto && (
                <>
                  <Image
                    src={data?.profilePhoto}
                    width={160}
                    height={160}
                    className="overflow-hidden rounded-full"
                    alt="profile"
                  />
                </>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
              {data?.name}
            </h3>
            <p className="font-medium">User</p>


            <div className="mx-auto max-w-[720px]">

              <p className="mt-4">
                {data?.bio}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>

  );
}
