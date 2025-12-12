module checkin_nft::events {
    use std::string;
    use sui::event;

    /// Ghi log khi mint NFT
    public struct MintEvent has copy, drop, store {
        user: address,
        rarity: string::String,
        completion: u64,
    }

    /// Ghi log khi upgrade NFT
    public struct UpgradeEvent has copy, drop, store {
        user: address,
        new_rarity: string::String,
        new_completion: u64,
    }

    /// emit MintEvent
    public fun emit_mint_event(user: address, rarity: string::String, completion: u64) {
        event::emit(MintEvent { user, rarity, completion });
    }

    /// emit UpgradeEvent
    public fun emit_upgrade_event(user: address, new_rarity: string::String, new_completion: u64) {
        event::emit(UpgradeEvent { user, new_rarity, new_completion });
    }
}
