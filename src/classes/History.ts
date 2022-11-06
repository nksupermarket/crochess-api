import { MoveNotationList, MoveNotationPair } from 'src/types/types';
import { copy2dArray } from 'src/utils/misc';

export default {
  insertMove: (list: MoveNotationList, notation: string) => {
    const copy = copy2dArray(list);
    const lastPair = copy[copy.length - 1];
    if (lastPair && lastPair.length === 1) {
      lastPair.push(notation);
    } else {
      const newPair: MoveNotationPair = [notation];
      copy.push(newPair);
    }

    return copy;
  }
};
