module checkin_nft::checkin_nft;

use checkin_nft::events;
use checkin_nft::rarity_helper::{random_number, rarity_from_number};
use std::string;

public struct CheckinNFT has key, store {
    id: UID,
    name: string::String,
    image_url: string::String,
    rarity: string::String,
    completion: u64,
    owner: address,
    latitude: string::String, // 🧭 Vĩ độ
    longitude: string::String, // 🧭 Kinh độ
}

/// 📊 Xác định độ hiếm (rarity)

 entry fun mint(
    name: string::String,
    image_url: string::String,
    latitude: string::String,
    longitude: string::String,
    ctx: &mut TxContext,
) {
    let sender = tx_context::sender(ctx);

    let numRarity = random_number(ctx, 1, 100);

    let rarity = rarity_from_number(numRarity);

    let completion = random_number(ctx, 1, 1000);

    let nft = CheckinNFT {
        id: object::new(ctx),
        name,
        image_url,
        rarity,
        completion,
        owner: sender,
        latitude,
        longitude,
    };

    events::emit_mint_event(sender, rarity, completion);
    transfer::transfer(nft, sender);
}
