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
}

const POST_REG = /^::CREATE::/

function PostList(props: Props) {
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

        setTransactions(getPostTxs(txs.data as TransferTransaction[]))
      })
  }, [])

  const getPostTxs = (txs: TransferTransaction[]): TransferTransaction[] => {
    const postTxs: TransferTransaction[] = []

    for (const tx of txs) {
      if (POST_REG.test(tx.message.payload)) {
        postTxs.push(tx)
      }
    }

    return postTxs
  }

  const getPostMsg = (tx: TransferTransaction): string => {
    return tx.message.payload.split(POST_REG)[1]
  }

  return (
    <Root>
      <h1>POST</h1>
      {transactions.map((tx) => {
        const hash = !!tx.transactionInfo ? tx.transactionInfo.hash : ''
        return (
          <div key={tx.signature}>
            <h3>POST : {getPostMsg(tx)}</h3>
            <h3>HASH : {hash}</h3>
            <hr />
          </div>
        )
      })}
    </Root>
  )
}

export default PostList

const Root = styled('div')({
  margin: '32px',
})
