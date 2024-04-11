import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartData } from 'chart.js';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'expensesreport-amount-by-department',
  standalone: true,
  templateUrl: './amount-by-department.component.html',
  styleUrl: './amount-by-department.component.css',
  imports: [ChartModule],
})
export class AmountByDepartmentComponent implements OnInit {
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

    this.data = {
      labels: [
        'Department 1',
        'Department 2',
        'Department 3',
        'Department 4',
        'Department 5',
        'Department 6',
        'Department 7',
      ],
      datasets: [
        {
          label: 'Amount',
          backgroundColor: 'rgb(59 130 246)',
          borderColor: 'transparent',
          data: [65, 59, 80, 81, 56, 55, 40],
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.2,
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
          text: `Amount by Department`,
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
