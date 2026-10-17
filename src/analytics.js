/**
 * Document Analytics Engine for MarkPulse Studio.
 * Computes document statistics and readability metrics from text.
 *
 * @param {string} text - The input document text.
 * @returns {object} Calculated metrics including words, characters, reading time,
 * lines, paragraphs, sentences, average sentence length, and readability classification.
 */
export function calculateAnalytics(text) {
  if (typeof text !== 'string' || text.length === 0) {
    return {
      words: 0,
      chars: 0,
      readTimeMin: 0,
      lines: 1,
      paragraphs: 0,
      sentences: 0,
      avgSentence: 0,
      readability: 'Easy'
    };
  }

  const trimmed = text.trim();

  // Word Count
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;

  // Character Count
  const chars = text.length;

  // Estimated Reading Time (200 words per minute)
  const readTimeMin = Math.ceil(words / 200);

  // Line Count
  const lines = text.split('\n').length;

  // Paragraph Count
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

  // Sentence Count
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

  // Avg Sentence Length (words per sentence)
  const avgSentence = sentences > 0 ? Number((words / sentences).toFixed(1)) : 0;

  // Readability Classification
  let readability = 'Easy';
  if (avgSentence > 20) {
    readability = 'Advanced';
  } else if (avgSentence > 14) {
    readability = 'Moderate';
  }

  return {
    words,
    chars,
    readTimeMin,
    lines,
    paragraphs,
    sentences,
    avgSentence,
    readability
  };
}
