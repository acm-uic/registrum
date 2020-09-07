import { Document, model } from 'mongoose';
import { Banner, Course, SearchResponse, Subject, Term } from 'registrum-common/dist/lib/Banner';
import { CourseSchema, SubjectSchema, TermSchema } from 'registrum-common/dist/schemas/Banner';
import { HookSchema } from 'registrum-common/dist/schemas/Hook';
import { Hook } from 'registrum-common/dist/types/Hook';

export const TermModel = model<Term & Document>('Term', TermSchema);
export const SubjectModel = model<Subject & Document>('Subject', SubjectSchema);
export const CourseModel = model<Course & Document>('Course', CourseSchema);
export const HookModel = model<Hook & Document>('Hook', HookSchema);

export type BannerDataConfig = {
  maxPageSize: number;
  waitBetweenPages: number;
  pageRetryCount: number;
  pageRetryTime: number;
  termsToUpdate: number;
  waitBetweenTerms: number;
};

export class BannerData {
  #config: BannerDataConfig;
  constructor(config: BannerDataConfig) {
    this.#config = config;
  }

  #getAllPages = async (banner: Banner) => {
    const progress = '✨ 🚀 🌮 🧪 🎸 😎 🔫 💩 👽 👾 🤖 💥 🔥 🌈 👻'.split(' ');
    const { maxPageSize, waitBetweenPages } = this.#config;
    let count = 0;
    const res = await this.#getPage(banner, maxPageSize, 0);
    const { success, totalCount, pageOffset, pageMaxSize, sectionsFetchedCount } = res;
    console.log(`${progress[count++ % progress.length]} ${success}, ${totalCount}, \
${pageOffset}, ${pageMaxSize}, ${sectionsFetchedCount}`);
    let received = res.data.length;
    while (received < res.totalCount) {
      const page = await this.#getPage(banner, maxPageSize, received);
      const { success, totalCount, pageOffset, pageMaxSize, sectionsFetchedCount } = page;
      console.log(`${progress[count++ % progress.length]} ${success}, ${totalCount}, \
${pageOffset}, ${pageMaxSize}, ${sectionsFetchedCount}`);
      res.data = [...res.data, ...page.data];
      received += page.data.length;
      await new Promise(resolve => setTimeout(resolve, waitBetweenPages));
    }
    return res;
  };

  #getPage = async (banner: Banner, size: number, offset: number) => {
    const { pageRetryTime, pageRetryCount } = this.#config;
    for (let retryCount = 0; retryCount < pageRetryCount; retryCount++) {
      const res = await banner.search({
        pageMaxSize: `${size}`,
        pageOffset: `${offset}`
      });
      if (res.success) return res;
      console.log('Retrying Page');
      await new Promise(resolve => setTimeout(resolve, pageRetryTime));
    }
  };
  updateTerms = async () => {
    const terms = await Banner.getLatestTerm(this.#config.termsToUpdate);
    const res = terms.map(term => {
      return {
        ...term,
        _id: term.code
      };
    });
    await TermModel.collection.bulkWrite(
      res.map(r => {
        return {
          updateOne: {
            filter: {
              _id: r._id
            },
            update: { $set: r },
            upsert: true
          }
        };
      })
    );
  };

  updateSubjects = async () => {
    const terms = await Banner.getLatestTerm(this.#config.termsToUpdate);
    for (const term of terms) {
      console.log(term.code);
      const subjects = await Banner.getSubject({
        term: term.code
      });
      const res = subjects.map(subject => {
        return {
          ...subject,
          _id: subject.code
        };
      });
      await SubjectModel.collection.bulkWrite(
        res.map(r => {
          return {
            updateOne: {
              filter: {
                _id: r._id
              },
              update: { $set: r },
              upsert: true
            }
          };
        })
      );
    }
  };

  updateAllCourses = async () => {
    const terms = await Banner.getLatestTerm(this.#config.termsToUpdate);
    for (const term of terms) {
      console.log(term.code);
      const banner = new Banner(term.code);

      const courses: SearchResponse = await this.#getAllPages(banner);
      const res = courses.data.map(course => {
        return {
          ...course,
          _id: course.courseReferenceNumber
        };
      });
      await CourseModel.collection.bulkWrite(
        res.map(r => {
          return {
            updateOne: {
              filter: {
                _id: r._id
              },
              update: { $set: r },
              upsert: true
            }
          };
        })
      );
      await new Promise(resolve => setTimeout(resolve, this.#config.waitBetweenTerms));
    }
  };

  updateCourses = async (): void => {
    const crns = (await HookModel.find({})).map(hook => hook._id);
    const dbCourses = await CourseModel.find({
      _id: {
        $in: crns
      }
    });
    if (crns.length !== dbCourses.length) {
      this.updateAllCourses();
    }
    const bannerCourses = (
      await Promise.all(
        dbCourses.map(async dbCourse => {
          const { term, subject, courseNumber, courseReferenceNumber } = dbCourse;
          const banner = new Banner(term);
          const res = await banner.search({
            subject,
            courseNumber
          });
          res.data.filter(r => r.courseReferenceNumber === courseReferenceNumber);
          return res.data;
        })
      )
    ).flat(1);
    const res = bannerCourses.map(course => {
      return {
        ...course,
        _id: course.courseReferenceNumber
      };
    });
    await CourseModel.collection.bulkWrite(
      res.map(r => {
        return {
          updateOne: {
            filter: {
              _id: r._id
            },
            update: { $set: r },
            upsert: true
          }
        };
      })
    );
  };

  updateDb = async () => {
    console.log('Updating Terms');
    await this.updateTerms();
    console.log('Updated Terms');
    console.log('Updating Subjects');
    await this.updateSubjects();
    console.log('Updated Subjects');
    console.log('Updating All Courses');
    await this.updateAllCourses();
    console.log('Updated All Courses');
  };
}

export default BannerData;
