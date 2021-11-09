/*xgajdo24
Tato kompennta je zobrazena při načítání apliakce, jedná se o jednoduchou animaci načítání*/
import { Component } from '@angular/core';
import { AuthProcessService } from 'ngx-auth-firebaseui';

@Component({
    selector: 'app-root',
    template: `
        <app-loader *ngIf="loading"></app-loader>
        <ng-container *ngIf="!loading">
            <router-outlet></router-outlet>
        </ng-container>
    `
})
export class AppComponent {
    public loading = true;

    constructor(private authService: AuthProcessService) {
        authService.user$.subscribe(() => (this.loading = false));
    }
}
