(category &&
    category
        .split(",")
        .filter((ele) => Types.ObjectId.isValid(ele))
        .map((ele) => new Types.ObjectId(ele))) ||
    [];
