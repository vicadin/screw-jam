import { _decorator } from 'cocos';
const { ccclass, property } = _decorator;

/**
 * Глобальный конфиг Playable Ad.
 * Хранит прямые ссылки на AppStore/GooglePlay и параметры баланса.
 */
@ccclass('GameConfig')
export class GameConfig {
    public static readonly STORE_URL_IOS: string = 'https://exapmle.com';
    public static readonly STORE_URL_ANDROID: string = 'https://exapmle.com';
    
    // Лимит кликов до принудительного перехода в стор
    public static readonly MAX_INTERACTIONS: number = 5;
    
    // Автоматический редирект в стор через X секунд инактива
    public static readonly AUTO_REDIRECT_TIMEOUT: number = 25;

    // Настройки механики Screw Jam
    public static readonly SCREW_UNSCREW_DURATION: number = 0.25; // Время скручивания болта в сек
    public static readonly PLATE_FALL_GRAVITY: number = 980; // Эмуляция падения пластин
}