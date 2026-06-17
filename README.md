Customer Feedback Sentiment Dashboard

INTP302 — Midterm Team Mini-Project
Don Joshua Anil & Willard Sunil

A web app where staff submit customer feedback text and instantly see whether it is Positive, Negative, Neutral, or Mixed — powered by Azure AI Language. All entries are stored in Azure Table Storage and displayed in a live dashboard.

Azure Services Used---


Azure App Service — hosts the Next.js application
Azure AI Language — sentiment analysis on submitted feedback text
Azure Table Storage — stores each feedback entry and its sentiment result

setup instructions--

-npm install
-npm run dev
-open localhost:3000

-copy Azure keys to .env.local file

Known Limitations--

Sentiment accuracy may be lower for very short or sarcastic text
Azure AI Language works best with English — other languages may be less reliable
No user authentication — anyone with the URL can submit and view entries
All test data is synthetic; no real customer data is collected

Responsible AI

Fairness: Sentiment accuracy may vary across languages, writing styles, and cultural expressions.

Reliability: AI results should not be treated as final decisions, especially for borderline or mixed responses. Confidence scores are shown to help users judge when manual review is needed.

Privacy: No real personal data is collected. API keys are stored in environment variables and never exposed in client-side code or the GitHub repository.

Transparency: The UI clearly states that AI is analyzing the text and displays both the sentiment label and confidence score with every result.

Accountability: Human staff remain responsible for acting on feedback. This app is a decision-support tool, not a replacement for human judgment.