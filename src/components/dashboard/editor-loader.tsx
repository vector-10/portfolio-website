"use client";

import dynamic from "next/dynamic";

export const EditorLoader = dynamic(() => import("./editor"), {
  ssr: false,
  loading: () => (
    <div aria-busy="true" className="flex flex-col gap-6 p-6">
      <div className="h-14 bg-soft" />
      <div className="h-[60vh] bg-soft" />
    </div>
  ),
});
