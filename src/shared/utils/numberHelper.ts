export const formatToDecimal = ({
  decimal = 1,
  num,
}: {
  decimal?: number;
  num: number;
}): string => {
  return num.toFixed(decimal);
};
