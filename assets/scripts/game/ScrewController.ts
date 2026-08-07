import { _decorator, Component, Node, Vec3, tween, EventTouch } from 'cc';
import { EventBus, GameEvent } from '../core/EventBus';

const { ccclass, property } = _decorator;

/**
 * Контроллер отдельного болта
 * Обрабатывает касания и запускает tween-анимацию скручивания резьбы.
 */
@ccclass('ScrewController')
export class ScrewController extends Component {

    @property
    public colorId: string = 'red'; // Идентификатор цвета винта

    private _isUnscrewed: boolean = false;
    private _isAnimating: boolean = false;

    protected onLoad(): void {
        // Подписываемся на касание узла
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this);
    }

    private onClick(event: EventTouch): void {
        if (this._isUnscrewed || this._isAnimating) return;

        this.unscrew();
    }

    public unscrew(): void {
        this._isAnimating = true;

        // Оповещаем EventBus о начале скручивания
        EventBus.instance.emit(GameEvent.SCREW_UNSCREW_START, this);

        const currentPos = this.node.position;
        // Точка подъема болта над деревянной плашкой
        const targetPos = new Vec3(currentPos.x, currentPos.y + 50, currentPos.z);

        tween(this.node)
            // 1. Выкручивание: подъем вверх по Y с одновременно вращением угла angle на 360 градусов
            .to(0.25, { position: targetPos, angle: this.node.angle + 360 }, { easing: 'cubicOut' })
            // 2. Отлет винта со сжатием масштаба
            .to(0.2, { scale: new Vec3(0, 0, 0) }, { easing: 'backIn' })
            .call(() => {
                this._isUnscrewed = true;
                this._isAnimating = false;
                this.node.active = false;

                // Уведомляем шину событий, что винт выкручен
                EventBus.instance.emit(GameEvent.SCREW_UNSCREW_COMPLETE, this);
            })
            .start();
    }
}