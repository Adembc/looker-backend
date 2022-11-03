import { PaginationModel } from "mongoose-paginate-ts";

const groupBy = (arr, key: string) => {
  // group by id
  const grouped = arr.reduce((acc, cval) => {
    const myAttribute = cval[key]?._id;
    acc[myAttribute] = [...(acc[myAttribute] || []), cval];
    return acc;
  }, {});
  // change keyName to title
  for (const keyy in grouped) {
    delete Object.assign(grouped, {
      [grouped[keyy][0][key]?.title]: grouped[keyy],
    })[keyy];
  }
  return grouped;
};

type returnedData = {
  code: number;
  status: string;
  results: number;
  payload: object;
  meta?: object;
};

type Option = {
  dataName: string;
  isPaginated: boolean;
  parentName?: string;
};

function paginateData(
  data: PaginationModel<any>,
  options: Option
): returnedData {
  const doc = options.parentName
    ? groupBy(data.docs, options.parentName)
    : data.docs;
  const {
    totalDocs,
    limit,
    pagingCounter,
    page,
    totalPages,
    prevPage,
    nextPage,
  } = data;
  let returnedData: returnedData;
  if (options.isPaginated) {
    returnedData = {
      code: 200,
      status: "success",
      results: doc.length,
      payload: {
        [options.dataName]: doc,
      },
      meta: {
        totalDocs,
        limit,
        page,
        totalPages,
        hasPrevPage: !!prevPage,
        hasNextPage: !!nextPage,
        prevPage,
        nextPage,
        pagingCounter,
      },
    };
  } else {
    returnedData = {
      code: 200,
      status: "success",
      results: doc.length,
      payload: {
        [options.dataName]: doc,
      },
    };
  }
  return returnedData;
}

export default paginateData;
