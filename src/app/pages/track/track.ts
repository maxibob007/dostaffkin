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
  errorMessage = signal<string | null>(null);

  private readonly statusIconMap: Record<string, string> = {
    created: 'images/icons/created.svg',
    'в обработке': 'images/icons/created.svg',
    'создан': 'images/icons/created.svg',
    'в пути': 'images/icons/in-way.svg',
    'в дороге': 'images/icons/in-way.svg',
    ready: 'images/icons/ready.svg',
    'готово': 'images/icons/ready.svg',
    'готов к выдаче': 'images/icons/ready.svg',
    done: 'images/icons/done.svg',
    'доставлен': 'images/icons/done.svg',
    'доставлено': 'images/icons/done.svg',
  };

  constructor(private deliveryApi: DeliveryApi) { }

  getStatusIcon(status: any): string {
    const candidates = [
      status?.icon,
      status?.type,
      status?.key,
      status?.code,
      status?.label,
    ].filter(Boolean) as string[];

    const normalized = candidates
      .map((value) => value.toString().trim().toLowerCase())
      .find((value) => this.statusIconMap[value]);

    return this.statusIconMap[normalized ?? ''] ?? 'images/icons/created.svg';
  }

  trackShipment(): void {
    const rawValue = this.trackId;
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

    this.trackResult.set(null);
    this.errorMessage.set(null);
    this.deliveryApi.getDeliveryInfo(numericValue).subscribe(
      (response) => {
        if ('error' in response) {
          this.errorMessage.set('Отправление не найдено');
          this.trackResult.set(null);
          return;
        }

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