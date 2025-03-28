"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { forwardRef } from "react";
import { Input } from "./input";
import { FormDescription } from "./form";

type InputTagsProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange"
> & {
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
};

const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(
  ({ value, onChange, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState("");

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        const newDataPoints = new Set([
          ...value,
          ...pendingDataPoint.split(","),
        ]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    };

    return (
      <>
        <div className="flex">
          <Input
            value={pendingDataPoint}
            onChange={(e) => setPendingDataPoint(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addPendingDataPoint();
              } else if (e.key === "," || e.key === " ") {
                e.preventDefault();
                addPendingDataPoint();
              }
            }}
            className="rounded-r-none"
            {...props}
            ref={ref}
          />
          <Button
            type="button"
            variant="secondary"
            className="rounded-l-none border border-l-0"
            onClick={addPendingDataPoint}
          >
            Add
          </Button>
        </div>
        {props["aria-description"] && (
          <FormDescription>
            List your top technical and professional skills.
          </FormDescription>
        )}
        {value.length > 0 && (
          <div className="overflow-y-auto py-2 flex gap-2 flex-wrap items-center">
            {value.map((item, idx) => (
              <Badge key={idx} variant="secondary">
                {item}
                <button
                  type="button"
                  className="w-3 ml-2"
                  onClick={() => {
                    onChange(value.filter((i) => i !== item));
                  }}
                >
                  <XIcon className="w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </>
    );
  }
);

InputTags.displayName = "InputTags";

export { InputTags };
