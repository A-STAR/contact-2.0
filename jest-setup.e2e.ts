import { toMatchImageSnapshot } from 'jest-image-snapshot';

jest.setTimeout(128000);

expect.extend({ toMatchImageSnapshot });
