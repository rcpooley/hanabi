import {
    Col,
    Numb,
    SELF_INDEX,
    TAction,
    TActionHint,
    TCard,
    THand
} from './types';
import { ANY, Utils } from './utils';

type YesNo<T> =
    | {
          type: 'yes';
          val: T;
      }
    | {
          type: 'no';
          vals: T[];
      };

export type CardKnowledge = {
    col: YesNo<Col>;
    numb: YesNo<Numb>;
};

export type HandKnowledge = CardKnowledge[];

export type PlayerInfo = {
    hand: THand;
    knowledge: HandKnowledge;
};

export type Fireworks = Record<Col, Numb[]>;

export class GameState {
    static initFireworks(): Fireworks {
        const fireworks = ANY({});
        for (const col of Utils.enumValues(Col)) {
            fireworks[col] = [];
        }
        return fireworks;
    }

    static initCardKnowledge(): CardKnowledge {
        return {
            col: {
                type: 'no',
                vals: [],
            },
            numb: {
                type: 'no',
                vals: [],
            },
        };
    }

    static initHandKnowledge(len: number): HandKnowledge {
        return new Array(len)
            .fill(null)
            .map(() => GameState.initCardKnowledge());
    }

    static addToFireworks(
        fireworks: Fireworks,
        card: TCard,
        isPlay: boolean
    ): boolean {
        const numbs = fireworks[card.col];
        if (isPlay) {
            if (card.numb === Numb.One) {
                if (numbs.length > 0) {
                    return false;
                }
            } else {
                if (
                    !numbs.includes(card.numb - 1) ||
                    numbs.includes(card.numb)
                ) {
                    return false;
                }
            }
        }
        numbs.push(card.numb);
        return true;
    }

    static addKnowledge(
        knowledge: HandKnowledge,
        { hint, handIndices }: TActionHint
    ) {
        for (let i = 0; i < knowledge.length; i++) {
            const know = knowledge[i];
            if (handIndices.includes(i)) {
                if (hint.type === 'color') {
                    know.col = {
                        type: 'yes',
                        val: hint.col,
                    };
                } else {
                    know.numb = {
                        type: 'yes',
                        val: hint.numb,
                    };
                }
            } else {
                if (hint.type === 'color' && know.col.type === 'no') {
                    know.col.vals.push(hint.col);
                    const last = Utils.getLastColor(know.col.vals);
                    if (last !== null) {
                        know.col = {
                            type: 'yes',
                            val: last,
                        };
                    }
                } else if (hint.type === 'number' && know.numb.type === 'no') {
                    know.numb.vals.push(hint.numb);
                    const last = Utils.getLastNumber(know.numb.vals);
                    if (last !== null) {
                        know.numb = {
                            type: 'yes',
                            val: last,
                        };
                    }
                }
            }
        }
    }

    private players: PlayerInfo[];
    private numDrawPileCards: number;
    private playFireworks: Fireworks;
    private discardFireworks: Fireworks;
    private numStrikes: number;

    constructor(hands: THand[], numDrawPileCards: number) {
        this.players = hands.map((hand) => ({
            hand,
            knowledge: GameState.initHandKnowledge(hand.length),
        }));
        this.numDrawPileCards = numDrawPileCards;
        this.playFireworks = GameState.initFireworks();
        this.discardFireworks = GameState.initFireworks();
        this.numStrikes = 0;
    }

    onPlayerAction(relativePlayerIndex: number, action: TAction): void {
        if (action.type === 'hint') {
            GameState.addKnowledge(
                this.players[action.relativePlayerIndex].knowledge,
                action
            );
        } else {
            const player = this.players[relativePlayerIndex];
            player.hand.splice(action.handIndex, 1);
            player.knowledge.splice(action.handIndex, 1);
            if (action.type === 'play') {
                if (
                    !GameState.addToFireworks(
                        this.playFireworks,
                        action.card,
                        true
                    )
                ) {
                    GameState.addToFireworks(
                        this.discardFireworks,
                        action.card,
                        false
                    );
                    this.numStrikes++;
                }
            } else {
                GameState.addToFireworks(
                    this.discardFireworks,
                    action.card,
                    false
                );
            }
        }
    }

    onOtherPlayerDraw(relativePlayerIndex: number, card: TCard): void {
        const player = this.players[relativePlayerIndex];
        player.hand.push(card);
        player.knowledge.push(GameState.initCardKnowledge());
    }

    onSelfDraw(): void {
        this.players[SELF_INDEX].knowledge.push(GameState.initCardKnowledge());
    }

    toString(): string {
        return this.players.map(player =>)
    }
}
