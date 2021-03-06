import { Banner, GetTermResponse } from '../lib/Banner';

describe('Banner Lib Test', () => {
  it('Static Operations', async () => {
    jest.setTimeout(100000);
    const terms: GetTermResponse = await Banner.getTerm();
    const term = terms[0].code;
    await Promise.all([
      Banner.getSession({ term }),
      Banner.getSubject({ term }),
      Banner.getAttribute({ term }),
      Banner.getPartOfTerm({ term }),
      Banner.getLatestTerm()
    ]);
  });

  it('Course Operations', async () => {
    jest.setTimeout(100000);
    const term = (await Banner.getLatestTerm()).pop();
    if (term) {
      const { code } = term;
      const banner = new Banner(code, 'CS');
      const courseReferenceNumber = (await banner.search({ courseNumber: '111' })).data[0]
        .courseReferenceNumber;
      await banner.getClassDetails({ courseReferenceNumber });
      await banner.getCourseDescription({ courseReferenceNumber });
      await banner.getSectionAttributes({ courseReferenceNumber });
      await banner.getRestrictions({ courseReferenceNumber });
      await banner.getFacultyMeetingTimes({ courseReferenceNumber });
      await banner.getXlstSections({ courseReferenceNumber });
      // banner takes too long to respond. flaky test
      // await banner.getLinkedSections({ courseReferenceNumber })
      await banner.getFees({ courseReferenceNumber });
      await banner.getSectionBookstoreDetails({ courseReferenceNumber });
    }
  });

  it('Term Operations', async () => {
    jest.setTimeout(5000);
    const term = (await Banner.getLatestTerm()).pop();
    if (term) {
      const { code } = term;
      const banner = new Banner(code);
      await banner.search({ courseNumber: '111' });
    }
  });
});
