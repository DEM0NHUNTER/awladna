if (!content || content.includes("error")) {
  return {
    response: "I'm having trouble responding right now. Please try again later.",
    sentiment_score: 0.0,
    sentiment: "neutral"
  };
}