export const BANK_THAI_NAME = {
  BBL: "Bangkok Bank (BBL) – ธนาคารกรุงเทพ",
  KTB: "Krung Thai Bank (KTB) – กรุงไทย",
  BAY: "Bank of Ayudhya (BAY) – กรุงศรีอยุธยา",
  KBANK: "Kasikorn Bank (KBANK) – กสิกรไทย",
  CIMBT: "CIMB Thai (CIMB) – ซีไอเอ็มบีไทย",
  TTB: "Thanachart Bank / TTB – ธนชาต / ทีเอ็มบีธนชาต",
  SCB: "Siam Commercial Bank (SCB) – ไทยพาณิชย์",
  UOBT: "UOB Thailand (UOB) – ยูโอบี",
  GSB: "Government Savings Bank (GSB) – ธนาคารออมสิน",
};

export const BANK_NAME_OPTIONS = [
  { value: "BBL", label: BANK_THAI_NAME["BBL"] },
  { value: "KTB", label: BANK_THAI_NAME["KTB"] },
  { value: "BAY", label: BANK_THAI_NAME["BAY"] },
  { value: "KBANK", label: BANK_THAI_NAME["KBANK"] },
  { value: "CIMBT", label: BANK_THAI_NAME["CIMBT"] },
  { value: "TTB", label: BANK_THAI_NAME["TTB"] },
  { value: "SCB", label: BANK_THAI_NAME["SCB"] },
  { value: "UOBT", label: BANK_THAI_NAME["UOBT"] },
  { value: "GSB", label: BANK_THAI_NAME["GSB"] },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: "internet_banking", label: "โอนเงินผ่านธนาคาร" },
  { value: "prompt_pay", label: "PromptPay" },
];
