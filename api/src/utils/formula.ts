export const calculateOvertime_1_5 = (basicSalary: number) => {
  return Number((((Number(basicSalary) * 12) / 2288) * 1.5).toFixed(3));
};

export const calculateOvertime_2_0 = (basicSalary: number) => {
  return Number((((Number(basicSalary) * 12) / 2288) * 2).toFixed(3));
};
