import { Button, TextField } from '@mui/material'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import {
  Address,
  Deadline,
  NetworkType,
  PlainMessage,
  SignedTransaction,
  TransactionHttp,
  TransferTransaction,
  UInt64,
} from 'symbol-sdk'

const GENERATION_HASH =
  '7FCCD304802016BEBBCD342A332F91FF1F3BB5E902988B352697BE245F48E836'
const EPOCH = 1637848847
const XYM_ID = '3A8416DB2D53B6C8'
const NODE_URL = 'https://sym-test.opening-line.jp:3001'
const NET_TYPE = NetworkType.TEST_NET

type Props = {
  address: string
}

interface SSSWindow extends Window {
  SSS: any
}
declare const window: SSSWindow

function Cheer(props: Props) {
  const [hash, setHash] = useState('')
  const [cheer, setCheer] = useState('')
  const [isRequest, setIsRequest] = useState<boolean>(false)
  const address = Address.createFromRawAddress(props.address)

  useEffect(() => {
    if (isRequest) {
      window.SSS.requestSign().then((signedTx: SignedTransaction) => {
        new TransactionHttp(NODE_URL).announce(signedTx)
      })
    }
  }, [isRequest])

  const submit = () => {
    const message = `::CHEER|${hash}::${cheer}`
    const tx = TransferTransaction.create(
      Deadline.create(EPOCH),
      address,
      [],
      PlainMessage.create(message),
      NET_TYPE,
      UInt64.fromUint(2000000)
    )
    window.SSS.setTransaction(tx)

    setIsRequest(true)
  }

  return (
    <Wrapper>
      <TextField
        label="hash"
        value={hash}
        fullWidth
        onChange={(e) => setHash(e.target.value)}
      />
      <TextField
        label="cheer"
        value={cheer}
        fullWidth
        onChange={(e) => setCheer(e.target.value)}
      />
      <Button onClick={submit}>ボタン</Button>
    </Wrapper>
  )
}

export default Cheer

const Wrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  flexDirection: 'column',
})
