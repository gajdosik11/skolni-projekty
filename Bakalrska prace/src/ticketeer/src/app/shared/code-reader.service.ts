/* xgajdo24
* služba obsahující funkce pro code reader
*/
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class CodeReaderService {
    constructor() {}
    /*je to znak*/
    private static isLetter(char: string): boolean {
        return char.length === 1 && char.match(/[a-z]/i) !== null;
    }
    /*je to cislo*/
    private static isDigit(char: string): boolean {
        return char.length === 1 && char.match(/[0-9]/i) !== null;
    }
    /*normalizace textu s kodem*/
    public static normalizeString(code: string): string {
        let normalizedString = '';
        if (code !== null) {
            for (let i = 0; i < code.length; i++) {
                normalizedString += CodeReaderService.normalizeChar(code.charAt(i));
            }
        }
        return normalizedString;
    }
    /*normalizace znaku podle klavesnice*/
    public static normalizeChar(char: string): string {
        if (!char) {
            return;
        } else if (char === 'y') {
            // normalize qwertz / qwerty keyboard layout
            char = 'z';
        } else if (char === 'Y') {
            char = 'Z';
        }
        return CodeReaderService.isLetter(char) || CodeReaderService.isDigit(char) ? char : ':';
    }
}
