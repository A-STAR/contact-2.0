export const navigate = async (path: string) => {
  const baseUrl = global['__URL__'];
  const page = global['__PAGE__'];
  await page.goto(baseUrl + '/' + path);
};

export const takeScreenshot = async () => {
  const page = global['__PAGE__'];
  return await page.screenshot();
};
