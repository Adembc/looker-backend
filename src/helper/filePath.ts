function filePath(path: string): string {
  if (!path) return undefined;
  return process.env.SERVER_URL + path.slice("public/".length);
}
export default filePath;
