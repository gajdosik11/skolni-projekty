/* xgajdo24
* komponenta zpracovávající timeout při platbě
*/
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-timeout',
    template: '{{timeout}}'
})
export class TimeoutComponent implements OnInit {
    @Output() timeoutEnded = new EventEmitter<boolean>();
    @Input() timeout;
    @Input() timerDisable = false;
    interval;
    constructor() {}

    ngOnInit(): void {
        this.interval = setInterval(() => {
            if (this.timerDisable) {
                clearInterval(this.interval);
            }
            this.timeout--;
            if (this.timeout <= 0) {
                this.timeoutEnded.emit(true);
                this.timeout = 0;
                clearInterval(this.interval);
            }
        }, 1000);
    }
}
