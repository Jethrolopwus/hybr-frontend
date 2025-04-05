"use client";

import ResultsComponent from "@/components/resultsComponent";
import { NextPage } from "next";
import React, { Suspense } from "react";

const Results: NextPage = () => {
  return (
    <Suspense>
      <ResultsComponent />;
    </Suspense>
  );
};

export default Results;
