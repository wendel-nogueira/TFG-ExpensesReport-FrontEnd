import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartData } from 'chart.js';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'expensesreport-amount-total',
  standalone: true,
  templateUrl: './amount-total.component.html',
  styleUrl: './amount-total.component.css',
  imports: [ChartModule],
})
export class AmountTotalComponent implements OnInit {
  @Input() date: { label: string; value: string } | null = null;

  data: ChartData;
  options: ChartOptions;

  constructor() {
    this.data = {
      labels: [],
      datasets: [],
    };
    this.options = {};
  }

  ngOnInit() {
    const textColor = 'rgb(107 114 128)';

    const data1 = [];
    const data2 = [];
    const labels = [];

    const now = new Date();

    for (let i = 0; i < 7; i++) {
      data1.push(Math.floor(Math.random() * 100));
      data2.push(Math.floor(Math.random() * 100));

      const date = new Date(now);
      date.setDate(now.getDate() - i);

      labels.push(date.toDateString().slice(4, 10));
    }

    labels.reverse();

    this.data = {
      datasets: [
        {
          label: 'Amount 1',
          data: data1,
          fill: true,
          tension: 0.4,
          borderColor: 'rgb(59 130 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 4,
          pointBackgroundColor: 'rgb(59 130 246)',
          animation: {
            duration: 2000,
            easing: 'easeOutQuart',
          },
          borderAlign: 'inner',
        },
        {
          label: 'Amount 2',
          data: data2,
          fill: true,
          tension: 0.4,
          borderColor: 'rgb(239 68 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 4,
          pointBackgroundColor: 'rgb(239 68 68)',
          animation: {
            duration: 2000,
            easing: 'easeOutQuart',
          },
          borderAlign: 'inner',
        },
      ],
      labels: labels,
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: {
              weight: 500,
              family: 'Inter',
              size: 12,
            },
          },
        },
        title: {
          display: true,
          text: `Amount Total`,
          color: textColor,
          font: {
            weight: 600,
            family: 'Inter',
            size: 16,
          },
          padding: { top: 12, bottom: 12 },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
            font: {
              weight: 500,
              family: 'Inter',
              size: 12,
            },
          },
          grid: {
            color: 'transparent',
          },
        },
        y: {
          ticks: {
            color: textColor,
            font: {
              weight: 500,
              family: 'Inter',
              size: 12,
            },
          },
          grid: {
            color: 'transparent',
          },
        },
      },
    };
  }
}
