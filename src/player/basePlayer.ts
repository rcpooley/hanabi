import { GameState } from '../gameState';
import { IPlayer, TAction, TCard, TPartialAction } from '../types';

export default abstract class BasePlayer implements IPlayer {
    constructor(protected state: GameState) {}

    onPlayerAction(relativePlayerIndex: number, action: TAction): void {
        this.state.onPlayerAction(relativePlayerIndex, action);
    }

    onOtherPlayerDraw(relativePlayerIndex: number, card: TCard): void {
        this.state.onOtherPlayerDraw(relativePlayerIndex, card);
    }

    onSelfDraw(): void {
        this.state.onSelfDraw();
    }

    abstract getAction(): TPartialAction;
}
