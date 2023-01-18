import { Component, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css'],
})
export class AlertsComponent implements OnDestroy {
  @Input() showAlertSuccess: boolean = false;
  @Input() messageAlert = '';
  @Input() showAlertError: boolean = false;

  ngOnDestroy() {
    this.showAlertError = false;
    this.showAlertSuccess = false;
    this.messageAlert = '';
  }
}
