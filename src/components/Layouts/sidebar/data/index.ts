import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: Icons.HomeIcon,
        items: [],
      },
      {
        title: "Registered Users",
        url: "/registeredUsers",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Buy Orders",
        url: "/buyOrders",
        icon: Icons.Alphabet,
        items: [],
      },
      {
        title: "Sell Orders",
        url: "/sellOrders",
        icon: Icons.Alphabet,
        items: [],
      },
      {
        title: "Learning Data",
        url: "/learningData",
        icon: Icons.ChevronUp,
        items: [],
      },
      {
        title: "Send Custom Message",
        url: "/customMessage",
        icon: Icons.PieChart,
        items: [],
      },
    ],
  },
  {
    label: "OTHERS",
    items: [

      {
        title: "Logout",
        url: "/auth",
        icon: Icons.Authentication,
        items: [],
      },
    ],
  },
];
