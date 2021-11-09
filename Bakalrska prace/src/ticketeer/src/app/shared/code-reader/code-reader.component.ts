/* xgajdo24
* tato komponenta zpracocácá klávesy "stlačené" pomocí čtečky
*/
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CodeReaderService } from '../code-reader.service';
/*ignorování znaků a mapování čísel*/
const MAX_AGE_MS = 150;
const IGNORED_KEYS: string[] = [
    'Backspace',
    'Tab',
    'Shift',
    'Control',
    'Alt',
    'CapsLock',
    'Escape',
    'Fn',
    'Meta',
    'NumLock',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'End',
    'Home',
    'PageDown',
    'PageUp',
    'Copy',
    'Cut',
    'Delete',
    'Insert',
    'Paste',
    'Redo',
    'Undo'
];
const KEY_CODE_MAP: Map<string, string> = new Map([
    ['Digit0', '0'],
    ['Digit1', '1'],
    ['Digit2', '2'],
    ['Digit3', '3'],
    ['Digit4', '4'],
    ['Digit5', '5'],
    ['Digit6', '6'],
    ['Digit7', '7'],
    ['Digit8', '8'],
    ['Digit9', '9'],
    ['Enter', 'Enter']
]);
const KEY_DOWN_EVENT_TARGET_WHITELIST: string[] = ['BODY', 'MAT-DIALOG-CONTAINER'];

@Component({
    selector: 'app-code-reader',
    template: ''
})
export class CodeReaderComponent {
    /*callback pro vrácení kódu*/
    @Input()
    codeScanCallback: (code: string) => void;

    private code = '';
    private lastTimeStamp: number;
    /*odposlouchávač pro stisky kláves*/
    @HostListener('window:keydown', ['$event'])
    private onKeyDown(event: KeyboardEvent): void {
        if (!KEY_DOWN_EVENT_TARGET_WHITELIST.includes((event.target as Element).tagName)) {
            return;
        }

        const code: string = this.processKeyPressAndReturnCode(event);

        if (code) {
            if (this.codeScanCallback) {
                this.codeScanCallback(CodeReaderService.normalizeString(code));
            }
        }
    }
    /*zpracování řetězec znaků*/
    private processKeyPressAndReturnCode(event: KeyboardEvent): string {
        const key: string = this.readNormalizedKeyFromEvent(event);

        if (this.submitCodeKeyPressed(key)) {
            if (this.codeValidated(event)) {
                const finalCode: string = this.code;
                this.resetCode();
                return finalCode;
            }

            this.resetCode();
            return;
        }

        if (this.keypressExpired(event)) {
            this.resetCode();
        }

        this.code += key;
        this.lastTimeStamp = event.timeStamp;
    }
    /*ignorování znaků*/
    private readNormalizedKeyFromEvent(event: KeyboardEvent): string {
        if (IGNORED_KEYS.includes(event.key)) {
            return '';
        }

        return KEY_CODE_MAP.has(event.code) ? KEY_CODE_MAP.get(event.code) : CodeReaderService.normalizeChar(event.key);
    }
    /*dlouha odezva mezi stisky znamena konec nacitani*/
    private keypressExpired(event: KeyboardEvent): boolean {
        return event.timeStamp - this.lastTimeStamp > MAX_AGE_MS;
    }
    /*validace zda je kod dostatecne dlouhy*/
    private codeValidated(event: KeyboardEvent): boolean {
        return this.code.length >= 4 && !this.keypressExpired(event);
    }
    /*potvrzeni kodu*/
    private submitCodeKeyPressed(key: string): boolean {
        return key === 'Enter';
    }
    /*reset kodu*/
    private resetCode(): void {
        this.code = '';
    }
}
