import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, from, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';

const getTokens = () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    return { token, refreshToken };
}

export const wsLink = new WebSocketLink({
    uri: `ws://localhost:4001/api/ws`,
    
    options: {
        lazy: true,
        reconnect: true,
        connectionParams: ()=>({ token: console.log('token',localStorage.getItem('token')) || localStorage.getItem('token'), refreshToken: console.log('refreshtoken',localStorage.getItem('refreshToken')) || localStorage.getItem('refreshToken')})
    }
});

const httpLink = createHttpLink({
    uri: 'http://localhost:4001/api/gql',
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const { token, refreshToken } = getTokens();
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            "x-token": token ? token : "",
            "x-refresh-token": refreshToken ? refreshToken : ""
        }
    }
});

const logLink = new ApolloLink((operation, forward) => {
    return forward(operation).map(result => {

        //wait for response and try to find response headers
        const context = operation.getContext();
        if (context.response && context.response.headers) {
            const token = context.response.headers.get('x-token');
            const refreshToken = context.response.headers.get('x-refresh-token');


            if (token) {
                localStorage.setItem('token', token);
            }
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
        }
        return result;
    });
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    from([logLink, authLink, httpLink]),
);

export const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
});