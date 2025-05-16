import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchPostDetails = () => {
    return axios.get(`http://localhost:4000/posts`);
}

const PostDetailsRQ = () => {


// /posts     ["posts"]
// /posts/1   ["posts", 1]
// /posts/2   ["posts", 2]
// /posts/1               ["posts", post.id]
// /posts/1/comments      ["posts", post.id, "comments"]

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["posts"],
        queryFn: () => fetchPostDetails()
    })

    console.log(data);
    console.log(data?.data);

    if (isLoading) {
        return <div>Page is loading...</div>
    }

    if (isError) {
        return <div>{error.message}</div>
    }


    return (
        <div >
            <div>
            {data?.data?.map(post => (
                <div className='post-item' key={post.id}>
                    <h3 className='post-title'>{post.title}</h3>
                    <p className='post-body'>{post.body}</p>
                </div>
            ))}
            </div>
        </div>
    )
}

export default PostDetailsRQ