// import darkLogo from "@/assets/logos/dark.svg";
// import logo from "@/assets/logos/main.svg";
import darkLogo from "@/assets/logos/zmx-02.png";
import logo from "@/assets/logos/zmx_logo.png";
import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-8 max-w-[7.847rem]">
      <Image
        src={logo}
        className="dark:hidden"
        alt="ZMX logo"
        role="presentation"
        quality={100}
      />

      <Image
        src={darkLogo}
        className="hidden dark:block"
        alt="ZMX logo"
        role="presentation"
        quality={100}
      />
    </div>
  );
}
