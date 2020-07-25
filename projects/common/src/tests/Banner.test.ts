import { Banner } from '../lib/Banner';

describe('Banner Lib Test', () => {
  it('Static Operations', async () => {
    jest.setTimeout(100000);
    const terms = await Banner.getTerm();
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
    const latestTerm = (await Banner.getLatestTerm()).pop();
    if (latestTerm && latestTerm.code) {
      const banner = new Banner(latestTerm.code, 'CS');
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
    const latestTerm = (await Banner.getLatestTerm()).pop();
    if (latestTerm && latestTerm.code) {
      const banner = new Banner(latestTerm.code);
      await banner.search({ courseNumber: '111' });
    }
  });
});
