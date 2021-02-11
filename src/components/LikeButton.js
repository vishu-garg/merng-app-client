import React, {useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {Button,Icon,Label} from 'semantic-ui-react';

import MyPopup from '../util/MyPopup'

function LikeButton({post:{id, likes,likeCount},user}) {


    const [liked,setLiked]=useState(false);

    useEffect(()=>{
        if(user && likes.find(like=> like.username===user.username)){
            setLiked(true);
        }else{
            setLiked(false);
        }
    },[user,likes]);

    const [likePost] = useMutation(LIKE_POST_MUTATION,{
        variables:{postId: id}
    });

    const likeButton = user ? (
        liked ? (
            <Button color='teal' onClick={likePost}>
            <Icon name='heart' />
            Like
        </Button>
        ): (
            <Button color='teal' basic onClick={likePost}>
            <Icon name='heart' />
            Like
        </Button>
        )
    ):(
        <Button as={Link} to='/login' color='teal' basic>
            <Icon name='heart' />
            Like
        </Button>
    );

    return (
        <MyPopup
         content={liked ? "Unlike post" : "Like post" }>
        <Button as='div' labelPosition='right'>
        {likeButton}
        <Label as='a' basic color='teal' pointing='left'>
            {likeCount}
        </Label>
        </Button>
        </MyPopup>
    );
}

const LIKE_POST_MUTATION = gql`
mutation likePost ($postId : ID!){
    likePost(postId:$postId){
        id likes{
            id username 
        }
        likeCount
    }
}
`;

export default LikeButton;