import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartData } from 'chart.js';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'expensesreport-total-by-status',
  standalone: true,
  templateUrl: './total-by-status.component.html',
  styleUrl: './total-by-status.component.css',
  imports: [ChartModule],
})
export class TotalByStatusComponent implements OnInit {
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
    const colors = ['rgb(59 130 246)', 'rgb(249 68 68)'];

    this.data = {
      labels: ['Status A', 'Status B'],
      datasets: [
        {
          data: [452, 124],
          backgroundColor: colors,
          hoverBackgroundColor: colors,
          borderColor: 'transparent',
        },
      ],
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
          text: `Total by Status`,
          color: textColor,
          font: {
            weight: 600,
            family: 'Inter',
            size: 16,
          },
          padding: { top: 12, bottom: 12 },
        },
      },
    };
  }
}
