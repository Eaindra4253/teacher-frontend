export {};

declare global {
  type ApiResponse<T> = {
    data: T;
  };

  type ApiResponseList<T> = {
    data: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };

  type ApiErrorResponse = {
    message: string;
  };

  interface LoginResponse {
    accessToken: string;
    user: User;
  }

  interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    department?: string;
    status: "ACTIVE" | "INACTIVE";
    role: "MODERATOR" | "ADMIN" | "AUDIT";
    createdAt: string;
    updatedAt: string;
  }

  type CashRequest = {
    id: number;
    requestCode: string;
    tabletName: string;
    merchantId: number;
    storeId: number;
    amount: number;
    status: string;
    collectorId: number;
    collector: Collector;
    shift: string;
    createdAt: string;
    updatedAt: string;
    merchant: Merchant;
    store: Store;
    remark: string;
    madeByUser: User;
    requestor: Requestor;
  };

  interface History {
    id: number;
    cashRequestId: number;
    superAgentId: number;
    agentMerchantId: number;
    status: string;
    merchantReference: string;
    collectorId: number;
    storeId: number;
    amount: number;
    createdAt: string;
    updatedAt: string;
    store: Store;
    collector: Collector;
    cashRequest: CashRequest;
    superAgent: Merchant;
    agentMerchant: Merchant;
  }

  type Collector = {
    id: number;
    collectedDate: string;
    collectorName: string;
  };

  interface Store {
    id: number;
    outletName: string;
    outletType: "GNG" | "CAPITAL";
    address: string;
    ddmName: string;
    ddmPhone: string;
    createdAt: string;
    updatedAt: string;
    merchantId: number;
    merchant: Merchant;
  }

  type MerchantTownship = {
    township: Township;
  };

  interface Merchant {
    id: number;
    merchantName: string;
    merchantType: string;
    districtId?: string;
    merchantTownships: MerchantTownship[];
    phone: string;
    address: string;
    createdAt: string;
    updatedAt: string;
  }

  type GenerateReport = {
    fromDate?: string;
    toDate?: string;
    status?: string;
    reportType?: string;
  };

  interface Reports {
    id: number;
    reportType: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    message: string;
    madeBy: User;
  }

  interface Requestor {
    username: string;
    id: number;
    type: "BCF";
    phone: string;
    email: string;
    address: string;
    status: "ACTIVE" | "INACTIVE";
    createdAt: string;
    updatedAt: string;
  }

  interface Locations {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    townships: Township[];
  }

  interface Township {
    id: string;
    name: string;
    cityId: string;
    createdAt: string;
    updatedAt: string;
  }
  interface Tablet {
    id: number;
    tabletName: string;
    createdAt: string;
    updatedAt: string;
  }
}
