import React, { useEffect, useState } from 'react'
import { Address } from 'symbol-sdk'
import './App.css'
import GuestPage from './GuestPage'
import OwnerPage from './OwnerPage'

interface SSSWindow extends Window {
  SSS: any
}
declare const window: SSSWindow

const OWNER_ADDR = Address.createFromRawAddress(
  'TDHLRYXKIT4QOEEL3PRBP4PWLJ6NWU3LSGB56BY'
)

function App() {
  const [addr, setAddr] = useState<Address | null>(null)
  const [pubkey, setPubkey] = useState<string>('')

  console.log('render')

  useEffect(() => {
    console.log('hello')
    setTimeout(() => {
      const activeAddress = window.SSS.activeAddress
      const activePublicKey = window.SSS.activePublicKey
      setAddr(Address.createFromRawAddress(activeAddress))
      setPubkey(activePublicKey)
    }, 500)
  }, [])

  if (addr === null) {
    return (
      <div>
        <h1>Hello Symbol not set address</h1>
      </div>
    )
  }

  if (OWNER_ADDR.plain() === addr.plain()) {
    return <OwnerPage address={addr.plain()} pubkey={pubkey} />
  }
  return <GuestPage address={addr.plain()} />
}

export default App
