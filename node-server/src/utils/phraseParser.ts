import { ToWords } from 'to-words'

// Define the language variable at the top of the module for easy editing
const LANGUAGE = 'en-GB'

// Initialize the ToWords instance with specific configuration for the above language
const toWordsInstance = new ToWords({
  localeCode: LANGUAGE,
  converterOptions: {
    ignoreDecimal: false, // Configuration to include decimals in conversion
    doNotAddOnly: false, // Configuration to include the word "only" after whole numbers (useful for other locales; has no effect in French)
  },
})

/**
 * Extracts sentences from a given text based on punctuation marks.
 *
 * The function searches for sequences of characters terminated by
 * '.', '?', '!', or a newline. Each of these sequences is considered
 * a separate sentence.
 *
 * @param {string} textToParse - The text to be parsed.
 * @returns {string[] | null} - An array of extracted sentences or null if no matches are found.
 */
export function findSentence(textToParse: string) {
  const regex = /[^.?!\n]+[.?!\n]/g
  const match = textToParse.match(regex)
  return match
}

/**
 * Replaces all numbers in a given text with their corresponding word representation in French.
 *
 * For instance, "23" would be converted to "twenty-three" and "1.5" to "1 point 5".
 *
 * @param {string} text - The text in which numbers need to be replaced.
 * @returns {string} - The processed text with numbers replaced by words.
 */
export const replaceNumbersWithWords = (text: string) => {
  // Search for all numbers (including decimals) in the text
  return text.replace(/\d+(\.\d+)?/g, (match) => {
    // Convert each found number to words
    return toWordsInstance.convert(Number(match))
  })
}
