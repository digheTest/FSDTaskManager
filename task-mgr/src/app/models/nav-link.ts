export class NavLink {
  path: Array<string>;
  label: string;

  constructor(options: { path?: Array<string>; label?: string }) {
    this.path = options.path || [];
    this.label = options.label || "";
  }
}
