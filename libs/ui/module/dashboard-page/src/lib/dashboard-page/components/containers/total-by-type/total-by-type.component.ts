import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartData } from 'chart.js';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'expensesreport-total-by-type',
  standalone: true,
  templateUrl: './total-by-type.component.html',
  styleUrl: './total-by-type.component.css',
  imports: [ChartModule],
})
export class TotalByTypeComponent implements OnInit {
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
    const colors = ['rgb(59 130 246)', 'rgb(239 68 68)'];

    this.data = {
      labels: ['Type A', 'Type B'],
      datasets: [
        {
          data: [540, 325],
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
          text: `Total by Type`,
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
