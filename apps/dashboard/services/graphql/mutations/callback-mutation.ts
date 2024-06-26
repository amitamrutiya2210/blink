import { gql } from "@apollo/client"

import { apolloClient } from ".."
import {
  CallbackEndpointAddMutation,
  CallbackEndpointAddDocument,
  CallbackEndpointDeleteMutation,
  CallbackEndpointDeleteDocument,
} from "../generated"

gql`
  mutation CallbackEndpointAdd($input: CallbackEndpointAddInput!) {
    callbackEndpointAdd(input: $input) {
      id
      errors {
        code
        message
      }
    }
  }
`

gql`
  mutation CallbackEndpointDelete($input: CallbackEndpointDeleteInput!) {
    callbackEndpointDelete(input: $input) {
      success
      errors {
        message
        code
      }
    }
  }
`
export async function callbackEndpointAdd({ url }: { url: string }) {
  const client = await apolloClient.authenticated()
  try {
    const { data } = await client.mutate<CallbackEndpointAddMutation>({
      mutation: CallbackEndpointAddDocument,
      variables: { input: { url } },
    })
    return data
  } catch (error) {
    console.error("Error executing mutation: CallbackEndpointAdd ==> ", error)
    throw new Error("Error in CallbackEndpointAdd")
  }
}

export async function callbackEndpointDelete({ id }: { id: string }) {
  const client = await apolloClient.authenticated()
  try {
    const { data } = await client.mutate<CallbackEndpointDeleteMutation>({
      mutation: CallbackEndpointDeleteDocument,
      variables: { input: { id } },
    })
    return data
  } catch (error) {
    console.error("Error executing mutation: CallbackEndpointDelete ==> ", error)
    throw new Error("Error in CallbackEndpointDelete")
  }
}
