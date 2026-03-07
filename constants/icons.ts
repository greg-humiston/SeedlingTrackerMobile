/**
 * constants/icons.ts
 *
 * Single source of truth for every emoji and SF Symbol name used in the app.
 *
 * Emoji constants  — used wherever a Unicode emoji appears in JSX or data.
 * SF Symbol names  — used in <IconSymbol> and the tab _layout; the actual
 *                    SF Symbol → Material Icon mapping lives in
 *                    components/ui/icon-symbol.tsx.
 */

// ─── SF Symbol names (tab bar / UI icons) ─────────────────────────────────────

export const ICON_HOME          = 'house.fill'              as const;
export const ICON_ADD           = 'plus.circle.fill'        as const;
export const ICON_GRID          = 'square.grid.2x2.fill'    as const;
export const ICON_SEND          = 'paperplane.fill'         as const;
export const ICON_CODE          = 'chevron.left.forwardslash.chevron.right' as const;
export const ICON_CHEVRON_RIGHT = 'chevron.right'           as const;
export const ICON_LINK          = 'link'                    as const;
export const ICON_LEAF          = 'leaf.fill'               as const;

// ─── Plant / garden emojis ────────────────────────────────────────────────────

export const EMOJI_SEEDLING      = '🌱';
export const EMOJI_HERB          = '🌿';
export const EMOJI_LEAF          = '🍃';
export const EMOJI_SPROUT        = '🌱'; // alias — same glyph as SEEDLING
export const EMOJI_FLOWER_PINK   = '🌸';
export const EMOJI_FLOWER_YELLOW = '🌼';
export const EMOJI_FLOWER_RED    = '🌺';
export const EMOJI_SUNFLOWER     = '🌻';
export const EMOJI_LAVENDER      = '💜';
export const EMOJI_POT           = '🪴';

// ─── Vegetable / fruit emojis ─────────────────────────────────────────────────

export const EMOJI_TOMATO       = '🍅';
export const EMOJI_LEAFY        = '🥬';
export const EMOJI_CORN         = '🌽';
export const EMOJI_CARROT       = '🥕';
export const EMOJI_PEPPER       = '🫑';
export const EMOJI_HOT_PEPPER   = '🌶️';
export const EMOJI_EGGPLANT     = '🍆';
export const EMOJI_POTATO       = '🥔';
export const EMOJI_SWEET_POTATO = '🍠';
export const EMOJI_BROCCOLI     = '🥦';
export const EMOJI_CUCUMBER     = '🥒';
export const EMOJI_ONION        = '🧅';
export const EMOJI_GARLIC       = '🧄';
export const EMOJI_BEAN         = '🫘';
export const EMOJI_PEA          = '🫛';
export const EMOJI_MUSHROOM     = '🍄';
export const EMOJI_STRAWBERRY   = '🍓';
export const EMOJI_WATERMELON   = '🍉';
export const EMOJI_PUMPKIN      = '🎃';
export const EMOJI_BLUEBERRY    = '🫐';
export const EMOJI_CHERRY       = '🍒';

// ─── Weather / environment emojis ─────────────────────────────────────────────

export const EMOJI_WATER    = '💧';
export const EMOJI_SUN      = '☀️';

// ─── Soil / decoration emojis ─────────────────────────────────────────────────

export const EMOJI_ROCK     = '🪨';
export const EMOJI_WORM     = '🪱';

// ─── UI / status emojis ───────────────────────────────────────────────────────

export const EMOJI_MAP      = '🗺';
export const EMOJI_CHART    = '📐';
export const EMOJI_OVERVIEW = '📊';
export const EMOJI_TIP      = '🌸'; // reuses FLOWER_PINK glyph for tip cards
export const EMOJI_WARNING  = '⚠';

// ─── Composite arrays (used in headers, footers, and option pickers) ──────────

/** Decorative icon strip shown in the branding header (index.tsx). */
export const DECOR_ICONS_HOME: string[] = [
  EMOJI_HERB, EMOJI_FLOWER_PINK, EMOJI_LEAF, EMOJI_SUNFLOWER, EMOJI_HERB,
];

/** Default decorative icon strip for garden headers. */
export const DECOR_ICONS_DEFAULT: string[] = [
  EMOJI_HERB, EMOJI_SEEDLING, EMOJI_HERB, EMOJI_LEAF, EMOJI_SEEDLING, EMOJI_HERB,
];

/** Soil / footer decoration bar used on multiple screens. */
export const FOOTER_SOIL: string[] = [
  EMOJI_ROCK, EMOJI_SEEDLING, EMOJI_WORM, EMOJI_SEEDLING, EMOJI_ROCK,
];

/** Ordered emoji palette shown in the seedling emoji picker. */
export const EMOJI_OPTIONS: string[] = [
  // Herbs & greens
  EMOJI_SEEDLING, EMOJI_HERB, EMOJI_LEAF, EMOJI_LEAFY, EMOJI_POT,
  // Vegetables
  EMOJI_TOMATO, EMOJI_CARROT, EMOJI_CORN, EMOJI_PEPPER, EMOJI_HOT_PEPPER, EMOJI_EGGPLANT,
  EMOJI_POTATO, EMOJI_SWEET_POTATO, EMOJI_BROCCOLI, EMOJI_CUCUMBER,
  EMOJI_ONION, EMOJI_GARLIC, EMOJI_BEAN, EMOJI_PEA, EMOJI_MUSHROOM,
  // Fruits
  EMOJI_STRAWBERRY, EMOJI_WATERMELON, EMOJI_PUMPKIN, EMOJI_BLUEBERRY, EMOJI_CHERRY,
  // Flowers
  EMOJI_SUNFLOWER, EMOJI_LAVENDER, EMOJI_FLOWER_PINK, EMOJI_FLOWER_YELLOW, EMOJI_FLOWER_RED,
];
