import { generateUrl } from '@/lib/urlGenerator';
import { genUniqueURL } from '@/lib/generateUniqueURL';
import { Url } from '@/models/url';
import * as dbHandler from '@/__tests__/utils/db.handler';

// mockURL
vi.mock('@/models/url.ts');

describe('urlGeneration Utilites', () => {
  beforeAll(async () => {
    await dbHandler.connect();
  });
  afterEach(async () => {
    await dbHandler.clearDatabase();
  });
  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  describe('generateURL', () => {
    it('Should return a generated short URL in string', () => {
      const shortUrl = generateUrl();

      expect(typeof shortUrl).toBe('string');
    });

    it('Should generate an unique shortURL', () => {
      // Empty set for storing Unique URLs
      const mySet = new Set();
      const MAX_ITERATIONS = 5;
      for (let i = 0; i <= MAX_ITERATIONS; i++) {
        const shortURL = generateUrl();
        mySet.add(shortURL);
      }

      expect(mySet.size - 1).toBe(MAX_ITERATIONS);
    });
    describe('genUniqueURL', () => {
      afterEach(() => {
        vi.clearAllMocks();
      });
      it('Should retry if URL already exists', async () => {
        // 1. Simulate a collision on the first call, then success on the second.
        // vi.mocked() provides type-safety for the mock.
        vi.mocked(Url.findOne).mockResolvedValueOnce({
          shortUrl: 'exists',
        } as any);
        vi.mocked(Url.findOne).mockResolvedValueOnce(null);

        // 3. Execute the function
        const result = await genUniqueURL();

        // 4. Assert the behavior
        expect(result).toEqual(expect.any(String));
        expect(Url.findOne).toHaveBeenCalledTimes(2);
      });
    });
  });
});
