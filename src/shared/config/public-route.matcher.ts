type Pattern = string;

export class PublicRouteMatcher {
  constructor(
    private readonly patterns: Pattern[],
    private readonly regexes: RegExp[] = [],
  ) {}

  isPublic(path: string): boolean {
    // FAST PATH (no regex)
    for (const p of this.patterns) {
      if (this.matchPattern(p, path)) return true;
    }

    // SLOW PATH (regex)
    for (const r of this.regexes) {
      if (r.test(path)) return true;
    }

    return false;
  }

  private matchPattern(pattern: string, path: string): boolean {
    // exact match
    if (!pattern.includes('*')) return pattern === path;

    // /** prefix match
    if (pattern.endsWith('/**')) {
      const base = pattern.slice(0, -3);
      return path === base || path.startsWith(base + '/');
    }

    // /* single segment
    if (pattern.endsWith('/*')) {
      const base = pattern.slice(0, -2);
      if (!path.startsWith(base + '/')) return false;
      const rest = path.slice(base.length + 1);
      return !rest.includes('/');
    }

    return false;
  }
}
