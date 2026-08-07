import { _decorator, Component } from 'cc';
import { EventBus, GameEvent } from './EventBus';
import { GameConfig } from '../config/GameConfig';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager | null = null;
    public static get instance(): GameManager {
        return GameManager._instance!;
    }

    private _totalScrews: number = 0;
    private _unscrewedCount: number = 0;
    private _interactionsCount: number = 0;
    private _isGameEnded: boolean = false;

    protected onLoad(): void {
        if (GameManager._instance === null) {
            GameManager._instance = this;
        } else {
            this.destroy();
            return;
        }

        EventBus.instance.on(GameEvent.SCREW_UNSCREW_COMPLETE, this.onScrewUnscrewed, this);
        EventBus.instance.on(GameEvent.CTA_CLICKED, this.onCtaClicked, this);
    }

    protected onDestroy(): void {
        EventBus.instance.off(GameEvent.SCREW_UNSCREW_COMPLETE, this.onScrewUnscrewed, this);
        EventBus.instance.off(GameEvent.CTA_CLICKED, this.onCtaClicked, this);
    }

    public registerScrewTotal(count: number): void {
        this._totalScrews = count;
    }

    private onScrewUnscrewed(): void {
        if (this._isGameEnded) return;

        this._unscrewedCount++;
        this._interactionsCount++;

        if (this._unscrewedCount >= this._totalScrews && this._totalScrews > 0) {
            this.triggerWin();
        } else if (this._interactionsCount >= GameConfig.MAX_INTERACTIONS) {
            this.triggerAutoRedirect();
        }
    }

    private triggerWin(): void {
        this._isGameEnded = true;
        EventBus.instance.emit(GameEvent.GAME_WIN);
    }

    private triggerAutoRedirect(): void {
        this._isGameEnded = true;
        EventBus.instance.emit(GameEvent.GAME_LOSE);
    }

    private onCtaClicked(): void {
        console.log('CTA Button pressed. Store URL:', GameConfig.STORE_URL_IOS);
    }
}