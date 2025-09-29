# **App Name**: TurnoverAI

## Core Features:

- URL Analysis & Industry Inference: Analyzes the input URL and infers the company's industry using NLP to categorize company activity.
- Employee Count Inference: Estimates the employee count based on website content complexity, assumed growth signals, and domain reputation using a rules-based system that can incorporate sentiment analysis on website marketing materials as a tool.
- Turnover Prediction: Predicts the company's annual turnover by comparing inferred data with a public company financial database using an LLM.
- Data Visualization: Displays the predicted turnover, confidence score, and comparison with industry benchmarks using charts.
- Interactive URL Input: Allows users to input a company website URL and trigger the prediction process.
- Inferred Data Display: Shows the inferred industry, employee count, and web traffic after analyzing the URL.
- Confidence Scoring: Provides a confidence score for the turnover prediction based on data relevance.

## Style Guidelines:

- Primary color: Amber (#F59E0B) to represent insights and financial aspects; extracted from user's chosen warm neutral palette.
- Background color: Slate-50 (#F8FAFC), a very light, desaturated background color that will provide adequate contrast for dark text.
- Accent color: Green-500 (#16A34A), for CTAs, graphs and highlights (chosen as an analogous color to the primary hue of Amber/Orange).
- Body and headline font: 'Inter' (sans-serif) for a clear and modern user experience. (User specified).
- Simple, line-based icons to represent data sources and metrics, fitting a clean aesthetic.
- Clear section separation using whitespace to guide users through the information. Implemented using Tailwind's spacing utilities.
- Subtle transition effects on hover for interactive elements, enhancing user engagement without distraction. Implemented using CSS transitions.