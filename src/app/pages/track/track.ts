import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeliveryApi } from '../../services/delivery-api';

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './track.html',
  styleUrls: ['./track.css'],
})
export class Track {
  trackId: string = '';
  trackResult = signal<any | null>(null);

  // НОВОЕ: текстовое сообщение об ошибке или отсутствии отправления
  errorMessage = signal<string | null>(null);

  constructor(private deliveryApi: DeliveryApi) { }

  trackShipment(): void {
    const rawValue = this.trackId;

    // 1) Пустой ввод — показываем понятное сообщение
    if (!rawValue?.trim()) {
      this.errorMessage.set('Введите номер отправления');
      this.trackResult.set(null);
      return;
    }

    const numericValue = Number(rawValue);
    if (Number.isNaN(numericValue) || numericValue <= 0) {
      this.errorMessage.set('Введите корректный номер отправления');
      this.trackResult.set(null);
      return;
    }

    // очищаем прошлые данные и сообщения
    this.trackResult.set(null);
    this.errorMessage.set(null);

    this.deliveryApi.getDeliveryInfo(numericValue).subscribe(
      (response) => {
        // 2) Сервис вернул ошибку — «Отправление не найдено»
        if ('error' in response) {
          // если учитель именно так формулировал:
          this.errorMessage.set('Отправление не найдено');
          this.trackResult.set(null);
          return;
        }

        // 3) Всё хорошо — показываем результат
        this.trackResult.set(response);
      },
      (error) => {
        console.error('API error:', error);
        this.errorMessage.set('Ошибка при запросе информации об отправлении');
        this.trackResult.set(null);
      }
    );
  }
}