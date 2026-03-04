/**
 * highlight.js language definition for OpenType Feature Files (.fea)
 * Adobe OpenType Feature File Syntax
 * https://adobe-type-tools.github.io/afdko/OpenTypeFeatureFileSpecification.html
 */

export function fea(hljs) {
  const KEYWORDS = [
    "feature",
    "lookup",
    "script",
    "language",
    "include",
    "languagesystem",
    "table",
    "useExtension",
    "lookupflag",
    "sub",
    "substitute",
    "pos",
    "position",
    "ignore",
    "by",
    "from",
    "mark",
    "markClass",
    "markAttachType",
    "useMarkFilteringSet",
    "RightToLeft",
    "IgnoreBaseGlyphs",
    "IgnoreLigatures",
    "IgnoreMarks",
    "enumerate",
    "enum",
    "parameters",
    "sizemenuname",
    "contourpoint",
    "device",
    "cursive",
    "base",
    "ligature",
    "anchor",
    "anchorDef",
    "valueRecordDef",
    "featureNameID",
    "name",
    "nameid",
    "include_dflt",
    "exclude_dflt",
    "required",
    "NULL",
    "HorizAxis.BaseTagList",
    "HorizAxis.BaseScriptList",
    "VertAxis.BaseTagList",
    "VertAxis.BaseScriptList",
    "GlyphClassDef",
    "Attach",
    "LigatureCaret",
    "CaretByPos",
    "CaretByIndex",
    "FontRevision",
    "UnicodeRange",
    "CodePageRange",
    "XHeight",
    "CapHeight",
    "Vendor",
    "Panose",
    "TypoAscender",
    "TypoDescender",
    "TypoLineGap",
    "winAscent",
    "winDescent",
    "XHeightPercent",
    "CaretOffset",
    "DescenderPercent",
    "AscenderPercent",
    "Ascender",
    "Descender",
    "LineGap",
    "Select",
    "Design",
  ];

  return {
    name: "OpenType Feature File",
    aliases: ["fea"],
    case_insensitive: false,
    keywords: {
      keyword: KEYWORDS.join(" "),
    },
    contains: [
      // Line comments
      hljs.COMMENT("#", "$"),

      // Quoted strings
      hljs.QUOTE_STRING_MODE,

      // Glyph class definition names: @ClassName
      {
        className: "variable",
        begin: /@[A-Za-z_][A-Za-z0-9_.]*|@\[/,
      },

      // 4-letter OpenType tags (e.g. latn, DFLT, kern)
      {
        className: "type",
        begin: /\b[A-Za-z][A-Za-z0-9]{0,3}\b/,
        relevance: 0,
      },

      // Numbers (integers and floats, including negative)
      {
        className: "number",
        begin: /-?\b\d+(\.\d+)?\b/,
        relevance: 0,
      },

      // Backslash-prefixed glyph names (\glyphname)
      {
        className: "symbol",
        begin: /\\[A-Za-z_][A-Za-z0-9_.#-]*/,
      },
    ],
  };
}
