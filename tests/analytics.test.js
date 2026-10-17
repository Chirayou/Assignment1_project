import { describe, it, expect } from 'vitest';
import { calculateAnalytics } from '../src/analytics.js';

describe('calculateAnalytics Method Tests', () => {
  describe('Input Validation & Edge Cases', () => {
    it('should return default zeroed statistics for an empty string', () => {
      const result = calculateAnalytics('');
      expect(result).toEqual({
        words: 0,
        chars: 0,
        readTimeMin: 0,
        lines: 1,
        paragraphs: 0,
        sentences: 0,
        avgSentence: 0,
        readability: 'Easy'
      });
    });

    it('should return default zeroed statistics for non-string inputs (null, undefined, numbers)', () => {
      expect(calculateAnalytics(null)).toEqual({
        words: 0,
        chars: 0,
        readTimeMin: 0,
        lines: 1,
        paragraphs: 0,
        sentences: 0,
        avgSentence: 0,
        readability: 'Easy'
      });

      expect(calculateAnalytics(undefined)).toEqual({
        words: 0,
        chars: 0,
        readTimeMin: 0,
        lines: 1,
        paragraphs: 0,
        sentences: 0,
        avgSentence: 0,
        readability: 'Easy'
      });

      expect(calculateAnalytics(12345)).toEqual({
        words: 0,
        chars: 0,
        readTimeMin: 0,
        lines: 1,
        paragraphs: 0,
        sentences: 0,
        avgSentence: 0,
        readability: 'Easy'
      });
    });

    it('should return 0 words and 0 paragraphs for whitespace-only text', () => {
      const result = calculateAnalytics('   \n\n\t   ');
      expect(result.words).toBe(0);
      expect(result.paragraphs).toBe(0);
      expect(result.sentences).toBe(0);
      expect(result.avgSentence).toBe(0);
      expect(result.readability).toBe('Easy');
    });
  });

  describe('Word, Character & Line Counting', () => {
    it('should accurately count words, characters, and lines', () => {
      const text = 'Hello world!\nWelcome to MarkPulse Studio.';
      const result = calculateAnalytics(text);

      expect(result.words).toBe(6);
      expect(result.chars).toBe(text.length);
      expect(result.lines).toBe(2);
    });

    it('should handle multiple consecutive spaces and tabs properly', () => {
      const text = 'WordOne    WordTwo \t  WordThree';
      const result = calculateAnalytics(text);

      expect(result.words).toBe(3);
    });
  });

  describe('Reading Time Estimation', () => {
    it('should calculate 1 minute reading time for short texts (< 200 words)', () => {
      const text = 'Short document with a few words.';
      const result = calculateAnalytics(text);

      expect(result.readTimeMin).toBe(1);
    });

    it('should estimate reading time based on 200 words per minute', () => {
      // Generate a string with exactly 450 words
      const wordsArray = Array.from({ length: 450 }, (_, i) => `word${i}`);
      const text = wordsArray.join(' ');
      const result = calculateAnalytics(text);

      expect(result.words).toBe(450);
      // Math.ceil(450 / 200) = 3
      expect(result.readTimeMin).toBe(3);
    });
  });

  describe('Paragraph & Sentence Detection', () => {
    it('should correctly count paragraphs separated by double newlines', () => {
      const text = 'Paragraph one.\n\nParagraph two.\n\nParagraph three.';
      const result = calculateAnalytics(text);

      expect(result.paragraphs).toBe(3);
      expect(result.sentences).toBe(3);
    });

    it('should handle different sentence terminators (. ! ?)', () => {
      const text = 'First sentence. Second sentence! Third sentence?';
      const result = calculateAnalytics(text);

      expect(result.sentences).toBe(3);
    });
  });

  describe('Readability Classification', () => {
    it('should classify text with average sentence length <= 14 as Easy', () => {
      // 8 words, 1 sentence -> avgSentence = 8
      const text = 'The quick brown fox jumps over the dog.';
      const result = calculateAnalytics(text);

      expect(result.sentences).toBe(1);
      expect(result.avgSentence).toBe(8);
      expect(result.readability).toBe('Easy');
    });

    it('should classify text with average sentence length between 14.1 and 20 as Moderate', () => {
      // 16 words, 1 sentence -> avgSentence = 16
      const text = 'This is a moderately constructed sentence designed to test the readability scoring engine of this studio application.';
      const result = calculateAnalytics(text);

      expect(result.sentences).toBe(1);
      expect(result.avgSentence).toBe(17);
      expect(result.readability).toBe('Moderate');
    });

    it('should classify text with average sentence length > 20 as Advanced', () => {
      // 25 words, 1 sentence -> avgSentence = 25
      const text = 'In software engineering education developing automated unit test suites with comprehensive coverage metrics ensures that critical analytical engines remain robust against regressions across future product iterations.';
      const result = calculateAnalytics(text);

      expect(result.sentences).toBe(1);
      expect(result.avgSentence).toBe(26);
      expect(result.readability).toBe('Advanced');
    });
  });
});
