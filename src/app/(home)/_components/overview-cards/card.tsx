import { ArrowDownIcon, ArrowUpIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import type { JSX, SVGProps } from "react";

type PropsType = {
  label: string;
  data: {
    value: string;
    change?: number | null;  // Can be null from API
    description?: string;
  };
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};

export function OverviewCard({ label, data, Icon }: PropsType) {
  // Handle null/undefined change values
  const hasChange = typeof data.change === 'number';
  const isDecreasing = hasChange ? data.change! < 0 : false;

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
      <Icon/>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <h3 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
            {data.value}
          </h3>
          <p className="text-sm font-medium text-dark-6">{label}</p>
          {data.description && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {data.description}
            </p>
          )}
        </div>

        {hasChange && (
          <div
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium",
              isDecreasing ? "text-red" : "text-green",
            )}
          >
            {Math.abs(data.change!)}%
            {isDecreasing ? (
              <ArrowDownIcon aria-hidden className="h-4 w-4" />
            ) : (
              <ArrowUpIcon aria-hidden className="h-4 w-4" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
