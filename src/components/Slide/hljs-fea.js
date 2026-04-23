/**
 * highlight.js language definition for OpenType Feature Files (.fea)
 * Adobe OpenType Feature File Syntax
 * https://adobe-type-tools.github.io/afdko/OpenTypeFeatureFileSpecification.html
 
* Covered Spec Version: 1.27 – 7 October 2024
*/

// According to spec 2.c. Keywords
export const KEYWORDS = [
  "anchor",
  "anchorDef",
  "anon",
  "anonymous",
  "by",
  "contourpoint",
  "cursive",
  "device", // [ Not implemented ]
  "enum",
  "enumerate",
  "exclude_dflt",
  "feature", // (used as a block and as a statement)
  "from",
  "ignore", // (used with substitute and position)
  "IgnoreBaseGlyphs",
  "IgnoreLigatures",
  "IgnoreMarks",
  "include",
  "include_dflt",
  "language",
  "languagesystem",
  "locationDef",
  "lookup",
  "lookupflag",
  "mark", // (can also be used as a tag or lookup block label)
  "MarkAttachmentType",
  "markClass",
  "nameid",
  // "NULL", // (used in substitute, device, value record, anchor)
  "parameters",
  "pos",
  "position",
  "required", // [ Not implemented ]
  "reversesub",
  "RightToLeft",
  "rsub",
  "script",
  "sub",
  "substitute",
  "subtable",
  "table",
  "useExtension",
  "UseMarkFilteringSet",
  "valueRecordDef",
  "excludeDFLT", // (deprecated)
  "includeDFLT", // (deprecated)
];

export const BASE_TABLE = [
  "HorizAxis.BaseTagList",
  "HorizAxis.BaseScriptList",
  "HorizAxis.MinMax",

  "VertAxis.BaseTagList",
  "VertAxis.BaseScriptList",
  "VertAxis.MinMax",
];

export const GDEF_TABLE = [
  "GlyphClassDef",
  "Attach",

  "LigatureCaretByDev",
  "LigatureCaretByPos",
  "LigatureCaretByIndex",
];

export const HEAD_TABLE = [
  //
  "FontRevision",
];

export const HHEA_TABLE = [
  "CaretOffset",
  "CaretSlopeRise",
  "CaretSlopeRun",

  "Ascender",
  "Descender",
  "LineGap",
];

export const NAME_TABLE = [
  //
  "nameid",
];

export const OS2_TABLE = [
  "FSType",
  "Panose",
  "UnicodeRange",
  "CodePageRange",
  "TypoAscender",
  "TypoDescender",
  "TypoLineGap",
  "winAscent",
  "winDescent",
  "XHeight",
  "CapHeight",
  "WeightClass",
  "WidthClass",
  "Vendor",
  "LowerOpSize",
  "UpperOpSize",
  "FamilyClass",
  "SubscriptXSize",
  "SubscriptXOffset",
  "SubscriptYSize",
  "SubscriptYOffset",
  "SuperscriptXSize",
  "SuperscriptXOffset",
  "SuperscriptYSize",
  "SuperscriptYOffset",
  "StrikeoutSize",
  "StrikeoutPosition",
];

export const VHEA_TABLE = [
  "CaretOffset",
  "CaretSlopeRise",
  "CaretSlopeRun",

  "VertTypoAscender",
  "VertTypoDescender",
  "VertTypoLineGap",
];

export const VMTX_TABLE = [
  //
  "VertOriginY",
  "VertAdvanceY",
];

export const SIZE_TABLE = [
  //
  "sizemenuname",
];

export const STAT_TABLE = [
  "ElidedFallbackName",
  "ElidedFallbackNameID",
  "DesignAxis",
  "AxisValue",
  "flag",
  "location",
  "name",
  "ElidableAxisValueName",
  "OlderSiblingFontAttribute",
];

export function fea(hljs) {
  const BLOCK_NAME_RE = /[A-Za-z_][A-Za-z0-9._]*/;

  const COMMENT = hljs.COMMENT("#", "$", { relevance: 0 });

  const STRING = {
    scope: "string",
    begin: '"',
    end: '"',
    contains: [
      {
        scope: "char.escape",
        begin: /\\(?:[0-9A-Fa-f]{4}|[0-9A-Fa-f]{2})/,
      },
    ],
  };

  const CLASS_NAME = {
    scope: "variable",
    begin: /@[A-Za-z_][A-Za-z0-9._-]*/,
    relevance: 0,
  };

  const ESCAPED_GLYPH_OR_CID = {
    scope: "char.escape",
    begin: /\\[^.*\s]+/,
    relevance: 0,
  };

  const HEX_NUMBER = {
    scope: "number",
    begin: /(?:0x|\\)[0-9A-Fa-f]+/,
    relevance: 0,
  };

  const NUMBER = {
    scope: "number",
    begin: /-?\d+(?:\.\d+)?/,
    relevance: 0,
  };

  const OPERATORS = {
    scope: "operator",
    begin: /[\-\[\]\/(){},.:;=%*<>']/,
  };

  const COMMON_CONTAINS = [
    COMMENT,
    STRING,
    CLASS_NAME,
    ESCAPED_GLYPH_OR_CID,
    HEX_NUMBER,
    NUMBER,
    OPERATORS,
  ];

  const INCLUDE = {
    begin: /\binclude\b\s*\(/,
    returnBegin: true,
    end: /\)/,
    contains: [
      { scope: "keyword", begin: /\binclude\b/ },
      { begin: /\s+/, relevance: 0 },
      { scope: "operator", begin: /\(/ },
      {
        scope: "string",
        begin: /[^\s()]+/,
        endsParent: true,
        relevance: 0,
      },
    ],
  };

  const BLOCK_START = {
    begin:
      /\b(?:anonymous|anon|feature|lookup)\b\s+[A-Za-z_][A-Za-z0-9._]*(?:\s+useExtension)?(?=\s*\{)/,
    returnBegin: true,
    end: /(?=\{)/,
    contains: [
      { scope: "keyword", begin: /\b(?:anonymous|anon|feature|lookup)\b/ },
      { begin: /\s+/, relevance: 0 },
      { scope: "title", begin: BLOCK_NAME_RE },
      { begin: /\s+/, relevance: 0 },
      { scope: "keyword", begin: /\buseExtension\b/ },
    ],
    relevance: 10,
  };

  const BLOCK_END = {
    begin: /\}\s+[A-Za-z_][A-Za-z0-9._]*\s*;/,
    returnBegin: true,
    end: /;/,
    contains: [
      { scope: "operator", begin: /\}/ },
      { begin: /\s+/, relevance: 0 },
      { scope: "title", begin: BLOCK_NAME_RE },
    ],
    relevance: 5,
  };

  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function tableMode(tableName, tableKeywords) {
    const tableEsc = escapeRegex(tableName);
    const keywordRe = new RegExp(
      `\\b(?:${tableKeywords.map(escapeRegex).join("|")})\\b`,
    );

    return {
      begin: new RegExp(`\\btable\\s+${tableEsc}\\s*\\{`),
      returnBegin: true,
      end: new RegExp(`\\}\\s*${tableEsc}\\s*;`),
      contains: [
        {
          begin: /\btable\b\s+/,
          returnBegin: true,
          end: /\{/,
          contains: [
            { scope: "keyword", begin: /\btable\b/ },
            { begin: /\s+/, relevance: 0 },
            { scope: "title", begin: new RegExp(tableEsc) },
            { begin: /\s+/, relevance: 0 },
            { scope: "operator", begin: /\{/ },
          ],
        },
        {
          scope: "keyword",
          begin: keywordRe,
          relevance: 2,
        },
        ...COMMON_CONTAINS,
        {
          begin: new RegExp(`\\}\\s*${tableEsc}\\s*;`),
          returnBegin: true,
          end: /;/,
          contains: [
            { scope: "operator", begin: /\}/ },
            { begin: /\s+/, relevance: 0 },
            { scope: "title", begin: new RegExp(tableEsc) },
          ],
        },
      ],
    };
  }

  return {
    name: "OpenType Feature File",
    aliases: ["fea", "opentype", "opentypefeature", "feature-file"],
    case_insensitive: false,
    keywords: {
      $pattern: /[A-Za-z_][A-Za-z0-9._-]*/,
      keyword: KEYWORDS.join(" "),
      literal: "NULL DFLT dflt",
    },
    contains: [
      tableMode("BASE", BASE_TABLE),
      tableMode("GDEF", GDEF_TABLE),
      tableMode("head", HEAD_TABLE),
      tableMode("hhea", HHEA_TABLE),
      tableMode("name", NAME_TABLE),
      tableMode("OS/2", OS2_TABLE),
      tableMode("vhea", VHEA_TABLE),
      tableMode("vmtx", VMTX_TABLE),
      tableMode("size", SIZE_TABLE),
      tableMode("STAT", STAT_TABLE),

      BLOCK_START,
      BLOCK_END,
      INCLUDE,
      ...COMMON_CONTAINS,
    ],
    illegal: /\t/,
  };
}
