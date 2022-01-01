export const requestOrLoadAccounts = async (): Promise<string[]> => {
  try {
    let accounts = await window.ethereum?.request({
      method: 'eth_accounts',
    })
    if (!accounts?.length) {
      accounts = await window.ethereum?.request({
        method: 'eth_requestAccounts',
      })
    }
    return accounts
  } catch (e) {
    console.error(e)
    return []
  }
}
