export class MetadataService {
  calculateMetadata = ({
    totalRecord,
    page,
    pageSize,
  }: {
    totalRecord: number;
    page: number;
    pageSize: number;
  }) => {
    if (!totalRecord || totalRecord === 0) {
      return null;
    }
    return {
      currentPage: page,
      pageSize: pageSize,
      firstPage: 1,
      lastPage: Math.ceil(totalRecord / pageSize),
      totalRecord: totalRecord,
    };
  };
}
