import { CastleRights } from 'src/types/interface';
import { CastleRightsStr } from 'src/types/types';

export default class Castle {
  w: CastleRights;
  b: CastleRights;
  constructor(state: CastleRightsStr) {
    this.w = {
      kingside: state.includes('K'),
      queenside: state.includes('Q')
    };

    this.b = {
      kingside: state.includes('k'),
      queenside: state.includes('q')
    };
  }
}
