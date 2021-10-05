function nextMassValue(mass: Array<any>, index: number) {
  let idx = index + 1
  return mass.length === idx ? 0 : idx

}

function prevMassValue(mass: Array<any>, index: number) {
  let idx = index - 1
  return idx < 0 ? mass.length : idx
}

export const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};