export function parseFilterName(attrName: string): {name: string, attr: string} {
  let name: string;
  let attr: string;
  if (attrName.indexOf('@') === -1) {
    attr = attrName;
    name = attrName;
  } else {
    attr = attrName.split('@')[0];
    name = attrName.split('@')[1];
  }
  return {attr, name};
}
