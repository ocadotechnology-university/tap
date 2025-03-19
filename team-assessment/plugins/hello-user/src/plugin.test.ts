import { helloUserPlugin } from './plugin';

describe('hello-user', () => {
  it('should export plugin', () => {
    expect(helloUserPlugin).toBeDefined();
  });
});
