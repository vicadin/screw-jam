import { _decorator, Component, Node, screen, Size } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Автоматически подстраивает масштаб игрового поля при изменении размеров окна / повороте устройства.
 */
@ccclass('ScreenAdapter')
export class ScreenAdapter extends Component {

    @property(Node)
    public gameAreaNode: Node = null!;

    protected onLoad(): void {
        // Подписываемся на новое событие ресайза экрана
        screen.on('window-resize', this.adaptScreen, this);
        this.adaptScreen();
    }

    protected onDestroy(): void {
        screen.off('window-resize', this.adaptScreen, this);
    }

    private adaptScreen(): void {
        // актуальные габариты окна через screen.windowSize
        const windowSize: Size = screen.windowSize;
        const isLandscape: boolean = windowSize.width > windowSize.height;

        if (this.gameAreaNode) {
            // немного уменьшаем игровое поле, чтобы UI и CTA умещались по бокам
            if (isLandscape) {
                this.gameAreaNode.setScale(0.85, 0.85, 1);
            } else {
                this.gameAreaNode.setScale(1, 1, 1);
            }
        }
    }
}