import { Component, signal } from '@angular/core';
import { Header } from '../../header/header';
import { DeliveryApi } from '../../services/delivery-api';

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [Header],
  templateUrl: './track.html',
  styleUrls: ['./track.css'],
})
export class Track {
  trackResult = signal<any | null>(null);

  constructor(private deliveryApi: DeliveryApi) {}

  trackShipment(rawValue: string): void {
    if (!rawValue?.trim()) {
      alert('Заполните номер отправления');
      return;
    }

    this.trackResult.set(null);

    const numericValue = Number(rawValue);
    if (Number.isNaN(numericValue) || numericValue <= 0) {
      alert('Введите корректный номер отправления');
      return;
    }

    this.deliveryApi.getDeliveryInfo(numericValue).subscribe((response) => {
      if ('error' in response) {
        alert(response.error);
        return;
      }

      this.trackResult.set(response);
    });
  }
}