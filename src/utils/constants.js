export const ROLES = {
  SUPER_ADMIN: 1,
  ADMINISTRATOR: 2,
  ADMIN_SUPPORT: 3,
  MANAGER: 4,
  SUPERVISOR: 5,
  SITE_SUPERVISOR: 6,
  STORE: 7,
  WORKER: 8,
  FREELANCE: 9,
}

export const PROJECT_REQUEST_STATUS = {
  NEW: { value: 'new', name: 'New' },
  IN_PROGRESS: { value: 'in_progress', name: 'Inprogress' },
  ISSUE: { value: 'issue', name: 'Issue' }
}

export const TRANSACTION_TYPE = {
  ISSUE: { value: 'ISSUE', name: 'ISSUE' },
  REPLENISH: { value: 'REPLENISH', name: 'REPLENISH' },
  ISSUE_IMAGE: { value: 'ISSUE_IMAGE', name: 'ISSUE_IMAGE' },
  CREATE_BIN_CONFIGURE: { value: 'CREATE_BIN_CONFIGURE', name: 'CREATE_BIN_CONFIGURE' },
  UPDATE_BIN_CONFIGURE: { value: 'UPDATE_BIN_CONFIGURE', name: 'UPDATE_BIN_CONFIGURE' },
  TYPE_REMOVE_BIN_CONFIGURE: { value: 'TYPE_REMOVE_BIN_CONFIGURE', name: 'TYPE_REMOVE_BIN_CONFIGURE' },
}

export const BIN_STATUSES = {
  UNASSIGNED: { value: 'unassigned', name: 'Unassigned' },
  ASSIGNED: { value: 'assigned', name: 'Assigned' },
  IS_FAILED: { value: 'is_failed', name: 'Is Failed' },
}

export const TIME_SHEET_STATUSES = {
  OPEN: { value: 'open' },
  REOPEN: { value: 'reopen' },
  DONE: { value: 'done' },
  APPROVE: { value: 'approve' },
  CLOSE: { value: 'close' },
}

export const TYPE_SPARE = {
  CONSUMABLE: 'consumable',
  TTC: 'ttc',
  PERISHABLE: 'perishable',
  CE: 'ce',
  TORQUE_WRENCH: 'torque_wrench',
  OTHERS: 'others',
}