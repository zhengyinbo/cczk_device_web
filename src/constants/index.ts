interface IOption {
  value: number | string;
  label: string;
}
// 状态枚举
export const CONTRACT_STATUS = {
  NORMAL: "正常",
  DISABLE: "禁用"
};

export const CONTRACT_STATUS_OPTIONS: Array<IOption> = [
  { value: CONTRACT_STATUS.NORMAL, label: '正常' },
  { value: CONTRACT_STATUS.DISABLE  , label: '禁用' }
];


export const ONLINE_STATUS = {
  ONLINE: "online",
  OFFLINE: "offline"
};

export const ONLINE_STATUS_OPTIONS: Array<IOption> = [
  { value: ONLINE_STATUS.ONLINE, label: '在线' },
  { value: ONLINE_STATUS.OFFLINE  , label: '离线' }
];

