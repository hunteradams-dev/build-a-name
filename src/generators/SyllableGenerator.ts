import {
  PLACE_PREFIXES,
  PLACE_MIDDLES,
  ALL_PLACE_SUFFIXES,
  PLACE_NATURAL_SUFFIXES,
  PLACE_ARTIFICIAL_SUFFIXES,
  PLACE_GENERIC_SUFFIXES,
  PLACE_CONTINENT_SUFFIXES,
} from "../data/places";
import { PREPOSITIONS_PLACE } from "../data/prepositions";
import {
  PEOPLE_PREFIXES,
  PEOPLE_MIDDLES,
  PEOPLE_SUFFIXES,
  PEOPLE_SUFFIXES_MASCULINE,
  PEOPLE_SUFFIXES_FEMININE,
} from "../data/people";
import {
  CREATURE_PREFIXES,
  CREATURE_MIDDLES,
  CREATURE_SUFFIXES,
} from "../data/creatures";

export type NameType = "place" | "person" | "creature" | "all";

interface SyllableData {
  prefixes: string[];
  middles: string[];
  suffixes: string[];
}

const data: Record<NameType, SyllableData> = {
  place: {
    prefixes: PLACE_PREFIXES,
    middles: PLACE_MIDDLES,
    suffixes: ALL_PLACE_SUFFIXES,
  },
  person: {
    prefixes: PEOPLE_PREFIXES,
    middles: PEOPLE_MIDDLES,
    suffixes: PEOPLE_SUFFIXES,
  },
  creature: {
    prefixes: CREATURE_PREFIXES,
    middles: CREATURE_MIDDLES,
    suffixes: CREATURE_SUFFIXES,
  },
  all: {
    prefixes: [...PLACE_PREFIXES, ...PEOPLE_PREFIXES, ...CREATURE_PREFIXES],
    middles: [...PLACE_MIDDLES, ...PEOPLE_MIDDLES, ...CREATURE_MIDDLES],
    suffixes: [...ALL_PLACE_SUFFIXES, ...PEOPLE_SUFFIXES, ...CREATURE_SUFFIXES],
  },
};

export class SyllableGenerator {
  static countSyllables(word: string): number {
    word = word.toLowerCase();
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
    word = word.replace(/^y/, "");
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  static generateWord(
    type: NameType,
    numSyllables: number,
    customSuffixes?: string[]
  ): string {
    const { prefixes, middles, suffixes: defaultSuffixes } = data[type];
    const suffixes = customSuffixes || defaultSuffixes;

    if (numSyllables < 1) numSyllables = 1;

    let name = "";

    // Pick random prefix
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    name += prefix;

    const prefixSyllables = this.countSyllables(prefix);

    if (numSyllables <= prefixSyllables) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    }

    // Calculate remaining syllables needed
    const remainingSyllables = numSyllables - prefixSyllables;

    // Filter suffixes that fit in the remaining space
    const validSuffixes = suffixes.filter(
      (s) => this.countSyllables(s) <= remainingSyllables
    );

    // Fallback to all suffixes if none fit
    const candidateSuffixes =
      validSuffixes.length > 0 ? validSuffixes : suffixes;

    const suffix =
      candidateSuffixes[Math.floor(Math.random() * candidateSuffixes.length)];
    const suffixSyllables = this.countSyllables(suffix);

    // Calculate how many middles we need
    let middlesNeeded = numSyllables - prefixSyllables - suffixSyllables;
    if (middlesNeeded < 0) middlesNeeded = 0;

    // Add middles
    for (let i = 0; i < middlesNeeded; i++) {
      const middle = middles[Math.floor(Math.random() * middles.length)];
      name += middle;
    }

    // Add suffix
    name += suffix;

    // Capitalize first letter
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  static convertToDemonym(name: string): string {
    const lastChar = name.slice(-1).toLowerCase();
    const lastTwo = name.slice(-2).toLowerCase();

    if (lastTwo === "ia") return name + "n";
    if (lastChar === "a") return name + "n";
    if (lastChar === "e") return name.slice(0, -1) + "an";
    if (lastChar === "y") return name.slice(0, -1) + "ian";
    if (lastChar === "o") return name + "an";
    if (lastChar === "i") return name + "an";

    // Default
    return name + "ian";
  }

  static generate(
    type: NameType,
    numSyllables: number | number[],
    numWords: number = 1,
    hyphenated: boolean = false,
    demonym: boolean = false,
    options: {
      includeNatural?: boolean;
      includeArtificial?: boolean;
      includeGeneric?: boolean;
      includeContinent?: boolean;
      includePrepositions?: boolean;
      gender?: "masculine" | "feminine" | "neutral" | "any";
    } = {}
  ): string {
    const words: string[] = [];
    const syllablesArray = Array.isArray(numSyllables)
      ? numSyllables
      : Array(numWords).fill(numSyllables);

    let customSuffixes: string[] | undefined;

    if (type === "person") {
      const { gender = "any" } = options;
      if (gender === "masculine") {
        customSuffixes = PEOPLE_SUFFIXES_MASCULINE;
      } else if (gender === "feminine") {
        customSuffixes = PEOPLE_SUFFIXES_FEMININE;
      } else if (gender === "neutral") {
        customSuffixes = PEOPLE_SUFFIXES;
      } else {
        // any
        customSuffixes = [
          ...PEOPLE_SUFFIXES,
          ...PEOPLE_SUFFIXES_MASCULINE,
          ...PEOPLE_SUFFIXES_FEMININE,
        ];
      }
    } else if (type === "place" || type === "all") {
      const {
        includeNatural = true,
        includeArtificial = true,
        includeGeneric = true,
        includeContinent = false,
      } = options;
      customSuffixes = [];
      if (includeNatural) customSuffixes.push(...PLACE_NATURAL_SUFFIXES);
      if (includeArtificial) customSuffixes.push(...PLACE_ARTIFICIAL_SUFFIXES);
      if (includeGeneric) customSuffixes.push(...PLACE_GENERIC_SUFFIXES);
      if (includeContinent) customSuffixes.push(...PLACE_CONTINENT_SUFFIXES);

      if (type === "all") {
        customSuffixes.push(...PEOPLE_SUFFIXES);
        customSuffixes.push(...PEOPLE_SUFFIXES_MASCULINE);
        customSuffixes.push(...PEOPLE_SUFFIXES_FEMININE);
        customSuffixes.push(...CREATURE_SUFFIXES);
      }
      if (includeGeneric) customSuffixes.push(...PLACE_GENERIC_SUFFIXES);

      if (type === "all") {
        customSuffixes.push(...PEOPLE_SUFFIXES);
        customSuffixes.push(...PEOPLE_SUFFIXES_MASCULINE);
        customSuffixes.push(...PEOPLE_SUFFIXES_FEMININE);
        customSuffixes.push(...CREATURE_SUFFIXES);
      }

      if (customSuffixes.length === 0) {
        if (type === "place") {
          customSuffixes = ALL_PLACE_SUFFIXES;
        } else {
          customSuffixes = [
            ...ALL_PLACE_SUFFIXES,
            ...PEOPLE_SUFFIXES,
            ...PEOPLE_SUFFIXES_MASCULINE,
            ...PEOPLE_SUFFIXES_FEMININE,
            ...CREATURE_SUFFIXES,
          ];
        }
      }
    }

    for (let i = 0; i < numWords; i++) {
      // Use the corresponding syllable count, or default to the last one/2 if missing
      const count =
        syllablesArray[i] ?? syllablesArray[syllablesArray.length - 1] ?? 2;
      words.push(this.generateWord(type, count, customSuffixes));
    }

    if (
      (type === "place" || type === "all") &&
      options.includePrepositions &&
      words.length > 1
    ) {
      const prep =
        PREPOSITIONS_PLACE[
          Math.floor(Math.random() * PREPOSITIONS_PLACE.length)
        ];
      // Insert at random position between words
      const insertIdx = Math.floor(Math.random() * (words.length - 1)) + 1;
      words.splice(insertIdx, 0, prep);
    }

    const fullName = words.join(hyphenated ? "-" : " ");

    if (demonym && (type === "place" || type === "all")) {
      return this.convertToDemonym(fullName);
    }

    return fullName;
  }
}
