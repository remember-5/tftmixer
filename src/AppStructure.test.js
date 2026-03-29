import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('app structure', () => {
  it('does not keep NoticeStack as a separate component file', () => {
    expect(existsSync(resolve(process.cwd(), 'src/components/NoticeStack.jsx'))).toBe(false);
  });
});
