"use client";

import ResultsComponent from "@/components/resultsComponent";
import { NextPage } from "next";
import React, { Suspense } from "react";

const Results: NextPage = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <ResultsComponent />;
    </Suspense>
  );
};

export default Results;
