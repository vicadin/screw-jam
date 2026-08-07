import { _decorator, Component, Node, RigidBody2D, ERigidBody2DType, Vec3, tween } from 'cc';
import { EventBus, GameEvent } from '../core/EventBus';
import { ScrewController } from './ScrewController';

const { ccclass, property } = _decorator;

/**
 * Отслеживает состояние удерживающих винтов и активирует физическое падение
 */
@ccclass('PlateController')
export class PlateController extends Component {

    @property([ScrewController])
    public holdingScrews: ScrewController[] = [];

    private _rigidBody: RigidBody2D | null = null;
    private _activeScrewCount: number = 0;

    protected onLoad(): void {
        this._rigidBody = this.getComponent(RigidBody2D);
        this._activeScrewCount = this.holdingScrews.length;

        // Фиксируем физическое тело до выкручивания всех удерживающих болтов
        if (this._rigidBody) {
            this._rigidBody.type = ERigidBody2DType.Static;
        }

        EventBus.instance.on(GameEvent.SCREW_UNSCREW_COMPLETE, this.onScrewUnscrewed, this);
    }

    protected onDestroy(): void {
        EventBus.instance.off(GameEvent.SCREW_UNSCREW_COMPLETE, this.onScrewUnscrewed, this);
    }

    private onScrewUnscrewed(screw: ScrewController): void {
        // Проверяем, входил ли этот выкрученный винт в список удерживающих плашку
        const index = this.holdingScrews.indexOf(screw);
        if (index !== -1) {
            this._activeScrewCount--;

            // Когда выкручены все удерживающие винты - активируем физику падения
            if (this._activeScrewCount <= 0) {
                this.dropPlate();
            }
        }
    }

    private dropPlate(): void {
        if (this._rigidBody) {
            // Включаем динамический режим физики для действия гравитации
            this._rigidBody.type = ERigidBody2DType.Dynamic;
            this._rigidBody.wakeUp();
        } else {
            // Резервный вариант (без включенного Box2D): падение плашки через Tween
            const targetY = this.node.position.y - 1000;
            tween(this.node)
                .to(0.8, { position: new Vec3(this.node.position.x, targetY, this.node.position.z), angle: -45 }, { easing: 'quadIn' })
                .call(() => {
                    EventBus.instance.emit(GameEvent.PLATE_FALLEN, this);
                    this.node.active = false;
                })
                .start();
        }
    }
}