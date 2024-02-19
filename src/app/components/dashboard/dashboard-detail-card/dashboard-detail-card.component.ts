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
  @Input({ required: true }) public count!: number;
  @Input({ required: true }) public description!: string;
  @Input({ required: true }) public title!: string;
  @Input({ required: true }) public cardLinks: {
    label: string;
    endPoint: string;
    queryParams?: Params | null;
  }[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  public handleCardLink(cardLink: {
    label: string;
    endPoint: string;
    queryParams?: Params | null;
  }) {
    this.router.navigate([`../${cardLink.endPoint}`], {
      relativeTo: this.route,
      queryParams: cardLink.queryParams,
    });
  }
}
