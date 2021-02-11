import React,{useContext} from 'react';
import {useQuery } from '@apollo/react-hooks';
import { Grid, Transition } from 'semantic-ui-react'

import PostCard from '../components/PostCard';
import {AuthContext} from '../context/auth';
import {FETCH_POST_QUERY} from '../util/graphql';
import PostForm from '../components/PostForm';

function Home(props) {


    const {user} = useContext(AuthContext);

    const {loading, data} = useQuery(FETCH_POST_QUERY);
    
    let posts;
    if(data){
        posts= data.getPosts;
    }                        

    return (
        <Grid columns={3}>
        <Grid.Row className={'page-title'}>
            <h1>Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>
            {
                user &&
                <Grid.Column>
                    <PostForm/>
                </Grid.Column>
            }
        { loading ?(
            <h1>Loading Posts...</h1>
        ): (
            <Transition.Group>
                {posts && posts.map(post=> (
                <Grid.Column key={post.id} style={{marginBottom:20}}>
                <PostCard post={post}/>
                </Grid.Column>
                ))}
            </Transition.Group>
        )}
        </Grid.Row>
        </Grid>
    );
}



export default Home;