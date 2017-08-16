import { Config } from '../../index';
/**
 * @name Navbar
 * @description
 * Navbar acts as the navigational toolbar, which also comes with a back
 * button. A navbar can contain a `ion-title`, any number of buttons,
 * a segment, or a searchbar. Navbars must be placed within an
 * `<ion-header>` in order for them to be placed above the content.
 * It's important to note that navbar's are part of the dynamic navigation
 * stack. If you need a static toolbar, use ion-toolbar.
 *
 * @usage
 * ```html
 * <ion-header>
 *
 *   <ion-navbar>
 *     <ion-button menuToggle>
 *       <ion-icon slot="icon-only" name="menu"></ion-icon>
 *     </ion-button>
 *
 *     <ion-title>
 *       Page Title
 *     </ion-title>
 *
 *     <ion-buttons end>
 *       <ion-button (click)="openModal()">
 *         <ion-icon slot="icon-only" name="options"></ion-icon>
 *       </ion-button>
 *     </ion-buttons>
 *   </ion-navbar>
 *
 * </ion-header>
 * ```
 *
 * @demo /docs/demos/src/navbar/
 * @see {@link ../../toolbar/Toolbar/ Toolbar API Docs}
 */
export declare class Navbar {
    el: HTMLElement;
    mode: string;
    color: string;
    config: Config;
    hideBackButton: boolean;
    backButtonText: string;
    backButtonIcon: string;
    hidden: boolean;
    backButtonClick(ev: UIEvent): void;
    ionViewDidLoad(): void;
    hostData(): {
        class: {
            'statusbar-padding': boolean;
        };
    };
    render(): JSX.Element[];
}
