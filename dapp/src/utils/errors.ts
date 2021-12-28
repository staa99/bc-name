export interface BCNameError {
  code: string
  message: string
}

export const AccountNotLinkedError: BCNameError = {
  code: '1000',
  message:
    'Your account must be linked to continue. Check your metamask for pending requests',
}
