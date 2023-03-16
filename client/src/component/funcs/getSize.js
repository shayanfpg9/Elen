/**
 *
 * @param {string} breakpoint
 * @returns size
 */

export default function getSize(breakpoint) {
  const breakpoints = { xs: 0, sm: 480, md: 720, lg: 960, xl: 1200, xxl: 1400 };
  return breakpoints[breakpoint];
}
