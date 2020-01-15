export = CSSPrefixer;
export as namespace CSSPrefixer;

declare namespace CSSPrefixer {
  function prefixProperty(prop: string): string[];
  function prefixValue(prop: string, value: string): string;
}
