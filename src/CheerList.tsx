/* eslint-disable react-hooks/exhaustive-deps */
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import {
  Address,
  NetworkType,
  Order,
  RepositoryFactoryHttp,
  TransactionGroup,
  TransactionSearchCriteria,
  TransactionType,
  TransferTransaction,
} from 'symbol-sdk'

// const GENERATION_HASH =
//   '7FCCD304802016BEBBCD342A332F91FF1F3BB5E902988B352697BE245F48E836'
// const EPOCH = 1637848847
// const XYM_ID = '3A8416DB2D53B6C8'
const NODE_URL = 'https://sym-test.opening-line.jp:3001'
const NET_TYPE = NetworkType.TEST_NET

type Props = {
  address: string
  pubkey: string
}

const CHEER_REG = /^::CHEER/

function CheerList(props: Props) {
  const [transactions, setTransactions] = useState<TransferTransaction[]>([])

  const address = Address.createFromRawAddress(props.address)

  useEffect(() => {
    const repositoryFactory = new RepositoryFactoryHttp(NODE_URL)
    const transactionHttp = repositoryFactory.createTransactionRepository()
    const searchCriteria: TransactionSearchCriteria = {
      group: TransactionGroup.Confirmed,
      recipientAddress: address,
      order: Order.Desc,
      type: [TransactionType.TRANSFER],
    }
    transactionHttp
      .search(searchCriteria)
      .toPromise()
      .then((txs) => {
        if (txs === undefined) return
        // const t = (
        //   txs.data.filter(
        //     (tx) => tx.signer?.publicKey !== props.pubkey
        //   ) as TransferTransaction[]
        // ).filter((tx) => !!tx.message.payload.startsWith('::CHEAR|'))
        setTransactions(getCheerTxs(txs.data as TransferTransaction[]))
      })
  }, [])

  const getCheerTxs = (txs: TransferTransaction[]): TransferTransaction[] => {
    const cheerTxs: TransferTransaction[] = []

    for (const tx of txs) {
      if (CHEER_REG.test(tx.message.payload)) {
        cheerTxs.push(tx)
      }
    }

    return cheerTxs
  }

  const getCheerMsg = (tx: TransferTransaction): string => {
    const tmp = tx.message.payload.split('|')[1]
    return tmp.split('::')[1]
  }
  const getCheerHash = (tx: TransferTransaction): string => {
    const tmp = tx.message.payload.split('|')[1]
    return tmp.split('::')[0]
  }

  return (
    <Root>
      <h1>CHEER</h1>
      {transactions.map((tx) => {
        const addr =
          tx.signer !== undefined
            ? Address.createFromPublicKey(
                tx.signer?.publicKey,
                NET_TYPE
              ).pretty()
            : 'NOT FOUND'
        return (
          <div key={tx.signature}>
            <h3>TO: {getCheerHash(tx)}</h3>
            <h3>MSG: {getCheerMsg(tx)}</h3>
            <h3>FROM: {addr}</h3>
            <hr />
          </div>
        )
      })}
    </Root>
  )
}

export default CheerList

const Root = styled('div')({
  margin: '32px',
})
