import React,{useState} from 'react';
import {useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import  cloneDeep from 'lodash.clonedeep';
import {Button,Confirm,Icon} from 'semantic-ui-react';

import {FETCH_POST_QUERY} from '../util/graphql';
import MyPopup from '../util/MyPopup';

function DeleteButton({postId, commentId, callback}) {

    const [confirmOpen,setConfirmOpen]= useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostorComment]= useMutation(mutation,{
        variables:{
            postId,
            commentId
        },
        update(proxy){
            setConfirmOpen(false);
            if(!commentId){
                const data1 = cloneDeep(proxy.readQuery({
                    query:FETCH_POST_QUERY
                }));
                console.log(data1);
                data1.getPosts = data1.getPosts.filter(p => p.id !== postId);
                proxy.writeQuery({
                    query:FETCH_POST_QUERY,
                    data:data1
                });
                if(callback){
                    callback();
                }
            }else{
                // Here since we are getting post back so Apollo will automatically re-render our page and update cache as well.
                // So we dont need to do anything here.
            }
        }
    })

    return (
        <>
        <MyPopup 
        content={commentId ? 'Delete comment' : 'Delete Post'}>
        <Button as="div" 
        color="red" 
        floated="right"
        basic
        onClick={()=>setConfirmOpen(true)}
        style={{marginTop:10}}>
            <Icon name="trash" style={{margin:0}}/>
        </Button>
        </MyPopup>
        <Confirm
            open={confirmOpen}
            onCancel={()=>setConfirmOpen(false)}
            onConfirm={deletePostorComment}
        />
        </>
    );
}


const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId:$postId)
    }
`;

const DELETE_COMMENT_MUTATION=gql`
    mutation deleteComment($postId: String!, $commentId:ID!)
    {
        deleteComment(postId:$postId commentId:$commentId){
            id
            comments{
                id username createdAt body
            }
            commentCount
        }
    }
`;

export default DeleteButton;