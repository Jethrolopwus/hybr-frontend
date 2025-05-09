
"use client";
import React from 'react'
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import { AssessmentResults, CategoryScore } from "@/types/generatedTypes";
import { RadarChartView, BarChartView } from "@/components/ResultsChart";
import { CATEGORIES } from "@/utils/questions";

const ResultsComponent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
  
    const [results, setResults] = useState<AssessmentResults | null>(null);
  
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [chartType, setChartType] = useState<"radar" | "bar">("radar");
  
    useEffect(() => {
      if (!id || typeof id !== "string") return;
  
      const fetchResults = async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/assessments/${id}`
        );
        try {
          setIsLoading(true);
          setError(null);
          console.log("Fetching results for ID:", id);
  
          console.log("Response status:", response.status);
  
          if (!response.ok) {
            throw new Error(`Failed to fetch results: ${response.statusText}`);
          }
  
          const data = await response.json();
  
          console.log("Response data:", data.assessment);
          if (!data?.assessment) {
            console.warn("No results in response data structure");
            throw new Error("No results data found in response");
          }
  
          setResults(data.assessment);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
          console.error("Error fetching results:", err);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchResults();
    }, [id]);
    
    if (isLoading) {
      return (
        <div className="max-w-md mx-auto py-20 px-4 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mb-8"></div>
            <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      );
    }
    
    if (error || !results) {
      return (
        <div className="max-w-md mx-auto py-20 px-4 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h2 className="font-bold">Error Loading Results</h2>
            <p>{error || "Assessment results Loading"}</p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="bg-[rgb(165,218,92)] text-white py-2 px-4 rounded-md hover:bg-[#2c4652]"
          >
            Return to Home
          </button>
        </div>
      );
    }
  
  
    return (
        <>
        <Head>
          <title>Innovation Results</title>
        </Head>
  
        <main className="w-full max-w-4xl mx-auto px-4 py-10 overflow-x-hidden">
          <h1 className="text-3xl font-bold mb-2 break-words">Your Innovation Results</h1>
          <p className="text-sm text-gray-500 mb-6">
            Assessment completed on:{" "}
            {new Date(results.createdAt).toLocaleDateString()}
          </p>
          <p className="mb-8 text-gray-700">
            Based on your responses, here&apos;s how your organization is
            performing.
          </p>
  
          {/* User Information */}
          <section className="mb-8 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Assessment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Name:</p>
                <p className="font-medium break-words">{results.User.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Company:</p>
                <p className="font-medium break-words">{results.User.company}</p>
              </div>
              <div>
                <p className="text-gray-600">Industry:</p>
                <p className="font-medium break-words">{results.User.industry}</p>
              </div>
              <div>
                <p className="text-gray-600">Company Size:</p>
                <p className="font-medium break-words">{results.User.companySize}</p>
              </div>
            </div>
          </section>
  
          {/* Overall Score */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold">Overall Score</h2>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-4xl font-bold text-[rgb(165,218,92)] shrink-0">
                {results.totalScore.toFixed(1)}/40.0
              </p>
              <div className="w-full bg-gray-200 rounded-full h-4 min-w-0">
                <div
                  className="bg-[rgb(165,218,92)] h-4 rounded-full"
                  style={{ width: `${results.totalScore * 2.5}%` }}
                ></div>
              </div>
            </div>
            <p className="mt-2 text-gray-700">
              {results.totalScore >= 8
                ? "Excellent! Your organization demonstrates strong innovation capabilities across multiple dimensions."
                : results.totalScore >= 6
                ? "Good performance. Your organization has solid innovation foundations but has opportunities to strengthen specific areas."
                : results.totalScore >= 4
                ? "Your organization shows some innovation capability but has significant room for improvement."
                : "Your organization is at an early stage of innovation maturity with substantial opportunity for development."}
            </p>
          </section>
  
          {/* Dimension Scores */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Dimension Scores</h2>
  
            <div className="flex gap-4 mb-6 flex-wrap">
              <button
                onClick={() => setChartType("radar")}
                className={`px-3 py-1 rounded transition-colors ${
                  chartType === "radar"
                    ? "bg-[rgb(165,218,92)] text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Radar View
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`px-3 py-1 rounded transition-colors ${
                  chartType === "bar"
                    ? "bg-[rgb(165,218,92)] text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Bar View
              </button>
            </div>
  
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 overflow-x-auto">
              <div className="min-w-[280px]">
                {chartType === "radar" ? (
                  <RadarChartView categoryScores={results.categoryScores} />
                ) : (
                  <BarChartView categoryScores={results.categoryScores} />
                )}
              </div>
            </div>
  
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(results.categoryScores).map(
                ([key, score]: [string, CategoryScore]) => (
                  <div
                    key={key}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h3 className="font-semibold text-gray-800 break-words">
                        {CATEGORIES[key as keyof typeof CATEGORIES] || key}
                      </h3>
                      <span className="bg-blue-100 text-[rgb(165,218,92)] text-sm font-medium px-2.5 py-0.5 rounded whitespace-nowrap">
                        {score.score.toFixed(1)}/{score.maxScore}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-[rgb(165,218,92)] h-2 rounded-full"
                        style={{
                          width: `${(score.score / score.maxScore) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
  
          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => window.print()}
              className="bg-[rgb(165,218,92)] text-white py-2 px-6 rounded-md hover:bg-[#2c4652] transition-colors"
            >
              Print Results
            </button>
            <button
              onClick={() => router.push("/")}
              className="bg-white text-gray-800 py-2 px-6 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => router.push(`/assessments/${id}/details`)}
              className="bg-gray-100 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-200 transition-colors"
            >
              View Detailed Report
            </button>
          </div>
        </main>
     </>
    );
  }
export default ResultsComponent