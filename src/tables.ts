export const TABLE_INFO = [
  { table: 1, emoji: "\u{1F3C6}", name: "The One" },
  { table: 2, emoji: "\u270C\uFE0F", name: "Double Feature" },
  { table: 3, emoji: "\u{1F3AD}", name: "Triple Threat" },
  { table: 4, emoji: "\u{1F340}", name: "Fantastic Four" },
  { table: 5, emoji: "\u2B50", name: "High Five" },
  { table: 6, emoji: "\u{1F3B2}", name: "Six Shooter" },
  { table: 7, emoji: "\u{1F308}", name: "Lucky Seven" },
  { table: 8, emoji: "\u{1F419}", name: "Octo-plex" },
  { table: 9, emoji: "\u2728", name: "Cloud Nine" },
  { table: 10, emoji: "\u{1F4AF}", name: "Perfect Ten" },
  { table: 11, emoji: "\u{1F3B8}", name: "Up to Eleven" },
  { table: 12, emoji: "\u{1F55B}", name: "Dirty Dozen" },
];

export const PRACTICABLE_TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 11, 12];

export function getTableInfo(table: number) {
  return TABLE_INFO.find((t) => t.table === table);
}
