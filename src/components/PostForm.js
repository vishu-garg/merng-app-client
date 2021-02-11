import React,{useState} from 'react';
import {Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import  cloneDeep from 'lodash.clonedeep';
import {useMutation} from '@apollo/react-hooks';

import {useForm} from '../util/hooks';
import {FETCH_POST_QUERY} from '../util/graphql';

function PostForm(props) {

    const {values,onChange,onSubmit}= useForm(createPostCallback,{
        body:''
    });
    const [errors,setErrors]=useState({});
    const [createPost, {error}]=useMutation(CREATE_POST_MUTATION,{
        variables:values,
        update(proxy,result){
            const data_1 = cloneDeep(proxy.readQuery({
                query: FETCH_POST_QUERY
            }));
            data_1.getPosts=[result.data.createPost,...data_1.getPosts];
            proxy.writeQuery({
                query: FETCH_POST_QUERY,
                data:{...data_1}
            });
            setErrors({});
            values.body="";
        },
        onError(err)
        {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        }
    });

    function createPostCallback(){
        createPost();
    }

    return (
        <div>
            <Form onSubmit = {onSubmit}>
                <h2>Create a Post</h2>
                <Form.Field>
                    <Form.Input
                    placeholder="Hi World"
                    name="body"
                    onChange={onChange}
                    value={values.body}
                    error={error ? true : false}
                    />
                </Form.Field>
                <Button type="submit" color="teal">
                    Submit
                </Button>
            </Form>
            {Object.keys(errors).length>0 && (
                <div className="ui error message" style={{marginBottom:20}}>
                <ul className="list">
                    {Object.values(errors).map(value=>(
                        <li key={value}>{value}</li>
                    ))}
                </ul>
            </div>
            )}
        </div>
    );
}

const CREATE_POST_MUTATION= gql`
mutation createPost($body: String!){
    createPost(body:$body){
        id body createdAt username
        likes{
            id username createdAt
        }
        likeCount
        comments{
            id body username createdAt
        }
        commentCount
    }
}
`

export default PostForm;