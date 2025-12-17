import { placePrefixes, placeMiddles, placeSuffixes } from "../data/places";
import { peoplePrefixes, peopleMiddles, peopleSuffixes } from "../data/people";
import {
  creaturePrefixes,
  creatureMiddles,
  creatureSuffixes,
} from "../data/creatures";

export type NameType = "place" | "person" | "creature";

interface SyllableData {
  prefixes: string[];
  middles: string[];
  suffixes: string[];
}

const data: Record<NameType, SyllableData> = {
  place: {
    prefixes: placePrefixes,
    middles: placeMiddles,
    suffixes: placeSuffixes,
  },
  person: {
    prefixes: peoplePrefixes,
    middles: peopleMiddles,
    suffixes: peopleSuffixes,
  },
  creature: {
    prefixes: creaturePrefixes,
    middles: creatureMiddles,
    suffixes: creatureSuffixes,
  },
};

export class SyllableGenerator {
  static generateWord(type: NameType, numSyllables: number): string {
    const { prefixes, middles, suffixes } = data[type];

    if (numSyllables < 1) numSyllables = 1;

    let name = "";

    // Pick random prefix
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    name += prefix;

    if (numSyllables === 1) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    }

    // Add middles
    for (let i = 0; i < numSyllables - 2; i++) {
      const middle = middles[Math.floor(Math.random() * middles.length)];
      name += middle;
    }

    // Add suffix
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    name += suffix;

    // Capitalize first letter
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  static generate(
    type: NameType,
    numSyllables: number,
    numWords: number = 1,
    hyphenated: boolean = false
  ): string {
    const words: string[] = [];
    for (let i = 0; i < numWords; i++) {
      words.push(this.generateWord(type, numSyllables));
    }
    return words.join(hyphenated ? "-" : " ");
  }
}
