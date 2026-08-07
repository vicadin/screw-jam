import { EventTarget } from 'cc';

export enum GameEvent {
    GAME_START = 'game_start',
    SCREW_UNSCREW_START = 'screw_unscrew_start',
    SCREW_UNSCREW_COMPLETE = 'screw_unscrew_complete',
    PLATE_FALLEN = 'plate_fallen',
    GAME_WIN = 'game_win',
    GAME_LOSE = 'game_lose',
    CTA_CLICKED = 'cta_clicked'
}

export class EventBus {
    private fontTarget: EventTarget = new EventTarget();
    private static _instance: EventBus | null = null;

    public static get instance(): EventBus {
        if (!EventBus._instance) {
            EventBus._instance = new EventBus();
        }
        return EventBus._instance;
    }

    public on(event: GameEvent | string, callback: (...args: any[]) => void, target?: any): void {
        this.fontTarget.on(event, callback, target);
    }

    public off(event: GameEvent | string, callback: (...args: any[]) => void, target?: any): void {
        this.fontTarget.off(event, callback, target);
    }

    public emit(event: GameEvent | string, ...args: any[]): void {
        this.fontTarget.emit(event, ...args);
    }
}