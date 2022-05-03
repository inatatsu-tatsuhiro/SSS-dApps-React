import styled from '@emotion/styled'
import Create from './Create'
import CheerList from './CheerList'
import PostList from './PostList'

type Props = {
  address: string
  pubkey: string
}

function OwnerPage(props: Props) {
  return (
    <Wrapper>
      <Create address={props.address} />
      <Flex>
        <PostList address={props.address} />
        <CheerList address={props.address} pubkey={props.pubkey} />
      </Flex>
    </Wrapper>
  )
}

export default OwnerPage

const Wrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  width: '80vw',
  margin: '10vw',
})
const Flex = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
})
