export const comaToBr = (text) => {
  const stringWithBrTags = text.replace(/,/g, "<br />");

  const elementWithBrTags = (
    <span dangerouslySetInnerHTML={{ __html: stringWithBrTags }} />
  );
  return elementWithBrTags;
};
