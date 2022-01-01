export interface BCNameStatus {
  code: string
  message: string
}

export const SuccessStatus: BCNameStatus = {
  code: '0000',
  message: 'Successful',
}

export const PendingStatus: BCNameStatus = {
  code: '0001',
  message: 'Pending',
}

export const AccountNotLinkedError: BCNameStatus = {
  code: '1000',
  message:
    'Your account must be linked to continue. Check your metamask for pending requests',
}

export const CannotLinkNameInvalidStateError: BCNameStatus = {
  code: '5001',
  message: 'You cannot link this name now. Try reloading the page',
}

export const NameNotAvailableError: BCNameStatus = {
  code: '5002',
  message: 'The name is not available at the moment',
}

export const RegistrationFailedError: BCNameStatus = {
  code: '5003',
  message: 'DP Name registration failed',
}
