import AuthForm from "@/components/Auth";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignIn() {
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex flex-wrap items-center">
        <div className="w-full xl:w-1/2">
          <div className="w-full p-4 sm:p-12.5 xl:p-15">
            <AuthForm />
          </div>
        </div>

        <div className="hidden w-full p-7.5 xl:block xl:w-1/2" style={{ height: 750 }}>
          <div
            className="custom-gradient-1 h-full overflow-hidden rounded-2xl px-12.5 pt-12.5 dark:!bg-dark-2 dark:bg-none"
            style={{
              backgroundImage: "url('/images/cover/background-image.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Link className="mb-10 inline-block" href="/">
              <Image
                className="hidden dark:block"
                src="/images/logo/zmx_logo.png"
                alt="Logo"
                width={176}
                height={32}
              />
              <Image
                className="dark:hidden"
                src="/images/logo/zmx-02.png"
                alt="Logo"
                width={176}
                height={32}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
