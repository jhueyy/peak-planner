export interface Item {
  label: string;
  href: string;
}

export interface Feature {
  icon: string;
  heading: string;
  items: Array<Item>;
}

