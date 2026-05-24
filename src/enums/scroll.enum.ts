/**
 * Scroll timeline — normalized progress values (0–1) for each section.
 *
 * Section boundary values are intentionally shared between the "End" of one section
 * and the "Start" of the next (e.g. HeroEnd = AppRevealStart = 0.35). This makes
 * consumer code readable — you can reference either side of a boundary by name.
 */
export enum ScrollTimeline {
  HeroStart      = 0.00,
  HeroEnd        = 0.35,
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  AppRevealStart = 0.35,
  AppRevealEnd   = 0.60,
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  DarkStoryStart = 0.60,
  DarkStoryEnd   = 0.75,
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  PhilosophyStart = 0.75,
  PhilosophyEnd   = 0.90,
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  WaitlistStart  = 0.90,
  WaitlistEnd    = 1.00,
}
