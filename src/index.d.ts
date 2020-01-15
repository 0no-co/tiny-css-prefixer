export = CSSPrefixer;
export as namespace CSSPrefixer;

declare namespace CSSPrefixer {
  function prefixProperty(prop: string): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  function prefixValue(prop: string, value: string): string;
}
