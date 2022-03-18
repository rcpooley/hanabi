/**
 * Relative indexing:
 *  0 is your self,
 *  1 is to your left, ...
 */
export const SELF_INDEX = 0;

export enum Col {
    Red,
    Blue,
    Green,
    Yellow,
    Black,
}

export enum Numb {
    One,
    Two,
    Three,
    Four,
    Five,
}

export type THint =
    | {
          type: 'color';
          col: Col;
      }
    | {
          type: 'number';
          numb: Numb;
      };

export type TCard = {
    col: Col;
    numb: Numb;
};

export type THand = TCard[];

export type TActionHint = {
    type: 'hint';
    relativePlayerIndex: number; // Relative indexing
    hint: THint;
    handIndices: number[];
};

export type TPartialActionPlayDiscard = {
    type: 'play' | 'discard';
    handIndex: number;
};

export type TActionPlayDiscard = TPartialActionPlayDiscard & {
    card: TCard;
};

export type TPartialAction = TActionHint | TPartialActionPlayDiscard;

export type TAction = TActionHint | TActionPlayDiscard;

export interface IPlayer {
    /**
     * Called when any player takes an action. All relative indices
     * are relative to you (including any index in the action itself).
     *
     * @param relativePlayerIndex Relative indexing
     * @param action The action the other player took
     */
    onPlayerAction(relativePlayerIndex: number, action: TAction): void;

    onOtherPlayerDraw(relativePlayerIndex: number, card: TCard): void;

    onSelfDraw(): void;

    getAction(): TPartialAction;
}
