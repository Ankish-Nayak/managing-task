import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-detail-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-detail-card.component.html',
  styleUrl: './dashboard-detail-card.component.scss',
})
export class DashboardDetailCardComponent {
  @Input({ required: true }) count!: number;
  @Input({ required: true }) description!: string;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) cardLinks: {
    label: string;
    endPoint: string;
    queryParams?: Params | null;
  }[] = [];
  employeesCount: number = 0;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  handleCardLink(cardLink: {
    label: string;
    endPoint: string;
    queryParams?: Params | null;
  }) {
    console.log('cardLink', cardLink);
    this.router.navigate([`../${cardLink.endPoint}`], {
      relativeTo: this.route,
      queryParams: cardLink.queryParams,
    });
  }
}
