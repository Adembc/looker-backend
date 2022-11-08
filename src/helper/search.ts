import { Types } from "mongoose";

export function generateCategoryFilter(category: string): Types.ObjectId[] {
  if (!category) return undefined;
  const result = category
    .split(",")
    .filter((ele) => Types.ObjectId.isValid(ele))
    .map((ele) => new Types.ObjectId(ele));
  return result.length > 0 ? result : undefined;
}

export function generateSearchFilter(
  search: string,
  isAvailable: string = null
) {
  if (!search) return [{ deletedAt: null }];
  const searchableFields = [
    { field: "name", type: "string" },
    { field: "category.products", type: "array" },
  ];
  const value = new RegExp(search.trim());

  const searchFilter = searchableFields.map((ele) => {
    if (ele.type === "array") {
      return {
        [ele.field]: {
          $elemMatch: {
            name: { $regex: value, $options: "i" },
            ...(isAvailable !== null && {
              isAvailable: isAvailable === "true",
            }),
          },
        },
      };
    }
    return { [ele.field]: { $regex: value, $options: "i" } };
  });
  return searchFilter;
}
