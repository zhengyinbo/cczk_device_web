interface IOption {
  value: number | string;
  label: string;
}
// 状态枚举
export const CONTRACT_STATUS = {
  NORMAL: "1",
  DISABLE: "2"
};

export const CONTRACT_STATUS_OPTIONS: Array<IOption> = [
  { value: CONTRACT_STATUS.NORMAL, label: '正常' },
  { value: CONTRACT_STATUS.DISABLE  , label: '禁用' }
];
