//! Created by [Fadroma](https://fadroma.tech).

#[fadroma::dsl::contract] pub mod contract {
    use fadroma::{*, dsl::*, prelude::*};
    impl Contract {
        #[init(entry_wasm)]
        pub fn new () -> Result<Response, StdError> {
            Ok(Response::default())
        }
        // #[execute]
        // pub fn my_tx_1 (arg1: String, arg2: Uint128) -> Result<Response, StdError> {
        //     Ok(Response::default())
        // }
        // #[execute]
        // pub fn my_tx_2 (arg1: String, arg2: Uint128) -> Result<Response, StdError> {
        //     Ok(Response::default())
        // }
        // #[query]
        // pub fn my_query_1 (arg1: String, arg2: Uint128) -> Result<(), StdError> {
        //     Ok(())

        // }
        // #[query]
        // pub fn my_query_2 (arg1: String, arg2: Uint128) -> Result<(), StdError> {
        //     Ok(())

        // }
    }
}