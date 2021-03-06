import { Navbar } from "../components/Navbar"
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const[{data},posts] = usePostsQuery()
  return (
  <>
    <Navbar/>
    <div>Hi there</div>
    <br/>
    {!data ? (<div>loading...</div>): data.posts.map(p => <div key={p.id}>{p.title}</div>)}
  </>
)
}
export default withUrqlClient(createUrqlClient, {ssr:true})(Index)
