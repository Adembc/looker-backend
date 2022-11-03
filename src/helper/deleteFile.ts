import { Types } from "mongoose";
import { unlink } from "node:fs/promises";

export const deleteFile = async (
  docId?: Types.ObjectId,
  findDocById?: Function,
  fieldname?: string,
  filePath?: string
): Promise<void> => {
  let doc;
  if (!filePath) {
    doc = await findDocById(docId);
  }

  const src = `${
    filePath
      ? filePath?.slice(process.env.SERVER_URL.length)
      : doc[fieldname]?.slice(process.env.SERVER_URL.length)
  }`;
  if (!src || src == "undefined") return;
  const path = "public/" + src;
  try {
    await unlink(path);
  } catch (err) {
    console.log(err);
  }
};
