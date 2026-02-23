// Poseidon Customizable User Dashboards
// Professional, robust, and extensible

export interface DashboardWidget {
  id: string;
  type: string;
  config: any;
}

export class UserDashboard {
  private widgets: DashboardWidget[] = [];

  addWidget(widget: DashboardWidget) {
    this.widgets.push(widget);
  }

  getWidgets(): DashboardWidget[] {
    return this.widgets;
  }
}

// Example usage:
// const dashboard = new UserDashboard();
// dashboard.addWidget({ id: 'w1', type: 'chart', config: {} });
// dashboard.getWidgets();
