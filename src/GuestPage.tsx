import styled from '@emotion/styled'
import { Address } from 'symbol-sdk'
import Cheer from './Cheer'
import PostList from './PostList'

type Props = {
  address: string
}
const OWNER_ADDR = Address.createFromRawAddress(
  'TDHLRYXKIT4QOEEL3PRBP4PWLJ6NWU3LSGB56BY'
)

function GuestPage(props: Props) {
  return (
    <Wrapper>
      <h1>Hello Symbol 「{props.address}」</h1>
      <Cheer address={OWNER_ADDR.plain()} />
      <PostList address={OWNER_ADDR.plain()} />
    </Wrapper>
  )
}

export default GuestPage

const Wrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  width: '80vw',
  margin: '10vw',
})
