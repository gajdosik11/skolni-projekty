/* xgajdo24
* skráva modální oken a formulářů určených pro tvorbu a úpravu událostí
*/
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { AngularFireUploadTask } from '@angular/fire/storage/task';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TicketEventService } from '../../../shared/ticket-event.service';

@Component({
    templateUrl: './create-or-edit-ticket-event-dialog.component.html'
})
export class CreateOrEditTicketEventDialogComponent implements OnInit {
    public files: File;
    public formGroup: FormGroup;
    public isEditingExisting = false;

    constructor(
        private dialogRef: MatDialogRef<CreateOrEditTicketEventDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef,
        private storage: AngularFireStorage,
        private ticketEventService: TicketEventService
    ) {
        this.isEditingExisting = this.data != null;
    }

    get waves() {
        return this.formGroup.get('waves') as FormArray;
    }
    /*inicializace kompoenty a formuláře který obsahuej datta o událsoti*/
    ngOnInit(): void {
        this.formGroup = this.formBuilder.group(
            {
                name: [null],
                date: [null],
                place: [null],
                waves: this.formBuilder.array([this.createWave()]),
                imgUrl: [null],
                files: [null, this.isEditingExisting ? null : Validators.required]
            },
            { validators: [Validators.required] }
        );
        /*pokud byli komponentě předány data, jedná se o editaci a políčka jsou polizovány a některé jsou znepřístupněny*/
        if (this.data) {
            this.ticketEventService.getEvents(this.data.uId, this.data.eventId).subscribe(events => {
                events[0].waves.forEach((wave, index, array) => {
                    if (index !== array.length - 1) {
                        this.addWave();
                    }
                    const curWave = (this.formGroup.get('waves') as FormArray).at(index) as FormGroup;
                    wave.tickets.forEach(ticket => {
                        if (ticket.available === false) {
                            curWave.get('price').disable();
                        }
                    });
                    curWave.get('count').disable();
                });
                const firstEvent = events[0];
                this.formGroup.patchValue(firstEvent);
            });
        }
    }
    /*vytvoří další vlnu ve formuláři pro událost*/
    createWave(): FormGroup {
        return this.formBuilder.group({
            count: [null, [Validators.min(0)]],
            price: [null, [Validators.min(0)]],
            expiration: [null]
        });
    }
    /*vlnu události přidá do formuláře*/
    addWave() {
        this.waves.push(this.createWave());
        this.cdr.markForCheck();
    }
    /*odebere vlnu událsotí*/
    removeWave(i) {
        this.waves.removeAt(i);
    }
    /*pokud byl předán soubor ulož jej do databáze pokud ne zabři dialogové okno a vrať hodnoty*/
    confirm(): void {
        const file: File = this.formGroup.get('files').value;
        if (file) {
            const path = `event-ticket-backgrounds/${Date.now()}`;
            const ref = this.storage.ref(path);
            const task: AngularFireUploadTask = this.storage.upload(path, file);

            task.snapshotChanges()
                .pipe(
                    finalize(async () => {
                        ref.getDownloadURL()
                            .toPromise()
                            .then(imgUrl => {
                                this.dialogRef.close({ ...this.formGroup.getRawValue(), imgUrl });
                            });
                    })
                )
                .subscribe();
        } else {
            this.dialogRef.close({ ...this.formGroup.getRawValue() });
        }
    }
}
